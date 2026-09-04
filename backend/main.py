import os
import json
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client
from fastembed import TextEmbedding
from groq import Groq

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Clients
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
embedding_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

def init_supabase():
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    if "your_supabase" in SUPABASE_URL.lower() or "your_supabase" in SUPABASE_KEY.lower():
        return None
    if not SUPABASE_URL.startswith("http://") and not SUPABASE_URL.startswith("https://"):
        return None
    try:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception:
        return None

supabase: Client = init_supabase()


class ChatRequest(BaseModel):
    query: str
    language: str = "English"
    simplify: bool = False
    image_base64: str | None = None

class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

@app.get("/health")
def health():
    return {"status": "BIS Backend is running natively"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        search_query = request.query

        # 0. Vision OCR processing if image_base64 is provided
        if request.image_base64:
            clean_b64 = request.image_base64
            if "," in clean_b64:
                clean_b64 = clean_b64.split(",")[1]

            img_data_url = request.image_base64 if request.image_base64.startswith("data:image") else f"data:image/png;base64,{clean_b64}"
            vision_models = ["qwen/qwen3.8-27b", "qwen/qwen3.6-27b"]
            extracted_text = ""
            
            for v_model in vision_models:
                try:
                    vision_completion = groq_client.chat.completions.create(
                        model=v_model,
                        messages=[
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "Extract all text, numbers, mineral/chemical composition (e.g. TDS, Chloride, Calcium, Magnesium, Bicarbonate, Sulfate, pH), BIS standard numbers (e.g. IS 10500), HUID codes, or brand/product names visible in this label image. List every extracted parameter with its exact value."
                                    },
                                    {
                                        "type": "image_url",
                                        "image_url": {
                                            "url": img_data_url
                                        }
                                    }
                                ]
                            }
                        ],
                        temperature=0.1,
                    )
                    extracted_text = vision_completion.choices[0].message.content.strip()
                    if extracted_text:
                        break
                except Exception as v_err:
                    print(f"Vision model '{v_model}' error: {v_err}")
                    continue

            if extracted_text:
                search_query = f"PRODUCT LABEL IMAGE DATA EXTRACTED:\n{extracted_text}\n\nUSER QUESTION: {request.query}"
                print(f"Vision OCR Extracted Entities: {extracted_text}")

        # 1. Embed the search query (use concise text for vector matching)
        embed_text = request.query if not request.image_base64 else f"Drinking water IS 10500 parameters TDS pH hardness chloride fluoride {request.query}"
        query_embedding = list(embedding_model.embed([embed_text]))[0].tolist()

        sources = []
        
        # 2. Semantic Search (Try Supabase first, fallback to local JSON)
        try:
            if supabase:
                res = supabase.rpc('match_documents', {'query_embedding': query_embedding, 'match_count': 5}).execute()
                sources = res.data
            else:
                raise Exception("Supabase client not initialized")
        except Exception as e:
            print(f"Supabase search failed/skipped, falling back to local JSON: {e}")
            json_path = os.path.join(os.path.dirname(__file__), "data", "processed_chunks.json")
            if os.path.exists(json_path):
                with open(json_path, 'r') as f:
                    local_data = json.load(f)
                scored_chunks = []
                for chunk in local_data:
                    sim = cosine_similarity(query_embedding, chunk["embedding"])
                    scored_chunks.append({**chunk, "similarity": float(sim)})
                scored_chunks.sort(key=lambda x: x["similarity"], reverse=True)
                sources = scored_chunks[:5]
        
        if not sources:
            return {"answer": "I do not have access to any BIS documents regarding this query.", "sources": []}

        # 3. Construct Context for Groq
        context_text = "\n\n---\n\n".join(
            f"Document: {s['metadata']['source']} (Page {s['metadata']['page']})\nContent: {s['content']}" 
            for s in sources
        )

        # 4. Call Groq LLM with refined consumer-friendly prompt
        system_prompt = (
            "You are an expert AI Assistant for the Bureau of Indian Standards (BIS).\n"
            "Your goal is to explain Indian Standards to everyday consumers, MSMEs, and startups in simple, easy-to-understand language.\n"
            "You MUST base your factual claims strictly on the provided context. Always cite the relevant Indian Standard code and page number (e.g., [IS 10500, Page 1]).\n\n"
            "RESPONSE FORMATTING GUIDELINES:\n"
            "1. **Summary & Safety Verdict**: Start with a clear 1-2 sentence summary and a prominent status badge (**✅ SAFE & COMPLIANT** or **⚠️ NON-COMPLIANT / NEEDS ATTENTION**).\n"
            "2. **MANDATORY Product Label vs. BIS Standard Comparison Table**:\n"
            "   - You MUST include a comparison table comparing parameters analyzed against BIS standard limits!\n"
            "   - The table columns MUST be:\n"
            "     | Parameter | Product Label Value | BIS Desirable Limit | BIS Permissible Limit | Compliance Status |\n"
            "   - For parameters present on the product label (e.g. TDS: 180 mg/l, Calcium: 25 mg/l, Magnesium: 35 mg/l, Chloride: 10 mg/l):\n"
            "     Show the exact **Product Label Value** in bold (e.g., **180 mg/l**).\n"
            "   - For standard BIS parameters not printed on the product label (e.g. pH, Color, Turbidity), write `Not Listed on Label` under Product Label Value.\n"
            "   - DO NOT output `N/A` for parameters that WERE extracted from the label image or user text!\n"
            "3. **What is Good vs What Needs Attention**: Use bullet points to highlight **What is Good** (*compliant/healthy parameters*) and **What Needs Attention** (*parameters exceeding limits or missing attributes*).\n"
            "4. **Everyday Language & Rich Formatting**: Use **bold** for key metrics and *italics* for important notes or warnings. Keep explanations clear and consumer-friendly.\n"
        )

        if request.simplify:
            system_prompt += "\nEXPLAIN IN EXTREMELY SIMPLE, PLAIN LANGUAGE SUITABLE FOR A 5TH GRADER (ELI5 style). Use easy real-world analogies. "
        else:
            system_prompt += "\nMaintain clear, professional, and practical consumer guidance. "

        system_prompt += f"You MUST write your entire response strictly in the following language: {request.language}."


        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Context:\n{context_text}\n\nUser Query: {search_query}"}
        ]


        # Call Groq LLM with model fallbacks
        models_to_try = ["llama-3.3-70b-versatile", "qwen/qwen3.8-27b", "groq/compound"]
        chat_completion = None
        last_err = None

        for model_name in models_to_try:
            try:
                chat_completion = groq_client.chat.completions.create(
                    messages=messages,
                    model=model_name,
                    temperature=0.2,
                )
                break
            except Exception as err:
                last_err = err
                continue

        if not chat_completion:
            raise last_err

        
        # 5. Format Response
        answer = chat_completion.choices[0].message.content
        formatted_sources = [{"document": s["metadata"]["source"], "page": s["metadata"]["page"], "content_snippet": s["content"][:200]} for s in sources]
        
        return {"answer": answer, "sources": formatted_sources}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

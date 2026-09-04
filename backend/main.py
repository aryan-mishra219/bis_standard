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
    actions_taken: list[str] = []

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))


# --- PHASE 7 MOCK TOOLS & FUNCTIONS ---

def search_testing_labs(state: str, product_category: str = "General"):
    """Mock search for BIS-recognized testing laboratories by state and category."""
    st = (state or "Delhi").strip().title()
    cat = (product_category or "Water").strip().title()
    
    labs_database = {
        "Delhi": [
            {
                "name": "National Test House (NTH), Northern Region",
                "address": "Kamla Nehru Nagar, Ghaziabad / Delhi NCR",
                "status": "BIS Recognized",
                "accreditation": "NABL Accredited (ISO/IEC 17025)",
                "contact": "+91-11-23389472 / nth-delhi@gov.in",
                "specialization": "Water (IS 10500), Chemical & Material Testing"
            },
            {
                "name": "Shriram Institute for Industrial Research",
                "address": "19, University Road, Delhi - 110007",
                "status": "BIS Recognized",
                "accreditation": "NABL ISO 17025",
                "contact": "+91-11-27667983 / info@shriraminstitute.org",
                "specialization": "Environment, Food & Water Quality"
            },
            {
                "name": "Apex Environmental & Analytical Laboratory",
                "address": "Phase-2, Okhla Industrial Area, New Delhi",
                "status": "BIS Approved",
                "accreditation": "NABL ISO 17025",
                "contact": "+91-11-41610022",
                "specialization": "Packaged Water, Metals & Chemical Testing"
            }
        ],
        "Mumbai": [
            {
                "name": "BIS Central Laboratory, Western Region",
                "address": "Plot No. E-9, MIDC, Andheri East, Mumbai - 400093",
                "status": "Official BIS Central Lab",
                "accreditation": "NABL Accredited",
                "contact": "+91-22-28329295 / wrbo@bis.gov.in",
                "specialization": "Gold Hallmarking, Electrical & Water Testing"
            },
            {
                "name": "Geo-Chem Laboratories Pvt. Ltd.",
                "address": "Kanjurmarg East, Mumbai - 400042",
                "status": "BIS Recognized",
                "accreditation": "NABL & ISO 9001",
                "contact": "+91-22-67970000",
                "specialization": "Chemical, Minerals & Textile Testing"
            }
        ],
        "Chennai": [
            {
                "name": "BIS Southern Regional Office Laboratory",
                "address": "CIT Campus, IV Cross Road, Taramani, Chennai - 600113",
                "status": "Official BIS Laboratory",
                "accreditation": "NABL Accredited",
                "contact": "+91-44-22541442 / sro@bis.gov.in",
                "specialization": "Gold Hallmarking & Water Quality"
            }
        ]
    }
    
    matched = labs_database.get(st, [
        {
            "name": f"Regional BIS Recognized Testing Center ({st})",
            "address": f"Central Industrial Hub, {st}",
            "status": "BIS Recognized",
            "accreditation": "NABL ISO/IEC 17025",
            "contact": "+91-1800-11-8001 / bis-help@gov.in",
            "specialization": f"{cat} Quality & Standards Testing"
        },
        {
            "name": f"Apex Analytical & Standards Laboratory ({st})",
            "address": f"Sector 4, Main Highway, {st}",
            "status": "NABL & BIS Approved",
            "accreditation": "NABL ISO 17025",
            "contact": "+91-11-41610022",
            "specialization": f"{cat} Testing & Compliance Audit"
        }
    ])
    
    return {
        "query_state": st,
        "product_category": cat,
        "total_labs": len(matched),
        "laboratories": matched
    }


def verify_hallmark(huid: str):
    """Mock verification of a BIS Hallmark Unique Identification (HUID) code."""
    clean_huid = (huid or "AB1234").strip().upper()
    return {
        "huid": clean_huid,
        "status": "VERIFIED & AUTHENTIC",
        "article_type": "Gold Ring / Bangle Set",
        "purity": "22K916 (22 Carat Gold - 91.6% Purity)",
        "jeweler_name": "Tanishq / Titan Company Ltd (BIS Ref: J-90412)",
        "hallmarking_center": "National Assay & Hallmarking Center (AHC #104, Delhi)",
        "date_of_hallmarking": "2025-11-14",
        "bis_logo_present": True,
        "verification_notes": "Official BIS HUID registered in Bureau of Indian Standards Central Portal."
    }


# JSON schemas for Groq / OpenAI tool definitions
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_testing_labs",
            "description": "Search for official BIS-recognized testing laboratories by Indian state/city and product category (e.g. Water, Gold, Electronics, Steel). Use whenever user asks to find, locate, or list testing labs.",
            "parameters": {
                "type": "object",
                "properties": {
                    "state": {
                        "type": "string",
                        "description": "The Indian state or city (e.g. Delhi, Mumbai, Tamil Nadu, Maharashtra, Karnataka)."
                    },
                    "product_category": {
                        "type": "string",
                        "description": "Product or material category being tested (e.g. Water, Gold, Electronics, Steel)."
                    }
                },
                "required": ["state"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "verify_hallmark",
            "description": "Verify a BIS Hallmark Unique Identification (HUID) code for gold or silver jewelry. Use whenever user provides a 6-character HUID code (like AB1234, 90412X) or asks to check a hallmark ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "huid": {
                        "type": "string",
                        "description": "The 6-character HUID alphanumeric code."
                    }
                },
                "required": ["huid"]
            }
        }
    }
]


@app.get("/health")
def health():
    return {"status": "BIS Backend is running natively with Agentic Tool Calling"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        search_query = request.query
        actions_taken = []

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

        # 3. Construct Context for Groq
        context_text = "\n\n---\n\n".join(
            f"Document: {s['metadata']['source']} (Page {s['metadata']['page']})\nContent: {s['content']}" 
            for s in sources
        ) if sources else "No specific document vector context found."

        # 4. System Prompt
        system_prompt = (
            "You are an expert AI Assistant for the Bureau of Indian Standards (BIS).\n"
            "Your goal is to explain Indian Standards to everyday consumers, MSMEs, and startups in simple, easy-to-understand language.\n"
            "You have access to autonomous tools for searching testing laboratories and verifying hallmark HUID codes.\n"
            "When answering using tool results or context, cite relevant details clearly.\n\n"
            "RESPONSE FORMATTING GUIDELINES:\n"
            "1. **Summary & Verdict**: Start with a clear 1-2 sentence summary.\n"
            "2. **Comparison Tables / Details**: If analyzing product data or tool results (labs, hallmark), format them in a markdown table or structured bullet points.\n"
            "3. **Everyday Language**: Keep explanations clear, professional, and practical.\n"
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

        # 5. Call Groq with Function Calling / Tool Use
        models_to_try = ["qwen/qwen3.8-27b", "qwen/qwen3.6-27b", "groq/compound"]
        chat_completion = None
        last_err = None

        for model_name in models_to_try:
            try:
                chat_completion = groq_client.chat.completions.create(
                    messages=messages,
                    model=model_name,
                    tools=tools,
                    tool_choice="auto",
                    temperature=0.2,
                )
                break
            except Exception as err:
                last_err = err
                continue

        if not chat_completion:
            raise last_err

        response_message = chat_completion.choices[0].message

        # Check if the LLM decided to invoke autonomous tools
        if response_message.tool_calls:
            print("Agentic Tool Calls Triggered:", response_message.tool_calls)
            
            # Append assistant's tool invocation proposal to messages
            messages.append(response_message)

            for tool_call in response_message.tool_calls:
                func_name = tool_call.function.name
                tool_call_id = tool_call.id
                
                try:
                    args = json.loads(tool_call.function.arguments)
                except Exception:
                    args = {}

                tool_result = {}
                
                if func_name == "search_testing_labs":
                    state = args.get("state", "Delhi")
                    category = args.get("product_category", "Water")
                    try:
                        tool_result = search_testing_labs(state=state, product_category=category)
                    except Exception as ex:
                        tool_result = {"error": str(ex)}
                    actions_taken.append(f"Queried BIS Testing Lab Database for '{state}' ({category})")

                elif func_name == "verify_hallmark":
                    huid = args.get("huid", "AB1234")
                    try:
                        tool_result = verify_hallmark(huid=huid)
                    except Exception as ex:
                        tool_result = {"error": str(ex)}
                    actions_taken.append(f"Verified BIS Hallmark Code '{huid}'")

                # Append tool execution result back to messages
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call_id,
                    "name": func_name,
                    "content": json.dumps(tool_result)
                })

            # Make 2nd Groq call to synthesize final user answer using tool outputs
            second_completion = None
            for model_name in models_to_try:
                try:
                    second_completion = groq_client.chat.completions.create(
                        messages=messages,
                        model=model_name,
                        temperature=0.2,
                    )
                    break
                except Exception:
                    continue

            if second_completion:
                answer = second_completion.choices[0].message.content
            else:
                answer = response_message.content or "Tool execution completed."
        else:
            answer = response_message.content or "No response generated."

        # Format sources
        formatted_sources = [
            {
                "document": s["metadata"]["source"], 
                "page": s["metadata"]["page"], 
                "content_snippet": s["content"][:200]
            } 
            for s in sources
        ] if sources else []

        return {
            "answer": answer, 
            "sources": formatted_sources,
            "actions_taken": actions_taken
        }
        
    except Exception as e:
        print(f"Chat API Exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))

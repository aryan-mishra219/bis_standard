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
        # 1. Embed the query
        query_embedding = list(embedding_model.embed([request.query]))[0].tolist()
        
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

        # 4. Call Groq LLM
        system_prompt = (
            "You are an AI-powered Intelligent Assistant for the Bureau of Indian Standards (BIS). "
            "Your job is to provide accurate, context-aware information to MSMEs, startups, and consumers. "
            "You MUST base your answer ONLY on the provided context. "
            "If the context does not contain the answer, politely state that you do not have the information. "
            "When answering, you MUST cite the specific Indian Standard and Page number from the context at the end of your claims (e.g., [IS 10500, Page 5]). "
        )

        if request.simplify:
            system_prompt += "EXPLAIN IN EXTREMELY SIMPLE, PLAIN LANGUAGE SUITABLE FOR A 5TH GRADER (ELI5 style). Use simple analogies and easy words. "
        else:
            system_prompt += "Maintain professional, clear, and technically accurate language. "

        system_prompt += f"You MUST write your entire response strictly in the following language: {request.language}."

        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Context:\n{context_text}\n\nUser Query: {request.query}"}
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

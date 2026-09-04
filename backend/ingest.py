import argparse
import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

import pymupdf  # PyMuPDF
from fastembed import TextEmbedding
from langchain_text_splitters import RecursiveCharacterTextSplitter
from supabase import Client, create_client

# Initialize FastEmbed model (384 dimensions matching vector(384) in PostgreSQL)
MODEL_NAME = "BAAI/bge-small-en-v1.5"
print(f"Loading FastEmbed model ({MODEL_NAME})...")
embedding_model = TextEmbedding(model_name=MODEL_NAME)


def extract_text_from_file(file_path: str):
    """Extract text from a PDF, Markdown, or Text file."""
    ext = Path(file_path).suffix.lower()
    filename = Path(file_path).name

    if ext == ".pdf":
        doc = pymupdf.open(file_path)
        pages_content = []
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text("text").strip()
            if text:
                pages_content.append(
                    {
                        "text": text,
                        "metadata": {
                            "source": filename,
                            "page": page_num + 1,
                            "total_pages": len(doc),
                        },
                    }
                )
        doc.close()
        return pages_content
    elif ext in [".md", ".txt"]:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read().strip()
        if text:
            return [
                {
                    "text": text,
                    "metadata": {
                        "source": filename,
                        "page": 1,
                        "total_pages": 1,
                    },
                }
            ]
        return []
    else:
        print(f"Unsupported file extension: {ext}")
        return []


def chunk_extracted_pages(pages_content, chunk_size=1000, chunk_overlap=200):
    """Chunk extracted page text using RecursiveCharacterTextSplitter."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""],
    )

    chunks = []
    for page in pages_content:
        split_texts = text_splitter.split_text(page["text"])
        for idx, split_text in enumerate(split_texts):
            chunks.append(
                {
                    "content": split_text,
                    "metadata": {
                        **page["metadata"],
                        "chunk_index": idx,
                    },
                }
            )
    return chunks


def generate_embeddings(chunks):
    """Generate 384-dimensional dense embeddings using FastEmbed."""
    texts = [c["content"] for c in chunks]
    print(f"Generating 384-dim embeddings for {len(texts)} text chunks...")
    embeddings_generator = embedding_model.embed(texts)
    embeddings = [e.tolist() for e in embeddings_generator]
    return embeddings


def get_supabase_client():
    """Attempt to initialize Supabase client if valid credentials exist."""
    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_KEY", "")

    if (
        not url
        or not key
        or "your_supabase" in url.lower()
        or "your_supabase" in key.lower()
    ):
        return None

    try:
        client = create_client(url, key)
        return client
    except Exception as e:
        print(f"Warning: Could not connect to Supabase: {e}")
        return None


def store_chunks(chunks, embeddings, output_dir="data"):
    """Store chunks and embeddings in Supabase or local JSON offline storage."""
    supabase = get_supabase_client()

    records = []
    for chunk, emb in zip(chunks, embeddings):
        records.append(
            {
                "content": chunk["content"],
                "metadata": chunk["metadata"],
                "embedding": emb,
            }
        )

    if supabase:
        print(f"Uploading {len(records)} records to Supabase (bis_standards table)...")
        try:
            batch_size = 50
            for i in range(0, len(records), batch_size):
                batch = records[i : i + batch_size]
                supabase.table("bis_standards").insert(batch).execute()
            print("Successfully uploaded all vectors to Supabase!")
            return True
        except Exception as e:
            print(f"Error inserting into Supabase: {e}")
            print("Falling back to local offline storage...")

    # Offline local JSON fallback storage
    os.makedirs(output_dir, exist_ok=True)
    fallback_file = os.path.join(output_dir, "processed_chunks.json")

    existing_data = []
    if os.path.exists(fallback_file):
        try:
            with open(fallback_file, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except Exception:
            existing_data = []

    existing_data.extend(records)

    with open(fallback_file, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, indent=2)

    print(
        f"Saved {len(records)} chunks & 384-dim embeddings to offline storage: {fallback_file}"
    )
    if not supabase:
        print("[NOTE] Add Supabase URL/Key to backend/.env once status resolves to sync to DB.")

    return False


def process_file(file_path: str):
    """Execute full pipeline: File -> Extract -> Chunk -> Embed -> Store."""
    print(f"\n--- Processing File: {file_path} ---")
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        return

    pages = extract_text_from_file(file_path)
    print(f"Extracted text from {len(pages)} section(s)/page(s).")

    if not pages:
        print("No readable text extracted from file.")
        return

    chunks = chunk_extracted_pages(pages)
    print(f"Divided into {len(chunks)} text chunk(s).")

    embeddings = generate_embeddings(chunks)
    store_chunks(chunks, embeddings)


def process_directory(dir_path: str):
    """Process all PDF, MD, and TXT files in a directory."""
    files = (
        list(Path(dir_path).glob("*.pdf"))
        + list(Path(dir_path).glob("*.md"))
        + list(Path(dir_path).glob("*.txt"))
    )
    if not files:
        print(f"No PDF/MD/TXT files found in directory: '{dir_path}'")
        return

    print(f"Found {len(files)} file(s) in '{dir_path}'.")
    for f in files:
        process_file(str(f))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="BIS Standards Document Ingestion & Embedding Pipeline"
    )
    parser.add_argument(
        "--file", type=str, help="Path to a single PDF/MD/TXT file to process"
    )
    parser.add_argument(
        "--dir",
        type=str,
        default="data",
        help="Directory containing documents (default: 'data')",
    )

    args = parser.parse_args()

    if args.file:
        process_file(args.file)
    else:
        process_directory(args.dir)


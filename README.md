# AI-Powered Intelligent Assistant for Indian Standards (BIS)

An intelligent assistant application built for Indian Standards (BIS) compliance, documentation, and query processing.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router, Pure JavaScript `.js`/`.jsx`, Tailwind CSS)
- **Backend**: Python (FastAPI, Uvicorn, Pydantic, Supabase, python-dotenv)

---

## 📁 Project Structure

```
bis_standard/
├── backend/
│   ├── .env                # Backend environment configuration
│   ├── init_db.sql         # Supabase vector DB migration script
│   ├── ingest.py           # Document extraction, chunking & FastEmbed pipeline
│   ├── main.py             # FastAPI entrypoint with CORS & health endpoint
│   └── requirements.txt    # Python dependencies
└── frontend/
    ├── .env.local          # Frontend environment configuration
    ├── app/
    │   ├── globals.css     # Tailwind CSS entrypoint
    │   ├── layout.js       # Root layout component
    │   └── page.js         # Main home page component
    ├── jsconfig.json       # JS path alias configuration
    ├── next.config.mjs     # Next.js configuration
    └── package.json        # Frontend dependencies & scripts
```


---

## ⚙️ Environment Configuration

### Backend Environment Variables (`backend/.env`)
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend Environment Variables (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Expected Output |
| --- | --- | --- | --- |
| `GET` | `/health` | Backend Health Check | `{"status": "BIS Backend is running natively"}` |

---

## 🚀 Getting Started

### 1. Running the Backend (FastAPI)

Open a terminal in the root directory and navigate to `backend`:

```bash
cd backend

# Create & Activate Virtual Environment (.venv)
python -m venv .venv

# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1

# On Windows (CMD):
.\.venv\Scripts\activate.bat

# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --port 8000
```

- Backend server URL: `http://localhost:8000`
- Health check URL: `http://localhost:8000/health`
- Interactive API Docs (Swagger): `http://localhost:8000/docs`

#### Ingesting BIS Standard PDFs
To extract, chunk, generate 384-dim embeddings (`fastembed`), and store vectors (in Supabase or local offline storage):

```bash
# Process a single PDF standard:
python ingest.py --file data/IS_10500_Drinking_Water.pdf

# Process all PDFs in a directory:
python ingest.py --dir data
```

---


### 2. Running the Frontend (Next.js)

Open a new terminal window in the root directory and navigate to `frontend`:

```bash
cd frontend
npm run dev
```

- Frontend URL: `http://localhost:3000`

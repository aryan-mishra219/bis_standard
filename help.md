# 📘 User & Judge Navigation Guide: M.A.N.A.K

**M.A.N.A.K** (*Multilingual Assistant for National Accreditation and Knowledge*) is an AI-powered full-stack platform engineered for the Bureau of Indian Standards (BIS). It bridges the gap between complex regulatory documentation and everyday consumers, startups, and MSMEs.

---

## 🧭 1. Navigation & UI Controls Guide

When you open the web application at `http://localhost:3000`, the user interface is divided into three main sections:

### 🔵 Top Navigation Header
Located at the top of the interface, the header provides instant access to global configuration tools:

1. **BIS Brand Logo & Title**: Displays the official M.A.N.A.K identity.
2. **ELI5 (Simplify) Toggle Switch**:
   - **What it does**: Toggles "Explain Like I'm 5" mode.
   - **How to use**: Click the checkbox. When enabled, the AI translates complex technical jargon into simple, real-world analogies suitable for a 5th grader.
3. **🌐 Multilingual Selector Dropdown**:
   - **What it does**: Forces the assistant to generate responses strictly in your chosen language.
   - **Options**: `English`, `Hindi (हिंदी)`, `Tamil (தமிழ்)`, and `Bengali (বাংলা)`.
4. **💰 Fee Estimator Toggle Button**:
   - **What it does**: Expands an interactive MSME Marking Fee Concession Calculator banner directly below the header.
   - **How to use**: Select your enterprise scale (`Large Enterprise`, `Small Enterprise - 50% Off`, or `Micro / Startup - 80% Off`) to calculate real-time savings.

---

### 💬 Central Chat Window
The main interactive area displays all user-assistant exchanges with rich visual components:

1. **Starter Prompts Grid**: Displayed when no messages have been sent. Click any card to launch a sample query instantly.
2. **User Chat Bubbles**: Displayed on the right in **Deep Blue** (`#0055A4`), showing your text query and attached image thumbnails.
3. **Assistant Chat Bubbles**: Displayed on the left in clean white cards with:
   - **⚙️ Action Badges (Phase 7 & 8)**: Amber pills at the top showing autonomous backend tool calls (e.g. `⚙️ Action: Searched BIS testing labs in 'Delhi'`).
   - **📊 Product Comparison Tables**: 5-column tables comparing extracted product label parameters against mandatory BIS limits.
   - **📍 Interactive Process Timelines (Phase 8)**: Numbered vertical step-by-step navigators with connecting guidelines for procedures.
   - **🛡️ Compliance Readiness Cards (Phase 9)**: Dark slate cards displaying compliance gaps, risk ratings, timeline estimates, and a **📄 Download Official PDF Report** button.
   - **📚 Source Citations**: Interactive badges at the bottom listing referenced BIS standards and page numbers (hover to reveal exact text snippets).

---

### 📥 Bottom Input & Attachment Bar
Located at the bottom of the screen:

1. **📎 Attachment (Paperclip) Button**:
   - **What it does**: Opens your device file picker to upload a product label, specification sheet image, or hallmark stamp.
   - **Client-Side Compression**: Automatically compresses uploaded images to lightweight 1024px JPEG data for 2-second fast processing.
2. **Text Input Box**: Type any question, paste a product specification sheet, or enter a HUID code.
3. **Send Button**: Transmits your query and attached image to the backend.

---

## ⭐ 2. Core Features & How to Use Them

### 1. 🛡️ Proactive Compliance Gap Analyzer (Phase 9)
- **What it does**: Flips the assistant from a reactive Q&A bot to a proactive regulatory advisor. It evaluates product spec sheets, identifies mandatory IS standards, cross-checks Quality Control Orders (QCO/CRS), flags missing test reports, and calculates timeline & fee estimates.
- **How to use**:
  - Type or paste your product spec sheet into the text box.
  - Or click the starter prompt: `"Audit my product spec sheet for bottled drinking water plant"`.
- **Downloadable PDF Report**: Click the green **`📄 Download Official PDF Report`** button on the compliance card to download a PDF report (`.pdf`) generated on the fly using `reportlab`.

### 2. 📍 Interactive Process Timelines (Phase 8)
- **What it does**: Automatically converts dense procedural regulations into visual, numbered vertical step-by-step timelines.
- **How to use**: Ask any how-to or application workflow question (e.g. *"What are the steps to apply for a BIS hallmark license?"*).

### 3. 🤖 Autonomous Agentic Tools (Phase 7)
- **What it does**: Autonomously detects when to trigger backend Python tools instead of generic text.
- **Tools**:
  - `search_testing_labs`: Triggers when asking for lab locations (e.g. *"Find me a water testing lab in Delhi"*).
  - `verify_hallmark`: Triggers when entering a 6-character HUID code (e.g. *"Check hallmark ID AB1234"*).

### 4. 📷 Multimodal Vision OCR & Comparison Tables (Phase 6)
- **What it does**: Extracts text, mineral values, brand names, and IS standard numbers directly off product label photos.
- **How to use**: Click **📎**, pick a label image (e.g. water bottle label), and click Send.

---

## 🧪 3. Ready-to-Use Dummy Test Prompts

Copy & paste any of these test prompts into the chat box to demonstrate the platform:

### 🛡️ Compliance Gap Audit Prompts
- `Audit my product spec sheet for bottled drinking water plant in Uttar Pradesh`
- `Run a proactive compliance gap analysis for my 20W LED bulb manufacturing unit`
- `What BIS standards and Quality Control Orders apply to manufacturing wooden toys?`

### 📍 Procedural & How-To Timeline Prompts
- `What are the steps to apply for a BIS hallmark license?`
- `Explain the step-by-step process for an MSME to get ISI mark certification.`
- `How can a packaged water plant get BIS approval? List the steps.`

### ⚙️ Testing Labs & Hallmark Verification Prompts
- `Find me a water testing lab in Delhi`
- `Locate BIS recognized gold testing labs in Mumbai`
- `Check hallmark ID AB1234`
- `Verify HUID code 90412X for 22K gold bangle`

### 📷 Label Image & Standard Comparison Prompts
- Upload any water bottle label photo using **📎** and click Send.
- `What are the permissible limits for lead and TDS in drinking water as per IS 10500?`

---

## 🛠️ 4. Technical Architecture Summary

- **Frontend**: Next.js (App Router, Pure JavaScript `.js`/`.jsx`, Tailwind CSS, `ReactMarkdown`, `remark-gfm`).
- **Backend**: Python FastAPI (`uvicorn`, `pydantic`, `fastembed`, `reportlab`, `groq`, `supabase`).
- **Vector Database**: PostgreSQL with `pgvector` hosted on Supabase (384-dimensional embeddings).
- **Vision & LLM Models**: Groq Multimodal Vision (`qwen/qwen3.8-27b`).

# User Manual & Step-by-Step Feature Guide: P.R.A.M.A.A.N

---

## 1. Project Introduction: What is P.R.A.M.A.A.N?

**P.R.A.M.A.A.N** (*Platform for Regulatory And Marking Authenticity Across Nation*) is an AI-powered regulatory intelligence and standards compliance platform built for the **Bureau of Indian Standards (BIS)**.

### What Problem Does It Solve?
Indian technical standards, Quality Control Orders (QCOs), certification schemes (ISI Mark, CRS, Hallmark), and laboratory testing guidelines are dense, multi-page statutory documents. For micro, small, and medium enterprises (MSMEs), startups, importers, and consumers, navigating these regulations is often overwhelming, slow, and prone to costly non-compliance penalties.

### What Does It Do?
1. **Translates Complex Standards**: Converts thousands of pages of BIS standards (e.g., IS 14543 for Drinking Water, IS 16102 for LED Bulbs, IS 1786 for Steel, IS 9873 for Toys) into plain-language advice, interactive checklists, and visual timelines.
2. **Proactive Compliance Audits**: Analyzes product spec sheets, flags regulatory gaps, identifies required in-house test equipment, estimates lab test costs, and generates official downloadable compliance audit PDF reports.
3. **Multimodal Vision Label Verification**: Reads product labels via camera/image upload, extracts mineral and safety values via OCR, and builds 5-column comparison tables against statutory limits.
4. **Pan-India Laboratory Locator**: Features an interactive, Survey of India (SOI) compliant map and directory of all BIS Central, Regional, Branch, and NABL-accredited testing facilities with instant sample test booking requisitions.
5. **Hallmark & HUID Authenticity Verification**: Instantly validates 6-character gold/silver HUID stamps, displays Assaying Centre credentials, and calculates real-time melt values and scrap worth.

---

## 2. Complete Step-by-Step Feature Tutorial

---

### Feature 1: AI Regulatory Copilot & Conversational Search (Home Portal)

The central conversational AI agent answers technical regulatory queries, identifies applicable Indian Standards (IS), and guides users through certification procedures.

#### How to Use Step-by-Step:
1. **Access the Chat Interface**: Open `http://localhost:3000` in your web browser.
2. **Select a Starter Prompt or Type a Custom Query**:
   - If you are new, click any card in the **Starter Prompts Grid** (e.g., *"Audit my product spec sheet for bottled drinking water plant"* or *"Explain step-by-step process for ISI mark"*).
   - Alternatively, click the text input box at the bottom and type your query (e.g., *"What tests are mandatory for manufacturing 20W LED bulbs in India?"*).
3. **Send the Message**: Press the `Enter` key or click the **Send** button (paper airplane icon).
4. **View the Streaming Response**: The response streams in real-time with smooth typewriter animation.
5. **Inspect Verified Citations**: Hover over or click the citation badges at the bottom of the assistant's message to view the exact IS standard number, clause, and text excerpt used to ground the answer.
6. **Message Actions**:
   - Click the **Copy** button to copy the answer to your clipboard.
   - Click the **Thumbs Up / Thumbs Down** buttons to record feedback.
   - Click the **Retry / Regenerate** button to get a refreshed response.

---

### Feature 2: Proactive Compliance Gap Analyzer & Downloadable PDF Audit Report

Evaluates product specifications against mandatory Quality Control Orders (QCO), identifies missing test parameters, calculates estimated timelines, and generates official downloadable PDF compliance reports.

#### How to Use Step-by-Step:
1. **Submit Product Specifications**:
   - In the chat box, type or paste your raw product specifications (e.g., *"We are setting up a packaged drinking water plant with 250 TDS, RO filtration, UV treatment, and 20L jar packaging. Audit our compliance."*).
2. **Review the Compliance Readiness Card**:
   - The assistant displays a dark slate **Compliance Readiness Card** summarizing:
     - **Applicable IS Standard**: (e.g., `IS 14543:2024 / IS 10500`)
     - **Scheme Type**: (e.g., `Scheme-I (ISI Mark) - Mandatory QCO`)
     - **Compliance Risk Level**: Color-coded badge (`High Risk`, `Medium Risk`, or `Compliant`)
     - **Gaps Identified**: Specific missing tests, NOCs, or equipment calibrations.
     - **Estimated Timeline & Statutory Fees**: Expected processing days and base fees.
3. **Download the Official PDF Report**:
   - Inside the Compliance Card, click the green **"Download Official PDF Report"** button.
   - The backend dynamically compiles a formal, multi-page audit report complete with BIS headers, parameter comparison tables, and statutory checklist items, and saves it directly to your downloads folder.

---

### Feature 3: Multimodal Vision OCR & Label Compliance Verifier

Allows users to upload photos of product packaging, mineral tables, or hallmark stamps. The vision engine extracts the values and builds a 5-column comparison table against mandatory limits.

#### How to Use Step-by-Step:
1. **Prepare Your Image**: Take a clear photo or screenshot of a product label (e.g., a bottled water nutritional/mineral table, an electronics safety sticker, or a gold hallmark).
2. **Attach the File**: Click the **Paperclip (Attach)** button to the left of the chat input box.
3. **Select Your Image**: Choose the image file (`.jpg`, `.png`, `.webp`). The interface displays an instant image preview thumbnail above the input bar.
4. **Add Optional Text (or leave blank)**: You can type a specific question (e.g., *"Does this water label comply with IS 14543?"*) or simply send the image directly.
5. **Click Send**: The client automatically optimizes the image for fast transmission.
6. **Analyze the Comparison Table**:
   - The assistant renders a structured table containing:
     - **Parameter Tested**: (e.g., `TDS`, `pH`, `Lead`, `Magnesium`)
     - **Label Declared Value**: (Extracted by OCR)
     - **BIS Permissible Limit**: (As per the relevant Indian Standard)
     - **Variance**: Percentage deviation from standard.
     - **Status**: `PASS` (green badge) or `FAIL` (red badge).

---

### Feature 4: Interactive Step-by-Step Process Timelines

Converts dense bureaucratic procedures into visual, numbered vertical roadmaps with timelines, documents, and action steps.

#### How to Use Step-by-Step:
1. **Ask a Procedural Question**: Type any workflow question into the chat (e.g., *"What is the step-by-step process for getting an ISI mark for packaged water?"* or *"How to get a hallmark license for a jewellery showroom?"*).
2. **Navigate the Interactive Timeline**:
   - The response renders a vertical sequence of numbered milestone cards:
     - **Stage Title & Number**: (e.g., `Stage 1: Documentation & Portal Filing`)
     - **Duration**: Expected time (e.g., `Days 1–7`)
     - **Mandatory Requirements**: Required forms, fees, or laboratory samples.
     - **Key Pitfalls to Avoid**: Common rejection reasons highlighted in amber.

---

### Feature 5: MSME Fee Concession & Factory Capex Estimator (Drawer Panel)

An interactive statutory fee calculator that computes real-time fee concessions (up to 80% discount for Micro/Startups) and itemizes in-house factory laboratory capital expenditures.

#### How to Use Step-by-Step:
1. **Open the Fee Panel**: Click the **"MSME Fee"** button in the top navigation bar. A drawer panel slides out on the right side of the screen.
2. **Select Product Sector & Standard**:
   - Open the **"Product Sector & Standard"** custom dropdown.
   - Choose your industry (e.g., *Packaged Drinking Water (IS 14543)*, *LED Lighting (IS 16102)*, *Steel TMT Rebars (IS 1786)*, *Toys (IS 9873)*, *Jewellery (IS 1417)*, or *EV Batteries (IS 16046)*).
3. **Configure Enterprise Details**:
   - **Procedure Track**: Choose `Simplified (30 Days)` or `Normal (60-90 Days)`.
   - **Enterprise Scale**: Select `Micro / Startup (80% Off)`, `Small (50% Off)`, or `Large Enterprise (0%)`.
   - **Special Category Concession**: Check the box if your business is Women-owned, SC/ST-owned, or located in North-East/J&K/Ladakh (+10% extra concession).
4. **Adjust Annual Production Volume**:
   - Drag the **Annual Production Volume** slider to match your estimated output.
5. **Inspect the Dynamic Fee Summary**:
   - View your gross marking fee, discount savings badge, net statutory fee, lab testing fee, and application fee.
6. **Switch to Factory Capex & Machinery Checklist**:
   - Click the **"Inspection & Capex"** tab inside the panel.
   - View the estimated in-house lab setup cost (e.g., *₹1.5L - ₹3.5L*).
   - Review the required testing instruments (e.g., *Laminar Air Flow Cabinet, Autoclave, Digital pH Meter, Turbidity Meter*).
   - Review the statutory pre-requisite documents checklist (e.g., *FSSAI license, Groundwater NOC, Chemist appointment letter*).
7. **Send Context to AI Copilot**:
   - Click the blue **"Send Estimate to AI Copilot"** button at the bottom of the drawer to automatically load this configuration into your conversation.

---

### Feature 6: Autonomous Agentic Tool Execution (Live Lab Search & Hallmark Tools)

The backend AI autonomously detects when a user query requires direct tool execution, executing Python routines rather than generic generative text.

#### How to Use Step-by-Step:
1. **Trigger Lab Search Agent**:
   - Type a location-based lab query (e.g., *"Find testing labs for packaged drinking water in Ghaziabad or Delhi NCR"*).
   - The assistant executes `search_testing_labs` and renders an amber **Action Badge** (`Searched BIS testing labs in 'Ghaziabad'`) followed by matched lab cards.
2. **Trigger Hallmark Verification Agent**:
   - Type a 6-character HUID code (e.g., *"Verify hallmark code AB1234"*).
   - The assistant executes `verify_hallmark` and renders the official Assaying Centre registry data directly in the chat.

---

### Feature 7: Pan-India Laboratory Locator Portal (`/labs`)

A dedicated laboratory exploration system with dual interactive map and card directory views, filtering across all BIS Central, Regional, Branch, and NABL facilities across India.

#### How to Use Step-by-Step:
1. **Navigate to the Lab Locator**: Click **"Lab Locator"** in the top navigation bar or go to `http://localhost:3000/labs`.
2. **Search and Filter Facilities**:
   - **Keyword Search**: Type any keyword (e.g., *"Water"*, *"Photometry"*, *"Bangalore"*, or *"IS 14543"*).
   - **City Filter**: Select a specific city from the custom **City Dropdown** (e.g., *Delhi NCR*, *Mumbai*, *Bengaluru*, *Chennai*, *Kolkata*, *Hyderabad*, *Pune*, *Ahmedabad*, *Patna*, *Guwahati*).
   - **Tier Filter**: Filter by classification (e.g., *Apex BIS Central Lab*, *BIS Regional Lab*, *BIS Branch Lab*, or *Govt NABL Facility*).
   - **Scope Category Pills**: Click any pill (e.g., *Drinking Water*, *Electrical & LED*, *Steel & Rebars*, *Toys*, *Chemicals*, *Electronics*, *Automotive*, *Gold & Silver*) to filter by accredited testing scope.
3. **Interact with the Survey of India (SOI) Compliant Map**:
   - **Map Styles**: Use the top-right switcher to toggle between:
     - **Google Map**: Clear road map with official Survey of India sovereign borders.
     - **Satellite**: High-resolution aerial imagery.
     - **Terrain**: Topographic relief contours.
     - **Dark**: High-contrast dark basemap.
   - **Map Navigation**: Zoom, pan, or click the **"Locate Me"** button to center the map on your GPS location.
   - **Pin Selection**: Click any pin on the map to open its summary popup and view laboratory details.
4. **Get Turn-by-Turn GPS Directions**:
   - Click the **"Turn-by-Turn GPS"** button on any lab card to open Google Maps routing directly to the lab's gate coordinates.
5. **Book Sample Test / Inquire**:
   - Click **"Book Test / Inquire"** on any lab card.
   - Fill in your Company Name, Contact Person, Email, Phone, Product Name, and Target IS Standard.
   - Add optional batch notes or witness testing requests.
   - Click **"Submit Testing Requisition"** to receive an official Requisition Reference Number (e.g., `BIS-ILMS-2026-XXXX`) and sample dispatch instructions.

---

### Feature 8: Hallmark & HUID Authenticity Verification Portal (`/hallmark`)

A specialized consumer protection portal for verifying gold and silver hallmark authenticity, exploring purity fineness standards, and calculating precious metal scrap values.

#### How to Use Step-by-Step:
1. **Navigate to Hallmark Portal**: Click **"Hallmark Portal"** in the top navigation bar or go to `http://localhost:3000/hallmark`.
2. **Understand the 3-Element Hallmark Anatomy**:
   - Review the visual guide explaining the **BIS Triangle Logo**, the **Purity / Karat Mark** (e.g., `22K916`), and the **6-Character Alphanumeric HUID** laser stamp.
3. **Verify a 6-Character HUID Stamp**:
   - In the **"Enter 6-Digit Alphanumeric HUID"** field, type any HUID code (e.g., `AB1234`, `90412X`, `KL9921`, `CD5678`).
   - Click **"Verify Authenticity"**.
   - Review the verified certificate showing the Assaying & Hallmarking Centre (AHC), Jeweller BIS Registration ID, Hallmarking Date, and Article Category.
4. **Calculate Precious Metal Melt Value**:
   - In the **"Live Precious Metal Valuation Calculator"**:
     - Select **Gold (IS 1417)** or **Silver (IS 2112)**.
     - Choose the **Purity Grade** (e.g., `22K (91.6% Pure)`, `18K (75.0% Pure)`, `14K (58.5% Pure)`, etc.).
     - Drag the **Gross Weight** slider to your jewellery weight in grams.
     - Enter the prevailing **Live Market Rate (₹/gram)**.
     - Review the instant financial summary: Net Pure Metal Content (g), Gross Market Value (₹), Estimated Making Charges, and Net Melting / Scrap Valuation (₹).
5. **Report Fake Hallmarks**:
   - Review the consumer redressal steps to lodge grievances on the **BIS Care App** or the **National Consumer Helpline (1915)**.

---

### Feature 9: Multilingual Selector

Enables instant translation of all regulatory explanations into major Indian languages.

#### How to Use Step-by-Step:
1. Click the **Language Dropdown** (`EN`) in the top navigation bar.
2. Select your preferred language:
   - **EN**: English
   - **HI**: हिन्दी (Hindi)
   - **TA**: தமிழ் (Tamil)
   - **BN**: বাংলা (Bengali)
3. All subsequent AI responses, analogies, and procedural explanations will be rendered strictly in the chosen language while preserving technical IS standard numbers.

---

### Feature 10: ELI5 ("Explain Like I'm 5") Jargon Simplifier

Translates dense chemical formulas, engineering tolerances, and legal clauses into simple, relatable everyday analogies.

#### How to Use Step-by-Step:
1. In the top navigation bar, check the **"ELI5"** checkbox.
2. Ask any complex technical question (e.g., *"What is total dissolved solids (TDS) and turbidity in IS 14543?"*).
3. The assistant will answer using simple, intuitive metaphors (e.g., comparing water filtration to sorting marbles through sieves) without losing factual accuracy.

---

### Feature 11: Universal Dark / Light Mode

Provides complete, theme-consistent visual styling across all three portals, custom dropdowns, cards, and map canvases.

#### How to Use Step-by-Step:
1. Click the **Theme Toggle (Sun/Moon icon)** in the top navigation bar.
2. The entire application transitions smoothly between:
   - **Light Mode**: Crisp white surfaces with deep government blue (`#0055A4`) accents.
   - **Dark Mode**: Sleek dark slate (`#090d16` / `#111827`) backgrounds with vibrant sky-blue highlights.
3. Your preference is automatically persisted in your browser's local storage.

---

## 3. Ready-to-Test Prompts for Demonstration

Copy and paste these queries into the AI Copilot to test the core features:

| Category | Example Prompt to Copy & Paste | What to Look For |
| :--- | :--- | :--- |
| **Compliance Audit** | `Audit my product spec sheet for bottled drinking water plant in Uttar Pradesh` | Proactive Compliance Card, QCO details, and Download PDF Report button |
| **QCO Applicability** | `What Quality Control Orders (QCO) apply to manufacturing wooden and electronic toys in India?` | QCO Gazette dates, mandatory standards (IS 9873 / IS 15644), penalties |
| **Procedural Timeline** | `What is the step-by-step process for an MSME to obtain an ISI mark license?` | Numbered milestone timeline with day-by-day estimates |
| **Lab Search** | `Find BIS recognized testing laboratories for LED lighting and lamps in Delhi NCR` | Autonomous `search_testing_labs` tool badge & laboratory details |
| **Hallmark Check** | `Verify gold hallmark HUID code AB1234 for 22K gold necklace` | Autonomous `verify_hallmark` tool badge & Assaying Centre details |
| **Chemical Limits** | `What are the mandatory limits for lead, arsenic, and pesticide residues under IS 14543?` | Structured comparison table of chemical limits |

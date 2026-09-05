import os
import json
import random
import io
import re
import numpy as np
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client
from fastembed import TextEmbedding
from groq import Groq

# ReportLab PDF imports
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

load_dotenv()

app = FastAPI()

def clean_think_tags(text: str) -> str:
    """Strip internal AI thinking tags (<think>...</think>) from output."""
    if not text:
        return ""
    cleaned = re.sub(r'<think>[\s\S]*?</think>', '', text, flags=re.DOTALL)
    cleaned = re.sub(r'<think>[\s\S]*', '', cleaned, flags=re.DOTALL)
    return cleaned.strip()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    process_timeline: list[dict] | None = None
    compliance_report: dict | None = None

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))


# --- GLOBAL REPORT CACHE & PDF GENERATOR ---
REPORTS_CACHE = {}

def run_compliance_gap_analysis(product_name: str, product_description: str = "", enterprise_scale: str = "Micro/Startup"):
    """Run a full proactive compliance audit for an MSME product spec sheet."""
    p_name = (product_name or "General Industrial Product").strip().title()
    desc = (product_description or "Spec Sheet Audit").strip()
    scale = (enterprise_scale or "Micro/Startup").strip().title()
    
    report_id = f"REPORT-BIS-{random.randint(10000, 99999)}"
    
    p_lower = p_name.lower() + " " + desc.lower()
    
    if "water" in p_lower or "drink" in p_lower or "bottle" in p_lower:
        primary_is = "IS 14543:2004 / IS 10500:2012"
        standard_name = "Packaged Drinking Water / Drinking Water Specification"
        scheme_type = "Scheme I (Mandatory ISI Mark under QCO)"
        risk_level = "HIGH RISK (Mandatory Pre-Market Certification)"
        gaps = [
            "Missing Official BIS ISI Mark License (CM/L Number)",
            "Mandatory Pre-Market Quality Control Order (QCO) Compliance Required",
            "Full 48-Parameter Chemical & Microbiological NABL Test Report Pending",
            "In-house Testing Laboratory & Microbiologist Verification Needed"
        ]
        checklist = [
            {"item": "NABL Accredited Water Test Report (48 Parameters)", "status": "Action Required"},
            {"item": "In-House Lab Equipment Verification", "status": "Pending Verification"},
            {"item": "Manakonline Online Application Submission", "status": "Ready to Apply"},
            {"item": "BIS Factory Audit & Water Sample Sealing", "status": "Pending Inspection"}
        ]
        est_days = "30 - 45 Business Days"
        cost_breakdown = {
            "application_fee": "₹1,000",
            "lab_testing_fee": "₹15,000 - ₹20,000",
            "inspection_fee": "₹7,000",
            "marking_fee": "₹20,000 (80% MSME Concession)",
            "total_estimated": "₹43,000 Approx."
        }
    elif "led" in p_lower or "bulb" in p_lower or "light" in p_lower or "electronics" in p_lower:
        primary_is = "IS 16102 (Part 1 & 2)"
        standard_name = "Self-Ballasted LED Lamps for General Lighting Services"
        scheme_type = "Scheme II (Compulsory Registration Scheme - CRS)"
        risk_level = "HIGH RISK (Mandatory CRS Registration)"
        gaps = [
            "Missing BIS CRS Registration Number (R-Number)",
            "Mandatory Safety & EMC Testing (ISO 17025 NABL Lab)",
            "Product Marking with Standard Logo & Registration Number"
        ]
        checklist = [
            {"item": "Safety & Performance NABL Lab Test Report", "status": "Action Required"},
            {"item": "CRS Online Registration on BIS Portal", "status": "Ready to Apply"},
            {"item": "Brand Owner Authorized Indian Representative (AIR) Registration", "status": "Verified"}
        ]
        est_days = "20 - 30 Business Days"
        cost_breakdown = {
            "application_fee": "₹1,000",
            "lab_testing_fee": "₹25,000",
            "marking_fee": "₹10,000",
            "total_estimated": "₹36,000 Approx."
        }
    else:
        primary_is = "IS Standard Code (Product Specific)"
        standard_name = f"{p_name} Quality Specification"
        scheme_type = "Mandatory QCO / Scheme I ISI Certification"
        risk_level = "MEDIUM RISK (Pre-Market Compliance Check Required)"
        gaps = [
            "Missing Official BIS Certification / Registration Mark",
            "Product Performance & Safety Testing in NABL Recognized Lab",
            "Factory Quality Assurance Audit"
        ]
        checklist = [
            {"item": "Product Specification Sheet Verification", "status": "Completed"},
            {"item": "NABL Lab Sample Testing", "status": "Action Required"},
            {"item": "BIS Online Application & Document Upload", "status": "Ready to Apply"}
        ]
        est_days = "30 - 45 Business Days"
        cost_breakdown = {
            "application_fee": "₹1,000",
            "lab_testing_fee": "₹15,000 - ₹25,000",
            "marking_fee": "₹15,000 (MSME Concession Applied)",
            "total_estimated": "₹35,000 - ₹45,000 Approx."
        }

    report_data = {
        "report_id": report_id,
        "product_name": p_name,
        "product_description": desc,
        "enterprise_scale": scale,
        "primary_standard": primary_is,
        "standard_name": standard_name,
        "scheme_type": scheme_type,
        "risk_level": risk_level,
        "compliance_gaps": gaps,
        "checklist": checklist,
        "estimated_timeline": est_days,
        "cost_breakdown": cost_breakdown,
        "date_generated": "2026-09-04"
    }

    REPORTS_CACHE[report_id] = report_data
    return report_data


def build_pdf_report_bytes(report_data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        "TitleStyle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        textColor=colors.HexColor("#0055A4"),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        "SubTitleStyle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        textColor=colors.HexColor("#555555"),
        spaceAfter=12
    )
    
    heading_style = ParagraphStyle(
        "Heading2Style",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        textColor=colors.HexColor("#0055A4"),
        spaceBefore=10,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        "BodyStyle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#333333")
    )
    
    story = []
    
    # Header Banner
    story.append(Paragraph("BUREAU OF INDIAN STANDARDS (BIS) ASSISTANT", ParagraphStyle("TopHeader", fontName="Helvetica-Bold", fontSize=9, textColor=colors.HexColor("#0055A4"))))
    story.append(Paragraph("PROACTIVE COMPLIANCE READINESS AUDIT REPORT", title_style))
    story.append(Paragraph(f"Report ID: {report_data['report_id']} | Date: {report_data['date_generated']} | Scale: {report_data['enterprise_scale']}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0055A4"), spaceAfter=12))
    
    # Section 1: Audit Summary & Risk Assessment
    story.append(Paragraph("1. Executive Product Audit & Risk Assessment", heading_style))
    summary_text = (
        f"<b>Product Name:</b> {report_data['product_name']}<br/>"
        f"<b>Primary BIS Standard:</b> {report_data['primary_standard']} ({report_data['standard_name']})<br/>"
        f"<b>Mandatory Scheme:</b> {report_data['scheme_type']}<br/>"
        f"<b>Risk Level Rating:</b> <b>{report_data['risk_level']}</b>"
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 10))
    
    # Section 2: Compliance Gap Checklist Table
    story.append(Paragraph("2. Compliance Gap Checklist & Key Action Items", heading_style))
    
    gap_table_data = [["Audit Checklist Item", "Compliance Status", "Action Required"]]
    for item in report_data["checklist"]:
        gap_table_data.append([item["item"], item["status"], "Mandatory Step"])
        
    t_gap = Table(gap_table_data, colWidths=[240, 130, 160])
    t_gap.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0055A4")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('BOTTOMPADDING', (0,0), (-1,0), 5),
        ('TOPPADDING', (0,0), (-1,0), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#DDDDDD")),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 8),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_gap)
    story.append(Spacer(1, 12))
    
    # Section 3: Roadmap & Cost Breakdown
    story.append(Paragraph("3. Roadmap, Timeline & Fee Breakdown", heading_style))
    
    fee = report_data["cost_breakdown"]
    fee_table_data = [
        ["Fee / Component Name", "Amount (with MSME Concessions)"],
        ["Application Fee", fee.get("application_fee", "₹1,000")],
        ["NABL Lab Sample Testing Fee", fee.get("lab_testing_fee", "₹15,000")],
        ["BIS Inspection Charges", fee.get("inspection_fee", "₹7,000")],
        ["Marking License Fee", fee.get("marking_fee", "₹20,000")],
        ["TOTAL ESTIMATED INVESTMENT", fee.get("total_estimated", "₹43,000")]
    ]
    
    t_fee = Table(fee_table_data, colWidths=[300, 230])
    t_fee.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#DDDDDD")),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 8),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor("#EFF6FF")),
        ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0,-1), (-1,-1), colors.HexColor("#0055A4")),
    ]))
    story.append(t_fee)
    
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()


class FeeQuotationRequest(BaseModel):
    product_name: str = "Packaged Drinking Water (IS 14543)"
    standard_code: str = "IS 14543:2024"
    scheme_type: str = "Scheme-I (ISI Mark)"
    track: str = "Simplified Fast-Track"
    enterprise_scale: str = "Micro / Startup"
    special_category: str = "Standard"
    annual_volume: int = 250000
    volume_unit: str = "Bottles / Year"
    application_fee: int = 1000
    inspection_fee: int = 7000
    lab_testing_fee: int = 18000
    base_marking_fee: int = 45000
    discount_marking_amount: int = 36000
    net_marking_fee: int = 9000
    subtotal: int = 35000
    gst_amount: int = 6300
    total_payable: int = 41300
    in_house_lab_capex: str = "₹1,50,000 - ₹3,50,000"
    estimated_timeline: str = "30 - 45 Days"


def build_fee_quotation_pdf_bytes(q: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'QuotationTitle',
        parent=styles['Heading1'],
        fontSize=15,
        leading=18,
        textColor=colors.HexColor("#0055A4"),
        alignment=1
    )
    sub_title = ParagraphStyle(
        'QuotationSubTitle',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#4B5563"),
        alignment=1
    )
    h2_style = ParagraphStyle(
        'QuotationH2',
        parent=styles['Heading2'],
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=8,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'QuotationBody',
        parent=styles['Normal'],
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#1F2937")
    )
    
    qid = f"PRAMAAN-FEE-{random.randint(100000, 999999)}"
    
    story.append(Paragraph("<b>BUREAU OF INDIAN STANDARDS (BIS)</b>", title_style))
    story.append(Paragraph("<b>P.R.A.M.A.A.N Regulatory Compliance & Statutory Fee Quotation</b>", ParagraphStyle('M', parent=title_style, fontSize=11, leading=14, textColor=colors.HexColor("#1F2937"))))
    story.append(Paragraph(f"Official Estimate ID: <b>{qid}</b> &nbsp;|&nbsp; Generated via P.R.A.M.A.A.N Regulatory Platform &nbsp;|&nbsp; Gazette Schedule 2026", sub_title))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0055A4"), spaceAfter=8))
    
    # 1. Project & Applicant Summary
    story.append(Paragraph("<b>1. Certification Scope & Applicant Profile</b>", h2_style))
    scope_data = [
        ["Product / Scope:", q.get("product_name", "Packaged Drinking Water"), "Applicable Standard:", q.get("standard_code", "IS 14543:2024")],
        ["Certification Scheme:", q.get("scheme_type", "Scheme-I (ISI Mark)"), "Procedure Track:", q.get("track", "Simplified Fast-Track")],
        ["Enterprise Scale:", q.get("enterprise_scale", "Micro / Startup"), "Special Subsidies:", q.get("special_category", "Standard")],
        ["Estimated Annual Volume:", f"{q.get('annual_volume', 0):,} {q.get('volume_unit', 'Units')}", "Estimated Time-to-Grant:", q.get("estimated_timeline", "30-45 Days")]
    ]
    t_scope = Table(scope_data, colWidths=[125, 145, 125, 145])
    t_scope.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (2,0), (2,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor("#334155")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_scope)
    story.append(Spacer(1, 8))
    
    # 2. Itemized Statutory Fee Table
    story.append(Paragraph("<b>2. Itemized Statutory Fee Schedule (Payable to Bureau of Indian Standards)</b>", h2_style))
    fee_data = [
        ["Cost Component", "Statutory Description", "Amount (INR)"],
        ["1. Application Processing Fee", "One-time non-refundable statutory filing fee", f"₹{q.get('application_fee', 1000):,}"],
        ["2. Factory Audit & Inspection", "Auditor man-days fee for technical plant verification", f"₹{q.get('inspection_fee', 7000):,}"],
        ["3. Independent Lab Sample Testing", "NABL/BIS testing for initial type test compliance", f"₹{q.get('lab_testing_fee', 18000):,}"],
        ["4. Annual Minimum Marking Fee", "Base statutory marking fee before MSME subsidies", f"₹{q.get('base_marking_fee', 45000):,}"],
        ["   Less: MSME / Startup Concession", f"Official Government subsidy for {q.get('enterprise_scale', 'Micro')}", f"-₹{q.get('discount_marking_amount', 0):,}"],
        ["   Net Annual Marking Fee", "Statutory marking fee payable for the first year", f"₹{q.get('net_marking_fee', 9000):,}"],
        ["Statutory Subtotal (excl. GST)", "Sum of application, inspection, testing & net marking fee", f"₹{q.get('subtotal', 35000):,}"],
        ["Statutory GST (18.0%)", "Goods & Services Tax on certification services", f"₹{q.get('gst_amount', 6300):,}"],
        ["TOTAL ESTIMATED OUTFLOW", "Total initial statutory investment payable to BIS", f"₹{q.get('total_payable', 41300):,}"]
    ]
    t_fee = Table(fee_data, colWidths=[160, 260, 120])
    t_fee.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0055A4")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7.5),
        ('BACKGROUND', (0,5), (-1,5), colors.HexColor("#F0FDF4")),
        ('TEXTCOLOR', (2,5), (2,5), colors.HexColor("#16A34A")),
        ('FONTNAME', (0,5), (-1,5), 'Helvetica-Bold'),
        ('BACKGROUND', (0,-3), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor("#EFF6FF")),
        ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0,-1), (-1,-1), colors.HexColor("#0055A4")),
        ('FONTSIZE', (0,-1), (-1,-1), 8.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(t_fee)
    story.append(Spacer(1, 8))
    
    # 3. In-House Plant Testing Equipment & Capex
    story.append(Paragraph("<b>3. In-House Quality Testing Facilities (Required for Plant Approval)</b>", h2_style))
    story.append(Paragraph(f"To obtain an ISI Mark, manufacturer must install mandatory in-house testing facilities. Estimated Capex: <b>{q.get('in_house_lab_capex', '₹1,50,000 - ₹3,50,000')}</b>.", body_style))
    story.append(Spacer(1, 4))
    
    # 4. Mandatory Document Checklist
    story.append(Paragraph("<b>4. Mandatory Documents Checklist for Manakonline Submission</b>", h2_style))
    docs_data = [
        ["• Udyam Registration / DPIIT Startup Certificate", "• Factory Premises Lease Deed / Ownership Proof"],
        ["• Plant Layout & Machinery List with Capacity", "• In-House Lab Testing Equipment & Calibration Slips"],
        ["• Qualified Technical QC In-Charge Appointment Letter", "• Raw Material Test Certificates & Manufacturing SOP"]
    ]
    t_docs = Table(docs_data, colWidths=[270, 270])
    t_docs.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 7),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor("#374151")),
        ('TOPPADDING', (0,0), (-1,-1), 1.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.5),
    ]))
    story.append(t_docs)
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94A3B8"), spaceAfter=4))
    story.append(Paragraph("<i>Note: This document is an estimate generated according to BIS (Conformity Assessment) Regulations 2026. Actual lab fees may vary slightly based on testing parameters. Submit applications directly via manakonline.in.</i>", ParagraphStyle('F', parent=body_style, fontSize=6.5, leading=8.5, textColor=colors.HexColor("#6B7280"))))
    
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()


@app.post("/api/generate-fee-quotation")
def generate_fee_quotation(request: FeeQuotationRequest):
    pdf_bytes = build_fee_quotation_pdf_bytes(request.dict())
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=BIS_Statutory_Fee_Quotation_{request.standard_code.replace(':', '_')}.pdf"}
    )


@app.get("/api/download-report/{report_id}")
def download_report(report_id: str):
    report_data = REPORTS_CACHE.get(report_id)
    if not report_data:
        report_data = run_compliance_gap_analysis(product_name="Packaged Drinking Water", product_description="Spec Sheet Audit", enterprise_scale="Micro/Startup")
        report_data["report_id"] = report_id
    
    pdf_bytes = build_pdf_report_bytes(report_data)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=BIS_Compliance_Readiness_Report_{report_id}.pdf"}
    )


# --- PHASE 7 & 9 TOOL SCHEMAS ---

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
    },
    {
        "type": "function",
        "function": {
            "name": "generate_process_timeline",
            "description": "Call this tool whenever the user asks for a process, procedure, application steps, workflow, or how-to guide related to BIS certification or licensing (e.g. steps to apply for a hallmark license, BIS certification process for MSMEs). It visually renders an interactive step-by-step process timeline for the user.",
            "parameters": {
                "type": "object",
                "properties": {
                    "steps": {
                        "type": "array",
                        "description": "Sequential step-by-step instructions for the requested procedure.",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {
                                    "type": "string",
                                    "description": "Short, clear title for this step."
                                },
                                "description": {
                                    "type": "string",
                                    "description": "Detailed explanation of what needs to be completed in this step."
                                }
                            },
                            "required": ["title", "description"]
                        }
                    }
                },
                "required": ["steps"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "run_compliance_gap_analysis",
            "description": "Call this tool whenever an MSME or user asks for a compliance audit, product spec sheet analysis, gap analysis, or wants to check what BIS certifications, Quality Control Orders (QCO), or standards apply to their product (e.g. packaged water, LED bulbs, toys, steel).",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_name": {
                        "type": "string",
                        "description": "Name of the product (e.g. Packaged Drinking Water, LED Bulb, Electric Water Heater)."
                    },
                    "product_description": {
                        "type": "string",
                        "description": "Additional details or spec sheet info."
                    },
                    "enterprise_scale": {
                        "type": "string",
                        "description": "Enterprise scale (Micro/Startup, Small, Medium, Large)."
                    }
                },
                "required": ["product_name"]
            }
        }
    }
]


@app.get("/health")
def health():
    return {"status": "BIS Backend is running natively with Proactive Compliance Gap Analyzer"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        search_query = request.query
        actions_taken = []
        process_timeline = None
        compliance_report = None
        unsupported_image_flag = False

        # 0. Vision OCR processing if image_base64 is provided
        extracted_text = ""
        if request.image_base64:
            clean_b64 = request.image_base64
            if "," in clean_b64:
                clean_b64 = clean_b64.split(",")[1]

            img_data_url = request.image_base64 if request.image_base64.startswith("data:image") else f"data:image/png;base64,{clean_b64}"
            vision_models = ["qwen/qwen3.8-27b", "qwen/qwen3.6-27b"]
            
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
                                        "text": "Analyze this image carefully.\nFirst check: Does this image contain a product label, packaging info, specification sheet, hallmark stamp, or technical document?\nIf it is a random, unrelated, or unclear photo (e.g. animal, car, landscape, blank/blurry photo with no product or regulatory label), respond ONLY with: UNSUPPORTED_IMAGE.\nOtherwise, extract all text, numbers, mineral/chemical composition (e.g. TDS, Chloride, Calcium, pH), BIS standard numbers (e.g. IS 10500, IS 16102), HUID codes, or brand/product names visible in this label image."
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
                        max_tokens=600,
                        timeout=25
                    )
                    extracted_text = vision_completion.choices[0].message.content.strip()
                    if extracted_text:
                        break
                except Exception as v_err:
                    print(f"Vision model '{v_model}' error: {v_err}")
                    continue

            if "UNSUPPORTED_IMAGE" in extracted_text.upper():
                unsupported_image_flag = True
            elif extracted_text:
                search_query = f"PRODUCT LABEL IMAGE DATA EXTRACTED:\n{extracted_text}\n\nUSER QUESTION: {request.query}"
                print(f"Vision OCR Extracted Entities: {extracted_text}")

        # If image was unsupported, return polite guidance immediately
        if unsupported_image_flag:
            return {
                "answer": "📷 I couldn't detect a valid BIS product label, hallmark stamp, or technical specification sheet in this image. Please upload a clear photo of a product label, packaging, HUID stamp, or technical spec document.",
                "sources": [],
                "actions_taken": [],
                "process_timeline": None,
                "compliance_report": None
            }

        # 1. Embed the search query dynamically without domain bias
        if request.image_base64 and extracted_text:
            embed_text = f"{extracted_text[:200]} {request.query}"
        else:
            embed_text = request.query

        query_embedding = list(embedding_model.embed([embed_text]))[0].tolist()

        sources = []
        
        # 2. Semantic Search
        try:
            if supabase:
                res = supabase.rpc('match_documents', {'query_embedding': query_embedding, 'match_count': 5}).execute()
                sources = res.data or []
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

        # 2.1 Similarity Score Threshold Filtering (>= 0.35) to prevent cross-domain RAG contamination
        SIMILARITY_THRESHOLD = 0.35
        filtered_sources = []
        for s in sources:
            sim = s.get("similarity", 1.0)
            if sim >= SIMILARITY_THRESHOLD:
                filtered_sources.append(s)
        sources = filtered_sources

        # 3. Context
        context_text = "\n\n---\n\n".join(
            f"Document: {s['metadata']['source']} (Page {s['metadata']['page']})\nContent: {s['content']}" 
            for s in sources
        ) if sources else "No specific document vector context found."

        # 4. System Prompt
        system_prompt = (
            "You are an expert AI Assistant & Proactive Compliance Advisor for the Bureau of Indian Standards (BIS).\n"
            "Your goal is to explain Indian Standards to everyday consumers, MSMEs, and startups in crisp, professional, medium-sized, and visually appealing responses.\n\n"
            "MANDATORY FORMATTING & REGULATORY RULES:\n"
            "1. **Direct & Current Regulatory Status**: Always state the CURRENT active regulatory requirement first in 1-2 crisp bullet points. Do NOT give long rambling historical chronologies or contradict yourself (e.g. stating old rules first and then contradicting them later). Be direct, clear, and consistent.\n"
            "2. **Crisp & Medium-Sized Output**: Keep all text responses concise, well-spaced, and medium-sized. Use structured bullet points (•) and **bold keywords** for high readability. Avoid long walls of unstructured text.\n"
            "3. **Proactive Compliance Gap Audit**: Whenever the user asks for a compliance audit, product spec sheet analysis, gap check, or wants to know what standards/QCO apply to their product, YOU MUST CALL THE `run_compliance_gap_analysis` TOOL to generate a full compliance report and downloadable PDF.\n"
            "4. **Phase 8 Process Navigator**: Whenever the user asks for a procedure, steps, how-to guide, workflow, or application process, YOU MUST CALL THE `generate_process_timeline` TOOL to render an interactive step-by-step timeline navigator.\n"
            "5. **Product Label Comparison Table**: When an image or label data is provided, include the 5-column comparison table comparing Product Label Values against BIS limits.\n"
            "6. **Citations**: Always cite BIS codes and page numbers (e.g., [IS 10500, Page 1]).\n"
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
        # Note: Only models that support function/tool calling must be used here
        tool_capable_models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"]
        chat_completion = None
        last_err = None

        for model_name in tool_capable_models:
            try:
                chat_completion = groq_client.chat.completions.create(
                    messages=messages,
                    model=model_name,
                    tools=tools,
                    tool_choice="auto",
                    temperature=0.2,
                    max_tokens=1500,
                )
                break
            except Exception as err:
                print(f"Tool calling with '{model_name}' failed: {err}")
                last_err = err
                continue

        # If all tool-calling attempts failed, fall back to standard completion without tools
        if not chat_completion:
            fallback_models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b", "groq/compound"]
            for f_model in fallback_models:
                try:
                    chat_completion = groq_client.chat.completions.create(
                        messages=messages,
                        model=f_model,
                        temperature=0.2,
                        max_tokens=1500,
                    )
                    break
                except Exception as f_err:
                    last_err = f_err
                    continue

        if not chat_completion:
            raise last_err or HTTPException(status_code=500, detail="Groq model API call failed.")

        response_message = chat_completion.choices[0].message

        # Check if LLM invoked tools
        if response_message.tool_calls:
            print("Agentic Tool Calls Triggered:", response_message.tool_calls)
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

                elif func_name == "generate_process_timeline":
                    raw_steps = args.get("steps", [])
                    timeline_items = []
                    for idx, s in enumerate(raw_steps):
                        if isinstance(s, dict) and "title" in s and "description" in s:
                            timeline_items.append({
                                "step_number": idx + 1,
                                "title": s["title"],
                                "description": s["description"]
                            })
                    if timeline_items:
                        process_timeline = timeline_items
                        actions_taken.append(f"Generated Interactive Process Timeline ({len(timeline_items)} Steps)")
                    tool_result = {"status": "Timeline generated successfully", "total_steps": len(timeline_items)}

                elif func_name == "run_compliance_gap_analysis":
                    p_name = args.get("product_name", "Packaged Drinking Water")
                    p_desc = args.get("product_description", "")
                    scale = args.get("enterprise_scale", "Micro/Startup")
                    
                    try:
                        report_data = run_compliance_gap_analysis(product_name=p_name, product_description=p_desc, enterprise_scale=scale)
                        compliance_report = report_data
                        actions_taken.append(f"Ran Proactive Compliance Gap Audit for '{p_name}'")
                        tool_result = {
                            "status": "Audit completed successfully",
                            "report_id": report_data["report_id"],
                            "primary_standard": report_data["primary_standard"],
                            "risk_level": report_data["risk_level"]
                        }
                    except Exception as ex:
                        tool_result = {"error": str(ex)}

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call_id,
                    "name": func_name,
                    "content": json.dumps(tool_result)
                })

            second_completion = None
            for model_name in tool_capable_models:
                try:
                    second_completion = groq_client.chat.completions.create(
                        messages=messages,
                        model=model_name,
                        temperature=0.2,
                        max_tokens=1500,
                    )
                    break
                except Exception as s_err:
                    print(f"Second completion with '{model_name}' failed: {s_err}")
                    continue

            if second_completion:
                answer = second_completion.choices[0].message.content
            else:
                answer = response_message.content or "Tool execution completed."
        else:
            answer = response_message.content or "No response generated."

        # Strip internal AI thinking tags (<think>...</think>)
        clean_answer = clean_think_tags(answer)

        formatted_sources = [
            {
                "document": s["metadata"]["source"], 
                "page": s["metadata"]["page"], 
                "content_snippet": s["content"][:200]
            } 
            for s in sources
        ] if sources else []

        return {
            "answer": clean_answer, 
            "sources": formatted_sources,
            "actions_taken": actions_taken,
            "process_timeline": process_timeline,
            "compliance_report": compliance_report
        }
        
    except Exception as e:
        print(f"Chat API Exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))

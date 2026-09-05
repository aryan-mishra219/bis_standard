"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import CustomSelect from "../components/CustomSelect";
import { useTheme } from "../context/ThemeContext";

// ─── COMPREHENSIVE PAN-INDIA BIS & NABL RECOGNIZED LABS DIRECTORY ───
const LAB_DATABASE = [
  {
    id: "bis-cl-sahibabad",
    name: "BIS Central Laboratory (CL)",
    shortName: "BIS Central Lab Sahibabad",
    code: "BIS-CL-001",
    tier: "BIS Central Lab",
    tierBadge: "Apex BIS Facility",
    tierColor: "bg-blue-600 text-white",
    pinColor: "#2563eb",
    lat: 28.6712,
    lng: 77.3489,
    city: "Ghaziabad / Delhi NCR",
    state: "Uttar Pradesh",
    address: "Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad, UP - 201010",
    phone: "+91-120-4177100",
    email: "cl-bis@bis.gov.in",
    timing: "09:00 AM - 05:30 PM (Mon - Fri)",
    turnaround: "5 - 7 Business Days",
    accreditation: "ISO/IEC 17025:2017 (NABL Accredited & BIS Owned)",
    categories: ["Water & Beverages", "Electronics & IT (CRS)", "Steel & Metallurgy", "Toys & Safety", "Chemicals & Plastics", "Cement & Building Materials"],
    standards: ["IS 14543", "IS 10500", "IS 13252 (Part 1)", "IS 16046", "IS 9873 (Part 1-3)", "IS 1786", "IS 269", "IS 302"],
    sampleCapacity: "High Volume (Apex Lab)",
    facilities: ["Advanced Mass Spectrometry", "EMI/EMC Chamber", "Mechanical Tensile 1000kN", "Chemical Trace Analysis", "Toy Safety Ballistic/Toxicity Lab"]
  },
  {
    id: "bis-wrol-mumbai",
    name: "BIS Western Regional Office Laboratory (WROL)",
    shortName: "BIS Regional Lab Mumbai",
    code: "BIS-WROL-002",
    tier: "BIS Regional Lab",
    tierBadge: "BIS Regional Lab",
    tierColor: "bg-indigo-600 text-white",
    pinColor: "#4f46e5",
    lat: 19.1176,
    lng: 72.8797,
    city: "Mumbai",
    state: "Maharashtra",
    address: "Manakalaya, E9, MIDC, Andheri (East), Mumbai, Maharashtra - 400093",
    phone: "+91-22-28329295",
    email: "wrol@bis.gov.in",
    timing: "09:30 AM - 06:00 PM (Mon - Fri)",
    turnaround: "7 - 10 Business Days",
    accreditation: "ISO/IEC 17025:2017 (NABL TC-5012)",
    categories: ["Electronics & IT (CRS)", "Chemicals & Plastics", "Steel & Metallurgy", "Water & Beverages"],
    standards: ["IS 13252 (Part 1)", "IS 616", "IS 16046 (Part 2)", "IS 14543", "IS 1786", "IS 513"],
    sampleCapacity: "High Volume",
    facilities: ["Lithium Cell Safety Testing Rig", "IP68 Water Ingress Testing", "Spectrophotometry", "Metallurgy Microscope Suite"]
  },
  {
    id: "bis-srol-chennai",
    name: "BIS Southern Regional Office Laboratory (SROL)",
    shortName: "BIS Regional Lab Chennai",
    code: "BIS-SROL-003",
    tier: "BIS Regional Lab",
    tierBadge: "BIS Regional Lab",
    tierColor: "bg-indigo-600 text-white",
    pinColor: "#4f46e5",
    lat: 13.0067,
    lng: 80.2458,
    city: "Chennai",
    state: "Tamil Nadu",
    address: "CIT Campus, IV Cross Road, Taramani, Chennai, Tamil Nadu - 600113",
    phone: "+91-44-22541442",
    email: "srol@bis.gov.in",
    timing: "09:00 AM - 05:30 PM (Mon - Fri)",
    turnaround: "6 - 9 Business Days",
    accreditation: "ISO/IEC 17025:2017 (NABL TC-5044)",
    categories: ["Electronics & IT (CRS)", "EV Batteries & Auto", "Chemicals & Plastics", "Cement & Building Materials"],
    standards: ["IS 16046", "IS 13252", "IS 16333", "IS 12269", "IS 456", "IS 14543"],
    sampleCapacity: "High Volume",
    facilities: ["Battery Thermal Runaway Test Rig", "High Voltage Breakdown Tester", "Concrete Compressive 2000kN"]
  },
  {
    id: "bis-erol-kolkata",
    name: "BIS Eastern Regional Office Laboratory (EROL)",
    shortName: "BIS Regional Lab Kolkata",
    code: "BIS-EROL-004",
    tier: "BIS Regional Lab",
    tierBadge: "BIS Regional Lab",
    tierColor: "bg-indigo-600 text-white",
    pinColor: "#4f46e5",
    lat: 22.5804,
    lng: 88.4287,
    city: "Kolkata",
    state: "West Bengal",
    address: "1/14 C.I.T. Scheme VII M, VIP Road, Kankurgachi, Kolkata, WB - 700054",
    phone: "+91-33-23207085",
    email: "erol@bis.gov.in",
    timing: "09:30 AM - 05:30 PM (Mon - Fri)",
    turnaround: "7 - 10 Business Days",
    accreditation: "ISO/IEC 17025:2017 (NABL TC-5109)",
    categories: ["Steel & Metallurgy", "Cement & Building Materials", "Water & Beverages", "Chemicals & Plastics"],
    standards: ["IS 1786", "IS 2062", "IS 269", "IS 1489", "IS 14543", "IS 10500"],
    sampleCapacity: "High Volume",
    facilities: ["Charpy Impact Tester", "Chemical Wet Lab", "Atomic Absorption Spectrometer", "X-Ray Fluorescence"]
  },
  {
    id: "bis-brtc-bengaluru",
    name: "BIS Bangalore Regional Technology Centre & Lab",
    shortName: "BIS Lab Bengaluru",
    code: "BIS-BRTC-005",
    tier: "BIS Regional Lab",
    tierBadge: "BIS Tech Hub",
    tierColor: "bg-indigo-600 text-white",
    pinColor: "#4f46e5",
    lat: 12.9716,
    lng: 77.5946,
    city: "Bengaluru",
    state: "Karnataka",
    address: "Peenya Industrial Area, 1st Stage, Tumkur Road, Bengaluru, Karnataka - 560058",
    phone: "+91-80-28394955",
    email: "bnbo@bis.gov.in",
    timing: "09:00 AM - 05:30 PM (Mon - Fri)",
    turnaround: "5 - 8 Business Days",
    accreditation: "ISO/IEC 17025:2017 (NABL TC-5881)",
    categories: ["Electronics & IT (CRS)", "EV Batteries & Auto", "Toys & Safety"],
    standards: ["IS 13252", "IS 16046 (Part 1 & 2)", "IS 9873", "IS 15885"],
    sampleCapacity: "High Volume",
    facilities: ["Power Supply Stress Testing Bench", "Lithium Pouch Cell Drop Chamber", "Acoustic Noise Lab"]
  },
  {
    id: "cpri-bengaluru",
    name: "Central Power Research Institute (CPRI)",
    shortName: "CPRI Bengaluru (Govt)",
    code: "NABL-CPRI-010",
    tier: "Govt Recognized (NABL)",
    tierBadge: "Autonomous Govt Lab",
    tierColor: "bg-emerald-600 text-white",
    pinColor: "#059669",
    lat: 13.0158,
    lng: 77.5802,
    city: "Bengaluru",
    state: "Karnataka",
    address: "Prof. Sir C.V. Raman Road, Sadashivanagar, Bengaluru, Karnataka - 560080",
    phone: "+91-80-22072222",
    email: "cpri-testing@nic.in",
    timing: "09:00 AM - 05:30 PM (Mon - Fri)",
    turnaround: "10 - 14 Business Days",
    accreditation: "NABL Accredited & BIS Recognized Category 'A'",
    categories: ["Electronics & IT (CRS)", "EV Batteries & Auto", "Steel & Metallurgy"],
    standards: ["IS 16046", "IS 13252", "IS 302", "IS 694", "IS 1554"],
    sampleCapacity: "Ultra High (Mega Power Lab)",
    facilities: ["Ultra High Voltage Testing Bay", "Short Circuit Lab", "Seismic Simulation Shake Table", "EV Battery Fast Charge Cycler"]
  },
  {
    id: "npl-new-delhi",
    name: "CSIR - National Physical Laboratory (NPL)",
    shortName: "CSIR-NPL New Delhi",
    code: "NABL-NPL-011",
    tier: "Govt Recognized (NABL)",
    tierBadge: "National Metrology Apex",
    tierColor: "bg-emerald-600 text-white",
    pinColor: "#059669",
    lat: 28.6387,
    lng: 77.1706,
    city: "New Delhi",
    state: "Delhi",
    address: "Dr. K.S. Krishnan Marg, Pusa, New Delhi - 110012",
    phone: "+91-11-45609212",
    email: "director@nplindia.org",
    timing: "09:00 AM - 05:30 PM (Mon - Fri)",
    turnaround: "7 - 12 Business Days",
    accreditation: "National Metrology Institute of India & NABL Apex",
    categories: ["Electronics & IT (CRS)", "Hallmarking & Gold Assaying", "Steel & Metallurgy"],
    standards: ["IS 1417 (Gold Purity)", "IS 2112 (Silver)", "IS 13252", "IS 15885"],
    sampleCapacity: "Standard / Precision Metrology",
    facilities: ["Primary Atomic Clock Time Standards", "Fire Assay Reference Suite", "Precision Quantum Hall Resistance Standard"]
  },
  {
    id: "ertl-north-delhi",
    name: "ERTL (North) - STQC Directorate (MeitY)",
    shortName: "ERTL (North) STQC Delhi",
    code: "NABL-ERTLN-012",
    tier: "Govt Recognized (NABL)",
    tierBadge: "MeitY Govt Testing Lab",
    tierColor: "bg-emerald-600 text-white",
    pinColor: "#059669",
    lat: 28.5355,
    lng: 77.2608,
    city: "New Delhi",
    state: "Delhi",
    address: "S-Block, Okhla Industrial Area Phase-II, New Delhi - 110020",
    phone: "+91-11-26386219",
    email: "ertlnorth@stqc.gov.in",
    timing: "09:00 AM - 05:30 PM (Mon - Fri)",
    turnaround: "6 - 10 Business Days",
    accreditation: "ISO/IEC 17025:2017 (MeitY Recognized for BIS CRS)",
    categories: ["Electronics & IT (CRS)", "EV Batteries & Auto"],
    standards: ["IS 13252 (Part 1)", "IS 16046 (Part 2)", "IS 616", "IS 16333", "IS 16242"],
    sampleCapacity: "High Volume",
    facilities: ["10-Meter Semi-Anechoic EMC Chamber", "Surge/Burst Immunity Generators", "Environmental Climate Chambers (-40°C to +150°C)"]
  },
  {
    id: "ertl-west-mumbai",
    name: "ERTL (West) - STQC Directorate (MeitY)",
    shortName: "ERTL (West) Mumbai",
    code: "NABL-ERTLW-013",
    tier: "Govt Recognized (NABL)",
    tierBadge: "MeitY Govt Testing Lab",
    tierColor: "bg-emerald-600 text-white",
    pinColor: "#059669",
    lat: 19.1235,
    lng: 72.8722,
    city: "Mumbai",
    state: "Maharashtra",
    address: "Cross Road B, MIDC Area, Andheri (East), Mumbai, Maharashtra - 400093",
    phone: "+91-22-28327116",
    email: "ertlwest@stqc.gov.in",
    timing: "09:30 AM - 05:30 PM (Mon - Fri)",
    turnaround: "7 - 10 Business Days",
    accreditation: "ISO/IEC 17025:2017 (STQC/MeitY)",
    categories: ["Electronics & IT (CRS)", "EV Batteries & Auto"],
    standards: ["IS 13252", "IS 16046", "IS 616", "IS 15885"],
    sampleCapacity: "High Volume",
    facilities: ["RF Conformance Suite", "Drop & Impact Rigidity Test", "Safety Flammability Glow-wire Chamber"]
  },
  {
    id: "cipet-ahmedabad",
    name: "CIPET: Institute of Petrochemicals Technology",
    shortName: "CIPET Ahmedabad",
    code: "NABL-CIPET-014",
    tier: "Govt Recognized (NABL)",
    tierBadge: "Govt Plastics Apex",
    tierColor: "bg-emerald-600 text-white",
    pinColor: "#059669",
    lat: 23.0039,
    lng: 72.5975,
    city: "Ahmedabad",
    state: "Gujarat",
    address: "Plot No. 630, Phase-IV, GIDC Vatva, Ahmedabad, Gujarat - 382445",
    phone: "+91-79-40103903",
    email: "ahmedabad@cipet.gov.in",
    timing: "09:00 AM - 05:30 PM (Mon - Fri)",
    turnaround: "5 - 8 Business Days",
    accreditation: "ISO/IEC 17025:2017 (Department of Chemicals & Petrochemicals)",
    categories: ["Chemicals & Plastics", "Toys & Safety", "Water & Beverages"],
    standards: ["IS 4984 (HDPE)", "IS 4985 (PVC)", "IS 9873 (Plastic Toys)", "IS 14543 (PET Bottles)", "IS 15410"],
    sampleCapacity: "High Volume",
    facilities: ["Differential Scanning Calorimeter (DSC)", "Hydrostatic Burst Pressure Test 100 Bar", "Melt Flow Indexer"]
  },
  {
    id: "tuv-rheinland-gurugram",
    name: "TUV Rheinland (India) Pvt. Ltd.",
    shortName: "TÜV Rheinland Gurugram",
    code: "PVT-TUV-020",
    tier: "BIS Recognized Private",
    tierBadge: "Global Testing Leader",
    tierColor: "bg-amber-600 text-white",
    pinColor: "#d97706",
    lat: 28.4986,
    lng: 77.0878,
    city: "Gurugram / Delhi NCR",
    state: "Haryana",
    address: "Plot 27 & 28, Udyog Vihar Phase IV, Gurugram, Haryana - 122015",
    phone: "+91-124-4988888",
    email: "info-ind@tuv.com",
    timing: "09:00 AM - 06:30 PM (Mon - Sat)",
    turnaround: "3 - 5 Business Days (Fast-Track)",
    accreditation: "ISO/IEC 17025:2017 & BIS ILMS Recognized",
    categories: ["Electronics & IT (CRS)", "EV Batteries & Auto", "Toys & Safety", "Water & Beverages"],
    standards: ["IS 13252", "IS 16046 (Part 1 & 2)", "IS 9873", "IS 14543", "IS 302", "IS 616"],
    sampleCapacity: "Ultra High (Turnkey Lab)",
    facilities: ["Turnkey BIS CRS Fast-Track Cell", "3m Anechoic EMC Chamber", "Battery Abuse Simulation (Crush/Nail Penetration)", "Microbiology Clean Room"]
  },
  {
    id: "ul-india-bengaluru",
    name: "UL India Testing Center (Underwriters Laboratories)",
    shortName: "UL Solutions Bengaluru",
    code: "PVT-UL-021",
    tier: "BIS Recognized Private",
    tierBadge: "Global Testing Leader",
    tierColor: "bg-amber-600 text-white",
    pinColor: "#d97706",
    lat: 12.8399,
    lng: 77.6770,
    city: "Bengaluru",
    state: "Karnataka",
    address: "Laboratory Building, Kalyani Tech Park, Electronic City Phase I, Bengaluru - 560100",
    phone: "+91-80-41384400",
    email: "india.sales@ul.com",
    timing: "09:00 AM - 06:00 PM (Mon - Fri)",
    turnaround: "4 - 6 Business Days",
    accreditation: "ISO/IEC 17025:2017 (NABL & BIS Recognized)",
    categories: ["Electronics & IT (CRS)", "EV Batteries & Auto", "Toys & Safety"],
    standards: ["IS 13252", "IS 16046", "IS 9873", "IS 15885", "IS 616"],
    sampleCapacity: "Ultra High",
    facilities: ["Complete BIS CRS Testing Suite", "EV Battery Safety Explosion Chamber", "Acoustic and Sound Power Lab"]
  },
  {
    id: "intertek-delhi",
    name: "Intertek India Testing Services",
    shortName: "Intertek New Delhi",
    code: "PVT-INT-022",
    tier: "BIS Recognized Private",
    tierBadge: "Global Testing Leader",
    tierColor: "bg-amber-600 text-white",
    pinColor: "#d97706",
    lat: 28.5284,
    lng: 77.2798,
    city: "New Delhi",
    state: "Delhi",
    address: "E-20, Block B-1, Mohan Cooperative Industrial Estate, Mathura Road, New Delhi - 110044",
    phone: "+91-11-41599400",
    email: "delhi.testing@intertek.com",
    timing: "09:00 AM - 06:00 PM (Mon - Fri)",
    turnaround: "4 - 7 Business Days",
    accreditation: "ISO/IEC 17025:2017 (NABL TC-5290)",
    categories: ["Toys & Safety", "Electronics & IT (CRS)", "Chemicals & Plastics", "Water & Beverages"],
    standards: ["IS 9873 (Part 1, 2, 3, 4, 7)", "IS 15644 (Electric Toys)", "IS 13252", "IS 14543"],
    sampleCapacity: "High Volume",
    facilities: ["Phthalates & Heavy Metal Gas Chromatography (GC-MS)", "Small Parts & Choking Hazard Rig", "Flammability Testing Hood"]
  },
  {
    id: "sgs-india-chennai",
    name: "SGS India Testing Laboratory",
    shortName: "SGS Chennai",
    code: "PVT-SGS-023",
    tier: "BIS Recognized Private",
    tierBadge: "Global Testing Leader",
    tierColor: "bg-amber-600 text-white",
    pinColor: "#d97706",
    lat: 12.9815,
    lng: 80.1983,
    city: "Chennai",
    state: "Tamil Nadu",
    address: "28 B/1 (SP), 28 B/2 (SP), 2nd Main Road, Ambattur Industrial Estate, Chennai - 600058",
    phone: "+91-44-66081669",
    email: "chennai.lab@sgs.com",
    timing: "09:00 AM - 06:00 PM (Mon - Fri)",
    turnaround: "4 - 7 Business Days",
    accreditation: "ISO/IEC 17025:2017 (NABL Accredited)",
    categories: ["Water & Beverages", "Chemicals & Plastics", "Toys & Safety", "Steel & Metallurgy"],
    standards: ["IS 14543", "IS 13428", "IS 10500", "IS 9873", "IS 1786"],
    sampleCapacity: "High Volume",
    facilities: ["Microbial Pathogen Detection (E. Coli, Salmonella)", "Inductively Coupled Plasma Mass Spec (ICP-MS)", "TOC Analyzer"]
  },
  {
    id: "bureau-veritas-noida",
    name: "Bureau Veritas Consumer Products Services (India)",
    shortName: "Bureau Veritas Noida",
    code: "PVT-BV-024",
    tier: "BIS Recognized Private",
    tierBadge: "Global Testing Leader",
    tierColor: "bg-amber-600 text-white",
    pinColor: "#d97706",
    lat: 28.6019,
    lng: 77.3789,
    city: "Noida / Delhi NCR",
    state: "Uttar Pradesh",
    address: "C-19, Sector 7, Industrial Area, Noida, Uttar Pradesh - 201301",
    phone: "+91-120-4368500",
    email: "bvcps.india@in.bureauveritas.com",
    timing: "09:00 AM - 06:00 PM (Mon - Sat)",
    turnaround: "3 - 5 Business Days",
    accreditation: "ISO/IEC 17025:2017 & BIS ILMS Validated",
    categories: ["Toys & Safety", "Electronics & IT (CRS)", "Chemicals & Plastics"],
    standards: ["IS 9873 (Part 1-9)", "IS 15644", "IS 13252", "IS 616"],
    sampleCapacity: "High Volume",
    facilities: ["RoHS 2.0 / REACH Screen Suite", "Toy Drop Impact & Sharp Edge Machine", "Accelerated Weathering QUV Chamber"]
  },
  {
    id: "nth-kolkata",
    name: "National Test House (ER) - Govt of India",
    shortName: "National Test House Kolkata",
    code: "GOVT-NTH-030",
    tier: "Govt Recognized (NABL)",
    tierBadge: "Premier Govt Test House",
    tierColor: "bg-emerald-600 text-white",
    pinColor: "#059669",
    lat: 22.5298,
    lng: 88.3375,
    city: "Kolkata",
    state: "West Bengal",
    address: "Block CP, Sector V, Salt Lake, Kolkata, West Bengal - 700091",
    phone: "+91-33-23673871",
    email: "nth-er@nic.in",
    timing: "09:30 AM - 05:30 PM (Mon - Fri)",
    turnaround: "7 - 12 Business Days",
    accreditation: "Govt of India, Ministry of Consumer Affairs, NABL Accredited",
    categories: ["Cement & Building Materials", "Steel & Metallurgy", "Chemicals & Plastics", "Water & Beverages"],
    standards: ["IS 269", "IS 1489", "IS 1786", "IS 2062", "IS 10500"],
    sampleCapacity: "High Volume",
    facilities: ["3000 kN Universal Testing Machine", "Chemical Standard Wet Titration Lab", "Aggregate Crushing Value Setup"]
  },
  {
    id: "ahc-mumbai-hallmarking",
    name: "Assaying and Hallmarking Centre (AHC) Zaveri Bazar",
    shortName: "AHC Zaveri Hallmarking Mumbai",
    code: "BIS-AHC-040",
    tier: "BIS Recognized Private",
    tierBadge: "BIS Hallmarking Centre",
    tierColor: "bg-amber-600 text-white",
    pinColor: "#d97706",
    lat: 18.9515,
    lng: 72.8318,
    city: "Mumbai",
    state: "Maharashtra",
    address: "142/148, Sheikh Memon Street, Zaveri Bazaar, Mumbai, Maharashtra - 400002",
    phone: "+91-22-23441299",
    email: "ahc-mumbai@bisahc.in",
    timing: "10:00 AM - 07:30 PM (Mon - Sat)",
    turnaround: "24 - 48 Hours (Express Hallmarking)",
    accreditation: "BIS Recognized AHC under Hallmarking Scheme (IS 1417:2016)",
    categories: ["Hallmarking & Gold Assaying"],
    standards: ["IS 1417 (Gold 14k/18k/20k/22k/23k/24k)", "IS 2112 (Silver Articles)", "IS 15820 (AHC Standard)"],
    sampleCapacity: "High Volume (10,000+ pieces/day)",
    facilities: ["X-Ray Fluorescence (XRF) Multi-Spot Spectrometer", "Cupellation Furnace (Fire Assay at 1100°C)", "Laser Marking Micro-Engraver (6-digit HUID)"]
  },
  {
    id: "sri-new-delhi",
    name: "Shriram Institute for Industrial Research (SRI)",
    shortName: "SRI Institute Delhi",
    code: "PVT-SRI-045",
    tier: "Govt Recognized (NABL)",
    tierBadge: "Renowned Research Test House",
    tierColor: "bg-emerald-600 text-white",
    pinColor: "#059669",
    lat: 28.6942,
    lng: 77.2136,
    city: "New Delhi",
    state: "Delhi",
    address: "19, University Road, Delhi - 110007",
    phone: "+91-11-27667267",
    email: "customercare@shriraminstitute.org",
    timing: "09:00 AM - 05:30 PM (Mon - Fri)",
    turnaround: "5 - 8 Business Days",
    accreditation: "ISO/IEC 17025:2017 & BIS Approved Third Party Lab",
    categories: ["Chemicals & Plastics", "Water & Beverages", "Toys & Safety", "Cement & Building Materials"],
    standards: ["IS 14543", "IS 13428", "IS 10500", "IS 9873", "IS 4984", "IS 516"],
    sampleCapacity: "High Volume",
    facilities: ["Pesticide Residue Analysis (GC-MS/MS)", "Toxicity In-Vitro Testing Cell", "Tensile & Flexural Testing Machines"]
  },
  {
    id: "bis-cro-patna",
    name: "BIS Central Regional Office & Lab Patna",
    shortName: "BIS Branch Lab Patna",
    code: "BIS-CROL-050",
    tier: "BIS Regional Lab",
    tierBadge: "BIS Regional Lab",
    tierColor: "bg-indigo-600 text-white",
    pinColor: "#4f46e5",
    lat: 25.5941,
    lng: 85.1376,
    city: "Patna",
    state: "Bihar",
    address: "Patliputra Industrial Area, Patna, Bihar - 800013",
    phone: "+91-612-2262808",
    email: "patna@bis.gov.in",
    timing: "09:30 AM - 05:30 PM (Mon - Fri)",
    turnaround: "7 - 10 Business Days",
    accreditation: "ISO/IEC 17025:2017 (NABL TC-5912)",
    categories: ["Water & Beverages", "Cement & Building Materials", "Steel & Metallurgy"],
    standards: ["IS 14543", "IS 269", "IS 1786"],
    sampleCapacity: "Standard Volume",
    facilities: ["Packaged Drinking Water Testing Lab", "Compressive Strength Tester", "Rebar Bend & Re-bend Setup"]
  },
  {
    id: "arai-pune-ev",
    name: "Automotive Research Association of India (ARAI)",
    shortName: "ARAI Pune (Govt)",
    code: "GOVT-ARAI-060",
    tier: "Govt Recognized (NABL)",
    tierBadge: "Automotive & EV Apex",
    tierColor: "bg-emerald-600 text-white",
    pinColor: "#059669",
    lat: 18.5284,
    lng: 73.8164,
    city: "Pune",
    state: "Maharashtra",
    address: "Survey No. 102, Vetal Hill, Off Paud Road, Kothrud, Pune, Maharashtra - 411038",
    phone: "+91-20-30231111",
    email: "director@araiindia.com",
    timing: "08:30 AM - 05:00 PM (Mon - Fri)",
    turnaround: "10 - 15 Business Days",
    accreditation: "Ministry of Heavy Industries & NABL Accredited",
    categories: ["EV Batteries & Auto", "Electronics & IT (CRS)"],
    standards: ["IS 16046 (Part 2)", "AIS 038 (Rev 2)", "AIS 156 (EV Battery Safety)", "IS 13252"],
    sampleCapacity: "Ultra High (Specialized Auto Bay)",
    facilities: ["EV Battery Thermal Shock & Water Immersion Bay", "Full Vehicle Crash Test Facility", "Automotive EMC Chamber 10m"]
  },
  {
    id: "bis-ghy-guwahati",
    name: "BIS North Eastern Regional Laboratory Guwahati",
    shortName: "BIS Lab Guwahati",
    code: "BIS-NER-070",
    tier: "BIS Regional Lab",
    tierBadge: "North-East Hub",
    tierColor: "bg-indigo-600 text-white",
    pinColor: "#4f46e5",
    lat: 26.1445,
    lng: 91.7362,
    city: "Guwahati",
    state: "Assam",
    address: "Panjabari Road, Juripar, Guwahati, Assam - 781037",
    phone: "+91-361-2332617",
    email: "guwahati@bis.gov.in",
    timing: "09:30 AM - 05:30 PM (Mon - Fri)",
    turnaround: "7 - 12 Business Days",
    accreditation: "ISO/IEC 17025:2017 (NABL Accredited)",
    categories: ["Water & Beverages", "Cement & Building Materials", "Chemicals & Plastics"],
    standards: ["IS 14543", "IS 10500", "IS 269", "IS 1489"],
    sampleCapacity: "Standard Volume",
    facilities: ["Drinking Water Microbial Culture Lab", "Cement Testing Autoclave", "Specific Gravity Balance"]
  },
  {
    id: "icert-hyderabad",
    name: "ICERT Testing & Research Laboratories",
    shortName: "ICERT Labs Hyderabad",
    code: "PVT-ICERT-080",
    tier: "BIS Recognized Private",
    tierBadge: "BIS Recognized Private",
    tierColor: "bg-amber-600 text-white",
    pinColor: "#d97706",
    lat: 17.4483,
    lng: 78.3915,
    city: "Hyderabad",
    state: "Telangana",
    address: "Plot 18, HITEC City Phase 2, Madhapur, Hyderabad, Telangana - 500081",
    phone: "+91-40-67128800",
    email: "hyderabad@icertlabs.in",
    timing: "09:00 AM - 06:30 PM (Mon - Sat)",
    turnaround: "4 - 6 Business Days",
    accreditation: "ISO/IEC 17025:2017 & BIS ILMS Recognized",
    categories: ["Electronics & IT (CRS)", "EV Batteries & Auto", "Toys & Safety"],
    standards: ["IS 13252 (Part 1)", "IS 16046 (Part 2)", "IS 9873", "IS 16333"],
    sampleCapacity: "High Volume",
    facilities: ["IT Equipment Safety Rig", "Lithium Pouch Vibration Shaker", "Chemical Phthalate Analyzer"]
  }
];

// ─── PROFESSIONAL SVG ICONS (NO EMOJIS) ───
const Icons = {
  mapPin: (
    <svg className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  zap: (
    <svg className="w-3.5 h-3.5 shrink-0 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  shield: (
    <svg className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  search: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  close: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  printer: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  ),
  check: (
    <svg className="w-6 h-6 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 shrink-0 text-blue-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  compass: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
    </svg>
  ),
  clipboard: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  building: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  globe: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  cpu: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9h6v6H9zM9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 6h3M1 9h3m-3 6h3" />
    </svg>
  ),
  droplet: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  ),
  smile: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </svg>
  ),
  battery: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="7" width="16" height="10" rx="2" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 11v2M6 11l2 2-2 2" />
    </svg>
  ),
  layers: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  star: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2" />
    </svg>
  ),
  flask: (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  )
};

const CATEGORIES = [
  { id: "all", name: "All Categories", icon: Icons.globe },
  { id: "Electronics & IT (CRS)", name: "Electronics & IT (CRS)", icon: Icons.cpu },
  { id: "Water & Beverages", name: "Water & Beverages", icon: Icons.droplet },
  { id: "Toys & Safety", name: "Toys & Children Safety", icon: Icons.smile },
  { id: "EV Batteries & Auto", name: "EV Batteries & Auto", icon: Icons.battery },
  { id: "Steel & Metallurgy", name: "Steel & Metallurgy", icon: Icons.building },
  { id: "Hallmarking & Gold Assaying", name: "Gold Hallmarking (AHC)", icon: Icons.star },
  { id: "Cement & Building Materials", name: "Cement & Construction", icon: Icons.layers },
  { id: "Chemicals & Plastics", name: "Chemicals & Plastics", icon: Icons.flask }
];

const TIERS = [
  { id: "all", name: "All Tiers" },
  { id: "BIS Central Lab", name: "BIS Central Lab (Sahibabad)" },
  { id: "BIS Regional Lab", name: "BIS Regional Labs (WROL/SROL/EROL)" },
  { id: "Govt Recognized (NABL)", name: "Govt NABL Labs (CPRI/NPL/ERTL/ARAI)" },
  { id: "BIS Recognized Private", name: "BIS Recognized Private (TÜV/UL/Intertek)" }
];

const CITIES = [
  "All Cities",
  "Delhi NCR",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Ahmedabad",
  "Pune",
  "Patna",
  "Guwahati"
];

export default function LabLocatorPage() {
  const { theme } = useTheme();
  const [selectedLab, setSelectedLab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [userLocation, setUserLocation] = useState(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // "split", "map", "list"
  
  // Test Inquiry Modal State
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryLab, setInquiryLab] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    productName: "",
    standardCode: "IS 14543",
    sampleQty: "3 Samples",
    notes: ""
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryRefNumber, setInquiryRefNumber] = useState("");
  const [mapProvider, setMapProvider] = useState("google_standard"); // "google_standard", "google_satellite", "google_terrain", "dark_canvas"

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const boundaryLayerRef = useRef(null);
  const markersRef = useRef({});

  // Helper to obtain tile configuration (Esri Dark Canvas + Google Maps India Edition with full sovereign borders)
  const getMapTileConfig = (provider, isDark) => {
    if (provider === "google_satellite") {
      return {
        url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&gl=IN&hl=en",
        attribution: 'Imagery &copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google</a> (Survey of India Compliant)',
        maxZoom: 19
      };
    }
    if (provider === "google_terrain") {
      return {
        url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&gl=IN&hl=en",
        attribution: 'Map &copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google</a> (Survey of India Compliant)',
        maxZoom: 19
      };
    }
    if (provider === "dark_canvas" || (provider === "auto" && isDark)) {
      return {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        attribution: '&copy; Esri, HERE, Garmin, USGS (Official Sovereign India Overlay)',
        maxZoom: 19
      };
    }
    // Default: Google Maps Standard Roadmap with Sovereign India Boundary Edition (&gl=IN)
    return {
      url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&gl=IN&hl=en",
      attribution: 'Map data &copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google</a> (Survey of India Compliant Sovereign Edition)',
      maxZoom: 19
    };
  };

  // Filtered labs
  const filteredLabs = useMemo(() => {
    return LAB_DATABASE.filter(lab => {
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = lab.name.toLowerCase().includes(q) || lab.shortName.toLowerCase().includes(q);
        const matchesCode = lab.code.toLowerCase().includes(q);
        const matchesCity = lab.city.toLowerCase().includes(q) || lab.state.toLowerCase().includes(q);
        const matchesStandards = lab.standards.some(s => s.toLowerCase().includes(q));
        const matchesCategories = lab.categories.some(c => c.toLowerCase().includes(q));
        if (!matchesName && !matchesCode && !matchesCity && !matchesStandards && !matchesCategories) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all") {
        if (!lab.categories.includes(selectedCategory)) {
          return false;
        }
      }

      // Tier filter
      if (selectedTier !== "all") {
        if (lab.tier !== selectedTier) {
          return false;
        }
      }

      // City filter
      if (selectedCity !== "All Cities") {
        if (!lab.city.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedTier, selectedCity]);

  // Dynamic Leaflet Map Initialization
  useEffect(() => {
    if (typeof window === "undefined") return;

    let L;
    let isCancelled = false;

    import("leaflet").then((leafletModule) => {
      if (isCancelled) return;
      L = leafletModule.default || leafletModule;

      if (!mapContainerRef.current) return;

      // Clean up previous map instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map centered at sovereign India [22.8, 79.5]
      const map = L.map(mapContainerRef.current, {
        center: [22.8, 79.5],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true
      });

      const isDark = theme === "dark";
      const config = getMapTileConfig(mapProvider, isDark);

      tileLayerRef.current = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: config.maxZoom,
        crossOrigin: true
      }).addTo(map);

      mapInstanceRef.current = map;

      // Load official Survey of India boundary GeoJSON
      fetch("/india-boundary.json")
        .then((res) => res.json())
        .then((geoData) => {
          if (isCancelled || !mapInstanceRef.current) return;
          const isDarkMode = theme === "dark" || mapProvider === "dark_canvas";
          boundaryLayerRef.current = L.geoJSON(geoData, {
            style: {
              color: isDarkMode ? "#38bdf8" : "#0055A4",
              weight: 2.2,
              opacity: 0.9,
              fillColor: isDarkMode ? "#0284c7" : "#0055A4",
              fillOpacity: 0.03
            }
          }).addTo(mapInstanceRef.current);
        })
        .catch(() => {});

      // Render lab markers
      renderMarkers(L, map);
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Dynamically update tile layer when mapProvider or dark mode is toggled
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return;
    import("leaflet").then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      const map = mapInstanceRef.current;
      if (!map) return;

      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
        tileLayerRef.current = null;
      }

      const isDark = theme === "dark";
      const config = getMapTileConfig(mapProvider, isDark);

      tileLayerRef.current = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: config.maxZoom,
        crossOrigin: true
      }).addTo(map);

      // Update boundary styling if present
      if (boundaryLayerRef.current) {
        const isDarkMode = theme === "dark" || mapProvider === "dark_canvas";
        boundaryLayerRef.current.setStyle({
          color: isDarkMode ? "#38bdf8" : "#0055A4",
          weight: 2.2,
          opacity: 0.9,
          fillColor: isDarkMode ? "#0284c7" : "#0055A4",
          fillOpacity: 0.03
        });
      }
    });
  }, [mapProvider, theme]);

  // Update markers when filteredLabs changes
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return;
    import("leaflet").then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      renderMarkers(L, mapInstanceRef.current);
    });
  }, [filteredLabs, selectedLab]);

  // Function to render custom SVG pin markers
  const renderMarkers = (L, map) => {
    // Clear old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    filteredLabs.forEach(lab => {
      const isSelected = selectedLab?.id === lab.id;

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: "custom-lab-marker",
        html: `
          <div style="
            position: relative;
            cursor: pointer;
            transform: translate(-50%, -100%);
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          " class="${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-10'}">
            <div style="
              background: ${lab.pinColor};
              color: #ffffff;
              width: ${isSelected ? '38px' : '32px'};
              height: ${isSelected ? '38px' : '32px'};
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              border: 2px solid #ffffff;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
                <rect width="16" height="20" x="4" y="2" rx="2"/>
                <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>
              </svg>
            </div>
            ${isSelected ? `
              <div style="
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: 8px;
                height: 8px;
                background: ${lab.pinColor};
                border-radius: 50%;
                opacity: 0.7;
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([lab.lat, lab.lng], { icon: customIcon }).addTo(map);

      // Popup content
      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 240px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="background: ${lab.pinColor}; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px; text-transform: uppercase;">
              ${lab.tier}
            </span>
            <span style="font-size: 11px; color: #64748b; font-weight: 600;">${lab.code}</span>
          </div>
          <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">
            ${lab.name}
          </h4>
          <p style="font-size: 12px; color: #475569; margin: 0 0 6px 0;">${lab.city}, ${lab.state}</p>
          <div style="font-size: 11px; background: #f8fafc; padding: 6px 8px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 8px;">
            <strong>Turnaround:</strong> ${lab.turnaround}<br/>
            <strong>Testing Scope:</strong> ${lab.categories.slice(0, 3).join(", ")}
          </div>
          <div style="display: flex; gap: 6px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lab.lat},${lab.lng}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #0055a4; color: #fff; text-decoration: none; font-size: 11px; font-weight: 600; padding: 6px 8px; border-radius: 6px; display: inline-block;">
              Directions
            </a>
            <button id="inquire-btn-${lab.id}" style="flex: 1; background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 600; padding: 6px 8px; border-radius: 6px; cursor: pointer;">
              Inquire
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        setSelectedLab(lab);
        // Scroll the lab card into view in the list pane
        const el = document.getElementById(`lab-card-${lab.id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });

      marker.on("popupopen", () => {
        setTimeout(() => {
          const btn = document.getElementById(`inquire-btn-${lab.id}`);
          if (btn) {
            btn.onclick = () => {
              openInquiryModal(lab);
            };
          }
        }, 50);
      });

      markersRef.current[lab.id] = marker;
    });

    // If a lab is selected, open its popup
    if (selectedLab && markersRef.current[selectedLab.id]) {
      markersRef.current[selectedLab.id].openPopup();
    }
  };

  // Handle lab card click in list -> Pan map to lab
  const handleSelectLab = (lab) => {
    setSelectedLab(lab);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lab.lat, lab.lng], 13, {
        duration: 1.2,
        easeLinearity: 0.25
      });
      if (markersRef.current[lab.id]) {
        markersRef.current[lab.id].openPopup();
      }
    }
  };

  // Locate User's Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocatingUser(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 11, { duration: 1.5 });

          import("leaflet").then((leafletModule) => {
            const L = leafletModule.default || leafletModule;
            const userIcon = L.divIcon({
              className: "user-loc-marker",
              html: `
                <div style="
                  width: 20px;
                  height: 20px;
                  background: #0284c7;
                  border: 3px solid #ffffff;
                  border-radius: 50%;
                  box-shadow: 0 0 0 6px rgba(2, 132, 199, 0.35);
                "></div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            L.marker([latitude, longitude], { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup("<strong>Your Current Location</strong>")
              .openPopup();
          });
        }
      },
      (err) => {
        setLocatingUser(false);
        alert("Could not retrieve your location. Please check browser permissions.");
      }
    );
  };

  // Open Sample Test Inquiry Modal
  const openInquiryModal = (lab) => {
    setInquiryLab(lab);
    setInquirySubmitted(false);
    setInquiryForm({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      productName: lab.categories[0] || "Packaged Drinking Water",
      standardCode: lab.standards[0] || "IS 14543",
      sampleQty: "3 Samples",
      notes: `Requesting batch sample testing and test report issuance as per ${lab.standards[0] || 'applicable IS standard'} for BIS Certification.`
    });
    setInquiryModalOpen(true);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    const ref = `ILMS-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setInquiryRefNumber(ref);
    setInquirySubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* ─── HEADER / NAVIGATION BAR ─── */}
      <header className="bg-white dark:bg-[#0d131f] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Assistant</span>
            </Link>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <img src="/bis-logo.png" alt="BIS" className="w-8 h-8 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 shadow-xs" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">P.R.A.M.A.A.N Lab Locator</h1>
                  <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ILMS Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                  BIS Central, Regional & NABL Recognized Laboratory Directory & Geo-Routing
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLocateMe}
              disabled={locatingUser}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shadow-xs cursor-pointer"
              title="Find labs closest to your GPS coordinates"
            >
              <svg className={`w-3.5 h-3.5 text-blue-600 dark:text-sky-400 ${locatingUser ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{locatingUser ? "Locating..." : "Near Me"}</span>
            </button>

            {/* Mobile View Toggle */}
            <div className="flex sm:hidden border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1 text-xs font-medium ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-2.5 py-1 text-xs font-medium ${viewMode === "map" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
              >
                Map
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span><strong>{filteredLabs.length}</strong> Labs Active</span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle showLabel={false} />
          </div>
        </div>
      </header>

      {/* ─── SEARCH & FILTER BAR ─── */}
      <section className="bg-white dark:bg-[#0d131f] border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Lab Name, City, IS Standard (e.g. IS 14543, IS 13252), or Product..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Clear search"
                >
                  {Icons.close}
                </button>
              )}
            </div>

            {/* City Dropdown */}
            <div className="w-full md:w-48">
              <CustomSelect
                value={selectedCity}
                onChange={setSelectedCity}
                options={CITIES.map((c) => ({ value: c, label: c }))}
                placeholder="All Cities"
                size="md"
                ariaLabel="Filter by City / Region"
              />
            </div>

            {/* Tier Dropdown */}
            <div className="w-full md:w-60">
              <CustomSelect
                value={selectedTier}
                onChange={setSelectedTier}
                options={TIERS.map((t) => ({ value: t.id, label: t.name, subtitle: t.description }))}
                placeholder="All Laboratory Tiers"
                size="md"
                ariaLabel="Filter by Laboratory Classification"
              />
            </div>
          </div>

          {/* Product Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] pr-1 shrink-0">Scope:</span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-blue-700 dark:bg-sky-600 text-white shadow-xs font-semibold"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="shrink-0">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT: SPLIT VIEW (LAB CARDS ON LEFT, LEAFLET MAP ON RIGHT) ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-150">
          
          {/* LEFT COLUMN: LAB DIRECTORY CARDS (5 Cols on Large screens) */}
          <div className={`lg:col-span-5 flex flex-col ${viewMode === "map" ? "hidden lg:flex" : "flex"}`}>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Recognized Test Facilities ({filteredLabs.length})
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-blue-700 dark:text-sky-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-500"></span> BIS Owned
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500"></span> Govt NABL
                </span>
                <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-500"></span> Recognized Pvt
                </span>
              </div>
            </div>

            {/* Scrollable Lab Cards Container */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[calc(100vh-250px)]">
              {filteredLabs.length === 0 ? (
                <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center my-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto mb-3">
                    {Icons.search}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">No laboratories match your filter criteria</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Try clearing your search keyword, resetting category filters, or selecting "All Cities".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedTier("all");
                      setSelectedCity("All Cities");
                    }}
                    className="mt-4 px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredLabs.map((lab) => {
                  const isSelected = selectedLab?.id === lab.id;
                  return (
                    <div
                      key={lab.id}
                      id={`lab-card-${lab.id}`}
                      onClick={() => handleSelectLab(lab)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer bg-white dark:bg-[#111827] relative ${
                        isSelected
                          ? "border-blue-600 dark:border-sky-500 shadow-md ring-2 ring-blue-100 dark:ring-sky-950 bg-blue-50/20 dark:bg-sky-950/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs"
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${lab.tierColor}`}>
                          {lab.tierBadge}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {lab.code}
                        </span>
                      </div>

                      {/* Lab Name & Location */}
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-sky-400">
                        {lab.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-1">
                        {Icons.mapPin}
                        <span>{lab.address}</span>
                      </p>

                      {/* Meta Information Bar */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-semibold uppercase">Turnaround Time</span>
                          <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                            {Icons.zap} {lab.turnaround}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-semibold uppercase">Accreditation</span>
                          <span className="text-slate-700 dark:text-slate-300 font-medium truncate flex items-center gap-1" title={lab.accreditation}>
                            {Icons.shield} {lab.accreditation.split("(")[0]}
                          </span>
                        </div>
                      </div>

                      {/* Standards Tags */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {lab.standards.map((std) => (
                          <span key={std} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                            {std}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${lab.lat},${lab.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                        >
                          <svg className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>Directions</span>
                        </a>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInquiryModal(lab);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-sky-600 dark:hover:bg-sky-700 text-white transition shadow-xs cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Book Test / Inquire</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE GOOGLE-MAPS STYLE LEAFLET MAP (7 Cols on Large screens) */}
          <div className={`lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-sm relative ${viewMode === "list" ? "hidden lg:flex" : "flex"}`}>
            
            {/* Map Container */}
            <div ref={mapContainerRef} className="w-full flex-1 min-h-137.5 z-0" />

            {/* Map Overlay Floating Controls */}
            <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
              {/* Survey of India (SOI) Compliance Indicator */}
              <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-[11px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="hidden sm:inline">Survey of India (SOI) Compliant Sovereign Map</span>
                <span className="sm:hidden">SOI India Map</span>
              </div>

              {/* Map Layer Switcher */}
              <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMapProvider("google_standard")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    mapProvider === "google_standard"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="Google Maps India Edition (Full Sovereign Territory)"
                >
                  Google Map
                </button>
                <button
                  type="button"
                  onClick={() => setMapProvider("google_satellite")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    mapProvider === "google_satellite"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="Google Satellite Hybrid Imagery"
                >
                  Satellite
                </button>
                <button
                  type="button"
                  onClick={() => setMapProvider("google_terrain")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer hidden md:inline-block ${
                    mapProvider === "google_terrain"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="Google Physical Topography"
                >
                  Terrain
                </button>
                <button
                  type="button"
                  onClick={() => setMapProvider("dark_canvas")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    mapProvider === "dark_canvas"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="High-Contrast Dark Basemap"
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Selected Lab Floating Bottom Drawer on Map */}
            {selectedLab && (
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-lg z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${selectedLab.tierColor}`}>
                      {selectedLab.tier}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{selectedLab.code}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{selectedLab.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate flex items-center gap-1">
                    {Icons.mapPin}
                    <span>{selectedLab.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLab.lat},${selectedLab.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition text-center flex items-center justify-center gap-1.5"
                  >
                    {Icons.compass}
                    <span>Turn-by-Turn GPS</span>
                  </a>
                  <button
                    onClick={() => openInquiryModal(selectedLab)}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-sky-600 dark:hover:bg-sky-700 text-white transition text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {Icons.clipboard}
                    <span>Book Sample Test</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─── SAMPLE TEST BOOKING / INQUIRY MODAL ─── */}
      {inquiryModalOpen && inquiryLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            {inquirySubmitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-4">
                  {Icons.check}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sample Test Requisition Initiated!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Your testing inquiry has been routed to <strong>{inquiryLab.name}</strong> under BIS ILMS testing guidelines.
                </p>

                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Requisition Reference:</span>
                    <span className="font-mono font-bold text-blue-700 dark:text-sky-400">{inquiryRefNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Testing Facility:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{inquiryLab.shortName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Standard Code:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{inquiryForm.standardCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Sample Dispatch Instructions:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{inquiryForm.sampleQty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Estimated TAT:</span>
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">{inquiryLab.turnaround}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="flex-1 px-4 py-2 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {Icons.printer}
                    <span>Print Dispatch Challan</span>
                  </button>
                  <button
                    onClick={() => setInquiryModalOpen(false)}
                    className="flex-1 px-4 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 dark:bg-sky-600 dark:hover:bg-sky-700 text-white rounded-xl cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">BIS ILMS Sample Testing Inquiry</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Destination: {inquiryLab.name} ({inquiryLab.code})</p>
                  </div>
                  <button
                    onClick={() => setInquiryModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                    title="Close"
                  >
                    {Icons.close}
                  </button>
                </div>

                <form onSubmit={handleInquirySubmit} className="mt-4 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Applicant Name *</label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.companyName}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, companyName: e.target.value })}
                        placeholder="e.g. Apex Industrial Solutions Ltd"
                        className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Person & Designation *</label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.contactPerson}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, contactPerson: e.target.value })}
                        placeholder="e.g. Rahul Sharma (QA Head)"
                        className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Email *</label>
                      <input
                        type="email"
                        required
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        placeholder="e.g. rahul@company.com"
                        className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone / Mobile No. *</label>
                      <input
                        type="tel"
                        required
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Description *</label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.productName}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, productName: e.target.value })}
                        placeholder="e.g. 20L Packaged Water Jar"
                        className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target IS Standard *</label>
                      <CustomSelect
                        value={inquiryForm.standardCode}
                        onChange={(val) => setInquiryForm({ ...inquiryForm, standardCode: val })}
                        options={[
                          ...(inquiryLab?.standards || []).map((s) => ({ value: s, label: s })),
                          { value: "Other", label: "Other Standard (Specify in notes)" },
                        ]}
                        placeholder="Select IS Standard"
                        size="md"
                        ariaLabel="Target IS Standard"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Testing Batch Notes / Sample Details</label>
                    <textarea
                      rows={2}
                      value={inquiryForm.notes}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                      placeholder="Mention any specific testing parameters, witness testing requirements, or deadline..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400">{Icons.info}</span>
                    <span><strong>ILMS Sample Note:</strong> Testing fee challan and sample dispatch token will be issued upon laboratory acceptance. Please ensure production samples are factory sealed and labeled with Batch ID.</span>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setInquiryModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 dark:bg-sky-600 dark:hover:bg-sky-700 text-white rounded-xl transition shadow-xs cursor-pointer"
                    >
                      Submit Requisition Inquiry →
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

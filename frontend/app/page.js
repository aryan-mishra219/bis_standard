"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ─── Icons (SVG) ─── */
const Icons = {
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  send: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/></svg>,
  attach: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  close: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  chevDown: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  calculator: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8M8 10h8M8 14h4M8 18h4"/></svg>,
  shield: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>,
  flask: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6M10 9V3M14 9V3M5.2 20h13.6a1 1 0 0 0 .86-1.5L14 9H10L4.34 18.5A1 1 0 0 0 5.2 20z"/></svg>,
  file: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  building: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>,
  alert: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>,
  retry: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
  thumbUp: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>,
  thumbDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2M9 18.12l1-4.12H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg>,
  download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
  globe: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  bookmark: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>,
  clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  tag: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>,
  cog: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  mapPin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  doc: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m3 15 2 2 4-4"/></svg>,
};

/* ─── Animation Config ─── */
const msgAnim = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 35 } },
};

const panelSpring = { type: "spring", stiffness: 400, damping: 34 };

/* ─── Skeleton ─── */
function SkeletonLine({ w = "100%", h = "12px", cls = "" }) {
  return <div className={`skeleton rounded ${cls}`} style={{ width: w, height: h }} />;
}

function ChatSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start w-full">
      <div className="w-8 h-8 rounded-lg skeleton shrink-0 mt-1" />
      <div className="flex-1 min-w-0 p-5 rounded-2xl rounded-tl-sm bg-white border border-gray-100 shadow-xs space-y-3">
        <SkeletonLine w="35%" h="14px" />
        <SkeletonLine w="92%" h="10px" />
        <SkeletonLine w="78%" h="10px" />
        <SkeletonLine w="55%" h="10px" />
        <div className="flex gap-2 pt-1">
          <SkeletonLine w="70px" h="22px" cls="!rounded-full" />
          <SkeletonLine w="90px" h="22px" cls="!rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Data ─── */
const strategyPortals = [
  { icon: Icons.calculator, label: "Fee Estimator (MSME)", id: "fee" },
  { icon: Icons.search, label: "Standard Search (IS Directory)", id: "search" },
  { icon: Icons.shield, label: "Hallmark Verifier (HUID)", id: "hallmark" },
  { icon: Icons.building, label: "Lab Locator (ILMS)", id: "lab" },
];



/* ─── Product Sectors & BIS Standards Dataset ─── */
const productSectors = [
  {
    id: "water",
    name: "Packaged Drinking Water",
    standard: "IS 14543:2024 / IS 10500",
    scheme: "Scheme-I (ISI Mark)",
    baseMarkingFee: 45000,
    unitRate: 0.02,
    minVolume: 50000,
    maxVolume: 1500000,
    stepVolume: 50000,
    defaultVolume: 250000,
    unitName: "Bottles / Year",
    labFee: 18000,
    inspectionDays: 2,
    inHouseCapex: "₹1.5L - ₹3.5L",
    keyEquipment: [
      { name: "Laminar Air Flow Cabinet (Class 100)", cost: "₹45,000" },
      { name: "Autoclave & Bacteriological Incubator", cost: "₹35,000" },
      { name: "Digital TDS & pH Meter (0.01 accuracy)", cost: "₹12,000" },
      { name: "Turbidity Meter & Spectrophotometer", cost: "₹55,000" },
    ],
    checklist: [
      "FSSAI Manufacturing License (Mandatory testing compliance)",
      "Groundwater Extraction NOC from CGWA / State Authority",
      "Factory Premises Lease / Title Deed & Layout Plan",
      "Qualified Microbiologist / Chemist Appointment Letter",
      "In-House Test Equipment Calibration Records"
    ]
  },
  {
    id: "led",
    name: "LED Lighting & Self-Ballasted Lamps",
    standard: "IS 16102 (Part 1 & 2)",
    scheme: "Scheme-II (CRS Registration)",
    baseMarkingFee: 55000,
    unitRate: 0.15,
    minVolume: 20000,
    maxVolume: 1000000,
    stepVolume: 20000,
    defaultVolume: 100000,
    unitName: "Pieces / Year",
    labFee: 32000,
    inspectionDays: 1,
    inHouseCapex: "₹2.0L - ₹5.0L",
    keyEquipment: [
      { name: "Integrating Sphere & Spectroradiometer", cost: "₹1,20,000" },
      { name: "Electrical Safety & Surge Immunity Tester", cost: "₹65,000" },
      { name: "High Voltage (Hipot) & Insulation Tester", cost: "₹35,000" },
      { name: "Digital Power & Harmonics Analyzer", cost: "₹45,000" },
    ],
    checklist: [
      "DPIIT / Udyam MSME Registration Certificate",
      "Factory Machinery & SMT / Assembly Line Inventory",
      "Authorized Indian Representative (AIR) for Foreign Makers",
      "NABL Accredited Safety & EMC Test Report",
      "PCB Layout & Bill of Materials (BOM) Declaration"
    ]
  },
  {
    id: "steel",
    name: "Steel TMT Rebars for Construction",
    standard: "IS 1786:2008 (Fe 500D)",
    scheme: "Scheme-I (Mandatory ISI Mark)",
    baseMarkingFee: 85000,
    unitRate: 12.0,
    minVolume: 500,
    maxVolume: 25000,
    stepVolume: 500,
    defaultVolume: 2500,
    unitName: "Metric Tonnes / Year",
    labFee: 45000,
    inspectionDays: 2,
    inHouseCapex: "₹5.0L - ₹12.0L",
    keyEquipment: [
      { name: "Universal Tensile Machine (UTM - 1000 kN)", cost: "₹4,50,000" },
      { name: "Optical Emission Spectrometer (OES for Chemistry)", cost: "₹3,80,000" },
      { name: "Cold Bend & Re-Bend Testing Fixture", cost: "₹65,000" },
      { name: "Digital Extensometer & Proof Stress Gauge", cost: "₹45,000" },
    ],
    checklist: [
      "Induction Furnace / Re-rolling Mill Pollution Clearance (CTO)",
      "Plant Machinery Capacity & Quality Plan (STI)",
      "Metallurgical Lab In-Charge Credentials",
      "Raw Material (Billet/Ingot) Test Certificates",
      "Calibration of Load Cell & Temperature Sensors"
    ]
  },
  {
    id: "toys",
    name: "Electric & Non-Electric Toys",
    standard: "IS 9873 (Parts 1-9) & IS 15644",
    scheme: "Scheme-I (Toys QCO 2020)",
    baseMarkingFee: 38000,
    unitRate: 0.25,
    minVolume: 10000,
    maxVolume: 500000,
    stepVolume: 10000,
    defaultVolume: 50000,
    unitName: "Toys / Year",
    labFee: 24000,
    inspectionDays: 1,
    inHouseCapex: "₹1.2L - ₹2.8L",
    keyEquipment: [
      { name: "Drop & Impact Test Rig (Sharp Edge/Point Tester)", cost: "₹38,000" },
      { name: "Torque & Tension Gauge (Choking hazard tester)", cost: "₹28,000" },
      { name: "Small Parts Gauge Cylinder", cost: "₹8,000" },
      { name: "Flammability Test Chamber", cost: "₹45,000" },
    ],
    checklist: [
      "Udyam MSME Certificate (Eligible for 80% rebate)",
      "Toy Safety Assessment & Chemical Phthalate Test Reports",
      "Factory Fire Safety Certificate & Premises Lease",
      "Quality Control Plan (QCP) as per BIS Scheme-I",
      "Traceability & Age-Grading Warning Label Designs"
    ]
  },
  {
    id: "hallmark",
    name: "Gold & Silver Jewellery",
    standard: "IS 1417 (Gold) / IS 2112 (Silver)",
    scheme: "Assaying & Hallmarking Scheme",
    baseMarkingFee: 15000,
    unitRate: 45.0,
    minVolume: 250,
    maxVolume: 15000,
    stepVolume: 250,
    defaultVolume: 1000,
    unitName: "Articles / Year",
    labFee: 5000,
    inspectionDays: 1,
    inHouseCapex: "₹80k - ₹1.5L",
    keyEquipment: [
      { name: "X-Ray Fluorescence (XRF) Gold Analyzer", cost: "₹75,000" },
      { name: "Electronic Micro-Balance (0.01 mg precision)", cost: "₹25,000" },
      { name: "10x Aplanatic Triplet Loupe & Optical Scope", cost: "₹6,000" },
    ],
    checklist: [
      "GST Registration Certificate of Jeweller Outlet / Workshop",
      "Proof of Registered Business Premises & Trade License",
      "Signatory Authority / Owner KYC & Aadhaar / PAN",
      "HUID Integration Registration on Manakonline Portal",
      "Turnover Self-Declaration for Slabs"
    ]
  },
  {
    id: "ev",
    name: "EV Battery Packs & Storage Cells",
    standard: "IS 16046 (Part 2) / IS 17855",
    scheme: "Scheme-II (CRS Registration)",
    baseMarkingFee: 65000,
    unitRate: 20.0,
    minVolume: 500,
    maxVolume: 25000,
    stepVolume: 500,
    defaultVolume: 3000,
    unitName: "Battery Packs / Year",
    labFee: 60000,
    inspectionDays: 1,
    inHouseCapex: "₹4.0L - ₹9.0L",
    keyEquipment: [
      { name: "Multi-Channel Battery Pack Cycler & Load Bank", cost: "₹2,50,000" },
      { name: "Thermal Runaway & Temperature Chamber", cost: "₹1,80,000" },
      { name: "Short-Circuit & Overcharge Safety Tester", cost: "₹95,000" },
      { name: "Internal Resistance & BMS Diagnostic Rig", cost: "₹65,000" },
    ],
    checklist: [
      "Automotive Research Association / NABL Test Certificate",
      "BMS Firmware Safety & Cell Chemistry Datasheets",
      "Factory Flame-Proof Storage & Assembly Layout",
      "ISO 9001 Quality Management System Certificate",
      "Cell Traceability & QR Code Implementation Plan"
    ]
  }
];

const actionTabs = [
  { icon: Icons.flask, label: "Lab Test" },
  { icon: Icons.doc, label: "BIS Audit" },
  { icon: Icons.shield, label: "ISI Mark" },
  { icon: Icons.shield, label: "Hallmark" },
  { icon: Icons.file, label: "QCO" },
];

/* ─── Markdown Renderers ─── */
const mdComponents = {
  table: ({ node, ...props }) => (
    <div className="my-3.5 w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
      <table className="min-w-full w-full divide-y divide-gray-200 text-xs sm:text-[13px] text-gray-700 bg-white" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-slate-50 text-slate-800 font-bold tracking-wide" {...props} />,
  th: ({ node, ...props }) => <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-left font-bold border-b border-gray-200 text-slate-900 text-xs" {...props} />,
  td: ({ node, ...props }) => <td className="px-4 py-2 sm:px-5 sm:py-2.5 border-b border-gray-100 text-gray-700 text-xs sm:text-[13px]" {...props} />,
  tr: ({ node, ...props }) => <tr className="hover:bg-blue-50/30 transition-colors" {...props} />,
};

/* ════════════════════════════════════════════════════════════════════ */
export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [feedbackState, setFeedbackState] = useState({});
  const [language, setLanguage] = useState("English");
  const [simplify, setSimplify] = useState(false);
  const [showFeePanel, setShowFeePanel] = useState(false);
  const [enterpriseType, setEnterpriseType] = useState("Large");
  const [imagePreview, setImagePreview] = useState(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => { if (e.matches) setMobileSidebar(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ─── Image ─── */
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        const MAX = 1024;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
        else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        setImagePreview(canvas.toDataURL("image/jpeg", 0.8));
      };
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  /* ─── API ─── */
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleSend = async (overrideQuery = null) => {
    const query = overrideQuery || input;
    if (!query.trim() && !imagePreview) return;
    setLastQuery(query);
    const currentImage = imagePreview;
    setMessages((prev) => [...prev, { role: "user", content: query || "Analyzed attached image for BIS Standards.", image: currentImage }]);
    setInput(""); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query || "What BIS standard or information is in this image?", language, simplify, image_base64: currentImage }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer, sources: data.sources, actions_taken: data.actions_taken || [], process_timeline: data.process_timeline || null, compliance_report: data.compliance_report || null, is_error: false }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.detail || "Server Error: Could not fetch response.", is_error: true, failed_query: query, sources: [], actions_taken: [], process_timeline: null, compliance_report: null }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error: Unable to reach P.R.A.M.A.A.N backend.", is_error: true, failed_query: query, sources: [], actions_taken: [], process_timeline: null, compliance_report: null }]);
    } finally { setIsLoading(false); }
  };

  const handleFeedback = (idx, type) => setFeedbackState((prev) => ({ ...prev, [idx]: type }));

  /* ─── State for Enhanced Fee Estimator ─── */
  const [calculatorTab, setCalculatorTab] = useState("fee"); // 'fee' | 'capex' | 'checklist'
  const [selectedSectorId, setSelectedSectorId] = useState("water");
  const [applicationTrack, setApplicationTrack] = useState("simplified"); // 'simplified' | 'normal'
  const [isSpecialCategory, setIsSpecialCategory] = useState(false); // Women/SC-ST/NER
  const [productionVolume, setProductionVolume] = useState(250000);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [checkedChecklist, setCheckedChecklist] = useState({});

  const currentSector = productSectors.find((s) => s.id === selectedSectorId) || productSectors[0];

  const handleSectorChange = (sectorId) => {
    setSelectedSectorId(sectorId);
    const sec = productSectors.find((s) => s.id === sectorId);
    if (sec) setProductionVolume(sec.defaultVolume);
  };

  /* ─── Dynamic Regulatory Fee Calculations ─── */
  const variableMarkingFee = Number(productionVolume) * currentSector.unitRate;
  const grossMarkingFee = Math.max(currentSector.baseMarkingFee, variableMarkingFee);
  
  let baseConcessionPct = 0;
  if (enterpriseType === "Small") baseConcessionPct = 50;
  else if (enterpriseType === "Micro/Startup") baseConcessionPct = 80;
  
  const effectiveConcessionPct = isSpecialCategory ? Math.min(90, baseConcessionPct + 10) : baseConcessionPct;
  const markingDiscountAmount = (grossMarkingFee * effectiveConcessionPct) / 100;
  const netMarkingFee = grossMarkingFee - markingDiscountAmount;

  const inspectionFee = (applicationTrack === "simplified" ? 1 : currentSector.inspectionDays) * 7000;
  const effectiveLabFee = enterpriseType === "Micro/Startup" ? currentSector.labFee * 0.5 : currentSector.labFee;
  const applicationFee = 1000;

  const subtotal = applicationFee + inspectionFee + effectiveLabFee + netMarkingFee;
  const gstAmount = Math.round(subtotal * 0.18);
  const totalPayable = subtotal + gstAmount;
  const totalSavings = markingDiscountAmount + (currentSector.labFee - effectiveLabFee);

  const downloadQuotationPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const payload = {
        product_name: currentSector.name,
        standard_code: currentSector.standard,
        scheme_type: currentSector.scheme,
        track: applicationTrack === "simplified" ? "Simplified Fast-Track (30 Days)" : "Normal Inspection Procedure (60-90 Days)",
        enterprise_scale: enterpriseType,
        special_category: isSpecialCategory ? "Women/SC-ST/NER (+10% Rebate)" : "Standard",
        annual_volume: Number(productionVolume),
        volume_unit: currentSector.unitName,
        application_fee: applicationFee,
        inspection_fee: inspectionFee,
        lab_testing_fee: Math.round(effectiveLabFee),
        base_marking_fee: Math.round(grossMarkingFee),
        discount_marking_amount: Math.round(markingDiscountAmount),
        net_marking_fee: Math.round(netMarkingFee),
        subtotal: Math.round(subtotal),
        gst_amount: Math.round(gstAmount),
        total_payable: Math.round(totalPayable),
        in_house_lab_capex: currentSector.inHouseCapex,
        estimated_timeline: applicationTrack === "simplified" ? "30 - 45 Days" : "60 - 90 Days"
      };

      const res = await fetch(`${API_BASE_URL}/api/generate-fee-quotation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("PDF generation endpoint returned non-200");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BIS_Statutory_Quotation_${currentSector.id.toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Download error:", err);
      alert("Could not generate PDF quotation. Please make sure the backend is running.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const starterPrompts = [
    { icon: Icons.flask, text: "Audit my product spec sheet for bottled drinking water plant" },
    { icon: Icons.shield, text: "What are the steps to apply for a BIS hallmark license?" },
    { icon: Icons.building, text: "Find me a water testing lab in Delhi" },
    { icon: Icons.file, text: "Generate a compliance gap report for ISI mark on steel" },
  ];

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f1f5f9]">

      {/* ═══ Mobile Sidebar Overlay ═══ */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileSidebar(false)}
            className="fixed inset-0 z-40 bg-black/50 sidebar-overlay lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ═══ SIDEBAR — always visible on lg+, slide on mobile ═══ */}
      <aside className={`
        fixed lg:relative z-50 lg:z-auto top-0 left-0 bottom-0
        w-65 shrink-0
        bg-[#0f172a] text-slate-400
        flex flex-col
        transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${mobileSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Brand */}
        <div className="px-4 pt-4 pb-3 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <img src="/bis-logo.png" alt="BIS" className="w-9 h-9 rounded-lg object-contain shrink-0 bg-white p-0.5" />
            <div className="min-w-0">
              <h1 className="text-[13px] font-bold text-white tracking-tight leading-none">P.R.A.M.A.A.N</h1>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Bureau of Indian Standards</p>
            </div>
          </div>
          <button
            onClick={() => { setMessages([]); setMobileSidebar(false); }}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1e3a5f] hover:bg-[#254b77] text-white text-[11px] font-semibold transition-colors duration-200 border border-white/6"
          >
            {Icons.plus}
            <span>New Consultation</span>
          </button>
        </div>

        {/* Strategy Portals */}
        <div className="px-3 pt-3 pb-1">
          <p className="px-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600 mb-1.5">Strategy Portals</p>
          {strategyPortals.map((p) => (
            <button
              key={p.id}
              onClick={() => { if (p.id === "fee") setShowFeePanel(!showFeePanel); else handleSend(`Open ${p.label}`); setMobileSidebar(false); }}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.75 rounded-md text-[11px] hover:bg-white/6 hover:text-slate-200 transition-colors text-left"
            >
              <span className="text-slate-500 shrink-0">{p.icon}</span>
              <span className="truncate">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </aside>

      {/* ═══ MAIN PANEL ═══ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">

        {/* ── Header ── */}
        <header className="shrink-0 bg-white border-b border-gray-200 px-3 sm:px-4 h-12 flex items-center gap-2.5">
          {/* Mobile hamburger */}
          <button onClick={() => setMobileSidebar(true)} className="lg:hidden p-1.5 -ml-1 rounded-md hover:bg-gray-100 transition-colors text-gray-500" aria-label="Menu">
            {Icons.menu}
          </button>
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2 min-w-0">
            <img src="/bis-logo.png" alt="BIS" className="w-7 h-7 rounded-md object-contain shrink-0 bg-white p-0.5" />
            <span className="text-sm font-semibold text-gray-900 truncate">P.R.A.M.A.A.N</span>
          </div>

          {/* Tabs */}
          <div className="hidden sm:flex items-center gap-1 flex-1 min-w-0 overflow-x-auto no-scrollbar">
            {actionTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => { setActiveTab(tab.label); handleSend(`Help me with ${tab.label}`); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border ${
                  activeTab === tab.label
                    ? "bg-[#0055A4] text-white border-[#0055A4]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                <span className="text-current opacity-70">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            <label className="hidden sm:inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md cursor-pointer border border-gray-200 hover:bg-gray-50 transition-colors select-none text-gray-600">
              <input type="checkbox" checked={simplify} onChange={(e) => setSimplify(e.target.checked)} className="accent-[#0055A4] w-3 h-3 cursor-pointer" />
              ELI5
            </label>
            <div className="inline-flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-md border border-gray-200 text-gray-600">
              <span className="text-gray-400 shrink-0">{Icons.globe}</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer text-[11px] pr-1">
                <option value="English">EN</option>
                <option value="Hindi">HI</option>
                <option value="Tamil">TA</option>
                <option value="Bengali">BN</option>
              </select>
            </div>
            <button
              onClick={() => setShowFeePanel(!showFeePanel)}
              className={`hidden md:inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md font-medium transition-colors duration-150 border whitespace-nowrap ${
                showFeePanel ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {Icons.tag} MSME Fee
            </button>

          </div>
        </header>

        {/* ── Content (Chat + Fee) ── */}
        <div className="flex-1 flex overflow-hidden">

          {/* Chat Area */}
          <main className="flex-1 overflow-y-auto min-w-0">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8 py-8">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 max-w-3xl lg:max-w-4xl w-full">
                  <div className="space-y-2.5">
                    <img src="/bis-logo.png" alt="BIS" className="w-16 h-16 rounded-2xl object-contain shadow-lg mb-1 bg-white p-1.5 mx-auto" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">How can I help you with Indian Standards today?</h2>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">Verify BIS certifications, audit product compliance, calculate MSME marking fees, or explore Indian standards.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {starterPrompts.map((p, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                        onClick={() => handleSend(p.text)}
                        className="flex items-start gap-3.5 p-4 bg-white border border-gray-200 rounded-xl hover:border-[#0055A4]/40 hover:shadow-md transition-all duration-150 text-left group cursor-pointer"
                      >
                        <span className="text-gray-400 mt-0.5 shrink-0 group-hover:text-[#0055A4] transition-colors">{p.icon}</span>
                        <span className="text-[13px] text-gray-700 leading-snug group-hover:text-gray-900 font-medium transition-colors">{p.text}</span>
                      </motion.button>
                    ))}
                  </div>
                  {/* Mobile tabs */}
                  <div className="flex sm:hidden overflow-x-auto gap-1.5 no-scrollbar">
                    {actionTabs.map((tab) => (
                      <button key={tab.label} onClick={() => handleSend(`Help me with ${tab.label}`)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors shrink-0">
                        <span className="opacity-60">{tab.icon}</span> {tab.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="w-full max-w-5xl lg:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => (
                    <motion.div key={idx} variants={msgAnim} initial="hidden" animate="visible" layout className={`flex ${msg.role === "user" ? "justify-end" : "gap-3 justify-start w-full"}`}>

                      {/* Assistant avatar */}
                      {msg.role === "assistant" && (
                        <img src="/bis-logo.png" alt="BIS" className="w-8 h-8 rounded-lg object-contain mt-1 shrink-0 bg-white p-0.5 border border-gray-200/80 shadow-xs" />
                      )}

                      <div className={`overflow-hidden ${
                        msg.role === "user"
                          ? "max-w-[85%] sm:max-w-[70%] bg-[#0055A4] text-white rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm"
                          : "flex-1 min-w-0 bg-white border border-gray-200/90 rounded-2xl rounded-tl-sm px-5 py-4 shadow-xs"
                      }`}>

                        {msg.image && (
                          <img src={msg.image} alt="Uploaded" className="max-h-36 sm:max-h-44 w-auto rounded-lg mb-2 border border-white/20 object-contain max-w-full" />
                        )}

                        {msg.role === "assistant" ? (
                          <div className="msg-prose text-[13px] text-gray-700 wrap-break-word">

                            {msg.is_error ? (
                              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-2">
                                <div className="flex items-center gap-2 font-semibold text-red-800">
                                  <span className="text-red-500">{Icons.alert}</span>
                                  {msg.content}
                                </div>
                                <p className="text-[11px] text-red-600/80">Connection interrupted. Click retry to resend.</p>
                                <button onClick={() => handleSend(msg.failed_query || lastQuery)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold text-xs transition-colors">
                                  {Icons.retry} Retry
                                </button>
                              </div>
                            ) : (
                              <>
                                {/* Action pills */}
                                {msg.actions_taken?.length > 0 && (
                                  <div className="mb-2.5 flex flex-wrap gap-1.5">
                                    {msg.actions_taken.map((action, i) => (
                                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[10px] font-medium">
                                        <span className="text-slate-400">{Icons.cog}</span>
                                        <span className="truncate max-w-50">{action}</span>
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Markdown */}
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                  {msg.content ? msg.content.replace(/<think>[\s\S]*?<\/think>/g, "").trim() : ""}
                                </ReactMarkdown>

                                {/* Process Timeline */}
                                {msg.process_timeline?.length > 0 && (
                                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <div className="flex items-center gap-1.5 mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                      {Icons.mapPin}
                                      <span>Process Navigator — {msg.process_timeline.length} Steps</span>
                                    </div>
                                    <div className="relative pl-7 border-l-2 border-slate-300 space-y-3">
                                      {msg.process_timeline.map((step, i) => (
                                        <div key={i} className="relative">
                                          <div className="absolute -left-5.75 top-0 w-6 h-6 rounded-full bg-[#0055A4] text-white text-[10px] font-bold flex items-center justify-center ring-[3px] ring-slate-50">{step.step_number || i + 1}</div>
                                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                                            <h4 className="text-xs font-semibold text-gray-900">{step.title}</h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5">{step.description}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Compliance Report */}
                                {msg.compliance_report && (
                                  <div className="mt-4 p-4 bg-[#0f172a] text-white rounded-xl border border-slate-700/50">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/50">
                                      <div className="flex items-center gap-2">
                                        <span className="text-blue-300">{Icons.shield}</span>
                                        <div>
                                          <h3 className="text-[11px] font-semibold tracking-wide uppercase text-blue-200">Compliance Readiness Report</h3>
                                          <p className="text-[10px] text-slate-400">ID: <span className="font-mono font-semibold text-white">{msg.compliance_report.report_id}</span> | {msg.compliance_report.product_name}</p>
                                        </div>
                                      </div>
                                      <span className="px-2 py-0.5 bg-amber-400 text-slate-900 font-bold text-[9px] rounded-full uppercase tracking-wider">{msg.compliance_report.risk_level}</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 text-xs">
                                      <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                                        <div className="font-semibold text-slate-400 uppercase text-[9px] mb-1">Applicable Standard</div>
                                        <div className="font-semibold text-white text-xs">{msg.compliance_report.primary_standard}</div>
                                        <div className="text-slate-300 text-[11px]">{msg.compliance_report.standard_name}</div>
                                        <div className="text-emerald-400 font-medium mt-1 text-[11px] flex items-center gap-1">{Icons.bookmark} {msg.compliance_report.scheme_type}</div>
                                      </div>
                                      <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                                        <div className="font-semibold text-slate-400 uppercase text-[9px] mb-1">Timeline & MSME Estimate</div>
                                        <div className="font-semibold text-amber-300 text-xs flex items-center gap-1">{Icons.clock} {msg.compliance_report.estimated_timeline}</div>
                                        <div className="text-emerald-400 font-bold text-sm mt-0.5">{msg.compliance_report.cost_breakdown?.total_estimated || "₹43,000"}</div>
                                        <div className="text-[9px] text-slate-400 mt-0.5">Includes concession for {msg.compliance_report.enterprise_scale}</div>
                                      </div>
                                    </div>

                                    {msg.compliance_report.compliance_gaps?.length > 0 && (
                                      <div className="mb-3">
                                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Compliance Gaps</div>
                                        <div className="space-y-1">
                                          {msg.compliance_report.compliance_gaps.map((gap, i) => (
                                            <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-200 bg-white/4 p-2 rounded border border-white/4">
                                              <span className="text-amber-400 shrink-0 mt-px">{Icons.alert}</span>
                                              <span>{gap}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    <div className="pt-2 flex justify-end">
                                      <a href={`${API_BASE_URL}/api/download-report/${msg.compliance_report.report_id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors">
                                        {Icons.download} Download PDF ({msg.compliance_report.report_id}.pdf)
                                      </a>
                                    </div>
                                  </div>
                                )}

                                {/* Sources */}
                                {msg.sources?.length > 0 && (
                                  <div className="mt-3 pt-2.5 border-t border-gray-100">
                                    <p className="text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Sources Referenced</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {msg.sources.map((src, i) => (
                                        <div key={i} className="group relative text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded cursor-default hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1">
                                          <span className="text-slate-400">{Icons.doc}</span>
                                          {src.document} (Pg. {src.page})
                                          <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl z-10 whitespace-normal leading-relaxed">&ldquo;{src.content_snippet}...&rdquo;</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Feedback */}
                                <div className="mt-2.5 pt-2 flex items-center justify-between border-t border-gray-100">
                                  <span className="text-[10px] text-gray-400">Was this helpful?</span>
                                  <div className="flex items-center gap-0.5">
                                    <button onClick={() => handleFeedback(idx, "up")} className={`p-1.5 rounded-md transition-colors ${feedbackState[idx] === "up" ? "text-emerald-600 bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}>{Icons.thumbUp}</button>
                                    <button onClick={() => handleFeedback(idx, "down")} className={`p-1.5 rounded-md transition-colors ${feedbackState[idx] === "down" ? "text-red-600 bg-red-50" : "text-gray-400 hover:bg-gray-100"}`}>{Icons.thumbDown}</button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap text-[13px]">{msg.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && <ChatSkeleton />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </main>

          {/* ═══ Industry-Grade BIS Fee & Feasibility Estimator Panel ═══ */}
          <AnimatePresence>
            {showFeePanel && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 380, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={panelSpring}
                className="fixed inset-y-0 right-0 z-50 md:relative md:z-auto md:flex flex-col shrink-0 border-l border-gray-200 bg-white overflow-hidden shadow-xl md:shadow-none"
              >
                <div className="flex flex-col h-full w-[380px]">
                  
                  {/* Panel Header */}
                  <div className="p-3.5 border-b border-gray-200 bg-slate-50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-[#0055A4] text-white rounded-lg">{Icons.calculator}</span>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 leading-tight">BIS Feasibility & Cost Estimator</h3>
                        <p className="text-[10px] text-gray-500">Gazette Schedule & Subsidy Calculator</p>
                      </div>
                    </div>
                    <button onClick={() => setShowFeePanel(false)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-400 hover:text-gray-600">{Icons.close}</button>
                  </div>

                  {/* Panel Tabs */}
                  <div className="px-3 pt-2.5 pb-1 border-b border-gray-100 flex gap-1 bg-white shrink-0">
                    {[
                      { id: "fee", label: "Fee Schedule", icon: Icons.tag },
                      { id: "capex", label: "Lab Capex", icon: Icons.flask },
                      { id: "checklist", label: "Checklist", icon: Icons.check }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setCalculatorTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
                          calculatorTab === tab.id
                            ? "bg-[#0055A4] text-white shadow-xs"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span className="opacity-80">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Panel Body */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs text-gray-700">

                    {/* ═══ TAB 1: Statutory Fee Calculator ═══ */}
                    {calculatorTab === "fee" && (
                      <div className="space-y-3">

                        {/* Product Sector */}
                        <div>
                          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Product Sector & Standard</label>
                          <select
                            value={selectedSectorId}
                            onChange={(e) => handleSectorChange(e.target.value)}
                            className="w-full text-xs bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 focus:border-[#0055A4] cursor-pointer"
                          >
                            {productSectors.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.standard})
                              </option>
                            ))}
                          </select>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 px-0.5">
                            <span className="font-semibold text-blue-700">{currentSector.standard}</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-medium">{currentSector.scheme}</span>
                          </div>
                        </div>

                        {/* Procedure Track & Enterprise Scale in Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Procedure Track</label>
                            <select
                              value={applicationTrack}
                              onChange={(e) => setApplicationTrack(e.target.value)}
                              className="w-full text-xs bg-gray-50 border border-gray-200 text-gray-800 rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 cursor-pointer"
                            >
                              <option value="simplified">Simplified (30 Days)</option>
                              <option value="normal">Normal (60-90 Days)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Enterprise Scale</label>
                            <select
                              value={enterpriseType}
                              onChange={(e) => setEnterpriseType(e.target.value)}
                              className="w-full text-xs bg-gray-50 border border-gray-200 text-gray-800 rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 cursor-pointer"
                            >
                              <option value="Micro/Startup">Micro / Startup (80% Off)</option>
                              <option value="Small">Small (50% Off)</option>
                              <option value="Large">Large Enterprise (0%)</option>
                            </select>
                          </div>
                        </div>

                        {/* Special Concession Toggle */}
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-200/80 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isSpecialCategory}
                            onChange={(e) => setIsSpecialCategory(e.target.checked)}
                            className="accent-[#0055A4] w-3.5 h-3.5 rounded cursor-pointer shrink-0"
                          />
                          <div className="text-[11px] text-amber-900 leading-tight">
                            <span className="font-bold">Women / SC-ST / NER Unit</span>
                            <span className="text-[10px] text-amber-700 block">+10% additional statutory rebate</span>
                          </div>
                        </label>

                        {/* Annual Production Volume Slider */}
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-semibold text-slate-700">Estimated Annual Volume</span>
                            <span className="font-bold text-[#0055A4]">{Number(productionVolume).toLocaleString("en-IN")} <span className="text-[10px] text-slate-500 font-normal">{currentSector.unitName}</span></span>
                          </div>
                          <input
                            type="range"
                            min={currentSector.minVolume}
                            max={currentSector.maxVolume}
                            step={currentSector.stepVolume}
                            value={productionVolume}
                            onChange={(e) => setProductionVolume(Number(e.target.value))}
                            className="w-full accent-[#0055A4] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                          />
                          <div className="flex justify-between text-[9px] text-slate-400">
                            <span>Min: {currentSector.minVolume.toLocaleString("en-IN")}</span>
                            <span>Rate: ₹{currentSector.unitRate} / unit</span>
                            <span>Max: {currentSector.maxVolume.toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        {/* Total Outflow Hero Card */}
                        <div className="bg-[#0f172a] text-white rounded-xl p-3.5 text-center space-y-1 shadow-sm">
                          <div className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">Estimated Total Statutory Outflow (incl. 18% GST)</div>
                          <div className="text-2xl font-black tracking-tight text-white">₹{totalPayable.toLocaleString("en-IN")}</div>
                          {totalSavings > 0 && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                              <span>Total Subsidies Saved: ₹{totalSavings.toLocaleString("en-IN")} ({effectiveConcessionPct}% Off)</span>
                            </div>
                          )}
                        </div>

                        {/* Detailed Itemized Breakdown */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                          <div className="px-3 py-1.5 bg-slate-100 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-slate-600 flex justify-between">
                            <span>Cost Head (Statutory)</span>
                            <span>Amount</span>
                          </div>
                          <div className="p-2.5 space-y-1.5 text-[11px]">
                            <div className="flex justify-between text-gray-600">
                              <span>1. Application Filing Fee:</span>
                              <span className="font-semibold text-gray-900">₹{applicationFee.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>2. Factory Audit Fee ({applicationTrack === "simplified" ? "1 Day" : `${currentSector.inspectionDays} Days`}):</span>
                              <span className="font-semibold text-gray-900">₹{inspectionFee.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>3. NABL Sample Testing Fee:</span>
                              <span className="font-semibold text-gray-900">₹{Math.round(effectiveLabFee).toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>4. Annual Marking Fee (Gross):</span>
                              <span className="font-medium text-gray-700">₹{Math.round(grossMarkingFee).toLocaleString("en-IN")}</span>
                            </div>
                            {markingDiscountAmount > 0 && (
                              <div className="flex justify-between text-emerald-600 font-semibold pl-2">
                                <span>↳ MSME/Startup Concession (-{effectiveConcessionPct}%):</span>
                                <span>-₹{Math.round(markingDiscountAmount).toLocaleString("en-IN")}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-slate-800 font-medium pl-2">
                              <span>↳ Net Annual Marking Fee:</span>
                              <span className="font-semibold">₹{Math.round(netMarkingFee).toLocaleString("en-IN")}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-1.5 flex justify-between text-gray-600">
                              <span>Statutory Subtotal:</span>
                              <span className="font-semibold text-gray-800">₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 text-[10px]">
                              <span>Statutory GST (18.0%):</span>
                              <span>₹{gstAmount.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-900 text-xs">
                              <span>Net Total Payable to BIS:</span>
                              <span className="text-[#0055A4]">₹{totalPayable.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-1">
                          <button
                            onClick={downloadQuotationPdf}
                            disabled={isDownloadingPdf}
                            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                          >
                            {isDownloadingPdf ? (
                              <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Generating PDF Quotation...</span>
                              </div>
                            ) : (
                              <>
                                {Icons.download}
                                <span>Download Official Fee Quotation (PDF)</span>
                              </>
                            )}
                          </button>

                          <a
                            href="https://www.manakonline.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                          >
                            <span>Apply on Manakonline Portal</span>
                            <span className="text-slate-400">↗</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* ═══ TAB 2: In-House Lab Capex ═══ */}
                    {calculatorTab === "capex" && (
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="font-bold text-blue-900 text-xs flex items-center gap-1.5 mb-1">
                            <span>{Icons.flask}</span>
                            <span>Mandatory In-House Testing Setup</span>
                          </div>
                          <p className="text-[11px] text-blue-700 leading-relaxed">
                            Under BIS Scheme-I (STI - Scheme of Testing & Inspection), plants must maintain on-site laboratory facilities to obtain license approval.
                          </p>
                          <div className="mt-2 pt-2 border-t border-blue-200/60 flex justify-between items-center text-xs">
                            <span className="font-semibold text-blue-900">Estimated Capex Budget:</span>
                            <span className="font-extrabold text-[#0055A4]">{currentSector.inHouseCapex}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Required Quality Testing Apparatus for {currentSector.name}</h4>
                          <div className="space-y-1.5">
                            {currentSector.keyEquipment.map((eq, i) => (
                              <div key={i} className="p-2.5 bg-white border border-gray-200 rounded-lg flex items-center justify-between hover:border-gray-300 transition-colors">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                  <span className="text-[11px] font-medium text-gray-800 leading-tight">{eq.name}</span>
                                </div>
                                <span className="font-semibold text-slate-700 text-[11px] shrink-0 ml-2">{eq.cost}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 space-y-1">
                          <div className="font-semibold text-slate-700">Calibration Requirement:</div>
                          <p>All load cells, pressure gauges, incubators, and analytical balances must possess valid NABL Calibration Certificates during the BIS Officer audit.</p>
                        </div>
                      </div>
                    )}

                    {/* ═══ TAB 3: Document Checklist ═══ */}
                    {calculatorTab === "checklist" && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-1 border-b border-gray-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Statutory Documents Required</span>
                          <span className="text-[10px] font-bold text-[#0055A4]">
                            {Object.values(checkedChecklist).filter(Boolean).length} of {currentSector.checklist.length} Ready
                          </span>
                        </div>

                        <div className="space-y-2">
                          {currentSector.checklist.map((item, idx) => {
                            const isDone = !!checkedChecklist[`${selectedSectorId}_${idx}`];
                            return (
                              <label
                                key={idx}
                                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                                  isDone
                                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                                    : "bg-white border-gray-200 hover:bg-slate-50 text-gray-700"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={(e) => setCheckedChecklist((prev) => ({ ...prev, [`${selectedSectorId}_${idx}`]: e.target.checked }))}
                                  className="accent-emerald-600 w-4 h-4 rounded mt-0.5 shrink-0 cursor-pointer"
                                />
                                <span className={`text-[11px] leading-snug ${isDone ? "line-through opacity-80" : ""}`}>
                                  {item}
                                </span>
                              </label>
                            );
                          })}
                        </div>

                        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[10px] text-amber-900 space-y-1">
                          <span className="font-bold flex items-center gap-1">{Icons.alert} Verification Tip</span>
                          <p>Upload self-attested colored PDF scans on Manakonline. Applications with missing calibration records face a standard 15-day objection delay.</p>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <footer className="shrink-0 border-t border-gray-200 bg-white">
          <div className="w-full max-w-5xl lg:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 space-y-2">
            {messages.length > 0 && (
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {[{ icon: Icons.flask, label: "Quick Audit" }, { icon: Icons.file, label: "BIS Remediation Plan" }, { icon: Icons.doc, label: "Form V Report" }].map((a) => (
                  <button key={a.label} onClick={() => handleSend(a.label)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0">
                    <span className="opacity-60">{a.icon}</span> {a.label}
                  </button>
                ))}
              </div>
            )}

            {imagePreview && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="h-14 w-auto rounded-lg object-cover border border-gray-200 shadow-sm" />
                <button onClick={removeImage} className="absolute -top-1.5 -right-1.5 bg-gray-600 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center shadow hover:bg-gray-700 transition-colors">×</button>
              </motion.div>
            )}

            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageSelect} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40 shrink-0">{Icons.attach}</button>
              <input
                ref={inputRef} type="text" value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask anything about Indian Standards, upload a product label, or verify..."
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0055A4] focus:ring-1 focus:ring-[#0055A4]/20 transition-all"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || (!input.trim() && !imagePreview)}
                className="p-2.5 rounded-xl bg-[#0055A4] hover:bg-[#003d7a] text-white transition-colors disabled:opacity-40 shrink-0"
              >
                {isLoading ? (
                  <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-1.5 bg-white rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full typing-dot" />
                  </div>
                ) : Icons.send}
              </button>
            </div>

            <p className="text-center text-[9px] text-gray-400 leading-tight">
              P.R.A.M.A.A.N is an official AI agent under Bureau of Indian Standards, verified against gazetted <span className="font-medium">National Register</span> — <span className="font-semibold text-gray-500">1805 IS &middot; 11,400+</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

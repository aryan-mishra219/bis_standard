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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-lg skeleton shrink-0 mt-0.5" />
      <div className="flex-1 max-w-[78%] p-4 rounded-2xl rounded-tl-sm bg-white border border-gray-100 shadow-sm space-y-2.5">
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
    <div className="overflow-x-auto my-3 max-w-full border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm bg-white" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-slate-50 text-slate-700 font-semibold" {...props} />,
  th: ({ node, ...props }) => <th className="px-3 py-2 sm:px-4 sm:py-2.5 text-left font-semibold border-b border-gray-200 whitespace-nowrap text-xs" {...props} />,
  td: ({ node, ...props }) => <td className="px-3 py-1.5 sm:px-4 sm:py-2 border-b border-gray-50 text-gray-700 text-xs" {...props} />,
  tr: ({ node, ...props }) => <tr className="hover:bg-slate-50/50 transition-colors" {...props} />,
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
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error: Unable to reach M.A.N.A.K backend.", is_error: true, failed_query: query, sources: [], actions_taken: [], process_timeline: null, compliance_report: null }]);
    } finally { setIsLoading(false); }
  };

  const handleFeedback = (idx, type) => setFeedbackState((prev) => ({ ...prev, [idx]: type }));

  /* ─── Fee Calc ─── */
  const baseFee = 100000;
  let discountPercent = 0;
  if (enterpriseType === "Small") discountPercent = 50;
  else if (enterpriseType === "Micro/Startup") discountPercent = 80;
  const finalFee = baseFee * (1 - discountPercent / 100);
  const savings = baseFee - finalFee;

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
              <h1 className="text-[13px] font-bold text-white tracking-tight leading-none">M.A.N.A.K</h1>
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
            <span className="text-sm font-semibold text-gray-900 truncate">M.A.N.A.K</span>
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
              <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 max-w-xl w-full">
                  <div className="space-y-2.5">
                    <img src="/bis-logo.png" alt="BIS" className="w-14 h-14 rounded-2xl object-contain shadow-lg mb-1 bg-white p-1 mx-auto" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">How can I help you with Indian Standards today?</h2>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">Verify BIS certifications, audit product compliance, locate testing labs, or explore Indian standards.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                    {starterPrompts.map((p, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                        onClick={() => handleSend(p.text)}
                        className="flex items-start gap-3 p-3.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-150 text-left group"
                      >
                        <span className="text-gray-400 mt-0.5 shrink-0 group-hover:text-[#0055A4] transition-colors">{p.icon}</span>
                        <span className="text-[12px] text-gray-600 leading-snug group-hover:text-gray-800 transition-colors">{p.text}</span>
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
              <div className="max-w-3xl mx-auto px-3 sm:px-5 py-4 sm:py-5 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => (
                    <motion.div key={idx} variants={msgAnim} initial="hidden" animate="visible" layout className={`flex ${msg.role === "user" ? "justify-end" : "gap-2.5 justify-start"}`}>

                      {/* Assistant avatar */}
                      {msg.role === "assistant" && (
                        <img src="/bis-logo.png" alt="BIS" className="w-8 h-8 rounded-lg object-contain mt-0.5 shrink-0 bg-white p-0.5" />
                      )}

                      <div className={`max-w-[85%] sm:max-w-[78%] overflow-hidden ${
                        msg.role === "user"
                          ? "bg-[#0055A4] text-white rounded-2xl rounded-br-sm px-4 py-2.5"
                          : "bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"
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

          {/* ═══ Fee Panel ═══ */}
          <AnimatePresence>
            {showFeePanel && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                transition={panelSpring}
                className="hidden md:flex flex-col shrink-0 border-l border-gray-200 bg-white overflow-hidden"
              >
                <div className="p-4 space-y-4 w-70">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">{Icons.tag} MSME Fee Calculator</h3>
                    <button onClick={() => setShowFeePanel(false)} className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400">{Icons.close}</button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Enterprise Scale</label>
                      <select value={enterpriseType} onChange={(e) => setEnterpriseType(e.target.value)} className="w-full text-xs bg-gray-50 border border-gray-200 text-gray-800 rounded-lg p-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 focus:border-[#0055A4] cursor-pointer">
                        <option value="Large">Large Enterprise (0% Off)</option>
                        <option value="Small">Small Enterprise (50% Off)</option>
                        <option value="Micro/Startup">Micro / Startup (80% Off)</option>
                      </select>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-1">
                      <div className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">Estimated Marking Fee</div>
                      <div className="text-2xl font-extrabold text-gray-900">₹{finalFee.toLocaleString("en-IN")}</div>
                      {discountPercent > 0 && (
                        <>
                          <div className="text-xs text-gray-400 line-through">₹{baseFee.toLocaleString("en-IN")}</div>
                          <div className="text-[10px] font-semibold text-emerald-600">Save ₹{savings.toLocaleString("en-IN")} ({discountPercent}% Off)</div>
                        </>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 space-y-1.5">
                      <div className="flex justify-between"><span>Base Marking Fee:</span><span className="font-medium text-gray-700">₹1,00,000</span></div>
                      <div className="flex justify-between"><span>MSME Concession:</span><span className="font-medium text-emerald-600">-{discountPercent}%</span></div>
                      <div className="flex justify-between"><span>Application + Inspection:</span><span className="font-medium text-gray-700">₹11,000</span></div>
                      <div className="border-t border-gray-200 pt-1.5 flex justify-between font-semibold text-gray-900 text-[11px]">
                        <span>Total Payable to BIS:</span>
                        <span>₹{(finalFee + 11000).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-[#0055A4] hover:bg-[#003d7a] text-white rounded-lg text-[11px] font-semibold transition-colors">Apply Concession on Manakonline</button>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <footer className="shrink-0 border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-3 sm:px-5 py-2 sm:py-2.5 space-y-1.5">
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
              M.A.N.A.K is an official AI agent under Bureau of Indian Standards, verified against gazetted <span className="font-medium">National Register</span> — <span className="font-semibold text-gray-500">1805 IS &middot; 11,400+</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

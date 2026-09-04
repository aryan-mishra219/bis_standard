"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Phase 5 Hackathon "Wow" Features States
  const [language, setLanguage] = useState("English");
  const [simplify, setSimplify] = useState(false);
  const [showFeeEstimator, setShowFeeEstimator] = useState(false);
  const [enterpriseType, setEnterpriseType] = useState("Large");

  // Phase 6 Multimodal Vision States
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Compress image to lightweight JPEG data URL
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setImagePreview(compressedDataUrl);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (overrideQuery = null) => {
    const query = overrideQuery || input;
    if (!query.trim() && !imagePreview) return;

    const currentImage = imagePreview;

    const userMsg = { 
      role: "user", 
      content: query || "Analyzed attached image for BIS Standards.",
      image: currentImage
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: query || "What BIS standard or information is in this image?", 
          language, 
          simplify,
          image_base64: currentImage
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessages((prev) => [
          ...prev, 
          { 
            role: "assistant", 
            content: data.answer, 
            sources: data.sources,
            actions_taken: data.actions_taken || [],
            process_timeline: data.process_timeline || null,
            compliance_report: data.compliance_report || null
          }
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not fetch response.", sources: [], actions_taken: [], process_timeline: null, compliance_report: null }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please ensure the Python backend is running on port 8000.", sources: [], actions_taken: [], process_timeline: null, compliance_report: null }]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterPrompts = [
    "Audit my product spec sheet for bottled drinking water plant",
    "What are the steps to apply for a BIS hallmark license?",
    "Find me a water testing lab in Delhi"
  ];

  // Fee calculation logic
  const baseFee = 100000;
  let discountPercent = 0;
  if (enterpriseType === "Small") discountPercent = 50;
  else if (enterpriseType === "Micro/Startup") discountPercent = 80;

  const finalFee = baseFee * (1 - discountPercent / 100);
  const savings = baseFee - finalFee;

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-[#0055A4] text-white p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#0055A4] shadow">BIS</div>
          <div>
            <h1 className="text-xl font-bold">BIS Intelligent Assistant</h1>
            <p className="text-xs text-blue-200">Official Standards & Certification Guide</p>
          </div>
        </div>

        {/* Control Panel */}
        <div className="flex items-center flex-wrap gap-3">
          {/* ELI5 Toggle */}
          <label className="flex items-center gap-2 text-xs bg-blue-900/60 hover:bg-blue-900 px-3 py-1.5 rounded-lg cursor-pointer border border-blue-400/30 transition">
            <input 
              type="checkbox" 
              checked={simplify} 
              onChange={(e) => setSimplify(e.target.checked)}
              className="accent-[#0055A4] w-4 h-4 cursor-pointer"
            />
            <span className="font-medium">ELI5 (Simplify)</span>
          </label>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-blue-900/60 px-2 py-1 rounded-lg border border-blue-400/30">
            <span className="text-blue-200 font-medium">🌐</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="English" className="text-gray-800">English</option>
              <option value="Hindi" className="text-gray-800">Hindi (हिंदी)</option>
              <option value="Tamil" className="text-gray-800">Tamil (தமிழ்)</option>
              <option value="Bengali" className="text-gray-800">Bengali (বাংলা)</option>
            </select>
          </div>

          {/* Fee Estimator Toggle Button */}
          <button
            onClick={() => setShowFeeEstimator(!showFeeEstimator)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition shadow-sm border ${
              showFeeEstimator 
                ? "bg-amber-400 text-blue-950 border-amber-300 font-bold" 
                : "bg-blue-800/80 hover:bg-blue-800 text-white border-blue-400/30"
            }`}
          >
            💰 Fee Estimator {showFeeEstimator ? "▲" : "▼"}
          </button>
        </div>
      </header>

      {/* Fee Estimator Banner */}
      {showFeeEstimator && (
        <div className="bg-amber-50 border-b border-amber-200 p-4 shadow-inner transition-all">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                <span>🏷️</span> BIS Certification Fee Estimator (MSME Concessions)
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Calculate official marking fees according to your enterprise scale.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-amber-900">Enterprise Scale:</label>
                <select
                  value={enterpriseType}
                  onChange={(e) => setEnterpriseType(e.target.value)}
                  className="text-xs bg-white border border-amber-300 text-amber-900 rounded-md p-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-sm"
                >
                  <option value="Large">Large Enterprise</option>
                  <option value="Small">Small Enterprise (50% Off)</option>
                  <option value="Micro/Startup">Micro / Startup (80% Off)</option>
                </select>
              </div>

              <div className="bg-white border border-amber-300 rounded-lg px-4 py-2 text-right shadow-sm">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Estimated Marking Fee</div>
                <div className="text-base font-bold text-emerald-700">
                  ₹{finalFee.toLocaleString("en-IN")}
                  {discountPercent > 0 && (
                    <span className="text-xs text-gray-400 line-through ml-2 font-normal">
                      ₹{baseFee.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <div className="text-[10px] font-bold text-emerald-600">
                    🎉 You Save ₹{savings.toLocaleString("en-IN")} ({discountPercent}% Concession)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">How can I help you with Indian Standards today?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              {starterPrompts.map((prompt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(prompt)}
                  className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-[#0055A4] hover:shadow-md transition text-sm text-left text-gray-600"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-4 rounded-xl shadow-sm ${msg.role === "user" ? "bg-[#0055A4] text-white rounded-br-none" : "bg-white border border-gray-200 rounded-bl-none"}`}>
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="Uploaded BIS label or hallmark" 
                      className="max-h-48 rounded-lg mb-3 border border-blue-200 object-contain bg-black/10" 
                    />
                  )}
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none text-gray-700">
                      {/* Phase 7 Agentic Action Pills */}
                      {msg.actions_taken && msg.actions_taken.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {msg.actions_taken.map((action, i) => (
                            <div 
                              key={i} 
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-full text-xs font-semibold shadow-sm"
                            >
                              <span className="text-amber-600">⚙️</span>
                              <span>Action: {action}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg shadow-sm">
                              <table className="min-w-full divide-y divide-gray-200 text-sm bg-white" {...props} />
                            </div>
                          ),
                          thead: ({ node, ...props }) => (
                            <thead className="bg-blue-50 text-[#0055A4] font-semibold" {...props} />
                          ),
                          th: ({ node, ...props }) => (
                            <th className="px-4 py-2.5 text-left font-bold border-b border-gray-200" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="px-4 py-2 border-b border-gray-100 text-gray-700" {...props} />
                          ),
                          tr: ({ node, ...props }) => (
                            <tr className="hover:bg-blue-50/50 transition-colors" {...props} />
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>

                      {/* Phase 8 Dynamic Process Timeline Navigator */}
                      {msg.process_timeline && msg.process_timeline.length > 0 && (
                        <div className="mt-5 mb-4 p-5 bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-200 rounded-xl shadow-sm">
                          <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-[#0055A4]">
                            <span className="text-base">📍</span>
                            <span>Interactive Process Navigator ({msg.process_timeline.length} Sequential Steps)</span>
                          </div>

                          <div className="relative pl-7 border-l-2 border-[#0055A4]/40 space-y-6 my-2">
                            {msg.process_timeline.map((step, idx) => (
                              <div key={idx} className="relative group">
                                {/* Numbered Step Circle */}
                                <div className="absolute -left-[41px] top-0 w-7 h-7 rounded-full bg-[#0055A4] text-white text-xs font-bold flex items-center justify-center shadow-md ring-4 ring-white group-hover:scale-110 transition-transform">
                                  {step.step_number || idx + 1}
                                </div>

                                {/* Step Title & Description */}
                                <div className="bg-white/95 p-3.5 rounded-lg border border-blue-100 shadow-sm hover:border-blue-300 transition-all">
                                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    {step.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    {step.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Phase 9 Proactive Compliance Gap Report Banner & Card */}
                      {msg.compliance_report && (
                        <div className="mt-5 mb-4 p-5 bg-gradient-to-br from-slate-900 to-[#003366] text-white rounded-xl shadow-lg border border-blue-900">
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-800">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🛡️</span>
                              <div>
                                <h3 className="text-sm font-bold tracking-wide uppercase text-blue-200">
                                  Proactive Compliance Readiness Report
                                </h3>
                                <p className="text-[11px] text-blue-300">
                                  ID: <span className="font-mono font-bold text-white">{msg.compliance_report.report_id}</span> | Product: {msg.compliance_report.product_name}
                                </p>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 bg-amber-400 text-blue-950 font-extrabold text-[10px] rounded-full uppercase tracking-wider shadow">
                              {msg.compliance_report.risk_level}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
                            <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1.5">
                              <div className="font-semibold text-blue-200 uppercase text-[10px]">Applicable Standard & Scheme</div>
                              <div className="font-bold text-white text-sm">{msg.compliance_report.primary_standard}</div>
                              <div className="text-blue-100">{msg.compliance_report.standard_name}</div>
                              <div className="text-emerald-300 font-medium pt-1">📌 {msg.compliance_report.scheme_type}</div>
                            </div>

                            <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1.5">
                              <div className="font-semibold text-blue-200 uppercase text-[10px]">Timeline & MSME Budget Estimate</div>
                              <div className="font-bold text-amber-300 text-sm">⏱️ {msg.compliance_report.estimated_timeline}</div>
                              <div className="text-emerald-400 font-bold text-base">
                                💰 {msg.compliance_report.cost_breakdown?.total_estimated || "₹43,000"}
                              </div>
                              <div className="text-[10px] text-blue-200">Includes Concession for {msg.compliance_report.enterprise_scale} Enterprise</div>
                            </div>
                          </div>

                          {/* Gap Checklist */}
                          {msg.compliance_report.compliance_gaps && msg.compliance_report.compliance_gaps.length > 0 && (
                            <div className="mb-4">
                              <div className="text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-2">Identified Compliance Gaps & Action Checklist:</div>
                              <div className="space-y-1.5">
                                {msg.compliance_report.compliance_gaps.map((gap, i) => (
                                  <div key={i} className="flex items-start gap-2 text-xs text-blue-50 bg-black/20 p-2 rounded border border-white/5">
                                    <span className="text-amber-400 font-bold">⚠️</span>
                                    <span>{gap}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* PDF Download Button */}
                          <div className="pt-2 flex justify-end">
                            <a 
                              href={`http://localhost:8000/api/download-report/${msg.compliance_report.report_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-extrabold shadow-md transition transform hover:scale-105"
                            >
                              <span>📄</span>
                              <span>Download Official PDF Report ({msg.compliance_report.report_id}.pdf)</span>
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 mb-2">SOURCES REFERENCED:</p>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((src, i) => (
                              <div key={i} className="group relative text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded cursor-pointer hover:bg-blue-50 hover:text-[#0055A4] border border-gray-200">
                                📚 {src.document} (Pg. {src.page})
                                <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg z-10 whitespace-normal">
                                  "{src.content_snippet}..."
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (

                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-4 rounded-xl rounded-bl-none shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#0055A4] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#0055A4] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-[#0055A4] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Image Preview Thumbnail */}
          {imagePreview && (
            <div className="relative inline-block bg-gray-100 p-1.5 border border-gray-300 rounded-lg shadow-sm">
              <img 
                src={imagePreview} 
                alt="Selected preview" 
                className="h-20 w-auto rounded object-cover" 
              />
              <button 
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow hover:bg-red-700 transition"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex gap-3 items-center">
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*" 
              onChange={handleImageSelect}
              className="hidden" 
            />

            {/* Paperclip Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border border-gray-300 transition text-lg flex items-center justify-center disabled:opacity-50"
              title="Attach Product Spec Sheet, Label, or Hallmark Image"
            >
              📎
            </button>

            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a query, paste a spec sheet, or attach an image (📎)..." 
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0055A4] focus:ring-1 focus:ring-[#0055A4]"
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || (!input.trim() && !imagePreview)}
              className="bg-[#0055A4] hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

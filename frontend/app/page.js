"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (overrideQuery = null) => {
    const query = overrideQuery || input;
    if (!query.trim()) return;

    const userMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer, sources: data.sources }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not fetch response.", sources: [] }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please ensure the Python backend is running on port 8000.", sources: [] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterPrompts = [
    "What are the permissible limits for lead in drinking water as per IS 10500?",
    "Explain the BIS certification process for MSMEs.",
    "What are the rules for Gold Hallmarking in India?"
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-[#0055A4] text-white p-4 shadow-md flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#0055A4]">BIS</div>
        <div>
          <h1 className="text-xl font-bold">BIS Intelligent Assistant</h1>
          <p className="text-xs text-blue-200">Official Standards & Certification Guide</p>
        </div>
      </header>

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
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                      
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
                    <p>{msg.content}</p>
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
        <div className="max-w-4xl mx-auto flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about BIS standards, certification, or hallmarking..." 
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0055A4] focus:ring-1 focus:ring-[#0055A4]"
            disabled={isLoading}
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-[#0055A4] hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

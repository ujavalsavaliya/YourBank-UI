import React, { useState, useEffect, useRef } from "react";
import robot from "./assets/robot.png";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              ...messages.map((m) => ({
                role: m.from === "user" ? "user" : "assistant",
                content: m.text,
              })),
              { role: "user", content: input.trim() },
            ],
            max_tokens: 150,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: data.choices[0].message.content },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Sorry, I didn't get a response." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error: Unable to reach AI server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  const isCode = (text) =>
    text.startsWith("```") || text.includes("\n") || text.includes("    ");

  // Dynamically adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="md:ml-60 p-4 sm:p-6 bg-gray-100 min-h-screen relative flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md my-8 md:my-12">
        <div className="flex flex-col h-[80vh] md:h-[90vh] w-full mx-auto bg-[#0d1117] text-[#000000] font-sans rounded-2xl overflow-hidden">
          {/* Stylish Header */}
          <header className="px-4 py-3 sm:px-6 sm:py-4 bg-[#cdf3ff] border-b border-[#30363d] text-lg sm:text-xl font-semibold flex items-center gap-3 rounded-t-2xl">
            <img
              src={robot}
              alt="Robot"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-gray-300"
            />
            <span className="text-[#0d1117]">Investment ChatBot</span>
          </header>

          {/* Messages Area */}
          <main
            className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 flex flex-col gap-3 bg-[#0d1117] scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm ${
                    msg.from === "user"
                      ? "bg-[#cdf3ff] text-black shadow-md"
                      : "bg-[#161b22] border border-[#30363d] text-[#c9d1d9] shadow-sm"
                  }`}
                  style={{
                    fontFamily:
                      msg.from === "bot" && isCode(msg.text)
                        ? "SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace"
                        : undefined,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {loading && (
              <div className="flex justify-center py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#8b949e] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#8b949e] rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-[#8b949e] rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-[#161b22] border-t border-[#30363d] rounded-b-2xl">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-grow resize-none rounded-md bg-[#0d1117] border border-[#cdf3ff] px-3 py-2 text-[#c9d1d9] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#b6edfe] overflow-hidden"
              disabled={loading}
              style={{ maxHeight: "200px" }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`rounded-md px-3 sm:px-4 py-2 font-semibold transition-colors text-sm sm:text-base ${
                loading || !input.trim()
                  ? "bg-[#3a3f45] cursor-not-allowed text-[#6e7681]"
                  : "bg-[#cdf3ff] hover:bg-[#8ee2fb] text-black cursor-pointer"
              }`}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

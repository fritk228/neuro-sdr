"use client";
import { useEffect, useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function WidgetPage() {
    // Достаем clientId из URL (например, /widget?clientId=123)
  const [clientId, setClientId] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setClientId(params.get("clientId") || "");
  }, []);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Привет! Я ИИ-помощник. Чем могу помочь?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
           const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, clientId: clientId }) // <-- Добавили clientId
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply || data.error || "Ошибка" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "Ошибка сети." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-zinc-200 font-sans">
      
      {/* Шапка виджета */}
      <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <Bot size={16} className="text-black" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white">Чат с ИИ</h1>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Онлайн
          </p>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`p-3 rounded-lg max-w-[85%] text-sm leading-relaxed ${msg.role === "user" ? "bg-zinc-700 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-300 prose prose-invert"}`}>
              {msg.role === "bot" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Печатает...
            </div>
          </div>
        )}
      </div>

      {/* Поле ввода */}
      <form onSubmit={sendMessage} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ваш вопрос..."
          className="flex-1 bg-black/40 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="bg-white hover:bg-zinc-200 disabled:opacity-50 text-black p-2 rounded-lg transition-all"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
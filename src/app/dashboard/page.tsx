"use client";
import { useState } from "react";
import { Send, Bot, User, Loader2, Terminal, Settings, CreditCard, MessageSquare, LogOut, BarChart, UserPlus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

// ВСТАВЬ СВОЙ ID ИЗ SUPABASE
const MY_CLIENT_ID = "ТВОЙ_UUID_ИЗ_СУПАБЕЙС";

export default function Dashboard() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Привет! Я NeuroSDR. Задай мне вопрос по сайту, и я найду ответ в базе знаний." }
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
        // ВАЖНО: Передаем clientId, чтобы API знал, чей это чат
        body: JSON.stringify({ message: userMsg.text, clientId: MY_CLIENT_ID })
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
    <div className="flex h-screen bg-black text-zinc-300 font-sans relative overflow-hidden">
      
      {/* Фоновая сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>

      {/* Боковое меню */}
      <aside className="w-64 bg-[#09090b] border-r border-zinc-800 flex flex-col hidden md:flex relative z-10">
        <div className="p-6 flex items-center gap-3 border-b border-zinc-800">
          <Terminal className="text-white w-6 h-6" />
          <span className="font-semibold text-lg text-white tracking-tight">NeuroSDR</span>
        </div>

        <div className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-2.5 bg-zinc-800 text-white rounded-md font-medium text-sm transition-colors">
            <MessageSquare size={16} /> Чат с ИИ
          </Link>
          <Link href="/dashboard/stats" className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md font-medium text-sm transition-colors">
            <BarChart size={16} /> Аналитика
          </Link>
          <Link href="/dashboard/leads" className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md font-medium text-sm transition-colors">
            <UserPlus size={16} /> Лиды
          </Link>
          <Link href="/dashboard/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md font-medium text-sm transition-colors">
            <Settings size={16} /> Настройки
          </Link>
          <Link href="/dashboard/pricing" className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md font-medium text-sm transition-colors">
            <CreditCard size={16} /> Тарифы
          </Link>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md font-medium text-sm transition-colors">
            <LogOut size={16} /> На главную
          </Link>
        </div>
      </aside>

      {/* Основная зона чата */}
      <main className="flex-1 flex flex-col relative z-10">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-black">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            GigaChat подключен
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-zinc-700" : "bg-white"}`}>
                  {msg.role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-black" />}
                </div>
                <div className={`p-4 rounded-lg max-w-[85%] text-sm leading-relaxed ${msg.role === "user" ? "bg-zinc-800 text-white" : "bg-[#09090b] border border-zinc-800 text-zinc-300 prose prose-invert"}`}>
                  {msg.role === "bot" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
                  <Bot size={16} className="text-black" />
                </div>
                <div className="p-4 rounded-lg bg-[#09090b] border border-zinc-800 text-zinc-500 flex items-center gap-3 text-sm">
                  <Loader2 size={16} className="animate-spin text-zinc-400" /> Анализирую...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 bg-black">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Задайте вопрос..."
              className="w-full bg-[#09090b] border border-zinc-800 rounded-lg pl-4 pr-14 py-3 text-white outline-none focus:border-zinc-500 transition-all text-sm"
            />
            <button type="submit" disabled={loading || !input.trim()} className="absolute right-2 bg-white text-black p-2 rounded-md disabled:opacity-50 hover:bg-zinc-200 transition-all">
              <Send size={16} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
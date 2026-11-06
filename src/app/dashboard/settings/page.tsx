"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Save, RefreshCw, Copy, Check, Terminal, Code2 } from "lucide-react";

// НЕ ЗАБУДЬ ВСТАВИТЬ СВОЙ ID
const MY_CLIENT_ID = "ТВОЙ_UUID_ИЗ_СУПАБЕЙС"; 

export default function SettingsPage() {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [chatId, setChatId] = useState("");
  
  const [scraping, setScraping] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleScrape = async () => {
    if (!url) return alert("Введите URL");
    setScraping(true);
    setStatusMsg("Сканируем сайт...");
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success) setStatusMsg("✅ Сайт успешно спарсен и добавлен в базу!");
      else setStatusMsg(`❌ Ошибка: ${data.error}`);
    } catch (e) {
      setStatusMsg("❌ Ошибка сети");
    } finally {
      setScraping(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: MY_CLIENT_ID, telegramToken: token, telegramChatId: chatId })
      });
      const data = await res.json();
      if (data.success) setStatusMsg("✅ Настройки Telegram сохранены!");
      else setStatusMsg(`❌ Ошибка: ${data.error}`);
    } catch (e) {
      setStatusMsg("❌ Ошибка сети");
    } finally {
      setSaving(false);
    }
  };

  const iframeCode = `<iframe src="http://localhost:3000/widget?clientId=${MY_CLIENT_ID}" width="100%" height="600" style="border:none;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.5);"></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft size={16} /> Назад в чат
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Настройки проекта</h1>

        {statusMsg && (
          <div className="mb-6 p-4 bg-zinc-900 border border-zinc-700 text-white rounded-xl text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            {statusMsg}
          </div>
        )}

        <div className="space-y-6">
          
          {/* Блок парсинга */}
          <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <Globe className="w-5 h-5 text-zinc-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">База знаний</h2>
            </div>
            <p className="text-sm text-zinc-500 mb-6 ml-11">Введите URL сайта, чтобы ИИ прочитал его и мог отвечать клиентам.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 ml-0 sm:ml-11">
              <input 
                type="text" 
                placeholder="https://ваш-сайт.ру" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-zinc-500 transition-all text-sm"
              />
              <button onClick={handleScrape} disabled={scraping} className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-zinc-200 disabled:opacity-50 text-sm flex items-center justify-center gap-2 transition-all">
                {scraping ? <RefreshCw className="animate-spin w-4 h-4" /> : "Спарсить сайт"}
              </button>
            </div>
          </div>

          {/* Блок Telegram */}
          <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <Terminal className="w-5 h-5 text-zinc-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Интеграция с Telegram</h2>
            </div>
            <p className="text-sm text-zinc-500 mb-6 ml-11">Куда отправлять лиды, когда клиент оставит номер телефона.</p>
            
            <div className="space-y-4 ml-0 sm:ml-11">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Токен бота</label>
                <input 
                  type="text" 
                  placeholder="Вставьте токен от @BotFather" 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-zinc-500 transition-all text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Chat ID</label>
                <input 
                  type="text" 
                  placeholder="Вставьте ID от @userinfobot" 
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-zinc-500 transition-all text-sm font-mono"
                />
              </div>
              <button onClick={handleSaveSettings} disabled={saving} className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-zinc-200 disabled:opacity-50 text-sm flex items-center justify-center gap-2 mt-2 transition-all">
                {saving ? <RefreshCw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Сохранить настройки
              </button>
            </div>
          </div>

          {/* Блок виджета (Стиль редактора кода) */}
          <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <Code2 className="w-5 h-5 text-zinc-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Код для вставки на сайт</h2>
            </div>
            <p className="text-sm text-zinc-500 mb-6 ml-11">Вставьте этот HTML-код в любое место вашего сайта.</p>
            
            <div className="ml-0 sm:ml-11">
              <div className="bg-black border border-zinc-800 rounded-xl relative group overflow-hidden">
                {/* Панелька сверху как в редакторе */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-[#09090b]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                  </div>
                  <button onClick={copyToClipboard} className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-md">
                    {copied ? <><Check className="w-3 h-3 text-emerald-400" /> Скопировано</> : <><Copy className="w-3 h-3" /> Копировать</>}
                  </button>
                </div>
                {/* Сам код */}
                <div className="p-4 overflow-x-auto">
                  <code className="text-xs text-emerald-400 font-mono whitespace-pre-wrap break-all leading-relaxed">
                    {iframeCode}
                  </code>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
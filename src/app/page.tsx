import Link from "next/link";
import { ArrowRight, Database, Terminal, ShieldCheck, Cpu, Check, Bot, User } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-white selection:text-black relative overflow-hidden">
      
      {/* Мягкий белый свет сверху (создает глубину) */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Тонкая сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Навигация */}
      <nav className="fixed top-0 w-full border-b border-white/10 bg-[#09090b]/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="text-white w-5 h-5" />
            <span className="font-semibold text-lg text-white tracking-tight">NeuroSDR</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Документация
            </Link>
            <Link href="/dashboard" className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg text-sm font-medium transition-all">
              Войти в панель
            </Link>
          </div>
        </div>
      </nav>

      {/* Главный экран (Двухколоночный) */}
      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Левая часть (Текст) */}
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-zinc-300 tracking-wider uppercase">Beta v0.1</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-6 leading-[1.1]">
              Ваш сайт.<br />Умный ИИ.<br />Ноль упущенных клиентов.
            </h1>
            
            <p className="text-lg text-zinc-400 mb-10 leading-relaxed max-w-lg">
              NeuroSDR анализирует контент вашего сайта и превращает его в базу знаний. ИИ-менеджер отвечает клиентам 24/7 и присылает вам готовые лиды в Telegram.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 rounded-lg font-semibold hover:bg-zinc-200 transition-all">
                Запустить бесплатно <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Правая часть (Мокап чата) */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-xl opacity-50"></div>
            <div className="relative bg-[#09090b] border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Bot size={16} className="text-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">ИИ-Менеджер</p>
                  <p className="text-xs text-emerald-400">Онлайн</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="bg-white/10 text-zinc-300 text-sm p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    Здравствуйте! Сколько стоит разработка лендинга?
                  </div>
                </div>
                <div className="flex gap-2 flex-row-reverse">
                  <div className="bg-white text-black text-sm p-3 rounded-lg rounded-tr-none max-w-[80%]">
                    Наши лендинги стоят от 50 000 ₽. Оставьте номер, и менеджер свяжется с вами!
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-white/10 text-zinc-300 text-sm p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    +7 999 123-45-67
                  </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-2 rounded text-center">
                  🔥 Лид отправлен в Telegram
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
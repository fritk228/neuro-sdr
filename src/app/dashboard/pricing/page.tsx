import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft size={16} /> Назад
        </Link>
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Тарифные планы</h1>
          <p className="text-zinc-500">Масштабируйтесь вместе с нами.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#09090b] border border-zinc-800 p-8 rounded-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Free</h3>
            <p className="text-sm text-zinc-500 mb-6">Для тестов</p>
            <div className="text-4xl font-bold text-white mb-6">$0<span className="text-sm text-zinc-500 font-normal">/мес</span></div>
            <ul className="space-y-3 mb-8 text-sm text-zinc-400">
              <li className="flex items-center gap-2"><Check className="text-zinc-500 w-4 h-4"/> 10 сообщений</li>
              <li className="flex items-center gap-2"><Check className="text-zinc-500 w-4 h-4"/> 1 сайт</li>
            </ul>
            <button className="w-full py-2.5 bg-zinc-800 text-white rounded-lg font-medium opacity-50 cursor-not-allowed">Текущий план</button>
          </div>

          <div className="bg-[#09090b] border border-emerald-500/50 p-8 rounded-2xl relative shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">Популярный</div>
            <h3 className="text-lg font-medium text-white mb-2">Pro</h3>
            <p className="text-sm text-zinc-500 mb-6">Для бизнеса</p>
            <div className="text-4xl font-bold text-white mb-6">$49<span className="text-sm text-zinc-500 font-normal">/мес</span></div>
            <ul className="space-y-3 mb-8 text-sm text-zinc-300">
              <li className="flex items-center gap-2"><Check className="text-emerald-500 w-4 h-4"/> Безлимитные сообщения</li>
              <li className="flex items-center gap-2"><Check className="text-emerald-500 w-4 h-4"/> 5 сайтов</li>
              <li className="flex items-center gap-2"><Check className="text-emerald-500 w-4 h-4"/> Приоритетная поддержка</li>
            </ul>
            <button className="w-full py-2.5 bg-white text-black hover:bg-zinc-200 rounded-lg font-semibold transition-colors">Перейти на Pro</button>
          </div>

          <div className="bg-[#09090b] border border-zinc-800 p-8 rounded-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Agency</h3>
            <p className="text-sm text-zinc-500 mb-6">Для веб-студий</p>
            <div className="text-4xl font-bold text-white mb-6">$99<span className="text-sm text-zinc-500 font-normal">/мес</span></div>
            <ul className="space-y-3 mb-8 text-sm text-zinc-400">
              <li className="flex items-center gap-2"><Check className="text-zinc-500 w-4 h-4"/> White Label (ваш логотип)</li>
              <li className="flex items-center gap-2"><Check className="text-zinc-500 w-4 h-4"/> 20 сайтов</li>
            </ul>
            <button className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors">Связаться с нами</button>
          </div>
        </div>
      </div>
    </div>
  );
}
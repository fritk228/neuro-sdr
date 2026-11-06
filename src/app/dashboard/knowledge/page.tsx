import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";

export default function KnowledgeBase() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 text-sm">
          <ArrowLeft size={16} /> Назад в чат
        </Link>
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Database className="text-zinc-500" /> База знаний
        </h1>
        <div className="bg-[#050505] border border-zinc-800 rounded-xl p-8 text-center">
          <p className="text-zinc-500">Здесь будет список сайтов, которые вы спарсили, и количество сохраненных фрагментов текста.</p>
          <p className="text-zinc-600 text-sm mt-2">(В разработке)</p>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, MessageSquare, UserPlus, TrendingUp, BarChart2 } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_CLIENT_ID = "ТВОЙ_UUID_ИЗ_СУПАБЕЙС"; // ЗАМЕНИ

export default function StatsPage() {
  const [msgCount, setMsgCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: msgs } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('client_id', MY_CLIENT_ID);
      const { count: lds } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('client_id', MY_CLIENT_ID);
      setMsgCount(msgs || 0);
      setLeadsCount(lds || 0);
    };
    fetchStats();
  }, []);

  const conversion = msgCount > 0 ? ((leadsCount / msgCount) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft size={16} /> Назад
        </Link>
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Обзор проекта</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#09090b] border border-zinc-800 p-6 rounded-2xl">
            <MessageSquare className="w-6 h-6 text-blue-500 mb-4" />
            <p className="text-sm text-zinc-500 mb-1">Всего сообщений</p>
            <p className="text-4xl font-bold text-white">{msgCount}</p>
          </div>
          <div className="bg-[#09090b] border border-zinc-800 p-6 rounded-2xl">
            <UserPlus className="w-6 h-6 text-emerald-500 mb-4" />
            <p className="text-sm text-zinc-500 mb-1">Пойманных лидов</p>
            <p className="text-4xl font-bold text-white">{leadsCount}</p>
          </div>
          <div className="bg-[#09090b] border border-zinc-800 p-6 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-purple-500 mb-4" />
            <p className="text-sm text-zinc-500 mb-1">Конверсия в лид</p>
            <p className="text-4xl font-bold text-white">{conversion}%</p>
          </div>
        </div>

        <div className="bg-[#09090b] border border-zinc-800 p-8 rounded-2xl flex flex-col items-center justify-center min-h-[300px] text-center">
          <BarChart2 className="w-12 h-12 text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">График активности</h3>
          <p className="text-sm text-zinc-500 max-w-sm">Здесь будет отображаться статистика сообщений по дням, как только у вас появятся первые клиенты.</p>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Phone, MessageSquare, Inbox } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_CLIENT_ID = "ТВОЙ_UUID_ИЗ_СУПАБЕЙС"; // ЗАМЕНИ

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const { data } = await supabase.from('leads').select('*').eq('client_id', MY_CLIENT_ID).order('created_at', { ascending: false });
      if (data) setLeads(data);
    };
    fetchLeads();
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft size={16} /> Назад
        </Link>
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">База лидов</h1>
        
        {leads.length === 0 ? (
          <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-xl font-medium text-white mb-2">Пока нет лидов</h2>
            <p className="text-zinc-500 max-w-sm mb-6">Как только клиент оставит свой номер телефона в чате, он появится здесь.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-[#09090b] border border-zinc-800 p-6 rounded-xl flex justify-between items-start hover:border-zinc-700 transition-colors">
                <div>
                  <p className="text-white font-medium flex items-center gap-2 mb-2">
                    <Phone size={16} className="text-emerald-400"/> {lead.phone}
                  </p>
                  <p className="text-sm text-zinc-400 flex items-center gap-2">
                    <MessageSquare size={14}/> {lead.message}
                  </p>
                </div>
                <span className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full">
                  {new Date(lead.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
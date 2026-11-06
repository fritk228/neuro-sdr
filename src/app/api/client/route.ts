import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Функция, которая создает клиента только тогда, когда он реально нужен
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase URL or Service Role Key');
  }

  return createClient(url, key);
}


export async function POST(req: Request) {
  try {
    const { clientId, telegramToken, telegramChatId } = await req.json();

    if (!clientId) {
      return NextResponse.json({ error: 'Нет clientId' }, { status: 400 });
    }

    const supabase = getSupabaseClient(); // <-- Создаем клиент здесь

    const { error } = await supabase
      .from('clients')
      .update({ 
        telegram_token: telegramToken, 
        telegram_chat_id: telegramChatId 
      })
      .eq('id', clientId);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, message: 'Настройки сохранены' });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
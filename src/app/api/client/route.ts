import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { clientId, telegramToken, telegramChatId } = await req.json();

    if (!clientId) {
      return NextResponse.json({ error: 'Нет clientId' }, { status: 400 });
    }

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
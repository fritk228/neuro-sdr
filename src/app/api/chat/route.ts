import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GigaChat } from 'langchain-gigachat';
import { Agent } from 'node:https';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const httpsAgent = new Agent({ rejectUnauthorized: false });
const giga = new GigaChat({
  credentials: process.env.GIGACHAT_AUTH_KEY!,
  httpsAgent: httpsAgent,
  model: 'GigaChat',
});

// Отправка лида в Телеграм (без Markdown, чтобы не ломалось на символах _)
async function sendTelegramLead(clientId: string, contactInfo: string, originalMessage: string) {
  const { data: client } = await supabase
    .from('clients')
    .select('telegram_token, telegram_chat_id')
    .eq('id', clientId)
    .single();

  if (!client || !client.telegram_token) return;

  const text = `🔥 НОВЫЙ ЛИД С САЙТА!\n\n📞 Контакт: ${contactInfo}\n💬 Сообщение: ${originalMessage}`;
  
  await fetch(`https://api.telegram.org/bot${client.telegram_token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: client.telegram_chat_id, text: text })
  });
}

export async function POST(req: Request) {
  try {
    const { message, clientId } = await req.json();
    if (!message || !clientId) return NextResponse.json({ error: 'Пустой запрос' }, { status: 400 });

    // 1. ПАРАЛЛЕЛЬНЫЙ СТАРТ: Сохраняем сообщение в базу И ищем контекст ОДНОВРЕМЕННО
    const savePromise = supabase.from('messages').insert({ client_id: clientId, role: 'user', content: message });
    
    const searchWords = message.split(' ').filter((w: string) => w.length > 2);
    const orCondition = searchWords.map((w: string) => `content.ilike.%${w}%`).join(',');
    const searchPromise = supabase
      .from('documents')
      .select('content')
      .or(orCondition || `content.ilike.%${message}%`)
      .limit(2); // Уменьшили лимит для скорости

    // Ждем завершения обоих процессов
    const [_, { data: documents }] = await Promise.all([savePromise, searchPromise]);

    // 2. ПРОВЕРКА НА КОНТАКТЫ (Телефон, email или @username)
    const contactRegex = /((\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(@[a-zA-Z0-9_]{5,32})/gi;
    const matches = message.match(contactRegex);

    if (matches) {
      // Собираем все контакты через запятую
      const contactInfo = matches.join(', ');
      
      // Сохраняем лид и отправляем в Телегу
      await supabase.from('leads').insert({ client_id: clientId, phone: contactInfo, message: message });
      await sendTelegramLead(clientId, contactInfo, message);
      
      // Сохраняем ответ бота в базу (для аналитики)
      const botReply = "✅ Спасибо! Я передал ваши контакты менеджеру. Он свяжется с вами в ближайшее время.";
      await supabase.from('messages').insert({ client_id: clientId, role: 'bot', content: botReply });

      return NextResponse.json({ reply: botReply });
    }

    // 3. ОТВЕТ ОТ GIGACHAT (если контактов нет)
    let contextText = documents && documents.length > 0 ? documents.map(d => d.content).join('\n---\n') : "";
    let botReply = "";

    try {
      const prompt = `Ты — вежливый менеджер. Отвечай на вопросы, используя контекст:\n${contextText || "Информации нет."}\n\nЕсли клиент хочет купить, предложи оставить номер телефона.\nВопрос: ${message}`;
      const response = await giga.invoke(prompt);
      botReply = response.content as string;
    } catch (aiError) {
      botReply = contextText ? `(GigaChat недоступен):\n\n${contextText}\n\nОставьте ваш номер телефона!` : "Я не нашел информации. Оставьте ваш номер телефона!";
    }

    // 4. Сохраняем ответ бота в базу
    await supabase.from('messages').insert({ client_id: clientId, role: 'bot', content: botReply });

    return NextResponse.json({ reply: botReply });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
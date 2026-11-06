import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function splitTextIntoChunks(text: string, chunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    console.log(`Скачиваем сайт: ${url}`);
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    $('script, style, noscript, iframe, nav, footer, header, aside').remove();
    const rawText = $('body').text().replace(/\s+/g, ' ').trim();
    
    if (rawText.length < 100) {
      return NextResponse.json({ error: 'Слишком мало текста на сайте' }, { status: 400 });
    }

    const chunks = splitTextIntoChunks(rawText, 1000);
    console.log(`Нарезано кусков: ${chunks.length}`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // ВРЕМЕННАЯ ЗАГЛУШКА ВМЕСТО GIGACHAT (чтобы обойти ошибку 402)
      // Генерируем массив из 1024 случайных чисел для базы данных
      const fakeEmbedding = Array.from({ length: 1024 }, () => Math.random());

      const { error } = await supabase.from('documents').insert({
        content: chunk,
        metadata: { url, chunk_index: i },
        embedding: fakeEmbedding
      });

      if (error) throw new Error(`Ошибка Supabase: ${error.message}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Успешно обработано ${chunks.length} кусков текста с сайта ${url}` 
    });

  } catch (error: any) {
    console.error("Ошибка парсера:", error);
    return NextResponse.json({ error: error.message || 'Ошибка парсера' }, { status: 500 });
  }
}
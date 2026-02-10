import { GoogleGenerativeAI } from '@google/generative-ai';
import type { InsightsRequest } from '../types.js';

console.log('[llmClient] v2 initialized (SDK mode)');

function buildPrompt(body: InsightsRequest): string {
    const { range, metrics } = body;

    const langs = metrics.top_languages_7d
        .map((l) => `${l.name} (${l.percent}%)`)
        .join(', ');

    const projects = metrics.projects_touched_7d
        .map((p) => `${p.name} (${p.hours} jam)`)
        .join(', ');

    const delta = metrics.week_over_week_delta
        ? `\n- Perubahan minggu lalu: coding time ${metrics.week_over_week_delta.coding_time_change_percent ?? 'N/A'}%, active days ${metrics.week_over_week_delta.active_days_change ?? 'N/A'}`
        : '';

    return `Kamu adalah AI Analytics Reporter profesional untuk software engineer.
Analisis data aktivitas coding berikut untuk memberikan laporan wawasan yang cerdas dan strategis.

Data aktivitas ${range === '7d' ? '7 hari terakhir' : '30 hari terakhir'}:
- Waktu coding: ${metrics.coding_time_7d} jam
- Hari aktif: ${metrics.active_days_7d} hari
- Bahasa pemrograman: ${langs}
- Project: ${projects}${delta}

INSTRUKSI GAYA BAHASA (PENTING):
1. Bahasa output HARUS bahasa Indonesia yang NETRAL, PROFESIONAL, dan PUBLIK (orang ketiga).
2. DILARANG menggunakan kata "Anda", "Kamu", atau "Saya".
3. Gunakan sapaan "Hafiz", "Pengguna", atau "Individu ini".
4. Gaya bahasa: Laporan AI analytics, formal ringan, tidak personal namun tidak kaku.
5. Gunakan data angka di atas secara kontekstual dalam analisis.
6. Berikan TEPAT 3 rekomendasi langkah konkret yang actionable.

Balas HANYA dengan JSON valid:
{
  "summary": "analisis laporan mendalam (contoh: Hafiz menunjukkan performa...)",
  "focus": "kalimat singkat fokus pengembangan (contoh: Pengguna saat ini berfokus pada...)",
  "recommendations": ["rekomendasi 1", "rekomendasi 2", "rekomendasi 3"],
  "alerts": ["insight menarik atau peringatan, kosongkan array jika tidak ada"],
  "next_week_goal": { "title": "judul goal", "target": "target spesifik" }
}`;
}

async function callGemini(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error('GEMINI_API_KEY belum diisi di file .env');

    // Model yang akan dicoba (tambah 1.0 Pro sebagai cadangan terakhir)
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

    let lastErrorMessage = '';

    for (const modelName of models) {
        try {
            console.log(`[llmClient] Mencoba Gemini: ${modelName}...`);
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            if (text) {
                console.log(`[llmClient] ✅ Sukses dengan ${modelName}`);
                return text;
            }
        } catch (err: any) {
            console.error(`[callGemini] ${modelName} gagal:`, err.message);
            lastErrorMessage = err.message;
            // Lanjut ke model berikutnya
        }
    }

    throw new Error(`Google AI Error: ${lastErrorMessage}. Coba gunakan LLM_PROVIDER=openai atau aktifkan MOCK_AI=true di .env`);
}

async function getMockResponse(): Promise<string> {
    console.log('[llmClient] 💡 Menggunakan Demo Mode (MOCK_AI)');
    return JSON.stringify({
        summary: "Hafiz menunjukkan dedikasi yang signifikan dalam pengembangan infrastruktur data menggunakan Python. Fokus utama pada project 'Test' selama 14 jam mengindikasikan progres teknis yang stabil.",
        focus: "Pengguna saat ini mengarahkan pengembangan pada optimasi pemrosesan data dan arsitektur backend.",
        recommendations: [
            "Implementasi unit testing pada modul Python untuk meningkatkan keandalan sistem.",
            "Eksplorasi optimasi query untuk efisiensi performa pada data besar.",
            "Dokumentasi arsitektur project 'Test' untuk standarisasi alur kerja."
        ],
        alerts: ["Terdapat peningkatan aktivitas sebesar 20% dibandingkan periode sebelumnya."],
        next_week_goal: {
            title: "Performance Tuning",
            target: "Optimasi 2 modul utama pada project 'Test'."
        }
    });
}

async function callOpenAI(prompt: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY belum diisi');

    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a career advisor AI. Always respond in Indonesian and with valid JSON only.' },
            { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || '';
}

export async function generateInsights(body: InsightsRequest): Promise<string> {
    const prompt = buildPrompt(body);
    const provider = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();

    if (process.env.MOCK_AI === 'true') {
        return getMockResponse();
    }

    console.log(`[llmClient] Provider aktif: ${provider}`);

    if (provider === 'openai') {
        return callOpenAI(prompt);
    }
    return callGemini(prompt);
}

import type { InsightsResponse } from '../types.js';

const FALLBACK_RESPONSE: InsightsResponse = {
    summary:
        'Maaf, terjadi kesalahan saat memproses data. Silakan coba lagi dalam beberapa saat.',
    focus: 'Sistem sedang dalam perbaikan.',
    recommendations: [
        'Coba klik "Generate Insights" lagi dalam 1-2 menit.',
        'Pastikan koneksi internet Anda stabil.',
        'Jika masalah berlanjut, cek konfigurasi API key di server.',
    ],
    alerts: ['Respons AI tidak valid — menggunakan fallback.'],
    next_week_goal: {
        title: 'Retry',
        target: 'Coba generate ulang insights setelah beberapa saat.',
    },
};

export function validateInsights(raw: string): InsightsResponse {
    try {
        // Try to extract JSON from potential markdown code fences
        let jsonString = raw.trim();
        const fenceMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (fenceMatch) {
            jsonString = fenceMatch[1].trim();
        }

        const parsed = JSON.parse(jsonString);

        // Validate required fields
        if (
            typeof parsed.summary !== 'string' ||
            typeof parsed.focus !== 'string' ||
            !Array.isArray(parsed.recommendations) ||
            parsed.recommendations.length < 1 ||
            !Array.isArray(parsed.alerts) ||
            typeof parsed.next_week_goal?.title !== 'string' ||
            typeof parsed.next_week_goal?.target !== 'string'
        ) {
            console.warn('[validateInsights] Missing required fields, using fallback');
            return FALLBACK_RESPONSE;
        }

        return {
            summary: parsed.summary,
            focus: parsed.focus,
            recommendations: parsed.recommendations.map(String).slice(0, 5),
            alerts: parsed.alerts.map(String),
            next_week_goal: {
                title: String(parsed.next_week_goal.title),
                target: String(parsed.next_week_goal.target),
            },
        };
    } catch (err) {
        console.error('[validateInsights] JSON parse failed:', err);
        return FALLBACK_RESPONSE;
    }
}

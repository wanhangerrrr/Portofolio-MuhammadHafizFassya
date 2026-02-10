export interface MetricsPayload {
    coding_time_7d: number;
    active_days_7d: number;
    top_languages_7d: { name: string; percent: number }[];
    projects_touched_7d: { name: string; hours: number }[];
    week_over_week_delta?: {
        coding_time_change_percent?: number;
        active_days_change?: number;
    };
}

export interface InsightsRequest {
    track: 'data_engineer' | 'fullstack' | 'ml_engineer';
    range: '7d' | '30d';
    metrics: MetricsPayload;
}

export interface InsightsResponse {
    summary: string;
    focus: string;
    recommendations: string[];
    alerts: string[];
    next_week_goal: { title: string; target: string };
}

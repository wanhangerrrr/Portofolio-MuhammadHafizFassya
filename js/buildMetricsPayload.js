/**
 * buildMetricsPayload.js
 * Builds the metrics payload for the AI insights API.
 * Uses mock data by default — replace with real data when available.
 */

/**
 * @param {object} [overrides] — pass real data to override mocks
 * @returns {object} metrics payload
 */
function buildMetricsPayload(overrides = {}) {
    // [MOCK] Default mock data — replace with real metrics when available
    const defaults = {
        coding_time_7d: 14,          // [MOCK] hours
        active_days_7d: 5,           // [MOCK] days
        top_languages_7d: [          // [MOCK]
            { name: 'Python', percent: 40 },
            { name: 'JavaScript', percent: 30 },
            { name: 'HTML/CSS', percent: 20 },
            { name: 'SQL', percent: 10 },
        ],
        projects_touched_7d: [       // [MOCK]
            { name: 'Portfolio Website', hours: 5 },
            { name: 'ML Classification', hours: 4 },
            { name: 'Data Pipeline', hours: 3 },
            { name: 'API Server', hours: 2 },
        ],
        week_over_week_delta: {      // [MOCK]
            coding_time_change_percent: 12,
            active_days_change: 1,
        },
    };

    return {
        coding_time_7d: overrides.coding_time_7d ?? defaults.coding_time_7d,
        active_days_7d: overrides.active_days_7d ?? defaults.active_days_7d,
        top_languages_7d: overrides.top_languages_7d ?? defaults.top_languages_7d,
        projects_touched_7d: overrides.projects_touched_7d ?? defaults.projects_touched_7d,
        week_over_week_delta: overrides.week_over_week_delta ?? defaults.week_over_week_delta,
    };
}

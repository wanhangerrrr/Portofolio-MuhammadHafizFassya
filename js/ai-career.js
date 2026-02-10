/**
 * ai-career.js
 * Frontend logic for the AI Career Advisor page.
 * - Calls API_BASE + /api/ai-insights
 * - 30-second button lockout with countdown
 * - Stores results in localStorage keyed by track+range
 * - Handles loading/error/empty states
 */

(function () {
    'use strict';

    // ── Config ──
    const API_BASE = 'http://localhost:5174';
    const LOCKOUT_SECONDS = 30;
    const LS_PREFIX = 'ai_career_';

    // ── DOM Refs ──
    const rangeBtns = document.querySelectorAll('.range-btn');
    const generateBtn = document.getElementById('generateBtn');
    const btnLabel = document.getElementById('btnLabel');
    const btnCountdown = document.getElementById('btnCountdown');
    const insightsPanel = document.getElementById('insightsPanel');
    const lastGeneratedEl = document.getElementById('lastGenerated');
    const accordionToggle = document.getElementById('accordionToggle');
    const accordionContent = document.getElementById('accordionContent');

    let selectedRange = '7d';
    let lockoutTimer = null;

    // ── Init ──
    function init() {
        // Load cached result if available
        loadCachedResult();

        // Range toggle
        rangeBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                rangeBtns.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                selectedRange = btn.dataset.range;
                loadCachedResult();
            });
        });

        // Generate button
        generateBtn.addEventListener('click', handleGenerate);

        // Mobile accordion
        if (accordionToggle) {
            accordionToggle.addEventListener('click', () => {
                accordionToggle.classList.toggle('open');
                accordionContent.classList.toggle('open');
            });
        }
    }

    // ── Cache key ──
    function getCacheKey() {
        return LS_PREFIX + selectedRange;
    }

    // ── Load cached result ──
    function loadCachedResult() {
        try {
            const raw = localStorage.getItem(getCacheKey());
            if (raw) {
                const cached = JSON.parse(raw);
                renderInsights(cached.data);
                updateLastGenerated(cached.timestamp);
                return;
            }
        } catch (e) {
            // ignore
        }
        renderEmpty();
    }

    // ── Save to cache ──
    function saveToCache(data) {
        const payload = {
            data: data,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem(getCacheKey(), JSON.stringify(payload));
        updateLastGenerated(payload.timestamp);
    }

    // ── Update last generated ──
    function updateLastGenerated(isoString) {
        if (!isoString) {
            lastGeneratedEl.textContent = '';
            return;
        }
        const d = new Date(isoString);
        const fmt = d.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        lastGeneratedEl.textContent = 'Terakhir di-generate: ' + fmt;
    }

    // ── Handle Generate ──
    async function handleGenerate() {
        if (generateBtn.disabled) return;

        const metrics = buildMetricsPayload();

        const body = {
            range: selectedRange,
            metrics: metrics,
        };

        // Show loading state
        renderLoading();
        startLockout();

        try {
            const res = await fetch(API_BASE + '/api/ai-insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.status === 429) {
                const err = await res.json();
                renderError('Rate limit tercapai. ' + (err.message || 'Coba lagi nanti.'));
                return;
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const errMsg = err.message || 'Gagal menghasilkan insights.';
                const errDetail = err.details ? `\nDetail: ${err.details}` : ` Status: ${res.status}`;
                renderError(errMsg + errDetail);
                return;
            }

            const data = await res.json();
            renderInsights(data);
            saveToCache(data);
        } catch (err) {
            console.error('[ai-career] Fetch error:', err);
            renderError('Tidak dapat terhubung ke server. Pastikan server berjalan di ' + API_BASE);
        }
    }

    // ── Lockout ──
    function startLockout() {
        generateBtn.disabled = true;
        let remaining = LOCKOUT_SECONDS;
        btnLabel.textContent = 'Tunggu';
        btnCountdown.textContent = remaining + 's';

        lockoutTimer = setInterval(() => {
            remaining--;
            btnCountdown.textContent = remaining + 's';
            if (remaining <= 0) {
                clearInterval(lockoutTimer);
                lockoutTimer = null;
                generateBtn.disabled = false;
                btnLabel.textContent = 'Generate Insights';
                btnCountdown.textContent = '';
            }
        }, 1000);
    }

    // ── Render: Insights ──
    function renderInsights(data) {
        if (!data || !data.summary) {
            renderEmpty();
            return;
        }

        let html = '';

        // Summary
        html += '<div class="insight-section">';
        html += '  <div class="insight-label">📊 Ringkasan</div>';
        html += '  <div class="insight-text">' + escapeHtml(data.summary) + '</div>';
        html += '</div>';

        // Focus
        html += '<div class="insight-section">';
        html += '  <div class="insight-label">🎯 Fokus Utama</div>';
        html += '  <div class="insight-text">' + escapeHtml(data.focus) + '</div>';
        html += '</div>';

        // Recommendations
        if (data.recommendations && data.recommendations.length > 0) {
            html += '<div class="insight-section">';
            html += '  <div class="insight-label">💡 Rekomendasi</div>';
            html += '  <ul class="rec-list">';
            data.recommendations.forEach((rec, i) => {
                html += '    <li data-index="' + (i + 1) + '">' + escapeHtml(rec) + '</li>';
            });
            html += '  </ul>';
            html += '</div>';
        }

        // Alerts
        if (data.alerts && data.alerts.length > 0) {
            html += '<div class="insight-section">';
            html += '  <div class="insight-label">⚠️ Peringatan</div>';
            data.alerts.forEach((alert) => {
                html += '  <div class="alert-item">' + escapeHtml(alert) + '</div>';
            });
            html += '</div>';
        }

        // Next Week Goal
        if (data.next_week_goal) {
            html += '<div class="insight-section">';
            html += '  <div class="insight-label">🏁 Goal Minggu Depan</div>';
            html += '  <div class="goal-card">';
            html += '    <div class="goal-title">' + escapeHtml(data.next_week_goal.title) + '</div>';
            html += '    <div class="goal-target">' + escapeHtml(data.next_week_goal.target) + '</div>';
            html += '  </div>';
            html += '</div>';
        }

        insightsPanel.innerHTML = html;
    }

    // ── Render: Loading Skeleton ──
    function renderLoading() {
        let html = '';
        for (let i = 0; i < 3; i++) {
            html += '<div class="insight-section">';
            html += '  <div class="skeleton skeleton-line short"></div>';
            html += '  <div class="skeleton skeleton-line long"></div>';
            html += '  <div class="skeleton skeleton-line medium"></div>';
            html += '</div>';
        }
        html += '<div class="skeleton skeleton-block"></div>';
        html += '<div class="skeleton skeleton-block"></div>';
        insightsPanel.innerHTML = html;
    }

    // ── Render: Error ──
    function renderError(message) {
        const html =
            '<div class="cyber-error">' +
            '  <div class="error-icon">⚡</div>' +
            '  <h3>Terjadi Kesalahan</h3>' +
            '  <p>' + escapeHtml(message) + '</p>' +
            '  <button class="cyber-btn-generate" style="width: auto; padding: 10px 24px;" onclick="document.getElementById(\'generateBtn\').click()">↻ Coba Lagi</button>' +
            '</div>';
        insightsPanel.innerHTML = html;
    }

    // ── Render: Empty ──
    function renderEmpty() {
        const html =
            '<div class="cyber-empty">' +
            '  <div class="empty-icon"></div>' +
            '  <h3>Siap Menganalisis</h3>' +
            '  <p>Klik "Generate Insights" untuk mendapatkan Aktivitas Muhammad Hafiz Fassya</p>' +
            '</div>';
        insightsPanel.innerHTML = html;
    }

    // ── Escape HTML ──
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ── Run ──
    document.addEventListener('DOMContentLoaded', init);
})();

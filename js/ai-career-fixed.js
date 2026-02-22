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
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_BASE = isLocal ? 'http://localhost:5174' : window.location.origin;
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

        // Note: No longer building metrics payload since we use static JSON
        // const metrics = buildMetricsPayload();

        // Show loading state
        renderLoading();
        startLockout();

        try {
            // Random delay to simulate processing (optional, makes it feel like "thinking")
            await new Promise(r => setTimeout(r, 1500));

            // Fetch static JSON based on selected range
            const filename = selectedRange === '30d' ? 'data/insights_30d.json' : 'data/insights_7d.json';
            const res = await fetch(filename);

            if (!res.ok) {
                throw new Error(`Gagal memuat data (${res.status})`);
            }

            const data = await res.json();
            renderInsights(data);
            saveToCache(data);
        } catch (err) {
            console.error('[ai-career] Fetch error:', err);
            renderError('Gagal memuat insights. Pastikan file data tersedia.');
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
        if (!data) {
            renderEmpty();
            return;
        }

        let html = '';

        // Summary
        if (data.summary) {
            html += '<div class="insight-section">';
            html += '  <div class="insight-label">📊 Ringkasan</div>';
            html += '  <div class="insight-text">' + escapeHtml(data.summary) + '</div>';
            html += '</div>';
        }

        // Highlights (Mapped to Focus/Highlights section)
        if (data.highlights && data.highlights.length > 0) {
            html += '<div class="insight-section">';
            html += '  <div class="insight-label">✨ Highlights</div>';
            html += '  <ul class="rec-list">';
            data.highlights.forEach((item, i) => {
                html += '    <li data-index="' + (i + 1) + '">' + escapeHtml(item) + '</li>';
            });
            html += '  </ul>';
            html += '</div>';
        }

        // Top Topics (Optional extra section)
        if (data.topTopics && data.topTopics.length > 0) {
            html += '<div class="insight-section">';
            html += '  <div class="insight-label">🏷️ Top Topics</div>';
            html += '  <div class="insight-text">';
            html += data.topTopics.map(t => `<span class="tag" style="display:inline-block; background:rgba(0,255,136,0.1); color:#00ff88; padding:2px 8px; border-radius:4px; margin-right:4px;">${escapeHtml(t.topic)} (${t.count})</span>`).join(' ');
            html += '  </div>';
            html += '</div>';
        }

        // Notes (Mapped to Alerts)
        if (data.notes && data.notes.length > 0) {
            html += '<div class="insight-section">';
            html += '  <div class="insight-label">📝 Notes</div>';
            data.notes.forEach((note) => {
                html += '  <div class="alert-item">' + escapeHtml(note) + '</div>';
            });
            html += '</div>';
        }

        insightsPanel.innerHTML = html;

        // Update Quick Stats if available
        if (data.quickStats) {
            updateQuickStats(data.quickStats, data.reposTouched);
        }
    }

    // ── Update Quick Stats ──
    function updateQuickStats(stats, repos) {
        const statsGrid = document.querySelector('.stats-grid');
        if (!statsGrid) return;

        const updateCard = (labelSearch, newValue, newLabel) => {
            const items = statsGrid.querySelectorAll('.stat-item');
            for (let item of items) {
                const labelEl = item.querySelector('.stat-label');
                if (labelEl && labelEl.textContent.trim() === labelSearch) {
                    item.querySelector('.stat-value').textContent = newValue;
                    if (newLabel) labelEl.textContent = newLabel;
                    break;
                }
            }
        };

        // Coding Time -> Total Events (Estimation)
        updateCard('Coding Time', stats.eventsCount, 'Total Events');

        // Active Days -> Pushes
        updateCard('Active Days', stats.pushes, 'Total Pushes');

        // Languages -> PRs + Issues
        updateCard('Languages', stats.pullRequests + stats.issues, 'PRs & Issues');

        // Projects -> Repos count
        const repoCount = repos ? repos.length : 0;
        updateCard('Projects', repoCount, 'Repos Touched');
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

import type { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
    timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

const MAX_REQUESTS = 10;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function cleanOldEntries(entry: RateLimitEntry, now: number): void {
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
}

export function rateLimit(req: Request, res: Response, next: NextFunction): void {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    let entry = store.get(ip);
    if (!entry) {
        entry = { timestamps: [] };
        store.set(ip, entry);
    }

    cleanOldEntries(entry, now);

    if (entry.timestamps.length >= MAX_REQUESTS) {
        const oldestInWindow = entry.timestamps[0];
        const retryAfterMs = WINDOW_MS - (now - oldestInWindow);
        const retryAfterSec = Math.ceil(retryAfterMs / 1000);

        res.status(429).json({
            error: 'Too many requests',
            message: `Rate limit exceeded. Try again in ${retryAfterSec} seconds.`,
            retryAfter: retryAfterSec,
        });
        return;
    }

    entry.timestamps.push(now);
    next();
}

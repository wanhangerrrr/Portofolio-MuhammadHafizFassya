import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import aiInsightsRouter from './routes/aiInsights.js';

const app = express();
const PORT = parseInt(process.env.PORT || '5174', 10);

// Middleware
app.use(cors({
    origin: true, // allow all origins in dev
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Log all requests
app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
    next();
});

// Health check
app.get('/api/health', (_req: express.Request, res: express.Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/ai-insights', aiInsightsRouter);

// Start
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`   LLM Provider: ${process.env.LLM_PROVIDER || 'gemini'}`);
    console.log(`   Rate limit: 5 requests per 10 minutes per IP`);
});

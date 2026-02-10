import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import aiInsightsRouter from '../server/routes/aiInsights.js';

const app = express();
const PORT = parseInt(process.env.PORT || '5174', 10);

// Middleware
app.use(cors({
    origin: true, // allow all origins in dev
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Health check
app.get('/api/health', (_req: express.Request, res: express.Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/ai-insights', aiInsightsRouter);

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log(`   LLM Provider: ${process.env.LLM_PROVIDER || 'openai'}`);
        console.log(`   Rate limit: 5 requests per 10 minutes per IP`);
    });
}

export default app;

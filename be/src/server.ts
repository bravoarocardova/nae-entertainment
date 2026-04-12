import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb, getAllSongs, getSongsPaginated, getRandomSong } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());

// Init SQLite DB
initDb();

// ─── API Key Middleware ────────────────────────────────────────────────────────
// Checks header:  x-api-key: <key>
function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
    if (!API_KEY) {
        // No key configured → skip guard (dev convenience)
        return next();
    }

    const provided = (req.headers['x-api-key'] as string);

    if (!provided) {
        return res.status(401).json({ error: 'Unauthorized: API key required in headers' });
    }
    if (provided !== API_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }

    next();
}


// Serve static assets from separate public/ directories (PROTECTED)
app.use('/tracks', apiKeyAuth, express.static(path.join(__dirname, '../public/tracks')));
app.use('/lyrics', apiKeyAuth, express.static(path.join(__dirname, '../public/lyrics')));
app.use('/thumbnails', apiKeyAuth, express.static(path.join(__dirname, '../public/thumbnails')));


// ─── Protected Routes ─────────────────────────────────────────────────────────

// GET /api/songs/random    → pick one random track (scalable shuffle)
app.get('/api/songs/random', apiKeyAuth, (req: Request, res: Response) => {
    getRandomSong((err, song) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(song);
    });
});

// GET /api/songs          → all songs (relative path metadata)
// GET /api/songs?page=1&limit=8 → paginated response
app.get('/api/songs', apiKeyAuth, (req: Request, res: Response) => {
    const { page, limit } = req.query;

    if (page !== undefined || limit !== undefined) {
        const pageNum = Math.max(1, parseInt(page as string) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 8));
        const searchTerm = req.query.search as string;

        getSongsPaginated(pageNum, limitNum, searchTerm, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(result);
        });
    } else {
        getAllSongs((err, songs) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(songs);
        });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on ${BASE_URL}`);
    console.log(`API key protection: ${API_KEY ? 'ENABLED' : 'DISABLED (no API_KEY set)'}`);
});

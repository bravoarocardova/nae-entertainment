import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { musicDatabase } from './seeder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../data/music.db');
const db = new (sqlite3.verbose()).Database(dbPath);

export interface SongData {
    id: string;
    title: string;
    artist: string;
    publisher: string;
    album: string;
    genre: string;
    thumbnail: string;
    url: string;
    lyric: string;
    year?: number;
    duration?: string;
    bpm?: number;
}

export function initDb() {
    db.serialize(() => {
        const isProd = process.env.NODE_ENV === 'production';

        if (!isProd) {
            // Force refresh database structure and data during dev
            db.run("DROP TABLE IF EXISTS songs");
        }
        
        db.run(`CREATE TABLE IF NOT EXISTS songs (
            id TEXT PRIMARY KEY,
            title TEXT,
            artist TEXT,
            publisher TEXT,
            album TEXT,
            genre TEXT,
            thumbnail TEXT,
            url TEXT,
            lyric TEXT,
            year INTEGER,
            duration TEXT,
            bpm INTEGER
        )`, () => {
            // Ensure we never overwrite a database that already has data in production
            db.get("SELECT COUNT(*) AS count FROM songs", (err, row: { count: number }) => {
                if (!err && row && row.count === 0) {
                    console.log("Database empty. Seeding fresh music database...");
                    const stmt = db.prepare("INSERT INTO songs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    for (const song of musicDatabase) {
                        stmt.run(
                            song.id,
                            song.title,
                            song.artist,
                            song.publisher,
                            song.album,
                            song.genre,
                            song.thumbnail,
                            song.url,
                            song.lyric,
                            song.year || null,
                            song.duration || null,
                            song.bpm || null
                        );
                    }
                    stmt.finalize();
                    console.log("Seeding completed.");
                } else if (!err) {
                    console.log(`Database check passed. Preserved ${row.count} existing songs. Skipped seeding.`);
                }
            });
        });
    });
}

export function getAllSongs(callback: (err: Error | null, songs: SongData[] | null) => void) {
    db.all("SELECT * FROM songs", (err, rows: SongData[]) => {
        if (err) return callback(err, null);
        const songs = rows.map(row => ({
            ...row,
            url: row.url ? `/tracks/${row.url}` : '',
            lyric: row.lyric ? `/lyrics/${row.lyric}` : '',
            thumbnail: row.thumbnail ? (row.thumbnail.startsWith('http') ? row.thumbnail : `/thumbnails/${row.thumbnail}`) : ''
        }));
        callback(null, songs);
    });
}

export interface PaginatedResult {
    songs: SongData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function getSongsPaginated(page: number, limit: number, search: string | undefined, callback: (err: Error | null, result: PaginatedResult | null) => void) {
    const offset = (page - 1) * limit;
    let countSql = "SELECT COUNT(*) AS total FROM songs";
    let dataSql = "SELECT * FROM songs";
    const params: any[] = [];

    if (search) {
        const searchPattern = `%${search}%`;
        const whereClause = " WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?";
        countSql += whereClause;
        dataSql += whereClause;
        params.push(searchPattern, searchPattern, searchPattern);
    }

    dataSql += " LIMIT ? OFFSET ?";
    const dataParams = [...params, limit, offset];

    db.get(countSql, params, (err, countRow: { total: number }) => {
        if (err) return callback(err, null);
        const total = countRow.total;
        db.all(dataSql, dataParams, (err2, rows: SongData[]) => {
            if (err2) return callback(err2 as Error, null);
            const songs = rows.map(row => ({
                ...row,
                url: row.url ? `/tracks/${row.url}` : '',
                lyric: row.lyric ? `/lyrics/${row.lyric}` : '',
                thumbnail: row.thumbnail ? (row.thumbnail.startsWith('http') ? row.thumbnail : `/thumbnails/${row.thumbnail}`) : ''
            }));
            callback(null, { songs, total, page, limit, totalPages: Math.ceil(total / limit) });
        });
    });
}

export function getRandomSong(callback: (err: Error | null, song: SongData | null) => void) {
    db.get("SELECT * FROM songs ORDER BY RANDOM() LIMIT 1", (err, row: SongData) => {
        if (err) return callback(err, null);
        if (!row) return callback(null, null);
        const song = {
            ...row,
            url: row.url ? `/tracks/${row.url}` : '',
            lyric: row.lyric ? `/lyrics/${row.lyric}` : '',
            thumbnail: row.thumbnail ? (row.thumbnail.startsWith('http') ? row.thumbnail : `/thumbnails/${row.thumbnail}`) : ''
        };
        callback(null, song);
    });
}

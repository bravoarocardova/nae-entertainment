import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../music.db');
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

const musicDatabase: SongData[] = [
    {
        id: "nae-1",
        title: "Cinta Di Layar",
        artist: "NAE Artists",
        publisher: "NAE Entertainment",
        album: "Virtual Love",
        genre: "Pop Indie",
        thumbnail: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=2070",
        url: "Cinta Di Layar.mp3",
        lyric: "Cinta Di Layar.lrc",
        year: 2026,
        duration: "03:45",
        bpm: 120
    },
    {
        id: "nae-2",
        title: "Cinta di Layar (Alt Version)",
        artist: "NAE Group",
        publisher: "NAE Entertainment",
        album: "Virtual Love",
        genre: "Acoustic Pop",
        thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1974",
        url: "Cinta di Layar (1).mp3",
        lyric: "Cinta di Layar (1).lrc",
        year: 2026,
        duration: "03:15",
        bpm: 95
    },
    {
        id: "nae-3",
        title: "Gadis Manis Banten",
        artist: "NAE Voice",
        publisher: "NAE Records",
        album: "Nusantara Vibes",
        genre: "Pop Daerah",
        thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2070",
        url: "Gadis Manis Banten.mp3",
        lyric: "Gadis Manis Banten.lrc",
        year: 2023,
        duration: "04:10",
        bpm: 110
    },
    {
        id: "nae-4",
        title: "Level Roblox, Hati Real Life",
        artist: "NAE Gamers",
        publisher: "NAE Entertainment",
        album: "Digital Heartbeat",
        genre: "Pop Elektronik",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071",
        url: "Level Roblox, Hati Real Life.mp3",
        lyric: "Level Roblox, Hati Real Life.lrc",
        year: 2025,
        duration: "02:50",
        bpm: 128
    },
    {
        id: "nae-5",
        title: "R R Apa Rosi",
        artist: "NAE Beat",
        publisher: "NAE Studio",
        album: "Mystery EP",
        genre: "R&B / Hip-Hop",
        thumbnail: "https://images.unsplash.com/photo-1493225457124-a1a2a5956093?auto=format&fit=crop&q=80&w=2070",
        url: "R R Apa Rosi.mp3",
        lyric: "R R Apa Rosi.lrc",
        year: 2026,
        duration: "03:30",
        bpm: 85
    },
    {
        id: "nae-6",
        title: "Malam Di Jakarta",
        artist: "NAE Midnight",
        publisher: "NAE Entertainment",
        album: "City Lights",
        genre: "Lo-Fi Pop",
        thumbnail: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=2070",
        url: "sample.mp3",
        lyric: "sample.lrc",
        year: 2024,
        duration: "02:45",
        bpm: 88
    },
    {
        id: "nae-7",
        title: "Semangat Juang",
        artist: "NAE Rockers",
        publisher: "NAE Records",
        album: "Victory",
        genre: "Modern Rock",
        thumbnail: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=2070",
        url: "sample.mp3",
        lyric: "sample.lrc",
        year: 2022,
        duration: "03:20",
        bpm: 145
    },
    {
        id: "nae-8",
        title: "Tarian Hujan",
        artist: "NAE Folk",
        publisher: "NAE Entertainment",
        album: "Nature's Soul",
        genre: "Folk / Acoustic",
        thumbnail: "https://images.unsplash.com/photo-1534330207526-8e81f10ec6fe?auto=format&fit=crop&q=80&w=2070",
        url: "sample.mp3",
        lyric: "sample.lrc",
        year: 2025,
        duration: "04:05",
        bpm: 105
    },
    {
        id: "nae-9",
        title: "Cyberpunk NAE",
        artist: "NAE Synth",
        publisher: "NAE Studio",
        album: "Neon Future",
        genre: "Synthwave",
        thumbnail: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=2070",
        url: "sample.mp3",
        lyric: "sample.lrc",
        year: 2026,
        duration: "03:50",
        bpm: 110
    },
    {
        id: "nae-10",
        title: "Kopi Sore",
        artist: "NAE Chill",
        publisher: "NAE Entertainment",
        album: "Relax Mode",
        genre: "Jazz / Chill",
        thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2070",
        url: "sample.mp3",
        lyric: "sample.lrc",
        year: 2024,
        duration: "03:10",
        bpm: 75
    },
    {
        id: "nae-11",
        title: "Langkah Digital",
        artist: "NAE Tech",
        publisher: "NAE Records",
        album: "System Ready",
        genre: "EDM",
        thumbnail: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=2070",
        url: "sample.mp3",
        lyric: "sample.lrc",
        year: 2023,
        duration: "03:35",
        bpm: 128
    },
    {
        id: "nae-12",
        title: "Harapan Baru",
        artist: "NAE Piano",
        publisher: "NAE Entertainment",
        album: "Serenity",
        genre: "Classical / Cinematic",
        thumbnail: "https://images.unsplash.com/photo-1520529615916-af4c6821957c?auto=format&fit=crop&q=80&w=2070",
        url: "sample.mp3",
        lyric: "sample.lrc",
        year: 2026,
        duration: "02:15",
        bpm: 65
    },
    {
        id: "nae-13",
        title: "Pesta Pantai",
        artist: "NAE Tropical",
        publisher: "NAE Studio",
        album: "Summer Hits",
        genre: "Tropical House",
        thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2073",
        url: "sample.mp3",
        lyric: "sample.lrc",
        year: 2025,
        duration: "03:40",
        bpm: 115
    },
    {
        id: "nae-14",
        title: "Hutan Rahasia",
        artist: "NAE Ambient",
        publisher: "NAE Entertainment",
        album: "Deep Forest",
        genre: "Ambient",
        thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2071",
        url: "sample.mp3",
        lyric: "sample.lrc",
        year: 2022,
        duration: "05:00",
        bpm: 90
    },
    {
        id: "nae-15",
        title: "Rap Arena",
        artist: "NAE Flows",
        publisher: "NAE Records",
        album: "Street Knowledge",
        genre: "Hip-Hop",
        thumbnail: "https://images.unsplash.com/photo-1516280440502-c2b647fdbdc5?auto=format&fit=crop&q=80&w=2070",
        url: "sample.mp3",
        lyric: "sample.lrc",
        year: 2026,
        duration: "02:55",
        bpm: 92
    },
    {
        id: "nae-16",
        title: "Cinta Terakhir",
        artist: "NAE Soul",
        publisher: "NAE Entertainment",
        album: "Eternal Love",
        genre: "Ballad",
        thumbnail: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&q=80&w=1974",
        url: "sample.mp3",
        lyric: "sample.lrc",
        year: 2024,
        duration: "04:30",
        bpm: 72
    }
];

export function initDb() {
    db.serialize(() => {
        // Automatically refresh database structure and data during dev
        db.run("DROP TABLE IF EXISTS songs");
        
        db.run(`CREATE TABLE songs (
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
        )`);

        console.log("Seeding fresh music database...");
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

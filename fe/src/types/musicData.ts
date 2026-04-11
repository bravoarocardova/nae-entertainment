export interface SongData {
    id: string;          // Unique Identifier
    title: string;       // Song Title
    artist: string;      // Artist Name
    publisher: string;   // Record Label / Publisher
    album: string;       // Album Title
    genre: string;       // Music Genre
    thumbnail: string;   // Cover Image URL
    url: string;         // Relative MP3 path (e.g. "/music/song.mp3")
    lyric: string;       // Relative LRC path (e.g. "/music/song.lrc")
    year?: number;       // Release Year
    duration?: string;   // Duration MM:SS
    bpm?: number;        // Beats Per Minute
}

export interface PaginatedSongs {
    songs: SongData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

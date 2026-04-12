import { createContext, useContext, useState, ReactNode } from 'react';
import { apiClient } from '../config/api';
import type { SongData, PaginatedSongs } from '../types/musicData';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface MusicContextType {
    activeTrack: SongData | null;
    userQueue: SongData[];
    toastMessage: string;
    musicDatabase: SongData[];
    autoplayToken: number;
    playTrack: (track: SongData) => void;
    addToQueue: (track: SongData) => void;
    removeFromQueue: (index: number) => void;
    clearQueue: () => void;
    nextTrack: (isShuffle: boolean) => Promise<void>;
    prevTrack: (isShuffle: boolean) => Promise<void>;
    setContextPlaylist: (songs: SongData[], page: number, totalPages: number, search: string, limit: number) => void;
    playlistMeta: { page: number; totalPages: number; search: string; limit: number };
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
    // useState: cleared on every refresh (no persistence across page loads)
    const [activeTrack, setActiveTrack] = useState<SongData | null>(null);
    // localStorage: persists across sessions (user preferences)
    const [userQueue, setUserQueue] = useLocalStorage<SongData[]>('nae-user-queue', []);
    const [toastMessage, setToastMessage] = useState('');

    // Persistent fallback playlist
    const [musicDatabase, setMusicDatabase] = useState<SongData[]>([]);
    const [playlistMeta, setPlaylistMeta] = useState({ page: 1, totalPages: 1, search: '', limit: 8 });
    const [autoplayToken, setAutoplayToken] = useState(0);

    const setContextPlaylist = (songs: SongData[], page: number, totalPages: number, search: string, limit: number) => {
        setMusicDatabase(songs);
        setPlaylistMeta({ page, totalPages, search, limit });
    };

    const bumpAutoplay = () => setAutoplayToken(t => t + 1);

    const playTrack = (track: SongData) => {
        setActiveTrack(track);
        bumpAutoplay();
    };

    const addToQueue = (track: SongData) => {
        setUserQueue(prev => [...prev, track]);
        setToastMessage(`Dimasukkan ke antrian: ${track.title}`);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const removeFromQueue = (index: number) =>
        setUserQueue(prev => prev.filter((_, i) => i !== index));

    const clearQueue = () => setUserQueue([]);

    const nextTrack = async (isShuffle: boolean) => {
        if (userQueue.length > 0) {
            const [next, ...rest] = userQueue;
            setUserQueue(rest);
            setActiveTrack(next);
            bumpAutoplay();
        } else if (activeTrack) {
            if (isShuffle) {
                // Best Practice: Fetch random song from server for infinite scalability
                try {
                    const res = await apiClient.get<SongData>('/api/songs/random');
                    setActiveTrack(res.data);
                } catch (err) {
                    console.error('Shuffle failed:', err);
                }
            } else if (musicDatabase.length > 0) {
                const currentIdx = musicDatabase.findIndex(t => t.url === activeTrack.url);
                if (currentIdx === musicDatabase.length - 1) {
                    if (playlistMeta.search) {
                        // The user finished pushing through a filtered Search list.
                        // As requested, instead of dropping to Page 1 of the global list,
                        // we automatically enter an infinite Random Radio mode by fetching a random track!
                        try {
                            const res = await apiClient.get<SongData>('/api/songs/random');
                            // Replace the playlist entirely with this single random track to ensure
                            // that when it ends, it hits this boundary condition again naturally.
                            setMusicDatabase([res.data]);
                            setActiveTrack(res.data);
                        } catch (err) {
                            console.error('Seamless random track failed:', err);
                            setActiveTrack(musicDatabase[0]);
                        }
                    } else {
                        // Standard Unfiltered Sequential playback — grab the next exact chunk.
                        const nextPage = playlistMeta.page < playlistMeta.totalPages ? playlistMeta.page + 1 : 1;
                        try {
                            const res = await apiClient.get<PaginatedSongs>('/api/songs', {
                                params: { page: nextPage, limit: playlistMeta.limit }
                            });
                            setMusicDatabase(res.data.songs);
                            setPlaylistMeta(prev => ({ ...prev, page: nextPage }));
                            setActiveTrack(res.data.songs[0]);
                        } catch (err) {
                            console.error('Seamless next page failed:', err);
                            setActiveTrack(musicDatabase[0]); // fallback loops current
                        }
                    }
                } else {
                    setActiveTrack(musicDatabase[currentIdx + 1]);
                }
            }
            bumpAutoplay();
        }
    };

    const prevTrack = async (isShuffle: boolean) => {
        if (activeTrack) {
            if (isShuffle) {
                // Same as next for shuffle
                try {
                    const res = await apiClient.get<SongData>('/api/songs/random');
                    setActiveTrack(res.data);
                } catch (err) {
                    console.error('Shuffle failed:', err);
                }
            } else if (musicDatabase.length > 0) {
                const currentIdx = musicDatabase.findIndex(t => t.url === activeTrack.url);
                setActiveTrack(musicDatabase[(currentIdx - 1 + musicDatabase.length) % musicDatabase.length]);
            }
            bumpAutoplay();
        }
    };

    return (
        <MusicContext.Provider value={{
            activeTrack, userQueue, toastMessage, musicDatabase,
            autoplayToken, playlistMeta,
            playTrack, addToQueue, removeFromQueue, clearQueue, nextTrack, prevTrack, setContextPlaylist
        }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
}

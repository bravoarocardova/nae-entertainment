import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../config/api';
import type { SongData, PaginatedSongs } from '../types/musicData';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface MusicContextType {
    activeTrack: SongData | null;
    userQueue: SongData[];
    toastMessage: string;
    musicDatabase: SongData[];
    /** Monotonically-increasing counter. 0 = no user action yet. >0 = user explicitly picked a track. */
    autoplayToken: number;
    // Pagination
    currentPage: number;
    totalPages: number;
    isLoadingMusic: boolean;
    setPage: (page: number) => void;
    playTrack: (track: SongData) => void;
    addToQueue: (track: SongData) => void;
    removeFromQueue: (index: number) => void;
    clearQueue: () => void;
    nextTrack: (isShuffle: boolean) => void;
    prevTrack: (isShuffle: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
    // useState: cleared on every refresh (no persistence across page loads)
    const [activeTrack, setActiveTrack] = useState<SongData | null>(null);
    // localStorage: persists across sessions (user preferences)
    const [userQueue, setUserQueue] = useLocalStorage<SongData[]>('nae-user-queue', []);
    const [toastMessage, setToastMessage] = useState('');
    const [musicDatabase, setMusicDatabase] = useState<SongData[]>([]);
    const [autoplayToken, setAutoplayToken] = useState(0);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoadingMusic, setIsLoadingMusic] = useState(false);
    const PAGE_LIMIT = 8;

    // Fetch paginated songs whenever page changes
    useEffect(() => {
        setIsLoadingMusic(true);
        apiClient.get<PaginatedSongs>('/api/songs', { params: { page: currentPage, limit: PAGE_LIMIT } })
            .then(res => {
                setMusicDatabase(res.data.songs);
                setTotalPages(res.data.totalPages);
            })
            .catch(err => console.error('Error fetching songs:', err))
            .finally(() => setIsLoadingMusic(false));
    }, [currentPage]);

    const setPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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

    const nextTrack = (isShuffle: boolean) => {
        if (userQueue.length > 0) {
            const [next, ...rest] = userQueue;
            setUserQueue(rest);
            setActiveTrack(next);
        } else if (activeTrack && musicDatabase.length > 0) {
            const currentIdx = musicDatabase.findIndex(t => t.url === activeTrack.url);
            if (isShuffle) {
                setActiveTrack(musicDatabase[Math.floor(Math.random() * musicDatabase.length)]);
            } else {
                setActiveTrack(musicDatabase[(currentIdx + 1) % musicDatabase.length]);
            }
        }
        bumpAutoplay();
    };

    const prevTrack = (isShuffle: boolean) => {
        if (activeTrack && musicDatabase.length > 0) {
            const currentIdx = musicDatabase.findIndex(t => t.url === activeTrack.url);
            if (isShuffle) {
                setActiveTrack(musicDatabase[Math.floor(Math.random() * musicDatabase.length)]);
            } else {
                setActiveTrack(musicDatabase[(currentIdx - 1 + musicDatabase.length) % musicDatabase.length]);
            }
        }
        bumpAutoplay();
    };

    return (
        <MusicContext.Provider value={{
            activeTrack, userQueue, toastMessage, musicDatabase,
            autoplayToken,
            currentPage, totalPages, isLoadingMusic, setPage,
            playTrack, addToQueue, removeFromQueue, clearQueue, nextTrack, prevTrack,
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

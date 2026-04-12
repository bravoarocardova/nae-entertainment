import { useState, useEffect } from 'react';
import { Play, Search, ListPlus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMusic } from '../contexts/MusicContext';
import { SecureImage } from '../components/SecureAsset';
import { Button } from '@/components/ui/button';
import { apiClient, ENDPOINTS } from '../config/api';
import { SongData } from '@/types/musicData';

interface PaginatedSongs {
    songs: SongData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function MusicPage() {
    const { t } = useTranslation();
    const { playTrack, addToQueue } = useMusic();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<PaginatedSongs | null>(null);
    const [loading, setLoading] = useState(true);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get<PaginatedSongs>(ENDPOINTS.SONGS, {
                    params: {
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                        search: searchQuery || undefined
                    }
                });
                setPaginatedData(response.data);
            } catch (error) {
                console.error('Failed to fetch songs:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchData, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [currentPage, searchQuery]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const songs = paginatedData?.songs || [];
    const totalPages = paginatedData?.totalPages || 0;
    const totalItems = paginatedData?.total || 0;

    return (
        <div className="min-h-screen bg-background pt-32 pb-40 px-6 md:px-12">
            {/* Header section with refined typography */}
            <div className="max-w-7xl mx-auto mb-16 space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground inline-block bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent italic pe-2">
                    {t('music.title')}
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl font-bold max-w-2xl leading-relaxed">
                    {t('music.subtitle')}
                </p>

                {/* Search Bar with neon focus effect */}
                <div className="relative max-w-md mt-8 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-red-500" />
                    <input
                        type="text"
                        placeholder={t('common.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-secondary/30 border border-border rounded-2xl py-4 pl-12 pr-6 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 transition-all backdrop-blur-xl"
                    />
                </div>
            </div>

            {/* Song Grid with premium card design */}
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-red-600 to-transparent opacity-30"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">
                        {t('music.allSongs')} ({totalItems})
                    </span>
                    <div className="h-px w-20 bg-border/40"></div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">{t('common.loading')}</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 min-h-[400px] content-start">
                            {songs.map((track) => (
                                <div key={track.id} className="group relative bg-card/40 rounded-3xl p-4 border border-border hover:border-red-600/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(220,38,38,0.15)] flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 shadow-2xl">
                                        <SecureImage path={track.thumbnail} alt={track.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                                        {/* Premium Metadata Overlay Stickers */}
                                        <div className="absolute inset-0 p-3 pointer-events-none transition-all duration-500 group-hover:bg-black/20">
                                            {track.genre && (
                                                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                    <p className="text-[7px] font-black uppercase tracking-widest text-white">{track.genre}</p>
                                                </div>
                                            )}
                                            {track.year && (
                                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-xl opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                                    <p className="text-[8px] font-black text-white/90">{track.year}</p>
                                                </div>
                                            )}
                                            {track.bpm && (
                                                <div className="absolute bottom-3 left-3 flex flex-col items-start p-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                                    <span className="text-[6px] font-black uppercase tracking-tighter text-white/40">{t('player.bpm')}</span>
                                                    <p className="text-[8px] font-black text-white/90">{track.bpm}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Hover Play Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]">
                                            <button
                                                onClick={() => playTrack(track)}
                                                className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-500 hover:bg-red-700 active:scale-90 shadow-2xl"
                                            >
                                                <Play className="w-6 h-6 fill-current" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card Content with flexible spacing */}
                                    <div className="px-1 flex-grow">
                                        <h3 className="text-foreground font-black text-base md:text-lg tracking-tight truncate group-hover:text-red-500 transition-colors uppercase leading-tight mb-1">{track.title}</h3>
                                        <p className="text-muted-foreground text-[10px] md:text-xs font-black uppercase tracking-widest truncate">{track.artist}</p>
                                    </div>

                                    {/* Action Row */}
                                    <div className="mt-4 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity pt-4 border-t border-border/40">
                                        <button
                                            onClick={() => addToQueue(track)}
                                            className="p-2 hover:text-red-500 text-muted-foreground transition-colors tooltip flex items-center gap-2"
                                        >
                                            <ListPlus className="w-5 h-5" />
                                            <span className="text-[8px] font-black uppercase tracking-widest hidden lg:inline">{t('player.queue')}</span>
                                        </button>
                                        <span className="text-[9px] font-mono text-muted-foreground/60">{track.duration || "03:45"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {songs.length === 0 && (
                            <div className="text-center py-40 border-2 border-dashed border-border/40 rounded-[4rem]">
                                <Search className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                                <p className="text-muted-foreground font-black text-xl tracking-tighter uppercase italic">{t('music.noTracks')}</p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="rounded-2xl border border-border bg-secondary/30 hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-20 size-12"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </Button>

                                    <div className="flex items-center gap-2 bg-secondary/20 backdrop-blur-xl p-1.5 rounded-[2rem] border border-border">
                                        {[...Array(totalPages)].map((_, i) => {
                                            const page = i + 1;
                                            if (
                                                totalPages > 7 &&
                                                page !== 1 &&
                                                page !== totalPages &&
                                                Math.abs(page - currentPage) > 1
                                            ) {
                                                if (page === 2 || page === totalPages - 1) return <span key={page} className="text-muted-foreground px-2 font-black">...</span>;
                                                return null;
                                            }

                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "ghost"}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`rounded-full size-10 font-black text-xs transition-all duration-500 ${currentPage === page
                                                        ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-110'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                                        }`}
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="rounded-2xl border border-border bg-secondary/30 hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-20 size-12"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </Button>
                                </div>

                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                    {t('music.pageOf', { current: currentPage, total: totalPages })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

import { Play, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { SongData } from '../types/musicData';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMusic } from '../contexts/MusicContext';
import { SecureImage } from '../components/SecureAsset';

const MusicPage = () => {
    const { activeTrack, playTrack, addToQueue, musicDatabase, currentPage, totalPages, isLoadingMusic, setPage } = useMusic();

    const handleCardClick = (track: SongData) => {
        if (!activeTrack) {
            playTrack(track);
        } else {
            addToQueue(track);
        }
    };

    return (
        <section className="py-24 sm:py-32 px-4 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 sm:mb-20" data-aos="fade-up">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight px-2">OUR SOUND</h2>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">Discover the amazing tracks and original compositions that power our videos.</p>
                    <div className="h-1.5 w-16 sm:w-24 bg-red-600 mx-auto rounded-full mt-6"></div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-bold text-red-500 tracking-wider" data-aos="fade-right">LATEST RELEASES</h3>
                    {totalPages > 1 && (
                        <span className="text-sm text-muted-foreground">
                            Halaman {currentPage} dari {totalPages}
                        </span>
                    )}
                </div>

                {/* Track Grid/List */}
                {isLoadingMusic ? (
                    <div className="flex justify-center items-center py-32">
                        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                        {musicDatabase.map((track, index) => (
                            <div key={track.id} className="block outline-none" data-aos="fade-up" data-aos-delay={index * 50}>
                                {/* Mobile List Layout (Spotify Style) */}
                                <div className="sm:hidden">
                                   <div 
                                        onClick={() => handleCardClick(track)}
                                        className="py-2.5 flex items-center gap-4 cursor-pointer active:bg-accent/50 transition-colors rounded-lg px-2"
                                   >
                                        <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 bg-secondary shadow-lg">
                                            <SecureImage 
                                                path={track.thumbnail} 
                                                alt={track.title} 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className={`font-medium text-base truncate ${activeTrack?.id === track.id ? 'text-red-500' : 'text-foreground'}`}>
                                                {track.title}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-muted-foreground truncate flex items-center">
                                                    {track.artist} <span className="mx-1.5 opacity-30">•</span> {track.album}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Badge variant="outline" className="text-[9px] border-border text-muted-foreground py-0 px-1.5 uppercase font-medium">
                                                {track.genre}
                                            </Badge>
                                        </div>
                                   </div>
                                </div>

                                {/* Desktop Grid Layout */}
                                <div className="hidden sm:block h-full">
                                    <Card
                                        onClick={() => handleCardClick(track)}
                                        className="group bg-card/60 hover:bg-accent/40 border-none transition-all duration-500 overflow-hidden rounded-[1.5rem] shadow-none hover:shadow-2xl p-4 h-full flex flex-col cursor-pointer border border-transparent hover:border-red-600/20"
                                    >
                                        <div className="relative aspect-square rounded-[1rem] overflow-hidden shadow-2xl mb-4 bg-zinc-950 flex-shrink-0">
                                            <SecureImage 
                                                path={track.thumbnail} 
                                                alt={track.title} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                                            />
                                            
                                            {/* corner Metadata stickers */}
                                            <div className="absolute inset-0 p-3 pointer-events-none z-10">
                                                {/* Top Left: Genre */}
                                                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/5 shadow-lg">
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-white">{track.genre}</p>
                                                </div>

                                                {/* Top Right: Year */}
                                                {track.year && (
                                                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-white/5 shadow-lg">
                                                        <p className="text-[8px] font-black text-white/90">{track.year}</p>
                                                    </div>
                                                )}

                                                {/* Bottom Left: BPM */}
                                                {track.bpm && (
                                                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-white/5 shadow-lg flex items-center gap-1.5">
                                                        <span className="text-[6px] font-black uppercase tracking-tighter text-white/40">BPM</span>
                                                        <p className="text-[8px] font-black text-white/90">{track.bpm}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <div className="absolute bottom-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20 ease-out">
                                                <div className="bg-red-600 hover:bg-red-500 scale-100 group-hover:scale-110 transition-transform text-white p-4 rounded-full shadow-[0_10px_30_rgba(220,38,38,0.5)] flex items-center justify-center">
                                                    <Play className="w-6 h-6 fill-current translate-x-[1px]" />
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent className="p-0 flex-grow flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-black text-xl truncate text-foreground mb-1 group-hover:text-red-500 transition-colors tracking-tight">{track.title}</h4>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-80">{track.artist}</p>
                                                <p className="text-[10px] text-zinc-500 mt-2 truncate line-clamp-1 italic">{track.album}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && !isLoadingMusic && (
                    <div className="flex items-center justify-center gap-2 mt-12 pb-32">
                        <button
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium border border-border text-foreground"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Sebelumnya
                        </button>
 
                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setPage(page)}
                                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                                        page === currentPage
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                                            : 'bg-secondary hover:bg-accent text-muted-foreground border border-border'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
 
                        <button
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium border border-border text-foreground"
                        >
                            Selanjutnya
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Bottom padding when player is active */}
                {!totalPages || totalPages <= 1 && <div className="pb-32" />}
            </div>
        </section>
    );
};

export default MusicPage;

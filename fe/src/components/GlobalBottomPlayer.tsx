import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Mic2, ListMusic, Volume, Volume1, Volume2, VolumeX, Maximize2, X, ChevronDown, ListPlus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMusic } from '../contexts/MusicContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { apiClient } from '../config/api';
import { SecureImage, useSecureAsset } from './SecureAsset';


export default function GlobalBottomPlayer() {
    const { t } = useTranslation();
    const { activeTrack: track, userQueue, clearQueue, removeFromQueue, nextTrack, prevTrack, toastMessage, musicDatabase, autoplayToken } = useMusic();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lyricRefs = useRef<(HTMLParagraphElement | null)[]>([]);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffle, setIsShuffle] = useLocalStorage('nae-shuffle', false);
    const [isRepeat, setIsRepeat] = useLocalStorage('nae-repeat', false);
    const [volume, setVolume] = useLocalStorage('nae-volume', 1);
    const [prevVolume, setPrevVolume] = useState(1);

    // Sync volume to audio element when it changes
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    // Panel States
    const [showQueue, setShowQueue] = useState(false);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);
    const [isDraggingTime, setIsDraggingTime] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showLyrics, setShowLyrics] = useState(false);
    const [lyricsData, setLyricsData] = useState<{ time: number, text: string }[]>([{ time: 0, text: t('common.loading') }]);

    // Fetch secure audio URL
    const secureAudioSrc = useSecureAsset(track?.url);


    // Prevent Player from overlapping the Footer globally
    useEffect(() => {
        if (track) {
            document.body.style.paddingBottom = '6rem'; // Matches h-24
        } else {
            document.body.style.paddingBottom = '0px';
        }
        return () => {
            document.body.style.paddingBottom = '0px';
        };
    }, [track]);

    // Fetch lyrics whenever the track changes (always runs, even on restore from sessionStorage)
    useEffect(() => {
        if (!track) return;

        const fetchLyrics = async () => {
            try {
                // Determine lyric path: Use track.lyric if provided, otherwise fallback to replacing folder and extension
                let lrcPath = track.lyric;
                if (!lrcPath) {
                    // Fallback: Use the filename from url, swap tracks->lyrics and .mp3->.lrc
                    lrcPath = track.url.replace('/tracks/', '/lyrics/').replace('.mp3', '.lrc');
                }
                const response = await apiClient.get<string>(lrcPath, { responseType: 'text' });
                const text = response.data;
                const lines = text.split('\n');
                const parsedLyrics: { time: number, text: string }[] = [];

                lines.forEach(line => {
                    // Match multiple timestamps on a single line, e.g. [00:12.00][00:15.00] Lirik lagu
                    const matches = [...line.matchAll(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/g)];
                    if (matches.length > 0) {
                        const textContent = line.replace(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/g, '').trim();
                        if (textContent) {
                            matches.forEach(match => {
                                const minutes = parseInt(match[1]);
                                const seconds = parseInt(match[2]);
                                const msStr = match[3];
                                const ms = parseInt(msStr) * (msStr.length === 2 ? 10 : 1);
                                const time = (minutes * 60) + seconds + (ms / 1000);
                                parsedLyrics.push({ time, text: textContent });
                            });
                        }
                    }
                });

                parsedLyrics.sort((a, b) => a.time - b.time);

                if (parsedLyrics.length > 0) {
                    setLyricsData(parsedLyrics);
                    lyricRefs.current = new Array(parsedLyrics.length).fill(null);
                } else {
                    setLyricsData([{ time: 0, text: "Lirik kosong / Format gagal dibaca" }]);
                }
            } catch (error) {
                console.warn(error);
                setLyricsData([{ time: 0, text: "Lirik (.lrc) untuk lagu ini tidak tersedia" }]);
            }
        };

        fetchLyrics();
    }, [track?.url]);

    // Calculate Lyrics logic
    const currentLyricIndex = lyricsData.findIndex((lyric, index) => {
        const nextLyricTime = lyricsData[index + 1]?.time || Infinity;
        return currentTime >= lyric.time && currentTime < nextLyricTime;
    });

    // Auto-scroll lyrics
    useEffect(() => {
        if (currentLyricIndex !== -1 && lyricRefs.current[currentLyricIndex] && (isExpanded || showLyrics)) {
            lyricRefs.current[currentLyricIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [currentLyricIndex, isExpanded, showLyrics]);

    // Auto-play when user explicitly picks a track (autoplayToken > 0 = user action, not session restore)
    useEffect(() => {
        if (!track || autoplayToken === 0 || !secureAudioSrc) return;

        setIsPlaying(true);
        const timer = setTimeout(() => {
            if (audioRef.current && audioRef.current.src) {
                audioRef.current.play().catch(e => {
                    if (e.name !== 'AbortError' && e.name !== 'NotSupportedError') {
                        console.error('Autoplay failed:', e);
                    }
                });
            }
        }, 80);
        return () => clearTimeout(timer);
    }, [autoplayToken, secureAudioSrc, track]);

    if (!track) return null;

    const togglePlay = async () => {
        if (!audioRef.current || !secureAudioSrc) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (e) {
                if ((e as Error).name !== 'AbortError') {
                    console.error('Playback failed:', e);
                }
                setIsPlaying(false);
            }
        }
    };

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "-:--";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current && duration) {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const newTime = percent * duration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolume = (e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            audioRef.current.volume = percent;
            setVolume(percent);
            if (percent > 0) setPrevVolume(percent);
        }
    };

    const toggleMute = () => {
        if (volume > 0) {
            setPrevVolume(volume);
            setVolume(0);
            if (audioRef.current) audioRef.current.volume = 0;
        } else {
            setVolume(prevVolume || 0.5);
            if (audioRef.current) audioRef.current.volume = prevVolume || 0.5;
        }
    };

    const getVolumeIcon = () => {
        if (volume === 0) return <VolumeX className="w-5 h-5 text-red-500" />;
        if (volume < 0.3) return <Volume className="w-5 h-5" />;
        if (volume < 0.7) return <Volume1 className="w-5 h-5" />;
        return <Volume2 className="w-5 h-5" />;
    };


    return (
        <div className={`fixed bottom-0 left-0 right-0 z-[1000] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isExpanded ? 'h-full bg-black' : 'h-24 bg-black/80 backdrop-blur-2xl border-t border-white/5'}`}>


            {/* Mobile Expanded Control Layer */}
            {isExpanded && (
                <div className="absolute inset-0 flex flex-col pt-safe animate-in slide-in-from-bottom-12 duration-700">
                    {/* Top Bar */}
                    <div className="h-16 flex items-center justify-between px-6 shrink-0 z-20">
                        <button onClick={() => setIsExpanded(false)} className="flex items-center hover:bg-white/10 rounded-full transition-all bg-white/5 backdrop-blur-md group/close p-2 md:pr-6 md:gap-2">
                            <ChevronDown className="w-7 h-7 text-white group-hover/close:translate-y-0.5 transition-transform" />
                            <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mt-0.5">{t('common.hide')}</span>
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40">{t('player.playingFrom')}</span>
                            <span className="text-xs font-bold text-white truncate max-w-[150px]">{track.album}</span>
                        </div>
                        <button onClick={() => setShowQueue(!showQueue)} className={`p-2 rounded-full transition-all ${showQueue ? 'text-red-500 bg-red-500/10' : 'text-white bg-white/5'}`}>
                            <ListMusic className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main Content (Toggleable on Mobile) */}
                    <div className="flex-1 overflow-y-auto md:overflow-hidden relative custom-scrollbar scroll-smooth">
                        {/* Desktop Layout or Mobile Metadata */}
                        <div className={`flex flex-col md:flex-row-reverse h-full transition-all duration-500 ${showLyrics ? 'md:translate-x-0' : ''}`}>

                            {/* Metadata & Controls (Spotify Style Mobile) */}
                            <div className={`w-full md:w-[35%] lg:w-[30%] flex flex-col px-8 py-6 items-center justify-start md:justify-center gap-6 md:gap-8 ${showLyrics ? 'hidden md:flex' : 'flex'}`}>
                                <div className="w-full aspect-square max-w-[350px] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative group shrink-0">
                                    <SecureImage path={track.thumbnail} alt="Artwork" className={`w-full h-full object-cover transition-transform duration-[2000ms] ${isPlaying ? 'scale-110 rotate-1' : 'scale-100'}`} />
                                    
                                    {/* distributed corner Metadata stickers */}
                                    <div className="absolute inset-0 p-4 pointer-events-none transition-all duration-700">
                                        {/* Top Left: Genre */}
                                        {track.genre && (
                                            <div className="absolute top-4 left-4 px-2.5 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl scale-90 md:scale-100 origin-top-left">
                                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white decoration-white/30">{track.genre}</p>
                                            </div>
                                        )}

                                        {/* Top Right: Year */}
                                        {track.year && (
                                            <div className="absolute top-4 right-4 px-2.5 py-1.5 bg-black/40 backdrop-blur-xs rounded-lg border border-white/5 shadow-2xl scale-90 md:scale-100 origin-top-right">
                                                <p className="text-[9px] font-black text-white/90 tracking-widest">{track.year}</p>
                                            </div>
                                        )}

                                        {/* Bottom Left: BPM */}
                                        {track.bpm && (
                                            <div className="absolute bottom-4 left-4 flex flex-col items-start gap-1 p-2 bg-black/40 backdrop-blur-xs rounded-lg border border-white/5 shadow-2xl scale-90 md:scale-100 origin-bottom-left">
                                                <span className="text-[7px] font-black uppercase tracking-widest text-white/40">{t('player.bpm')}</span>
                                                <p className="text-[9px] font-black text-white/90">{track.bpm}</p>
                                            </div>
                                        )}

                                        {/* Bottom Right: Publisher */}
                                        {track.publisher && (
                                            <div className="absolute bottom-4 right-4 max-w-[120px] p-2 bg-black/40 backdrop-blur-xs rounded-lg border border-white/5 shadow-2xl scale-90 md:scale-100 origin-bottom-right">
                                                <span className="text-[7px] font-black uppercase tracking-widest text-white/40 block text-right">{t('player.label')}</span>
                                                <p className="text-[8px] font-black text-white px-2 py-1 md:text-white/90 uppercase tracking-tighter truncate text-right leading-none">{track.publisher}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>

                                <div className="w-full space-y-1 mt-2 shrink-0 px-2 md:px-0 text-center md:text-left">
                                    <h1 className="text-2xl md:text-5xl font-black tracking-tighter text-white leading-tight break-words">{track.title}</h1>
                                    <p className="text-lg md:text-2xl font-bold text-red-500/90 tracking-tight">{track.artist}</p>
                                </div>

                                {/* Interactive Progress Seeker */}
                                <div className="w-full space-y-1 shrink-0">
                                    <div
                                        className="h-10 flex items-center cursor-pointer group/slider relative touch-none"
                                        onPointerDown={(e) => { setIsDraggingTime(true); handleSeek(e); e.currentTarget.setPointerCapture(e.pointerId); }}
                                        onPointerMove={(e) => isDraggingTime && handleSeek(e)}
                                        onPointerUp={(e) => { setIsDraggingTime(false); e.currentTarget.releasePointerCapture(e.pointerId); }}
                                    >
                                        <div className="absolute inset-x-0 h-1 md:h-1.5 bg-white/10 rounded-full group-hover/slider:h-2 group-hover/slider:bg-white/20 transition-all duration-300 overflow-hidden">
                                            <div
                                                className={`h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] ${isDraggingTime ? 'transition-none' : 'transition-all duration-75'}`}
                                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                            />
                                        </div>
                                        <div
                                            className={`absolute w-4 h-4 bg-white rounded-full shadow-2xl -ml-2 transition-all duration-300 ${isDraggingTime ? 'scale-125' : 'scale-0 group-hover/slider:scale-110'}`}
                                            style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black tracking-widest text-white/40">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>

                                {/* Big Controls */}
                                <div className="flex items-center justify-between w-full max-w-[350px] px-2 mb-6 md:mb-10 shrink-0">
                                    <button onClick={() => setIsShuffle(!isShuffle)} className={`p-3 rounded-full transition-all ${isShuffle ? 'text-red-500 bg-red-500/10' : 'text-white/40 hover:text-white'}`}>
                                        <Shuffle className="w-5 md:w-6 h-5 md:h-6" />
                                    </button>
                                    <button onClick={() => prevTrack(isShuffle)} className="text-white hover:text-red-500 transition-all p-3">
                                        <SkipBack className="w-8 md:w-8 h-8 md:h-8 fill-current" />
                                    </button>
                                    <button onClick={togglePlay} className="w-16 md:w-20 h-16 md:h-20 bg-white hover:bg-red-500 text-black hover:text-white rounded-full flex items-center justify-center transition-all shadow-[0_15px_40px_rgba(255,255,255,0.1)] active:scale-95 group">
                                        {isPlaying ? <Pause className="w-8 md:w-10 h-8 md:h-10 fill-current" /> : <Play className="w-8 md:w-10 h-8 md:h-10 fill-current ml-2" />}
                                    </button>
                                    <button onClick={() => nextTrack(isShuffle)} className="text-white hover:text-red-500 transition-all p-3">
                                        <SkipForward className="w-8 md:w-8 h-8 md:h-8 fill-current" />
                                    </button>
                                    <button onClick={() => setIsRepeat(!isRepeat)} className={`p-3 rounded-full transition-all ${isRepeat ? 'text-red-500 bg-red-500/10' : 'text-white/40 hover:text-white'}`}>
                                        <Repeat className="w-5 md:w-6 h-5 md:h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Immersive Lyrics Area (Full width on Mobile toggle) */}
                            <div className={`flex-1 overflow-y-auto px-8 py-10 md:px-20 md:py-24 space-y-8 custom-scrollbar bg-black/60 backdrop-blur-3xl animate-in fade-in duration-500 ${showLyrics ? 'block' : 'hidden md:block'}`}>
                                {lyricsData.map((lyric, index) => {
                                    const isCurrent = index === currentLyricIndex;
                                    const isPassed = index < currentLyricIndex;
                                    
                                    return (
                                        <p
                                            key={index}
                                            ref={(el) => (lyricRefs.current[index] = el)}
                                            className={`text-3xl lg:text-5xl font-black leading-tight tracking-tighter transition-all duration-700 cursor-pointer ${isCurrent
                                                ? 'text-white blur-0 scale-100 opacity-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                                : isPassed
                                                    ? 'text-white/20 blur-[1px] scale-95'
                                                    : 'text-white/40 blur-[0.5px] scale-95 hover:text-white/60'
                                                }`}
                                            onClick={() => audioRef.current && (audioRef.current.currentTime = lyric.time)}
                                        >
                                            {lyric.text}
                                        </p>
                                    );
                                })}
                                <div className="h-60 shrink-0" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Floating Lyrics Toggle for Mobile */}
                    <div className="md:hidden h-24 flex items-center justify-center px-8 z-30 mb-safe shrink-0">
                        <button
                            onClick={() => setShowLyrics(!showLyrics)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl ${showLyrics ? 'bg-white/10 text-white backdrop-blur-xl border border-white/10' : 'bg-red-600 text-white'}`}
                        >
                            <Mic2 className="w-5 h-5" />
                            {showLyrics ? t('player.showControls') : t('player.showLyrics')}
                        </button>
                    </div>
                </div>
            )}

            {/* Main Bar View (Visible when not expanded or on Desktop) */}
            <div className={`flex items-center justify-between h-full px-4 md:px-8 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

                {/* Audio Engine */}
                <audio
                    ref={audioRef}
                    src={secureAudioSrc || undefined}
                    onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                    onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                    onEnded={() => isRepeat ? (audioRef.current && (audioRef.current.currentTime = 0, audioRef.current.play())) : nextTrack(isShuffle)}
                />

                {/* Track Info & Expand Trigger */}
                <div className="flex items-center gap-4 w-full md:w-[30%] cursor-pointer group" onClick={() => setIsExpanded(true)}>
                    <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-lg overflow-hidden shadow-2xl border border-white/5">
                        <SecureImage path={track.thumbnail} alt="cover" className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'rotate-3 scale-110' : ''}`} />
                    </div>
                    <div className="min-w-0 pr-4">
                        <h4 className="text-white font-black text-sm md:text-base truncate tracking-tight">{track.title}</h4>
                        <p className="text-white/50 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5 truncate">{track.artist}</p>
                    </div>
                </div>

                {/* Desktop Controls (Hidden Mobile) */}
                <div className="hidden md:flex flex-col items-center justify-center flex-1 max-w-2xl px-8 gap-1 translate-y-2">
                    <div className="flex items-center gap-8">
                        <button onClick={() => setIsShuffle(!isShuffle)} className={`transition-all ${isShuffle ? 'text-red-500 scale-110' : 'text-white/40 hover:text-white'}`}><Shuffle className="w-5 h-5" /></button>
                        <button onClick={() => prevTrack(isShuffle)} className="text-white/60 hover:text-white transition-all"><SkipBack className="w-6 h-6 fill-current" /></button>
                        <button onClick={togglePlay} className="w-12 h-12 bg-white hover:bg-red-600 text-black hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90">
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                        </button>
                        <button onClick={() => nextTrack(isShuffle)} className="text-white/60 hover:text-white transition-all"><SkipForward className="w-6 h-6 fill-current" /></button>
                        <button onClick={() => setIsRepeat(!isRepeat)} className={`transition-all ${isRepeat ? 'text-red-500 scale-110' : 'text-white/40 hover:text-white'}`}><Repeat className="w-5 h-5" /></button>
                    </div>
                    <div className="flex items-center gap-4 w-full px-2">
                        <span className="text-[10px] font-black font-mono text-white/40 min-w-[35px]">{formatTime(currentTime)}</span>
                        <div
                            className="flex-1 h-10 flex items-center relative group/progress cursor-pointer touch-none"
                            onPointerDown={(e) => { setIsDraggingTime(true); handleSeek(e); e.currentTarget.setPointerCapture(e.pointerId); }}
                            onPointerMove={(e) => isDraggingTime && handleSeek(e)}
                            onPointerUp={(e) => { setIsDraggingTime(false); e.currentTarget.releasePointerCapture(e.pointerId); }}
                        >
                            <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full group-hover/progress:h-1.5 group-hover/progress:bg-white/20 transition-all duration-300 overflow-hidden">
                                <div className={`h-full bg-red-600 ${isDraggingTime ? 'transition-none' : 'transition-all duration-75'}`} style={{ width: `${(currentTime / (duration || 1)) * 100}%` }} />
                            </div>
                            <div
                                className={`absolute w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-300 -ml-1.5 ${isDraggingTime ? 'scale-125' : 'scale-0 group-hover/progress:scale-100'}`}
                                style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-black font-mono text-white/40 min-w-[35px]">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Right Panel (Desktop) / Mobile Active Control */}
                <div className="flex items-center justify-end w-auto md:w-[30%] gap-4">
                    {/* Mobile Only Play/Pause Mini Control */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={togglePlay} className="p-2 text-white bg-white/5 rounded-full backdrop-blur-md transition-all active:scale-95">
                            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                        </button>
                        <button onClick={() => setIsExpanded(true)} className="p-2 text-zinc-400">
                            <Maximize2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <button onClick={() => setIsExpanded(true)} className={`transition-all ${isExpanded ? 'text-red-500' : 'text-white/40 hover:text-white'}`}><Mic2 className="w-5 h-5" /></button>
                        <div className="flex items-center gap-3 w-32 group/vol relative h-6">
                            <button
                                onClick={toggleMute}
                                className="text-white/40 group-hover/vol:text-white transition-all transform hover:scale-110 active:scale-95 shrink-0"
                            >
                                {getVolumeIcon()}
                            </button>
                            <div
                                className="flex-1 h-10 flex items-center relative group/vol-slider cursor-pointer touch-none"
                                onPointerDown={(e) => { setIsDraggingVolume(true); handleVolume(e); e.currentTarget.setPointerCapture(e.pointerId); }}
                                onPointerMove={(e) => isDraggingVolume && handleVolume(e)}
                                onPointerUp={(e) => { setIsDraggingVolume(false); e.currentTarget.releasePointerCapture(e.pointerId); }}
                            >
                                <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full group-hover/vol:h-1.5 group-hover/vol:bg-white/20 transition-all duration-300 overflow-hidden">
                                    <div className={`h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)] ${isDraggingVolume ? 'transition-none' : 'transition-all'}`} style={{ width: `${volume * 100}%` }} />
                                </div>
                                <div
                                    className={`absolute w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-300 -ml-1.5 ${isDraggingVolume ? 'scale-125' : 'scale-0 group-hover/vol:scale-100'}`}
                                    style={{ left: `${volume * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pop-up Antrian (Queue) - Works in both modes */}
            {showQueue && (
                <div className={`absolute ${isExpanded ? 'bottom-32 right-8 md:right-12' : 'bottom-28 right-4'} w-[90vw] md:w-96 bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[1500] animate-in slide-in-from-bottom-4 zoom-in-95 duration-300`}>
                    <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-3">
                            <ListMusic className="w-5 h-5 text-red-500" />
                            <h3 className="text-white font-black text-xs tracking-widest uppercase">{t('player.queue')}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            {userQueue.length > 0 && (
                                <button
                                    onClick={clearQueue}
                                    className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-white px-3 py-1.5 bg-red-500/10 hover:bg-red-600 rounded-full transition-all border border-red-500/20"
                                >
                                    {t('player.clearQueue')}
                                </button>
                            )}
                            <button onClick={() => setShowQueue(false)} className="text-white/40 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="p-5 max-h-[60vh] md:max-h-[400px] overflow-y-auto custom-scrollbar">
                        {userQueue.length > 0 ? (
                            <div className="space-y-2">
                                {userQueue.map((qTrack, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group/item cursor-pointer">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <SecureImage path={qTrack.thumbnail} alt="cover" className="w-12 h-12 object-cover rounded-lg shadow-lg group-hover/item:scale-105 transition-transform" />
                                            <div className="min-w-0">
                                                <h4 className="text-white font-bold text-sm truncate group-hover/item:text-red-500 transition-colors">{qTrack.title}</h4>
                                                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-1">{qTrack.artist}</p>
                                            </div>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); removeFromQueue(idx); }} className="text-white/40 hover:text-red-500 p-2 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-all shrink-0">
                                            <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 opacity-30">
                                <ListMusic className="w-12 h-12 mx-auto mb-3" />
                                <p className="text-xs font-black uppercase tracking-widest">{t('player.emptyQueue')}</p>
                                <p className="text-[10px] mt-1">{t('player.addNext')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Context Global Toaster rendered inside player to stay atop overlay */}
            {toastMessage && (
                <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-red-600 text-white font-black text-xs px-8 py-3 rounded-full shadow-[0_10px_30px_rgba(220,38,38,0.5)] z-[2000] animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none flex items-center gap-3 uppercase tracking-widest border border-white/10 backdrop-blur-md">
                    <ListPlus className="w-5 h-5" />
                    {toastMessage}
                </div>
            )}
        </div>
    );
}

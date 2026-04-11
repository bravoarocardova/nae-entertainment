import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, ArrowLeft, Mic2, ListMusic } from 'lucide-react';
import { getApiUrl } from '../config/api';

const lyricsData = [
    { time: 0, text: "🎵 (Instrumental Intro)" },
    { time: 5, text: "Yeah, welcome to NAE Entertainment" },
    { time: 10, text: "We don't just record, we craft the magic" },
    { time: 15, text: "Every pixel, every frame in its place" },
    { time: 20, text: "Setting the standard, setting the pace" },
    { time: 25, text: "You feel the rhythm, you feel the vibe" },
    { time: 30, text: "Building the future, keep it alive" },
    { time: 35, text: "From the lens to the screen, we dominate" },
    { time: 40, text: "NAE Studios, we elevate." },
    { time: 48, text: "🎵 (Beat Drop)" },
    { time: 60, text: "(Fading out...)" }
];

const MusicPlayerPage = () => {
    const location = useLocation();
    const track = location.state?.track || {
        title: "SoundHelix Electronic (Sample)",
        thumbnail: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=2070",
        url: getApiUrl('/music/sample.mp3')
    };

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Audio Play/Pause effect
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch((e) => {
                        console.error('Audio playback blocked by browser/autoply:', e);
                        setIsPlaying(false);
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    // Handle scrubber click/sync
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newTime = percent * duration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    // Format time (e.g., 65 -> 1:05)
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Find current lyric index
    const currentLyricIndex = lyricsData.findIndex((lyric, index) => {
        const nextLyricTime = lyricsData[index + 1]?.time || Infinity;
        return currentTime >= lyric.time && currentTime < nextLyricTime;
    });

    return (
        <div className="h-screen w-full flex flex-col bg-black text-white font-sans overflow-hidden">
            {/* Hidden Native Audio Element */}
            <audio
                ref={audioRef}
                src={track.url}
                onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Top Navigation */}
            <div className="h-16 flex items-center px-6 bg-gradient-to-b from-zinc-900/80 to-transparent z-10 absolute top-0 w-full">
                <Link to="/music" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/40 rounded-full px-4 py-2 backdrop-blur-md">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold text-sm">Back to Music</span>
                </Link>
            </div>

            {/* Main Content Area (Split Layout matching context7 responsive layout) */}
            <div className="flex-1 flex flex-col md:flex-row relative">

                {/* Visual / Album Art Area */}
                <div className="flex-1 p-8 pt-24 md:pt-8 flex flex-col items-center justify-center relative bg-gradient-to-br from-red-900/20 to-black">
                    <div className="w-64 h-64 md:w-96 md:h-96 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative group">
                        <img
                            src={track.thumbnail}
                            alt="Album Cover"
                            className={`w-full h-full object-cover transition-transform duration-1000 ${isPlaying ? 'scale-105' : 'scale-100'}`}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                </div>

                {/* Lyrics Area (Scrollable Sidebar) */}
                <div className="w-full h-1/2 md:h-full md:w-[40%] max-w-2xl bg-zinc-950/50 backdrop-blur-3xl border-l border-white/5 p-6 md:p-12 overflow-y-auto no-scrollbar scroll-smooth relative">
                    <div className="sticky top-0 bg-zinc-950/80 pb-6 mb-4 backdrop-blur-xl z-10 border-b border-white/5">
                        <h2 className="text-2xl font-black tracking-tight">Lyrics</h2>
                        <div className="flex gap-2 items-center text-red-500 mt-2">
                            <Mic2 className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Live Sync</span>
                        </div>
                    </div>

                    <div className="space-y-6 pb-24 lg:pb-32">
                        {lyricsData.map((lyric, index) => {
                            const isCurrent = index === currentLyricIndex;
                            const isPassed = index < currentLyricIndex;

                            return (
                                <p
                                    key={index}
                                    className={`text-3xl md:text-4xl font-bold leading-tight transition-all duration-500 ${isCurrent
                                            ? 'text-white scale-[1.02] origin-left drop-shadow-lg'
                                            : isPassed
                                                ? 'text-white/20'
                                                : 'text-white/40 hover:text-white/60'
                                        }`}
                                >
                                    {lyric.text}
                                </p>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Playback Bar */}
            <div className="h-24 md:h-28 bg-zinc-950 border-t border-zinc-800/50 flex items-center justify-between px-4 md:px-8 relative z-20">
                {/* Left: Song Info */}
                <div className="flex items-center gap-4 w-1/3 min-w-0">
                    <img
                        src={track.thumbnail}
                        alt="Thumbnail"
                        className="w-14 h-14 rounded-md object-cover hidden sm:block shadow-md"
                    />
                    <div className="min-w-0 truncate">
                        <h4 className="text-white font-bold text-sm md:text-base truncate hover:underline cursor-pointer">{track.title}</h4>
                        <p className="text-zinc-400 text-xs md:text-sm truncate hover:underline cursor-pointer">NAE Studios</p>
                    </div>
                </div>

                {/* Center: Controls & Scrubber */}
                <div className="flex flex-col items-center max-w-2xl w-full px-4">
                    <div className="flex items-center gap-4 md:gap-6 mb-2">
                        <button className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
                            <Shuffle className="w-5 h-5" />
                        </button>
                        <button className="text-zinc-400 hover:text-white transition-colors">
                            <SkipBack className="w-6 h-6 fill-current" />
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="bg-white hover:scale-105 active:scale-95 text-black p-3 md:p-3.5 rounded-full transition-all shadow-xl shadow-white/10"
                        >
                            {isPlaying ? (
                                <Pause className="w-6 h-6 md:w-7 md:h-7 fill-current" />
                            ) : (
                                <Play className="w-6 h-6 md:w-7 md:h-7 fill-current ml-1" />
                            )}
                        </button>

                        <button className="text-zinc-400 hover:text-white transition-colors">
                            <SkipForward className="w-6 h-6 fill-current" />
                        </button>
                        <button className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
                            <Repeat className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full">
                        <span className="text-xs font-medium text-zinc-400">{formatTime(currentTime)}</span>
                        <div
                            className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden cursor-pointer group"
                            onClick={handleSeek}
                        >
                            <div
                                className="h-full bg-white group-hover:bg-red-500 transition-colors relative"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-medium text-zinc-400">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Right: Actions / Volume (hidden on small mobile) */}
                <div className="w-1/3 flex justify-end items-center gap-4 hidden md:flex">
                    <ListMusic className="w-5 h-5 text-zinc-400 hover:text-white transition-colors cursor-pointer" />
                    <div className="flex items-center gap-2 w-32 group cursor-pointer">
                        <Volume2 className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                        <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-2/3 group-hover:bg-red-500 transition-colors"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
};

export default MusicPlayerPage;

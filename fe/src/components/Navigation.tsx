import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Youtube, Menu, X, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ModeToggle } from './mode-toggle';
import { LanguageSelector } from './LanguageSelector';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navigation = () => {
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const isHome = location.pathname === '/';
    const isDarkOverHero = isHome && !isScrolled;
    const showSolidNav = !isHome || isScrolled;

    return (
        <nav
            className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${showSolidNav
                    ? 'py-3 bg-background/80 backdrop-blur-2xl border-b border-border shadow-lg'
                    : 'py-6 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex justify-between items-center h-full">
                    <Link to="/" className="group flex items-center gap-3 relative z-10 transition-transform hover:scale-105 active:scale-95 duration-300">
                        <Avatar className={`transition-all duration-500 border-2 ${showSolidNav ? 'w-10 h-10 border-red-600/50' : 'w-12 h-12 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]'}`}>
                            <AvatarImage src="https://yt3.googleusercontent.com/xaCBa4Zk_U1s8ur-NFw3WO9pk5vPVH8hQci_qcSG9S19QMPIB-hh1vlhie7RSl_-CiSI65jWtA=s160-c-k-c0x00ffffff-no-rj" />
                            <AvatarFallback className="bg-red-600 text-white font-black text-xs uppercase">NAE</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col -gap-1">
                            <span className={`font-black text-2xl md:text-3xl tracking-tighter leading-[0.8] transition-colors duration-500 ${isDarkOverHero ? 'text-white' : 'text-foreground'}`}>NAE</span>
                            <span className="font-black text-[9px] tracking-[0.4em] text-red-600 leading-none mt-1">ENTERTAINMENT</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        <div className="flex items-center gap-10 text-xs font-black uppercase tracking-[0.2em]">
                            <Link to="/" className={`transition-all duration-500 relative group/link ${location.pathname === '/' ? (isDarkOverHero ? 'text-white' : 'text-foreground') : 'text-muted-foreground hover:text-red-500'}`}>
                                {t('nav.home')}
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-red-600 transition-all duration-300 ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                            </Link>
                            <Link to="/video" className={`transition-all duration-500 relative group/link ${location.pathname === '/video' ? (isDarkOverHero ? 'text-white' : 'text-foreground') : 'text-muted-foreground hover:text-red-500'}`}>
                                {t('nav.videos')}
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-red-600 transition-all duration-300 ${location.pathname === '/video' ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                            </Link>
                            <Link to="/music" className={`transition-all duration-500 relative group/link ${location.pathname.startsWith('/music') ? (isDarkOverHero ? 'text-white' : 'text-foreground') : 'text-muted-foreground hover:text-red-500'}`}>
                                {t('nav.music')}
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-red-600 transition-all duration-300 ${location.pathname.startsWith('/music') ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                            </Link>
                        </div>

                        <div className={`h-6 w-[1px] mx-2 transition-colors duration-500 ${isDarkOverHero ? 'bg-white/10' : 'bg-border'}`}></div>

                        <div className="flex items-center gap-4">
                            <LanguageSelector isDark={isDarkOverHero} />
                            <ModeToggle />
                            <Button
                                asChild
                                className="bg-red-600 hover:bg-red-700 text-white rounded-full font-black px-8 py-6 text-xs tracking-widest uppercase transition-all duration-500 shadow-[0_10px_30px_rgba(220,38,38,0.3)] border-none"
                            >
                                <a
                                    href={`https://www.youtube.com/${import.meta.env.VITE_YOUTUBE_USERNAME || "@NAEEntertainment-nrb"}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <Youtube className="w-5 h-5" />
                                    SUBSCRIBE
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle (Toggles only, Mode/Language hidden as requested) */}
                    <div className="md:hidden flex items-center gap-4 relative z-[110] transition-colors duration-500">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`transition-colors duration-500 ${isDarkOverHero ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-accent'}`}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`md:hidden fixed inset-0 top-0 bg-background/95 backdrop-blur-3xl z-[90] flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible h-screen' : 'opacity-0 invisible h-0'
                    }`}
            >
                <div className="flex flex-col items-center gap-8 mb-12 animate-in slide-in-from-bottom-8 duration-500">
                    <Link to="/" className="text-4xl font-black tracking-tighter text-foreground hover:text-red-600 transition-colors uppercase">{t('nav.home')}</Link>
                    <Link to="/video" className="text-4xl font-black tracking-tighter text-foreground hover:text-red-600 transition-colors uppercase">{t('nav.videos')}</Link>
                    <Link to="/music" className="text-4xl font-black tracking-tighter text-foreground hover:text-red-600 transition-colors uppercase">{t('nav.music')}</Link>

                    <div className="h-[2px] w-20 bg-red-600 rounded-full mt-4"></div>
                </div>

                <div className="w-full px-10 flex flex-col items-center gap-8 animate-in slide-in-from-bottom-12 delay-200 duration-500">
                    {/* Re-locating controls inside the sidebar for mobile accessibility but keeping header clean */}
                    <div className="flex items-center gap-6 p-4 bg-accent/20 rounded-[2.5rem] border border-border/40">
                         <LanguageSelector />
                         <div className="w-px h-6 bg-border/40"></div>
                         <ModeToggle />
                    </div>

                    <Button
                        asChild
                        className="bg-red-600 hover:bg-red-700 text-white w-full py-10 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-red-600/30"
                    >
                        <a
                            href={`https://www.youtube.com/${import.meta.env.VITE_YOUTUBE_USERNAME || "@NAEEntertainment-nrb"}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Youtube className="w-8 h-8" />
                            SUBSCRIBE NOW
                        </a>
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;

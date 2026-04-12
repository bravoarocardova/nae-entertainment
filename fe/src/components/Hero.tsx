import { Play, Users, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <header className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-background">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5 z-10"></div>
                
                <div 
                    className="w-full h-full bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-30 dark:opacity-20 scale-105 animate-[pulse_12s_infinite_alternate]"
                    style={{ transition: 'transform 2s ease-out' }}
                ></div>

                {/* Animated light orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
            </div>

            <div className="relative z-20 text-center px-6 max-w-5xl mx-auto" data-aos="zoom-out-up" data-aos-duration="1200">
                <div className="inline-block mb-10 group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex flex-col items-center">
                        <div className="p-1 rounded-full bg-background/50 backdrop-blur-xl border border-border shadow-2xl overflow-hidden mb-4">
                            <img 
                                src="https://yt3.googleusercontent.com/xaCBa4Zk_U1s8ur-NFw3WO9pk5vPVH8hQci_qcSG9S19QMPIB-hh1vlhie7RSl_-CiSI65jWtA=s160-c-k-c0x00ffffff-no-rj" 
                                alt="NAE Logo" 
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover grayscale-0 group-hover:scale-110 transition-transform duration-700" 
                            />
                        </div>
                        <Badge variant="secondary" className="px-3 py-1 bg-red-600/90 text-white font-black tracking-[0.2em] border-none shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            EST 2026
                        </Badge>
                    </div>
                </div>

                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.85] px-2 text-foreground">
                    {t('home.hero.title1')} <br />
                    <span className="text-red-600 relative inline-block">
                        {t('home.hero.title2')}
                        <span className="absolute -top-4 -right-8">
                           <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground opacity-50" />
                        </span>
                    </span>
                </h1>
                
                <p className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-10 sm:mb-12 max-w-2xl mx-auto px-4 font-medium leading-relaxed">
                    {t('home.hero.subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-lg mx-auto px-2">
                    <Button 
                        asChild
                        size="lg"
                        className="group relative bg-red-600 text-white rounded-full font-black text-lg hover:bg-red-700 transition-all duration-300 py-7 px-8 overflow-hidden shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.5)] border-none"
                    >
                        <a href={`https://www.youtube.com/${import.meta.env.VITE_YOUTUBE_USERNAME || "@NAEEntertainment-nrb"}`} target="_blank" rel="noreferrer">
                            <span className="relative z-10 flex items-center gap-2">
                                {t('home.hero.cta1')} <Play className="w-5 h-5 fill-current" />
                            </span>
                        </a>
                    </Button>
                    <Button 
                        asChild
                        variant="outline"
                        size="lg"
                        className="group border-2 border-primary/10 bg-primary/5 backdrop-blur-md text-foreground rounded-full font-black text-lg hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-500 py-7 px-8"
                    >
                        <a href="#founders" className="flex items-center gap-2">
                            {t('home.hero.cta2')} <Users className="w-5 h-5" />
                        </a>
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 hidden sm:block">
                <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center p-1">
                    <div className="w-1 h-2 bg-red-600 rounded-full animate-[bounce_1.5s_infinite]"></div>
                </div>
            </div>
            
            {/* Edge decorative text */}
            <div className="absolute -left-20 top-1/2 -rotate-90 hidden lg:block opacity-5 pointer-events-none select-none">
                <span className="text-8xl font-black tracking-widest uppercase text-foreground">Creativity</span>
            </div>
            <div className="absolute -right-20 top-1/2 rotate-90 hidden lg:block opacity-5 pointer-events-none select-none">
                <span className="text-8xl font-black tracking-widest uppercase text-foreground">Production</span>
            </div>
        </header>
    );
};

export default Hero;

import { Youtube } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

const CTA = () => {
    const { t } = useTranslation();

    return (
        <section className="py-24 sm:py-32 px-6 bg-background">
            <div className="max-w-6xl mx-auto" data-aos="zoom-in-up">
                <div className="bg-red-600 rounded-[3rem] p-10 sm:p-16 md:p-24 text-center relative overflow-hidden shadow-[0_30px_60px_rgba(220,38,38,0.4)]">
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
                    
                    {/* Decorative Blur Blobs */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/20 blur-3xl rounded-full"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <Badge className="mb-8 bg-white/20 text-white backdrop-blur-md border-white/20 px-6 py-2 rounded-full font-black tracking-widest text-xs">
                            {t('home.cta.tag')}
                        </Badge>
                        <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.85] tracking-tighter text-white">
                            {t('home.cta.title1')} <br/> {t('home.cta.title2')}
                        </h2>
                        <p className="text-lg sm:text-xl md:text-2xl text-red-50 mb-12 max-w-2xl mx-auto font-bold opacity-90 leading-tight">
                            {t('home.cta.desc')}
                        </p>
                        
                        <Button
                            asChild
                            size="lg"
                            className="group bg-white text-red-600 hover:bg-zinc-100 px-12 py-8 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 border-none h-auto"
                        >
                            <a href={`https://www.youtube.com/${import.meta.env.VITE_YOUTUBE_USERNAME || "@NAEEntertainment-nrb"}`} target="_blank" rel="noreferrer">
                                <Youtube className="w-8 h-8 fill-red-600 group-hover:scale-110 transition-transform" />
                                {t('home.cta.subscribe')}
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;

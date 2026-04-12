import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();

    return (
        <section id="about" className="py-24 sm:py-32 px-6 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="relative group" data-aos="fade-right">
                        <div className="absolute -inset-4 bg-red-600/20 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                        <div className="relative aspect-[4/5] sm:aspect-video lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-border">
                            <img 
                                src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=2056" 
                                alt="Studio" 
                                className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 z-20">
                                <Badge className="px-5 py-2 bg-red-600 text-white font-black uppercase tracking-tighter border-none text-sm">SINCE 2026</Badge>
                            </div>
                        </div>
                    </div>
                    
                    <div data-aos="fade-left" className="relative">
                        <Badge variant="outline" className="mb-6 text-muted-foreground border-border px-4 py-1.5 rounded-full font-bold tracking-widest text-[10px] uppercase">
                            {t('home.about.tag')}
                        </Badge>
                        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tighter text-foreground">
                            {t('home.about.title1')} <br/>
                            <span className="text-red-600">{t('home.about.title2')}</span>
                        </h2>
                        <p className="text-muted-foreground text-lg sm:text-xl mb-10 leading-relaxed font-medium">
                            {t('home.about.desc')}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="flex flex-col gap-2">
                                <h4 className="text-foreground font-black text-4xl sm:text-5xl tracking-tighter italic">100K<span className="text-red-600">+</span></h4>
                                <Separator className="w-12 h-1 bg-red-600" />
                                <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-[0.2em] font-black">{t('home.about.followers')}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-foreground font-black text-4xl sm:text-5xl tracking-tighter italic">50M<span className="text-red-600">+</span></h4>
                                <Separator className="w-12 h-1 bg-red-600" />
                                <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-[0.2em] font-black">{t('home.about.views')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;

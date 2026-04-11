import { ExternalLink, User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Founders = () => {
    const founders = [
        { id: "7839501057", role: "CEO & Producer", name: "Founder 1" },
        { id: "8761284326", role: "Creative Director", name: "Founder 2" },
        { id: "9757395983", role: "Technical Director", name: "Founder 3" }
    ];

    return (
        <section id="founders" className="py-20 sm:py-32 px-6 bg-zinc-950 border-t border-white/5 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6" data-aos="fade-up">
                    <div className="max-w-2xl">
                        <Badge variant="outline" className="mb-4 text-red-500 border-red-500/30 px-4 py-1 rounded-full font-black tracking-widest text-[10px] uppercase bg-red-500/5">
                            Our Leadership
                        </Badge>
                        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 tracking-tighter text-white">
                            THE VOICES BEHIND <br />
                            <span className="text-red-600">THE VISION.</span>
                        </h2>
                    </div>
                    <p className="text-zinc-400 text-lg sm:text-xl font-medium max-w-md border-l-2 border-red-600 pl-6 py-2">
                        Kreativitas tanpa batas, didukung oleh tim yang berdedikasi tinggi untuk kualitas.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {founders.map((f, i) => (
                        <Card 
                            key={i} 
                            className="group relative bg-zinc-900/50 border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-zinc-900 transition-all duration-700 hover:border-red-600/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]" 
                            data-aos="fade-up" 
                            data-aos-delay={i * 200}
                        >
                            <CardContent className="p-8 sm:p-10 flex flex-col items-center text-center">
                                <div className="relative mb-8 pt-4">
                                    <div className="absolute inset-0 bg-red-600/20 rounded-full blur-3xl group-hover:bg-red-600/40 transition-all duration-700 scale-125"></div>
                                    <Avatar className="w-40 h-40 sm:w-48 sm:h-48 border-4 border-white/5 group-hover:border-red-600/50 transition-all duration-700 grayscale group-hover:grayscale-0 relative z-10 shadow-2xl">
                                        <AvatarImage 
                                            src={`https://www.roblox.com/headshot-thumbnail/image?userId=${f.id}&width=420&height=420&format=png`} 
                                            alt={f.name} 
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-zinc-800 text-white">
                                            <User className="w-12 h-12" />
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
                                        <Badge className="bg-red-600 text-white font-black px-4 py-1 border-4 border-zinc-900 rounded-full text-[10px] sm:text-xs">
                                            CORE TEAM
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-2xl sm:text-3xl font-black mb-1 text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">{f.name}</h3>
                                    <p className="text-zinc-500 font-bold text-sm tracking-widest uppercase mb-8">{f.role}</p>
                                    
                                    <div className="pt-6 border-t border-white/5 w-full flex justify-center">
                                        <a 
                                            href={`https://www.roblox.com/id/users/${f.id}/profile`} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="inline-flex items-center gap-2 text-xs font-black text-zinc-500 hover:text-white transition-all uppercase tracking-widest group/link"
                                        >
                                            View Profile <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                        </a>
                                    </div>
                                </div>

                                <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
                                    <span className="text-white font-black text-7xl select-none leading-none">0{i + 1}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Founders;

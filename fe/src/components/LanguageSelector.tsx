import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Languages, Check } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSelector({ isDark }: { isDark?: boolean }) {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const currentLang = i18n.language || 'id';

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className={`h-10 px-4 rounded-full flex items-center gap-2.5 transition-all duration-500 border border-transparent hover:scale-105 active:scale-95 group ${isDark 
                        ? 'text-white hover:bg-white/10 hover:border-white/10' 
                        : 'text-foreground hover:bg-accent hover:border-border'}`}
                >
                    <Languages className={`h-4 w-4 transition-colors ${isDark ? 'text-white/60 group-hover:text-red-500' : 'text-muted-foreground group-hover:text-red-500'}`} />
                    <span className="font-black text-[11px] uppercase tracking-[0.2em] mt-0.5">{currentLang.slice(0, 2)}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                className="z-[3000] bg-background/80 backdrop-blur-2xl border-border/40 p-1.5 min-w-[200px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl animate-in fade-in zoom-in-95 duration-300"
            >
                <div className="px-3 py-2 text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
                    Select Language
                </div>
                <DropdownMenuItem 
                    onClick={() => changeLanguage('id')}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all cursor-pointer mb-1 group ${currentLang.startsWith('id') ? 'bg-red-600/10 text-red-500' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-base">🇮🇩</span>
                        <span className="font-black uppercase tracking-[0.2em] text-[10px]">Indonesian</span>
                    </div>
                    {currentLang.startsWith('id') && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => changeLanguage('en')}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all cursor-pointer group ${currentLang.startsWith('en') ? 'bg-red-600/10 text-red-500' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-base">🇺🇸</span>
                        <span className="font-black uppercase tracking-[0.2em] text-[10px]">English</span>
                    </div>
                    {currentLang.startsWith('en') && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

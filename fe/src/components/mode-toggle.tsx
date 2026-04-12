import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative group rounded-full w-10 h-10 border border-border/40 bg-background/20 backdrop-blur-xl hover:bg-background/40 hover:border-red-500/50 transition-all duration-500 overflow-hidden"
                >
                    <div className="relative flex items-center justify-center w-full h-full">
                        <Sun className="h-5 w-5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] absolute scale-100 rotate-0 dark:scale-0 dark:-rotate-90 text-amber-500 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                        <Moon className="h-5 w-5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] absolute scale-0 rotate-90 dark:scale-100 dark:rotate-0 text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                    </div>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                className="z-[3000] bg-background/80 backdrop-blur-2xl border-border/40 p-1.5 min-w-[140px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl animate-in fade-in zoom-in-95 duration-300"
            >
                <DropdownMenuItem 
                    onClick={() => setTheme("light")}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer mb-1 text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'light' ? 'bg-red-600/10 text-red-500' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}
                >
                    <Sun className="h-4 w-4" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => setTheme("dark")}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer mb-1 text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'bg-red-600/10 text-red-500' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}
                >
                    <Moon className="h-4 w-4" />
                    Dark
                </DropdownMenuItem>
                <div className="h-px bg-border/40 my-1.5 mx-1" />
                <DropdownMenuItem 
                    onClick={() => setTheme("system")}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'system' ? 'bg-red-600/10 text-red-500' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}
                >
                    <Monitor className="h-4 w-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

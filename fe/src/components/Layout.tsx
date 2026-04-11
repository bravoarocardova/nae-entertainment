import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import GlobalBottomPlayer from "./GlobalBottomPlayer";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <Navigation />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <GlobalBottomPlayer />
        </div>
    );
};

export default Layout;

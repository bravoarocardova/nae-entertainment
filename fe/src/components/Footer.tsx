const Footer = () => {
    return (
        <footer className="bg-background border-t border-border pt-20 pb-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex items-center gap-3">
                        <img 
                            src="https://yt3.googleusercontent.com/xaCBa4Zk_U1s8ur-NFw3WO9pk5vPVH8hQci_qcSG9S19QMPIB-hh1vlhie7RSl_-CiSI65jWtA=s160-c-k-c0x00ffffff-no-rj" 
                            alt="NAE Logo" 
                            className="w-12 h-12 rounded-full grayscale hover:grayscale-0 transition-all" 
                        />
                        <span className="font-black text-2xl tracking-tighter text-foreground">NAE</span>
                    </div>
                    <div className="flex gap-6">
                        <a href={`https://www.youtube.com/${import.meta.env.VITE_YOUTUBE_USERNAME || "@NAEEntertainment-nrb"}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-red-500 transition-colors">
                            YouTube
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-red-500 transition-colors">
                            Twitter
                        </a>
                    </div>
                </div>
                <div className="text-center md:text-left text-muted-foreground text-sm border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>
                        &copy; {new Date().getFullYear()} NAE Entertainment. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

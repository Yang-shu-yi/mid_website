const { motion: motionNav } = window.Motion;

const Navigation = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motionNav.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-sm border-b border-white/10"
        >
            <div className="flex items-center gap-2 group cursor-pointer" onClick={scrollToTop}>
                <span className="text-3xl group-hover:rotate-180 transition-transform duration-700">🚀</span>
                <span className="font-display font-bold text-xl tracking-widest text-white group-hover:text-space-accent transition-colors">
                    BACK TO HOME
                </span>
            </div>
        </motionNav.nav>
    );
};

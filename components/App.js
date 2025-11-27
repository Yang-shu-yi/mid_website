const App = () => {
    return (
        <div className="relative min-h-screen bg-space-black text-white selection:bg-space-accent selection:text-black">
            <StarField />
            <Navigation />
            <main className="relative z-10">
                <Hero />
                <PlanetShowcase />
            </main>
            <footer className="relative z-10 border-t border-white/10 bg-black/80 backdrop-blur-md py-12 text-center">
                <p className="font-display text-gray-500 text-sm tracking-widest">
                    © {new Date().getFullYear()} SPACESHIP ODYSSEY SYSTEMS
                </p>
                <div className="mt-4 flex justify-center gap-4 text-xs text-gray-600 font-mono">
                    <span>VELOCITY: 0.98c</span>
                    <span>STATUS: NOMINAL</span>
                    <span>CREW: 1</span>
                </div>
            </footer>
        </div>
    );
};

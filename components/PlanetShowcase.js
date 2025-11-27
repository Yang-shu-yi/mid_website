const PlanetShowcase = () => {
    return (
        <section id="explore" className="relative z-10 py-20 bg-gradient-to-b from-transparent via-space-black/90 to-space-black">
            <div className="text-center mb-20 px-4">
                <h3 className="text-space-accent font-display tracking-[0.5em] text-sm uppercase mb-4">
                    System Map
                </h3>
                <p className="text-4xl md:text-5xl font-display font-bold text-white">
                    PLANETARY ARCHIVE
                </p>
            </div>

            <div className="space-y-12">
                {PLANETS.map((planet, index) => (
                    <PlanetCard key={planet.id} planet={planet} index={index} />
                ))}
            </div>
        </section>
    );
};

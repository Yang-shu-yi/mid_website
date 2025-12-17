const { motion: motionHero } = window.Motion;

const Hero = () => {
    return (
        <section className="relative h-screen flex flex-col items-center justify-center z-10 perspective-1000">
            <motionHero.div
                initial={{ opacity: 0, scale: 0.8, z: -100 }}
                animate={{ opacity: 1, scale: 1, z: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-center px-4 md:px-0"
            >
                <h1 className="font-display font-bold text-5xl md:text-8xl lg:text-9xl tracking-tighter 
                    text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 
                    drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4">
                    WELCOME<br className="md:hidden" /> ABOARD
                </h1>

                <p className="font-body text-base md:text-xl lg:text-2xl text-gray-300 
                    tracking-[0.2em] uppercase mb-12 px-4 md:px-0">
                    Initiate Descent Sequence
                </p>
            </motionHero.div>
        </section>
    );
};

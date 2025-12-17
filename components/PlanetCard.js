const { useState } = React;
const { motion: motionPlanet } = window.Motion;

const PlanetCard = ({ planet, index }) => {
    const isEven = index % 2 === 0;
    const [imgError, setImgError] = useState(false);

    return (
        <motionPlanet.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`flex flex-col md:flex-row ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 py-24 min-h-[80vh] px-6 max-w-7xl mx-auto`}
        >
            {/* 圖片區 */}
            <div className="flex-1 w-full flex justify-center items-center relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${planet.color} opacity-20 blur-[100px] rounded-full group-hover:opacity-40 transition-opacity duration-700`}></div>

                {imgError ? (
                    <div className={`w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-br ${planet.color} opacity-80 shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center justify-center z-10 border-2 border-white/10 relative`}>
                        <span className="text-4xl font-display font-bold text-white/20 tracking-widest">
                            {planet.name.substring(0, 3)}
                        </span>
                    </div>
                ) : (
                    <motionPlanet.img
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.5 }}
                        src={planet.imageUrl}
                        alt={planet.name}
                        onError={() => setImgError(true)}
                        className="w-64 h-64 md:w-96 md:h-96 rounded-full object-cover shadow-[0_0_50px_rgba(0,0,0,0.5)] grayscale group-hover:grayscale-0 transition-all duration-700 z-10 border-2 border-white/10 relative"
                    />
                )}
                <div className="absolute w-[120%] h-[120%] border border-white/5 rounded-full animate-spin-slow"></div>

                {/* Probe Link */}
                <a
                    href={`./history.html?planet=${planet.id}`}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-20 hover:scale-125 transition-transform cursor-pointer"
                    title={`View ${planet.name} exploration history`}
                >
                    <img src="./img/probe_icon.png" alt="Probe" className="w-12 h-12 opacity-80 hover:opacity-100 transition-opacity" />
                </a>
            </div>

            {/* 文字區 */}
            <div className="flex-1 space-y-6 text-center md:text-left z-10">
                <div className="inline-block px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-space-accent mb-2">
                    ID: {planet.id.toUpperCase()}_SYS
                </div>
                <h2 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                    {planet.name}
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                    {planet.description}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div>
                        <span className="block text-gray-500 text-sm font-display uppercase">Distance</span>
                        <span className="text-lg font-mono text-white">{planet.distance}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500 text-sm font-display uppercase">Temperature</span>
                        <span className="text-lg font-mono text-white">{planet.temp}</span>
                    </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed pt-4 border-l-2 border-space-accent pl-4">
                    {planet.details}
                </p>
            </div>
        </motionPlanet.div>
    );
};

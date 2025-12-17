const { motion: motionTimeline } = window.Motion;

const HistoryTimeline = ({ planetId }) => {
    // Get history data for the planet, or default to empty array if not found
    // If planetId is not valid (e.g. "null" string), handle it.
    const historyItems = (planetId && HISTORY_DATA[planetId]) ? HISTORY_DATA[planetId] : [];

    // Get planet data for title/styling
    const planetInfo = PLANETS.find(p => p.id === planetId) || { name: 'Unknown System', color: 'from-gray-400 to-gray-600' };

    return (
        <div className="max-w-4xl mx-auto py-20 px-4">
            <motionTimeline.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <div className="inline-block px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-space-accent mb-4">
                    EXPLORATION LOGS
                </div>
                <h1 className={`text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b ${planetInfo.color.replace('from-', 'from-white ').replace('to-', 'to-')}`}>
                    {planetInfo.name} EXPLORATION
                </h1>
            </motionTimeline.div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-space-accent to-transparent opacity-30"></div>

                <div className="space-y-12">
                    {historyItems.length > 0 ? (
                        historyItems.map((item, index) => (
                            <motionTimeline.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className={`flex flex-col md:flex-row gap-8 relative items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                {/* Date Bubble */}
                                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-space-accent shadow-[0_0_10px_#00f0ff] transform -translate-x-1/2"></div>

                                {/* Content Card */}
                                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors duration-300">
                                        <div className="text-space-accent font-mono text-xl mb-2">{item.year}</div>
                                        <h3 className="text-2xl font-display font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-gray-400 font-light">{item.description}</p>
                                    </div>
                                </div>

                                {/* Empty side for spacing */}
                                <div className="hidden md:block md:w-1/2"></div>
                            </motionTimeline.div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-20 font-mono">
                            暫無資訊
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center mt-20">
                <a href="./index2.html" className="inline-block px-8 py-3 border border-space-accent text-space-accent hover:bg-space-accent hover:text-black font-display tracking-widest transition-all duration-300 rounded-full">
                    RETURN TO MAP
                </a>
            </div>
        </div>
    );
};

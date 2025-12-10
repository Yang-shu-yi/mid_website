const { useState, useEffect } = React;

const HistoryApp = () => {
    const [currentPlanet, setCurrentPlanet] = useState(null);

    useEffect(() => {
        // Parse URL params
        const params = new URLSearchParams(window.location.search);
        const planetId = params.get('planet');

        // Simple validation or default
        if (planetId) {
            setCurrentPlanet(planetId);
        } else {
            // Default to earth or first planet if none specified? 
            // Or maybe show "Select a planet"
            // For now let's just default to null which Timeline handles
        }
    }, []);

    return (
        <div className="bg-space-black min-h-screen text-white overflow-x-hidden selection:bg-space-accent selection:text-space-black">
            <StarField />
            <Navigation />

            <div className="pt-24 min-h-screen relative z-10">
                <HistoryTimeline planetId={currentPlanet} />
            </div>

            <div className="fixed bottom-0 w-full h-24 bg-gradient-to-t from-space-black to-transparent pointer-events-none z-20"></div>
        </div>
    );
};

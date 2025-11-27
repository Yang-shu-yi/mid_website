const { useEffect, useRef } = React;

const StarField = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let stars = [];
        let width = 0;
        let height = 0;
        let warpSpeed = 0;
        const starCount = 1000;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const initStars = () => {
            stars = [];
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * width - width / 2,
                    y: Math.random() * height - height / 2,
                    z: Math.random() * width,
                    o: Math.random()
                });
            }
        };

        const draw = () => {
            ctx.fillStyle = 'rgba(5, 5, 5, 0.3)';
            ctx.fillRect(0, 0, width, height);
            
            const cx = width / 2;
            const cy = height / 2;

            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
            const targetSpeed = 2 + (scrollPercent * 50); 
            warpSpeed += (targetSpeed - warpSpeed) * 0.1;

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                star.z -= warpSpeed;

                if (star.z <= 0) {
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                    star.z = width;
                }

                const px = cx + (star.x / star.z) * (width * 0.8);
                const py = cy + (star.y / star.z) * (width * 0.8);
                const size = (1 - star.z / width) * 4;
                const alpha = (1 - star.z / width);

                if (px > 0 && px < width && py > 0 && py < height) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(px, py, size > 0 ? size : 0, 0, Math.PI * 2);
                    ctx.fill();

                    if (warpSpeed > 10) {
                        ctx.strokeStyle = `rgba(100, 200, 255, ${alpha * 0.5})`;
                        ctx.lineWidth = size * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        const prevZ = star.z + warpSpeed * 2;
                        const prevPx = cx + (star.x / prevZ) * (width * 0.8);
                        const prevPy = cy + (star.y / prevZ) * (width * 0.8);
                        ctx.lineTo(prevPx, prevPy);
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        resize();
        initStars();
        draw();

        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

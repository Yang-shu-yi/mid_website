const frameCount = 101;
const currentFrame = index =>
    `/ezgif-split/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`; // 改成絕對路徑 /...，適合本地伺服器；如果錯，換回 ezgif-split/

let images = [];
let videoFrames = { frame: 0 };
let imagesToLoad = frameCount;

// 將 setupScrollTriggerNew 移到全局，避免作用域問題
function setupScrollTriggerNew() { // 改成 function 宣告，提升到全局
    const nav = document.querySelector('nav'); // 定義 nav 元素
    const headers = document.querySelectorAll('.hero-content h1, .hero-content p'); // 定義 headers

    ScrollTrigger.create({
        trigger: '.hero',
        pin: true,
        start: 'top top',
        end: `+=${window.innerHeight * 4}px`,
        pinSpacing: false,
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;
            console.log('Progress:', progress, 'Frame:', videoFrames.frame); // Debug: 確認滾動觸發

            const animationProgress = Math.min(progress / 0.9, 1);
            const targetFrame = Math.round(animationProgress * (frameCount - 1));
            videoFrames.frame = targetFrame;
            render();

            if (progress >= 0.1) {
                const navOpacity = 1 - (progress / 0.1);
                gsap.set(nav, {opacity: navOpacity});
            } else {
                gsap.set(nav, {opacity: 0});
            }

            if (progress <= 0.2) {
                const zProgress = progress / 0.25;
                const translateZ = zProgress * -500;

                let opacity = 1;
                if (progress >= 0.2) {
                    const fadeProgress = Math.min((progress - 0.2) / (0.25 - 0.2), 1);
                    opacity = 1 - fadeProgress;
                }

                gsap.set(headers, {transform: `translate(-50%, -50%) translateZ(${translateZ}px)`, opacity: opacity});
            } else {
                gsap.set(headers, {opacity: 0});
            }
        }
    });

    ScrollTrigger.refresh(); // 強制刷新，確保初始化
}

const onLoad = () => {
    imagesToLoad--;
    if (!imagesToLoad) {
        console.log('All images loaded or failed');
        render();
        setupScrollTriggerNew(); // 現在可正常呼叫
    }
};

const render = () => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    const img = images[videoFrames.frame];
    if (img && img.complete && img.naturalWidth > 0) {
        const imagesAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = canvasWidth / canvasHeight;
        let drawWidth, drawHeight, drawX, drawY;
        if (imagesAspect > canvasAspect) {
            drawHeight = canvasHeight;
            drawWidth = drawHeight * imagesAspect;
            drawX = (canvasWidth - drawWidth) / 2;
            drawY = 0;
        } else {
            drawWidth = canvasWidth;
            drawHeight = drawWidth / imagesAspect;
            drawX = 0;
            drawY = (canvasHeight - drawHeight) / 2;
        }
        context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    } else {
        console.warn('Invalid image for frame:', videoFrames.frame);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis 防呆
    let lenisInstance;
    if (typeof Lenis !== 'undefined') {
        lenisInstance = new Lenis();
        lenisInstance.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    } else {
        console.error('Lenis is not defined. Falling back to native scrolling.');
        window.addEventListener('scroll', ScrollTrigger.update);
    }

    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const setCanvasSize = () => {
        const PixelRatio = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * PixelRatio;
        canvas.height = window.innerHeight * PixelRatio;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(PixelRatio, PixelRatio);
        render();
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 圖片預載入
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.onload = onLoad;
        img.onerror = () => {
            console.error('Failed to load image:', currentFrame(i));
            onLoad();
        };
        img.src = currentFrame(i);
        images.push(img);
    }

    // 原版 setupScrollTrigger（備用，如果 new 版有問題）
    function setupScrollTrigger() {
        const totalScrollDistance = document.body.scrollHeight;
        ScrollTrigger.create({
            trigger: '.hero',
            pin: true,
            start: 'top top',
            end: `+=${totalScrollDistance}`,
            scrub: true,
            onUpdate: (self) => {
                videoFrames.frame = Math.floor(self.progress * (frameCount - 1));
                render();
            }
        });
    }

});
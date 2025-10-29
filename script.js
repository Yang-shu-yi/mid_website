const frameCount = 101;
const currentFrame = index =>
  `/ezgif-split/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

let images = [];
let videoFrames = { frame: 0 };
let imagesToLoad = frameCount;
let hasAutoScrolled = false;

/* 初始化 ScrollTrigger 動畫邏輯 */
function setupScrollTriggerNew() {
  const nav = document.querySelector('nav');
  const headers = document.querySelectorAll('.hero-content h1, .hero-content p');
  const viewButton = document.querySelector('.hero-content .view-planets');
  if (viewButton) gsap.set(viewButton, { opacity: 0, y: 20, pointerEvents: 'none' });

  const scrollDistance = window.innerHeight * 5; // 控制整段動畫滾動距離

  ScrollTrigger.create({
    trigger: '.hero',
    pin: true,
    start: 'top top',
    end: `+=${scrollDistance}`,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      // 將 0~90% 的進度映射到影格播放，最後 10% 保留過度
      const animationProgress = Math.min(progress / 0.9, 1);
      const targetFrame = Math.round(animationProgress * (frameCount - 1));
      if (videoFrames.frame !== targetFrame) {
        videoFrames.frame = targetFrame;
        render();
      }

      // 在最後 10% 讓按鈕漸現
      if (viewButton) {
        const btnProgress = Math.max(0, Math.min((progress - 0.9) / 0.1, 1));
        gsap.set(viewButton, {
          opacity: btnProgress,
          y: (1 - btnProgress) * 20,
          pointerEvents: btnProgress > 0.05 ? 'auto' : 'none'
        });
      }

      // 導覽列淡出
      if (progress >= 0.1) {
        const navOpacity = Math.max(0, 1 - (progress / 0.1));
        gsap.set(nav, { opacity: navOpacity });
      } else {
        gsap.set(nav, { opacity: 1 });
      }

      // Hero 文字的 3D 移動與淡出
      if (progress <= 0.2) {
        const zProgress = progress / 0.25;
        const translateZ = zProgress * -500;
        let opacity = 1;
        if (progress >= 0.2) {
          const fadeProgress = Math.min((progress - 0.2) / (0.25 - 0.2), 1);
          opacity = 1 - fadeProgress;
        }
        gsap.set(headers, { transform: `translateZ(${translateZ}px)`, opacity });
      } else {
        gsap.set(headers, { opacity: 0 });
      }

      // 影片結束 → 自動滾動到 outro（只執行一次）
      if (progress >= 1 && !hasAutoScrolled) {
        hasAutoScrolled = true;

        // 若 ScrollToPlugin 已註冊則使用 gsap.scrollTo，否則使用原生平滑滾動備援
        if (typeof ScrollToPlugin !== 'undefined') {
          gsap.to(window, {
            scrollTo: ".outro",
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => setTimeout(() => { hasAutoScrolled = false; }, 300)
          });
        } else {
          const outro = document.querySelector('.outro');
          if (outro) {
            window.scrollTo({ top: outro.getBoundingClientRect().top + window.pageYOffset, behavior: 'smooth' });
            setTimeout(() => { hasAutoScrolled = false; }, 1500);
          } else {
            hasAutoScrolled = false;
          }
        }
      }
    }
  });

  ScrollTrigger.refresh();
}

/* 當圖片載入完畢後執行動畫設定 */
const onLoad = () => {
  imagesToLoad--;
  if (!imagesToLoad) {
    render();
    setupScrollTriggerNew();
  }
};

/* 將對應影格繪製到畫布上 */
const render = () => {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  // 清除畫布（避免殘影）
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // 僅繪製對應影格圖片（不要額外畫任何 shape）
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

    // 關閉任何 stroke/fill 設定，確保只有 drawImage
    context.beginPath();
    context.closePath();

    context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }
};

/* 初始化流程 */
document.addEventListener('DOMContentLoaded', () => {
  // 安全註冊 GSAP plugins（避免編輯器出現未定義紅線）
  const _plugins = [];
  if (typeof ScrollTrigger !== 'undefined') _plugins.push(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') _plugins.push(ScrollToPlugin);
  if (_plugins.length) gsap.registerPlugin(..._plugins);

  // Lenis 平滑滾動（若無則退回原生滾動）
  let lenisInstance;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis();
    lenisInstance.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    if (typeof ScrollTrigger !== 'undefined') {
      window.addEventListener('scroll', ScrollTrigger.update);
    } else {
      window.addEventListener('scroll', () => {});
    }
  }

  const canvas = document.querySelector('canvas');
  if (!canvas) return;
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

  // 預載入影格圖片
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.onload = onLoad;
    img.onerror = () => { onLoad(); };
    img.src = currentFrame(i);
    images.push(img);
  }
});

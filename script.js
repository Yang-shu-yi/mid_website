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

  // 簡單的互動：滑鼠進入/離開或鍵盤 focus/blur 時切換 hero-content 的放大 class
  (function setupHoverZoomOnButton() {
    const viewBtn = document.querySelector('.btn.primary.view-planets');
    const heroContent = document.querySelector('.hero-content');
    if (!viewBtn || !heroContent) return;

    const add = () => heroContent.classList.add('hover-zoom');
    const remove = () => heroContent.classList.remove('hover-zoom');

    viewBtn.addEventListener('mouseenter', add);
    viewBtn.addEventListener('mouseleave', remove);
    viewBtn.addEventListener('focus', add);   // 鍵盤聚焦也放大
    viewBtn.addEventListener('blur', remove);

    // 若按鈕內是 <a> 可能需監聽其子元素的 focus/blur：
    const link = viewBtn.closest('a') || viewBtn.querySelector('a');
    if (link) {
      link.addEventListener('focus', add);
      link.addEventListener('blur', remove);
    }
  })();

  // 移除畫面中央的「十字」overlay（保守條件：純文字為 '+'、尺寸小、位於畫面中央附近）
  (function removeCenterCrossRobust() {
    const isCandidate = (el, ww, wh) => {
      if (!el || el.nodeType !== 1) return false;
      const txt = (el.textContent || '').trim();
      if (txt !== '+' && txt !== '＋') return false;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return false;
      const cx = (r.left + r.right) / 2;
      const cy = (r.top + r.bottom) / 2;
      // 位於畫面中心 120px 範圍內，且元素不超出太大（避免誤刪 header/footer）
      return Math.abs(cx - ww / 2) < 120 && Math.abs(cy - wh / 2) < 120 && Math.max(r.width, r.height) < 160;
    };

    const hideMatches = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const all = Array.from(document.querySelectorAll('body *'));
      let found = false;
      for (const el of all) {
        try {
          if (isCandidate(el, ww, wh)) {
            // 優先隱藏，若需要可改為 el.remove()
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
            el.dataset.__cross_hidden = '1';
            found = true;
          }
        } catch (e) { /* ignore */ }
      }
      return found;
    };

    // 初始掃描 + resize 再掃描
    hideMatches();
    window.addEventListener('resize', hideMatches);

    // 監聽 DOM 變化，快速隱藏新增的十字節點
    const mo = new MutationObserver((mutations) => {
      if (hideMatches()) {
        // 若找到，稍後再執行一次以確保無殘留
        setTimeout(hideMatches, 120);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });

    // 最多掃描一段時間後停止 observer（避免永遠監聽）
    const stopAfter = 20_000; // ms
    setTimeout(() => mo.disconnect(), stopAfter);
  })();

  (function removeCenterPlusNode() {
    const root = document.querySelector('.hero-content') || document.body;
    if (!root) return;

    function cleanPlusTextNodes() {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      const removals = [];
      while (walker.nextNode()) {
        const txt = (walker.currentNode.textContent || '').trim();
        if (txt === '+' || txt === '＋') {
          const parent = walker.currentNode.parentElement;
          if (!parent) { removals.push(walker.currentNode); continue; }
          const r = parent.getBoundingClientRect();
          // 只移除位於中央且尺寸不大的候選節點，避免誤刪
          const cx = (r.left + r.right) / 2;
          const cy = (r.top + r.bottom) / 2;
          if (Math.abs(cx - window.innerWidth / 2) < 200 && Math.abs(cy - window.innerHeight / 2) < 200 && Math.max(r.width, r.height) < 200) {
            removals.push(walker.currentNode);
          }
        }
      }
      removals.forEach(n => n.parentNode && n.parentNode.removeChild(n));
    }

    // 初次清除
    cleanPlusTextNodes();

    // 監聽 DOM 變化，移除後續可能注入的「+」
    const mo = new MutationObserver(() => cleanPlusTextNodes());
    mo.observe(root, { childList: true, subtree: true, characterData: true });

    // 20s 後停止 observer（節省資源）
    setTimeout(() => mo.disconnect(), 20000);
  })();

  (function removeAllPlusTextNodes() {
    const isPlus = txt => typeof txt === 'string' && txt.trim() === '+' || txt.trim() === '＋';

    function scanAndRemove(root = document.body) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      const removals = [];
      let node;
      while ((node = walker.nextNode())) {
        try {
          if (!isPlus(node.nodeValue)) continue;
          const parent = node.parentElement;
          if (!parent) continue;
          // 只刪除位在 hero 或 hero-content 下，或位於畫面中央附近的小元素（保守條件）
          const inHero = !!parent.closest('.hero, .hero-content');
          const r = parent.getBoundingClientRect();
          const cx = (r.left + r.right) / 2;
          const cy = (r.top + r.bottom) / 2;
          const nearCenter = Math.abs(cx - window.innerWidth / 2) < 300 && Math.abs(cy - window.innerHeight / 2) < 300;
          const small = Math.max(r.width, r.height) < 220;
          if (inHero || (nearCenter && small)) removals.push(node);
        } catch (e) { /* ignore */ }
      }
      removals.forEach(n => n.parentNode && n.parentNode.removeChild(n));
      return removals.length;
    }

    // 初次掃描並移除
    scanAndRemove(document.querySelector('.hero-content') || document.body);

    // 監聽 DOM 變動，若有新節點加入則再次掃描（30s 後停止 observer）
    const mo = new MutationObserver(() => scanAndRemove(document.querySelector('.hero-content') || document.body));
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    setTimeout(() => mo.disconnect(), 30000);
  })();
});

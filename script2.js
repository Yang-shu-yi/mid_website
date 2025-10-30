const spotlightItems = [
    { name: "Mercury", img: "./img/Mercury.jpg" },
    { name: "Venus", img: "./img/Venus.jpg" },
    { name: "Earth", img: "./img/Earth.jpg" },
    { name: "Mars", img: "./img/Mars.png" },
    { name: "Jupiter", img: "./img/Jupiter.png" },
    { name: "Saturn", img: "./img/Saturn.jpg" },
    { name: "Uranus", img: "./img/Uranus.png" },
    { name: "Neptune", img: "./img/Neptune.png" },
];

let images = [];
let imagesToLoad = spotlightItems.length;

function setupScrollTrigger() {
    const titlesContainer = document.querySelector(".spotlight-titles");
    const imagesContainer = document.querySelector(".spotlight-images");
    const spotlightHeader = document.querySelector(".spotlight-header");
    const titlesContainerElement = document.querySelector(".spotlight-titles-container");
    const introTextElement = document.querySelectorAll(".spotlight-intro-text");
    const imageElement = [];

    spotlightItems.forEach((item, index) => {
        const titleElement = document.createElement("h1");
        titleElement.textContent = item.name;
        titlesContainer.appendChild(titleElement);

        const imgWrapper = document.createElement("div");
        imgWrapper.className = "spotlight-img";
        const imgElement = images[index]; // Use preloaded image
        imgWrapper.appendChild(imgElement);
        imagesContainer.appendChild(imgWrapper);
        imageElement.push(imgWrapper);
    });

    const titleElements = titlesContainer.querySelectorAll("h1");
    let currentActiveIndex = 0;

    const config = {
        gap: 0.08,
        speed: 0.3,
        arcRadius: 500,
    };

    const containerWidth = window.innerWidth * 0.3;
    const containerHeight = window.innerHeight;
    const arcStartX = 0; // 從左側開始
    const arcStartY = -200;
    const arcEndY = containerHeight + 200;
    const arcControlPointX = arcStartX + config.arcRadius;
    const arcControlPointY = containerHeight / 2;

    function getBezierPosition(t) {
        const x =
            (1 - t) * (1 - t) * arcStartX +
            2 * (1 - t) * t * arcControlPointX +
            t * t * arcStartX;
        const y =
            (1 - t) * (1 - t) * arcStartY +
            2 * (1 - t) * t * arcControlPointY +
            t * t * arcEndY;
        return { x, y };
    }

    function getImgProgressState(index, overallProgress) {
        const startTime = index * config.gap;
        const endTime = startTime + config.speed;

        if (overallProgress < startTime) return -1;
        if (overallProgress > endTime) return 2;

        return (overallProgress - startTime) / config.speed;
    }

    imageElement.forEach((img) => gsap.set(img, { opacity: 0 }));

    ScrollTrigger.create({
        trigger: ".spotlight",
        start: "top top",
        end: `+=${window.innerHeight * 10}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
            const process = self.progress;

            if (process <= 0.2) {
                const animationProgress = process / 0.2;
                const moveDistance = window.innerWidth * 0.6;
                gsap.set(introTextElement[0], { x: -animationProgress * moveDistance });
                gsap.set(introTextElement[1], { x: animationProgress * moveDistance });
                gsap.set(introTextElement[0], { opacity: 1 - animationProgress });
                gsap.set(introTextElement[1], { opacity: 1 - animationProgress });
                gsap.set(".spotlight-bg-img", { transform: `scale(${animationProgress})` });
                gsap.set(".spotlight-bg-img img", { transform: `scale(${1.5 - animationProgress * 0.5})` });
                imageElement.forEach((img) => gsap.set(img, { opacity: 0 }));
                spotlightHeader.style.opacity = "0";
                gsap.set(titlesContainerElement, { "--before-opacity": 0, "--after-opacity": 0 });
            } else if (process > 0.2 && process <= 0.25) {
                gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
                gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });
                gsap.set(introTextElement[0], { opacity: 0 });
                gsap.set(introTextElement[1], { opacity: 0 });
                imageElement.forEach((img) => gsap.set(img, { opacity: 0 }));
                spotlightHeader.style.opacity = "1";
                gsap.set(titlesContainerElement, { "--before-opacity": 1, "--after-opacity": 1 });
            } else if (process > 0.25 && process <= 0.95) {
                gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
                gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });
                gsap.set(introTextElement[0], { opacity: 0 });
                gsap.set(introTextElement[1], { opacity: 0 });
                spotlightHeader.style.opacity = "1";
                gsap.set(titlesContainerElement, { "--before-opacity": 1, "--after-opacity": 1 });

                const switchProgress = (process - 0.25) / 0.7;
                const viewportHeight = window.innerHeight;
                const titlesContainerHeight = titlesContainer.scrollHeight;
                const startPosition = viewportHeight;
                const targetPosition = -titlesContainerHeight;
                const totalDistance = startPosition - targetPosition;
                const currentY = startPosition - switchProgress * totalDistance;
                gsap.set(".spotlight-titles", { transform: `translateY(${currentY}px)` });

                imageElement.forEach((img, index) => {
                    const imageProgress = getImgProgressState(index, switchProgress);
                    if (imageProgress < 0 || imageProgress > 1) {
                        gsap.set(img, { opacity: 0 });
                    } else {
                        const pos = getBezierPosition(imageProgress);
                        gsap.set(img, { x: pos.x, y: pos.y - 75, opacity: 1 });
                    }
                });

                const ViewportMiddle = viewportHeight / 2;
                let closestIndex = 0;
                let closestDistance = Infinity;
                titleElements.forEach((title, index) => {
                    const titleRect = title.getBoundingClientRect();
                    const titleCenterY = titleRect.top + titleRect.height / 2;
                    const distanceFromCenter = Math.abs(titleCenterY - ViewportMiddle);
                    if (distanceFromCenter < closestDistance) {
                        closestDistance = distanceFromCenter;
                        closestIndex = index;
                    }
                });
                if (closestIndex !== currentActiveIndex) {
                    if (titleElements[currentActiveIndex]) {
                        titleElements[currentActiveIndex].style.opacity = "0.5";
                    }
                    titleElements[closestIndex].style.opacity = "1";
                    currentActiveIndex = closestIndex;
                }
            } else if (process > 0.95) {
                spotlightHeader.style.opacity = "0";
                gsap.set(titlesContainerElement, { "--before-opacity": 0, "--after-opacity": 0 });
            }
        },
    });

    ScrollTrigger.refresh();
}

const onLoad = () => {
    imagesToLoad--;
    if (!imagesToLoad) {
        console.log('All images loaded or failed');
        setupScrollTrigger();
    }
};

/* 在 outro 中生成所有星球縮圖（會包含你提供的那些圖片） */
function populateOutroWithThumbnails() {
  const outro = document.querySelector('.outro');
  if (!outro) return;

  // 只建立 gallery 容器（不再插入左側標題）
  outro.innerHTML = `
    <div class="planet-gallery" aria-label="Planet gallery"></div>
  `;
  const gallery = outro.querySelector('.planet-gallery');

  spotlightItems.forEach((item, index) => {
    const link = document.createElement('a');
    link.className = 'planet-thumb';
    link.href = `#planet-${index}`;
    link.setAttribute('aria-label', item.name);

    link.innerHTML = `
      <figure>
        <img src="${item.img}" alt="${item.name}">
        <figcaption>${item.name}</figcaption>
      </figure>
    `;
    gallery.appendChild(link);
  });
}

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis fallback
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

    // Preload images
    for (let i = 0; i < spotlightItems.length; i++) {
        const img = new Image();
        img.onload = onLoad;
        img.onerror = () => {
            console.error('Failed to load image:', spotlightItems[i].img);
            onLoad();
        };
        img.src = spotlightItems[i].img;
        images.push(img);
    }

    populateOutroWithThumbnails();
});
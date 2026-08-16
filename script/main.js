// Nav background border once scrolled away from very top
const scroller = document.getElementById('scroller');
const nav = document.getElementById('siteNav');
scroller.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scroller.scrollTop > 10);
});

// Reveal-on-scroll: fade/slide each page's content in as it comes into
// view (and back out on the way past, so it replays when scrolling back).
// The .reveal-ready class is what switches the CSS hidden-state on, so a
// JS failure just leaves everything visible instead of stuck invisible.
document.documentElement.classList.add('reveal-ready');
// threshold: 0 + a bottom rootMargin means "in-view" flips as soon as any
// part of the section enters that zone — independent of the section's
// total height. A ratio-based threshold (e.g. 0.2) never gets reached for
// sections taller than the viewport (stacked cards on mobile, long text
// blocks), so their content stayed stuck invisible while scrolling.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { root: scroller, threshold: 0, rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.page-inner').forEach((el) => revealObserver.observe(el));

// Active dot indicator based on which "page" is in view
const dotLinks = Array.from(document.querySelectorAll('.dot-link'));
const pageIds = ['hero', 'about', 'education', 'experience', 'project', 'certificate', 'contact'];
const targets = pageIds.map(id => document.getElementById(id));

// Track each section's visible ratio and activate the one most in view.
// (A single 0.6 threshold never fires for sections taller than the
// viewport — e.g. Certificate with its 3-card grid — leaving the
// matching dot stuck unlit.)
const visibleRatios = new Map();
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    visibleRatios.set(entry.target.id, entry.intersectionRatio);
  });
  let bestId = null;
  let bestRatio = 0;
  visibleRatios.forEach((ratio, id) => {
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestId = id;
    }
  });
  if (bestId) {
    dotLinks.forEach(d => d.classList.toggle('active', d.dataset.target === bestId));
  }
}, { root: scroller, threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });

targets.forEach(t => t && observer.observe(t));

// Screenshot gallery lightbox (project cards with data-gallery)
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCounter = document.getElementById('lightboxCounter');
let galleryImages = [];
let galleryIndex = 0;

function showGalleryImage(i) {
  galleryIndex = (i + galleryImages.length) % galleryImages.length;
  lightboxImage.src = galleryImages[galleryIndex];
  lightboxCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
}

function openLightbox(images, startIndex) {
  galleryImages = images;
  showGalleryImage(startIndex);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-gallery]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    openLightbox(JSON.parse(trigger.dataset.gallery), 0);
  });
});

lightbox.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeLightbox));
document.getElementById('lightboxPrev').addEventListener('click', () => showGalleryImage(galleryIndex - 1));
document.getElementById('lightboxNext').addEventListener('click', () => showGalleryImage(galleryIndex + 1));

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showGalleryImage(galleryIndex - 1);
  if (e.key === 'ArrowRight') showGalleryImage(galleryIndex + 1);
});

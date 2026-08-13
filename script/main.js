// Nav background border once scrolled away from very top
const scroller = document.getElementById('scroller');
const nav = document.getElementById('siteNav');
scroller.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scroller.scrollTop > 10);
});

// Active dot indicator based on which "page" is in view
const dotLinks = Array.from(document.querySelectorAll('.dot-link'));
const pageIds = ['hero', 'about', 'education', 'skills', 'experience', 'project'];
const targets = pageIds.map(id => document.getElementById(id));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      dotLinks.forEach(d => d.classList.toggle('active', d.dataset.target === id));
    }
  });
}, { root: scroller, threshold: 0.6 });

targets.forEach(t => t && observer.observe(t));

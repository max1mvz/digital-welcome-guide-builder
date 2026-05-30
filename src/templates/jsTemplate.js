// Static main.js bundled into every generated guide
export const jsContent = `/* =====================
   ACCORDION
   ===================== */
document.querySelectorAll('.accordion-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const item = toggle.closest('.accordion-item');
    const body = item.querySelector('.accordion-body');
    const isOpen = item.classList.contains('open');
    const siblings = item.closest('.accordion').querySelectorAll('.accordion-item');
    siblings.forEach(sib => {
      sib.classList.remove('open');
      sib.querySelector('.accordion-body').classList.remove('open');
    });
    if (!isOpen) {
      item.classList.add('open');
      body.classList.add('open');
    }
  });
});

/* =====================
   MODAL SYSTEM
   ===================== */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  const body = modal.querySelector('.modal-body');
  if (body) body.scrollTop = 0;
}
function closeAllModals() {
  document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-modal]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    openModal(el.dataset.modal);
  });
});
document.querySelectorAll('.modal-back').forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeAllModals();
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    // If the gallery lightbox is open, let it handle Escape (don't close the modal behind it)
    const lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('active')) return;
    closeAllModals();
  }
});

/* =====================
   GALLERY LIGHTBOX / CAROUSEL
   ===================== */
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const img = lb.querySelector('.lightbox-img');
  const counter = lb.querySelector('.lightbox-counter');
  const prevBtn = lb.querySelector('.lightbox-prev');
  const nextBtn = lb.querySelector('.lightbox-next');
  const closeBtn = lb.querySelector('.lightbox-close');
  let srcs = [];
  let idx = 0;

  function render() {
    img.src = srcs[idx] || '';
    counter.textContent = srcs.length ? (idx + 1) + ' / ' + srcs.length : '';
    const multi = srcs.length > 1;
    prevBtn.style.display = multi ? '' : 'none';
    nextBtn.style.display = multi ? '' : 'none';
  }
  function open(list, start) {
    srcs = list;
    idx = start;
    render();
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('active');
    img.src = '';
    // Keep scroll locked if a modal is still open underneath
    if (!document.querySelector('.modal.active')) document.body.style.overflow = '';
  }
  function next() { if (srcs.length) { idx = (idx + 1) % srcs.length; render(); } }
  function prev() { if (srcs.length) { idx = (idx - 1 + srcs.length) % srcs.length; render(); } }

  document.querySelectorAll('.gallery-grid').forEach(grid => {
    const items = Array.prototype.slice.call(grid.querySelectorAll('.gallery-item'));
    const list = items.map(it => it.getAttribute('href'));
    items.forEach((it, i) => {
      it.addEventListener('click', e => { e.preventDefault(); open(list, i); });
    });
  });

  nextBtn.addEventListener('click', e => { e.stopPropagation(); next(); });
  prevBtn.addEventListener('click', e => { e.stopPropagation(); prev(); });
  closeBtn.addEventListener('click', e => { e.stopPropagation(); close(); });
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  // Mobile swipe
  let startX = null;
  lb.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); }
    startX = null;
  }, { passive: true });
})();

/* =====================
   FLOATING VIDEO PLAYER
   ===================== */
(function () {
  const vlb = document.getElementById('video-lightbox');
  if (!vlb) return;
  const player = vlb.querySelector('.video-player');
  const closeBtn = vlb.querySelector('.video-close');

  function openVideo(src) {
    player.src = src;
    vlb.classList.add('active');
    document.body.style.overflow = 'hidden';
    const p = player.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }
  function closeVideo() {
    player.pause();
    vlb.classList.remove('active');
    player.removeAttribute('src');
    player.load();
    if (!document.querySelector('.modal.active')) document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-video]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openVideo(el.getAttribute('data-video'));
    });
  });

  closeBtn.addEventListener('click', e => { e.stopPropagation(); closeVideo(); });
  vlb.addEventListener('click', e => { if (e.target === vlb) closeVideo(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && vlb.classList.contains('active')) closeVideo();
  });
})();

/* =====================
   SCROLL ANIMATIONS
   ===================== */
const animTargets = document.querySelectorAll(
  '.card, .amenity-category, .rule-card, .nearby-card, .emergency-card, .review-card, .wifi-card, .host-card'
);
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
animTargets.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
`;

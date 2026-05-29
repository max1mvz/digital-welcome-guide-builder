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
  if (e.key === 'Escape') closeAllModals();
});

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

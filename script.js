const topbar = document.getElementById('topbar');
const heroCta = document.getElementById('heroCta');
function updateHeaderState() {
  if (window.scrollY > 20) topbar.classList.add('is-scrolled');
  else topbar.classList.remove('is-scrolled');

  if (heroCta) {
    const rect = heroCta.getBoundingClientRect();
    const heroCtaHidden = rect.bottom < topbar.offsetHeight;
    if (heroCtaHidden) topbar.classList.add('show-cta');
    else topbar.classList.remove('show-cta');
  }
}
window.addEventListener('scroll', updateHeaderState, { passive: true });
window.addEventListener('resize', updateHeaderState);
updateHeaderState();
const bgCeleste = document.getElementById('bgCeleste');
const anywhereSection = document.querySelector('.anywhere');
function updateCeleste() {
  if (!bgCeleste || !anywhereSection) return;
  const vh = window.innerHeight;
  const top = anywhereSection.getBoundingClientRect().top;
  const progress = Math.min(1, Math.max(0, (vh - top) / vh));
  bgCeleste.style.opacity = progress.toFixed(3);
}
window.addEventListener('scroll', updateCeleste, { passive: true });
window.addEventListener('resize', updateCeleste);
window.addEventListener('load', updateCeleste);
updateCeleste();
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale, .reveal-rotate, .reveal-bounce').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.lang-chip-row').forEach(row => {
  const prevArrow = row.previousElementSibling;
  const nextArrow = row.nextElementSibling;
  const isArrow = el => el && el.classList.contains('arrow');

  function updateArrowState() {
    const max = row.scrollWidth - row.clientWidth - 1;
    if (isArrow(prevArrow)) prevArrow.disabled = row.scrollLeft <= 0;
    if (isArrow(nextArrow)) nextArrow.disabled = row.scrollLeft >= max;
  }

  if (isArrow(prevArrow)) prevArrow.addEventListener('click', () => row.scrollBy({ left: -240, behavior: 'smooth' }));
  if (isArrow(nextArrow)) nextArrow.addEventListener('click', () => row.scrollBy({ left: 240, behavior: 'smooth' }));
  row.addEventListener('scroll', updateArrowState, { passive: true });
  window.addEventListener('resize', updateArrowState);
  window.addEventListener('load', updateArrowState);
  updateArrowState();
});
const langDropdown = document.getElementById('langDropdown');
const langBtn = document.getElementById('langBtn');
if (langBtn && langDropdown) {
  const closeLangDropdown = () => {
    langDropdown.classList.remove('open');
    langBtn.setAttribute('aria-expanded', 'false');
  };
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langDropdown.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  document.addEventListener('click', closeLangDropdown);
  langDropdown.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeLangDropdown(); langBtn.focus(); }
  });
}

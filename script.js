// ---- header: sombra sutil al scrollear + botón "EMPIEZA AHORA" que aparece cuando el del hero sale de vista ----
const topbar = document.getElementById('topbar');
const heroCta = document.getElementById('heroCta');

function updateHeaderState() {
  if (window.scrollY > 20) topbar.classList.add('is-scrolled');
  else topbar.classList.remove('is-scrolled');

  if (heroCta) {
    const rect = heroCta.getBoundingClientRect();
    // el botón del header aparece recién cuando el del hero quedó
    // realmente tapado por el header — usa la altura REAL del header,
    // nunca un número hardcodeado, para que CSS y JS no se desincronicen
    const heroCtaHidden = rect.bottom < topbar.offsetHeight;
    if (heroCtaHidden) topbar.classList.add('show-cta');
    else topbar.classList.remove('show-cta');
  }
}

window.addEventListener('scroll', updateHeaderState, { passive: true });
window.addEventListener('resize', updateHeaderState);
updateHeaderState();

// ---- fondo blanco -> celeste: el color lo decide la posición real del scroll,
//      no un degradé pintado. Progresa desde el techo de "aprende cuando quieras"
//      hasta el techo de Super (donde el corte a navy debe ser abrupto, así que
//      ahí el celeste ya tiene que estar al 100%) ----
const scrollBg = document.getElementById('scrollBg');
const transitionStart = document.querySelector('.anywhere');
const transitionEnd = document.querySelector('.super');
const WHITE = [255, 255, 255];
// el color destino sale de la variable CSS --blue-scene-3 (una sola fuente de verdad:
// si se cambia el tono en el CSS, este script lo sigue automáticamente)
function hexToRgb(hex) {
  const h = hex.trim().replace('#', '');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}
const CELESTE = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--blue-scene-3') || '#C8ECFF');

function updateScrollBg() {
  if (!scrollBg || !transitionStart || !transitionEnd) return;
  const startY = transitionStart.getBoundingClientRect().top + window.scrollY;
  const endY = transitionEnd.getBoundingClientRect().top + window.scrollY;
  const span = endY - startY;
  const progress = span > 0 ? Math.min(1, Math.max(0, (window.scrollY - startY) / span)) : 0;
  const rgb = WHITE.map((c, i) => Math.round(c + (CELESTE[i] - c) * progress));
  scrollBg.style.backgroundColor = `rgb(${rgb.join(',')})`;
}

window.addEventListener('scroll', updateScrollBg, { passive: true });
window.addEventListener('resize', updateScrollBg);
window.addEventListener('load', updateScrollBg);
updateScrollBg();

// ---- revelado de secciones e imágenes al entrar en pantalla ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale, .reveal-rotate, .reveal-bounce').forEach(el => revealObserver.observe(el));

// ---- flechas ‹ › : scrollean la fila de cursos horizontalmente y quedan
//      disabled cuando no queda más recorrido en esa dirección ----
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
  // las banderas son <img> y pueden seguir cargando cuando este script corre
  // (aunque esté al final del body) — sin esto, el ancho real de la fila
  // (scrollWidth) puede medirse antes de tiempo y dejar la flecha derecha
  // con un estado disabled incorrecto hasta el primer resize/scroll manual
  window.addEventListener('load', updateArrowState);
  updateArrowState();
});

// ---- dropdown de "idioma de la página": el click/tap es el ÚNICO mecanismo
//      de apertura (no hay :hover en el CSS). Funciona igual con mouse y touch. ----
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
  // no hace falta un listener por cada link: el click en cualquiera de ellos
  // ya burbujea hasta el listener de document de arriba, que cierra el
  // dropdown igual — un listener por link sería redundante (se ejecutaría
  // closeLangDropdown() dos veces por el mismo click)
}

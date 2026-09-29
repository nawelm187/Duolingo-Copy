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

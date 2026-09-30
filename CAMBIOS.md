# Cambios — versión final

## Celeste (corregido)
- El sitio original pone una capa `#DDF4FF` detrás de las features y de "aprende cuando quieras"; su opacidad sube de 0 a 1 con el scroll.
- Ahora: `.bg-scroll > .bg-celeste` + `updateCeleste()` en `script.js` (0 cuando el techo de `.anywhere` asoma abajo de la pantalla, 1 cuando llega arriba).
- Las secciones de adentro no pintan fondo propio (si lo hicieran taparían la capa).
- Se eliminaron `#scrollBg`, `.celeste`, `.celeste-scene` y el color `#C8ECFF`.

## Features y English Test
- Misma geometría que el original: fila de 988px (texto 503 + gap 101 + ilustración 530) desde 1080px, columna de 452px entre 768 y 1079, y 345px / títulos de 36px en móvil.
- Un solo bloque de CSS para las 5 secciones (antes había reglas separadas por sección y por `.screen`).

## Limpieza
- Sin `.screen`, sin variables CSS sin uso, sin CSS del celeste viejo.
- Capturas de referencia que la página no usa movidas a `_referencias/` (no se borró nada).
- Imágenes optimizadas sin pérdida; `personaje senalando numero 1.png` (3375px) y el logo achicados.
- `width`/`height`, `loading="lazy"` y `decoding="async"` en imágenes de contenido.

## Verificado (Chromium)
- Sin scroll horizontal a 390, 768, 900, 1024 y 1440px.
- 0 imágenes rotas.
- Celeste medido: blanco -> (238,249,255) -> (221,244,255).
- Medidas de features iguales al original a 1440px.

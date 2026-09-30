# Cambios aplicados — corrección pixel-fiel de "Anywhere" + limpieza general

## 1. Diagnóstico (antes de tocar código)

El problema real no era que faltaran objetos: era la **unidad de escala**. La escena usaba
`%` relativo a un contenedor con `max-width` fijo y padding lateral propio, distinto del
marco real de la referencia (`cuarta imagen duo.png`, 1502×760px). Con eso:

- el conjunto se veía más chico que en la referencia porque el `max-width` del contenedor
  topeaba antes de llegar al ancho real de la composición,
- título y badges no compartían la misma unidad que los objetos, así que al reescalar la
  ventana cada grupo se movía a velocidades distintas (perdían alineación entre sí),
- los badges de tienda estaban aproximados a mano, no medidos.

## 2. Medición contra la referencia

Trabajé con `cuarta imagen duo.png` como marco base y le agregué 20u arriba / 12u abajo de
aire (medido en el resto de capturas) → marco de trabajo **1502×792**.

- Recorté por alfa (bounding box de tinta, no el lienzo del PNG) cada asset usado en la
  escena y lo comparé contra el bounding box del objeto equivalente en la referencia, para
  sacar un factor de escala por objeto en vez de un tamaño "a ojo".
- Extraje con `fonttools` las métricas reales de Nunito ExtraBold (800) para calcular el
  `font-size` exacto que reproduce el ancho de línea del título en la referencia (**51.5u**,
  antes aproximado).
- Medí a nivel de píxel los dos badges de tienda (glifo, texto, padding, radio, ancho) en vez
  de mantener el diseño aproximado que había.
- Verifiqué el resultado renderizando la geometría final (objetos + título + badges) con
  Pillow y comparándola con la referencia lado a lado: **error máximo de 3u en 24 objetos
  medidos, con solo 1.11% de píxeles con diferencia fuerte** en la comparación directa.

## 3. Cambios en `styles.css` — sección Anywhere

- `.anywhere-stage` ahora es un contenedor con `aspect-ratio:1502/792` y `container-type:
  inline-size`, con una unidad propia `--u: 100cqw / 1502`. Título, badges y los 25 objetos
  de la escena escalan **todos contra la misma unidad**, así que nunca se desalinean entre
  sí sin importar el ancho de pantalla.
- Saqué el `max-width` que topaba la composición antes de tiempo: la escena ahora ocupa todo
  el ancho disponible, igual que en la referencia (teléfono izquierdo y hexágono derecho
  pegados a los bordes).
- Reescribí `.store-badge` con las medidas reales tomadas de la referencia (135×48u /
  125×48u, glifo a 20u, radio 13u, tipografía a 8.6u/12u) y un piso `--ub` para que no se
  vuelvan ilegibles en pantallas medianas antes de pasar al layout mobile.
- Nuevo breakpoint mobile en 900px (antes 768px): por debajo de ese ancho, título y badges
  vuelven al flujo normal (ya no dependen de `--u`) y la escena de objetos se muestra recortada
  al 120% del ancho, centrada, en vez de apilar o esconder objetos.

## 4. Cambios en `index.html`

- Reemplacé las posiciones de los 25 objetos de `.anywhere-scene` (6 teléfonos + 19 iconos)
  por las coordenadas medidas (`left/top/width` en % del marco 1502×792).
- Agregué la clase `store-badge--play` al segundo badge (ancho distinto, medido).

## 5. Limpieza de assets (verificado uno por uno antes de borrar)

Comparé cada imagen del proyecto contra su uso real en `src=`/`href=`/`url()` (ignorando
comentarios, para no contar una referencia que en realidad está comentada) y contra hashes
MD5 para detectar duplicados exactos. Solo borré lo que confirmé sin ninguna referencia:

- `banderas duolingo/G` e `imagenes de duolingo web/H` — archivos sin extensión ni contenido
  de imagen real, no referenciados.
- `imagenes de duolingo web/floaters/M.md` — nota suelta, no un asset.
- `imagenes de duolingo web/china.png` — duplicado exacto (mismo MD5) de
  `banderas duolingo/china.png`, que es la que se usa.
- `phone_00.png`, `phone_04.png`, `phone_05.png` — versiones recortadas más viejas,
  reemplazadas por `phone_00_full.png`/`phone_04_full.png`/`phone_05_full.png` (confirmé
  visualmente que son el mismo teléfono, versión completa).
- `icon_08.png`, `icon_09.png`, `icon_19.png`, `icon_21.png` — fragmentos sueltos de una
  extracción anterior por componentes conexos, sin uso en ninguna sección.
- `Animacion principal de duolingo 2.png` — sin ninguna referencia en el proyecto.

## 6. CSS: duplicados y muertos

- Los `@media (max-width:640px)` (3 bloques sueltos) y `@media (max-width:768px)` (5 bloques
  sueltos) estaban repetidos en distintos puntos del archivo. Los uní en un solo bloque por
  condición cada uno, verificando antes con un script que unirlos no cambiara el resultado
  final de ninguna propiedad (o sea, que ningún selector quedara pisado por otro al mover el
  bloque). 13 bloques `@media` → 7, mismas reglas, mismo comportamiento.
- Saqué `.floater{...}` — clase que ya no usa ningún elemento del HTML (la escena usa
  `.obj`/`.drift`, arquitectura que separa posición de animación para que no se pisen los
  `transform`).
- Saqué `.reveal-delay-3` (sin uso) y 5 variables CSS sin ninguna referencia
  (`--secondary-hover`, `--super-bg-deep`, `--c-super-navy-deep`, `--depth-btn-sm`,
  `--depth-float`).
- Dejé sin tocar las variables de paleta/escala que documentan colores oficiales o pasos de
  una escala completa aunque no se usen todos (`--c-bee`, `--r-pill`, `--sp-12`, etc.) —
  no son código muerto, son la documentación del sistema de diseño.

## 7. Verificación final

- 62 referencias a imágenes (`src`/`href`/`url()`), 0 rotas.
- 61 `<img>`, 61 con `alt`.
- Balance de tags (`div`, `section`, `header`, `main`, `nav`, `footer`, `button`, `h1-h3`,
  `span`, `svg`) y de llaves CSS: todo cuadra.
- `node --check script.js`: sin errores de sintaxis.
- IDs del documento: 11, sin duplicados; todos los `getElementById` de `script.js` apuntan a
  un id que existe.

## 8. Corrección posterior: el celeste no es un degradé pintado, es scroll real

Después de la entrega, el pedido fue puntual: en el sitio real el blanco pasa a celeste
**a medida que se scrollea**, no como un degradé ya dibujado dentro de una sección de
altura fija (que es lo que había: un `linear-gradient` estático en `.anywhere` + un color
sólido en `.celeste`).

Cambios:

- Agregué `#scrollBg`, un `<div>` `position:fixed;inset:0;z-index:-1` justo después de
  `<body>` — un fondo detrás de toda la página cuyo color lo pone `script.js`, no CSS.
- `.anywhere` y `.celeste` pasan a `background:transparent` — dejan de pintar su propio
  color y dejan ver `#scrollBg` a través.
- Nueva función `updateScrollBg()` en `script.js`: mide con `getBoundingClientRect()` el
  techo de `.anywhere` (inicio) y el techo de `.super` (fin), calcula el progreso real del
  scroll entre esos dos puntos (0 a 1, clampeado en los extremos) e interpola el color de
  `#scrollBg` entre blanco `(255,255,255)` y el celeste `(200,236,255)` = `--blue-scene-3`.
  Corre en `scroll`, `resize` y `load`, igual que el resto de los efectos de scroll que ya
  existían en el archivo.
- Como `#scrollBg` queda detrás de TODO el documento (no solo de esas dos secciones), le di
  `background:#fff` explícito a `.hero`, `.feature` y `.english-test` — si no, en algún punto
  del scroll (por ejemplo después de pasar Super, donde el progreso queda clampeado en 1)
  esas secciones habrían quedado con un tinte celeste que no les corresponde, porque antes
  no tenían color de fondo propio y heredaban lo que hubiera detrás.
- `.super` sigue teniendo su propio fondo navy sólido (`var(--super-bg)`), así que sobre esa
  sección el corte a oscuro sigue siendo abrupto — el celeste ya llegó al 100% antes de que
  Super empiece a taparlo.

Verificado con `node --check` (sintaxis) y probando la función de interpolación de forma
aislada con valores de progreso desde -0.2 hasta 1.3 para confirmar que clampea bien en los
dos extremos (nunca sale de blanco puro ni de celeste puro).

## Pendiente / no verificable en este entorno

No hay navegador disponible para renderizar la página real (sandbox sin salida a internet
para instalar uno) — toda la verificación de "Anywhere" se hizo componiendo los assets con
Pillow usando exactamente los mismos valores de posición/tamaño que quedaron en el CSS/HTML,
no con un screenshot del navegador. Si al abrirlo en un navegador real ves algo corrido,
decime el elemento puntual y lo ajusto con ese dato concreto.

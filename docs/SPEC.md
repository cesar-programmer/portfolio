# CESAR.DEV — Portafolio estilo consola portátil retro

Especificación del portafolio de Cesar Cordova Contreras.
Si algo aquí contradice una instrucción más reciente de Cesar, gana la instrucción de Cesar.

---

## 1. Objetivo

Un portafolio que consiga entrevistas para puestos de **AI Developer / Backend Developer (Python · JS)**.
La estética retro es el gancho para que lo recuerden; el contenido es lo que consigue el trabajo. Reglas que nunca se rompen:

1. Un reclutador debe poder ver **quién es Cesar, qué sabe hacer y cómo contactarlo en menos de 30 segundos**, sin tener que "jugar".
2. Todo el contenido es **HTML real** (no canvas): se puede seleccionar, indexar (SEO), leer con lector de pantalla y traducir.
3. Funciona perfecto en **celular**, que es donde muchos reclutadores abren el link desde LinkedIn.
4. **Bilingüe ES / EN** de principio a fin.

### Regla de oro: mínimo de clics
- Cualquier sección a **1 clic**, cualquier proyecto a **1 clic**, siguiente proyecto a **1 clic**, CV y contacto a **1 clic**.
- Nada importante depende del teclado ni del menú.

---

## 2. Dirección visual

**Principio: la consola es la protagonista; todo lo demás se calma.**

### Referencia
La forma de las portátiles de la era Game Boy Advance (horizontal y de concha) con el acabado del Game Boy original: plástico gris cálido, marco de pantalla gris oscuro, A/B magenta y rótulos en azul marino. El lenguaje de interfaz es el de los menús retro: cursor ▶ y cajas con borde pixel.
**Homenaje, no copia**: nada de logos, nombres, personajes ni sprites de Nintendo o Pokémon. Todo el arte y los nombres son originales.

### Fondo
- Casi negro con un toque morado (`--page-bg: #0e0c14`), viñeta suave en los bordes y un resplandor muy tenue y difuso detrás de la consola.
- Estrellas pixel **estáticas** a muy baja opacidad. Nada animado: sin neón, letreros, marcadores, rejilla en perspectiva ni parallax.

### Consola
- **Color por defecto:** gris cálido/crema (`--shell: #cbc8c0`), A/B magenta (`#9a2453`), rótulos y logo en azul marino (`#2f3a8a`).
- **Opciones de carcasa** (en Opciones, sobrias): índigo, plateado y negro.
- **Volumen y material:** degradados sutiles, luz arriba y sombra abajo, y una sombra suave debajo de la consola. Nada de color plano.
- **Marco de la pantalla:** gris oscuro, con la leyenda fina arriba ("PIXEL SCREEN · 32K COLORS" entre dos líneas), LED rojo y la palabra POWER.
- **Logo** "CESAR.DEV" en cursiva, grabado en la carcasa.
- **Bocina:** rejilla con ranuras; el ícono de sonido va integrado ahí, pequeño. Empieza silenciado.
- **Cruceta y A/B** con volumen (sombra interior y exterior). Letras A/B grabadas debajo.
- **Gatillos L/R** discretos, integrados a la silueta. Su área táctil es amplia aunque solo asome una franja.
- **Teclas de goma** iguales a START/SELECT (mismo material oscuro), en una fila bajo la pantalla, con la etiqueta grabada debajo en azul marino:
  - **CV** (descarga el CV del idioma activo)
  - **CONTACTO** (abre la pestaña Contacto)
  - **TV** (Modo TV)
  - **RECLUTADOR** (abre `/es/cv` o `/en/cv`)
  Área táctil mínima de 44px.
- Rótulos: START = **"MENÚ"**, SELECT = **"ES/EN"**, L = **"◀ L"**, R = **"R ▶"**.
- **Tamaño:** nunca más del ~90% del ancho ni del ~88% del alto del viewport; siempre con aire alrededor. Proporciones compactas, con alas laterales cortas.

### Pantalla: menos colores, más jerarquía
| Token | Valor | Uso |
|---|---|---|
| `--scr-bg` | `#15102a` | fondo morado muy oscuro |
| `--scr-surface` / `--scr-surface-2` | `#1c1634` / `#29214a` | cajas; fila seleccionada (ligeramente más clara) |
| `--scr-ink` / `--scr-muted` | `#ece8f6` / `#a79fc2` | texto / texto secundario |
| `--scr-title` | `#ffb000` | **único acento principal**: pestaña activa, cursor ▶, títulos y estrellas |
| `--scr-title-dim` | `#c9922f` | encabezados de grupo y de sección (ámbar tenue) |
| `--scr-accent` | `#38e8ff` | **solo** enlaces y acciones secundarias |
| `--scr-accent-2` | `#ff4fa3` | **solo** la etiqueta PRIVADO |

- **Selección:** fondo ligeramente más claro y cursor ▶ ámbar, sin bordes gruesos.
- **Etiquetas** (EN PRODUCCIÓN, NASA 2025, CASO DE ESTUDIO, PRIVADO, BONUS): texto pequeño monocromo con borde fino del mismo color. Máximo 2 visibles, y solo en la vista previa y la ficha (nunca en las filas de la lista).
- **Tipografía:** máximo 3 tamaños dentro de la pantalla, en múltiplos de 8px:
  - **Título:** Press Start 2P, 16 / 24 / 32px.
  - **Subtítulo:** Press Start 2P, 8 / 16px.
  - **Cuerpo:** Pixelify Sans, 16 / 24 / 32px.
  El tamaño sube según el ancho real de la pantalla (≥ 960px y ≥ 1700px). Hay más espacio entre elementos.
- **Easter eggs en Opciones:** paleta *Verde clásico* (4 tonos `#0f380f · #306230 · #8bac0f · #9bbc0f`) y *Pocket* (grises).
- Las capturas con dithering usan solo los tonos neutros de la pantalla.

### Tipografía de la carcasa
Rótulos en sans-serif bold azul marino; logo en Press Start 2P cursiva.

### Sonido
- Efectos chiptune con **Web Audio API** (onda cuadrada: cursor, confirmar, cancelar, pestaña, logro). Sin archivos de audio.
- **Silenciado por defecto.**

### Movimiento
- Animaciones en pasos discretos (`steps()`). El fondo nunca se anima.
- Con `prefers-reduced-motion`: sin parpadeos ni animación de concha; el texto aparece completo.

---

## 3. Controles

| Entrada | Acción |
|---|---|
| Clic / toque | Funciona directamente sobre cualquier opción (siempre con cursor de mano) |
| Hover | El cursor ▶ salta a esa opción; en Proyectos cambia la vista previa |
| Flechas / WASD / cruceta | Mover cursor; ← → en una ficha = proyecto anterior/siguiente |
| Enter / Z / botón **A** | Confirmar, completar texto |
| Esc / X / Backspace / botón **B** | Regresar |
| **Q / E**, **L / R** o gatillos **L / R** | Pestaña anterior / siguiente |
| **M** o **START (MENÚ)** | Abrir/cerrar Opciones |
| **I** o **SELECT (ES/EN)** | Cambiar idioma |
| **F** o botón **📺** | Modo TV (Esc sale) |
| Rueda del mouse / gesto táctil | Scroll dentro de la pantalla |

Texto de ayuda bajo la consola (escritorio): "Haz clic en cualquier opción · ← ↑ → ↓ · Enter / Esc · Q/E o L/R: pestañas · M: menú · I: idioma · F: Modo TV".

Primera visita: globo de diálogo dentro de la pantalla ("¡Haz clic en cualquier opción o usa las flechas!"). Se cierra solo o con cualquier interacción; se recuerda en `localStorage`.

Todo es accesible con teclado y con foco visible (`outline` real).

---

## 4. Flujo de pantallas

```
Encendido (≤ 1 s, no bloqueante, solo primera visita)
  └─> PESTAÑAS fijas arriba de la pantalla:
      PROYECTOS · YO · SKILLS · MISIONES · MEDALLAS · CONTACTO
      PROYECTOS → Ficha de proyecto (◀ ▶ anterior/siguiente)
START (MENÚ) → ventana de Opciones (sobre cualquier pestaña)
```

Ya no hay "PRESS START" obligatorio, menú principal ni mapa con sprite caminando.

### 4.1 Encendido
≤ 1 s, no bloquea la interacción y solo aparece en la primera visita. Después entra **directo** a PROYECTOS.

### 4.2 Pestañas
- Fila fija arriba, dentro de la pantalla, siempre visible.
- Gatillos L/R y teclas Q/E cambian a la pestaña anterior/siguiente.
- En pantallas angostas: iconos con etiqueta y scroll horizontal.
- Cada pestaña y cada proyecto tiene su URL por idioma (§7).

### 4.3 PROYECTOS (estilo enciclopedia)
- Sin encabezado ni filtros: el nombre y el título ya están en la carcasa y en YO, y el Modo reclutador es una tecla de la carcasa.
- **Lista** a la izquierda agrupada por mundo (**IA / Producción / Sistemas**) con encabezados discretos. Cada fila muestra solo nombre, estrellas y ✓ si ya se visitó. ← → saltan al mundo anterior o siguiente. Al final, "Zona clásica" colapsada (solo enlaces).
- **Vista previa** a la derecha (imagen o ilustración, nombre, rol, hasta 2 etiquetas, misión y stack) que cambia con **hover** o con las flechas, sin clic.
- **Un clic (o A)** abre la ficha. Si el espacio es angosto, lista y vista previa se apilan.
- Visitar todos los proyectos desbloquea la medalla secreta **"Explorador"** con sonido de logro.

### 4.4 Ficha de proyecto
1. **Imagen.** Captura real: se muestra reducida a la paleta de la pantalla (dithering) y "Ver a color" la transforma con un parpadeo blanco. Sin captura: **ilustración pixel art** con datos ficticios, etiqueta "Ilustración", sin "Ver a color".
2. **Nombre**, rol de Cesar (en grande cuando es liderazgo) y año.
3. **Misión** — 1–2 frases (máquina de escribir; A la completa).
4. **Lo que hice** — 3 viñetas máximo.
5. **Jefe final** — el reto técnico más difícil y cómo se resolvió (máquina de escribir).
6. **Stack**.
7. **Botones:** `Ver demo` · `Ver código` · `Caso de estudio` (solo los que existan; si es privado: "Código privado 🔒").
8. **◀ ▶** para ir al proyecto anterior/siguiente sin cerrar; ← → también. B / Esc vuelve a la lista.

### 4.5 YO (Sobre mí)
Credencial con retrato pixel (respira en 2 cuadros), nombre, clase "AI / Backend Dev", base "Tijuana, B.C.", idiomas, estudios y resumen de 2–3 líneas.
**Habilidades especiales** (estilo movimientos de RPG): nombre + una línea con evidencia concreta. Sin valores numéricos ni barras.

### 4.6 SKILLS (Mochila)
Bolsillos como pestañas: IA & ML · Backend · Frontend · Herramientas (← →). Lista de ítems con cursor (↑ ↓, hover) y, a la derecha, en qué proyectos se usó cada uno (enlaces a las fichas), experiencia o certificación. A abre el primer proyecto.

### 4.7 MISIONES (Experiencia y educación)
Bitácora en línea de tiempo: Clever Cloud (Full-Stack, mar–sep 2025), Gobierno del Estado de B.C. (prácticas, Mesa Espejo), formación UABC y SDGKU (2024).

### 4.8 MEDALLAS
Vitrina de 8 huecos con medallas pixel (emblema por medalla): AWS Academy Graduate — Cloud Architecting · DeepLearning.AI — TensorFlow Developer · **NASA Space Apps 2025 — líder del equipo Sofonques** · (secreta) **Explorador**. Huecos vacíos con "???". Las flechas recorren la vitrina; abajo se ve el detalle, el enlace de verificación si existe y el proyecto relacionado.

### 4.9 CONTACTO
Email `cesarcordova.developer@gmail.com` (copiar → "¡Copiado!"), LinkedIn, GitHub `cesar-programmer`, descarga del CV (ES y EN). **Sin teléfono** en ninguna parte del sitio.

### 4.10 Opciones (START / MENÚ)
Idioma · Sonido · Paleta de pantalla · Color de carcasa · Velocidad de texto (lenta / normal / instantánea) · Modo reclutador.

---

## 5. Contenido de proyectos

Textos en `src/content/{es,en}/projects.json`; metadatos sin idioma (stack, enlaces, estrellas, imágenes, año) en `src/content/shared/projects.json`.

### Mundo IA
- **★★★★★ Stepable** (2026) — repo público `cesar-programmer/stepable`. Capturas del repo (`docs/assets/recorrido.png`, `asistente.png`, `editor.png`).
- **★★★★ Vector Service API** (2025) — repo público (recomendado renombrarlo a `vector-service-api`). "¿Sabías que…?": será el cerebro del NPC "El Profesor".
- **★★★★ Sofonques Explorer — NASA Space Apps Challenge 2025** — Cesar fue **líder del equipo y desarrollador backend** (rol en grande). Repo privado. Etiqueta y medalla "NASA 2025".
- **★★ Finance Chatbot** (2024, bonus) — primer RAG con Chainlit.

### Mundo Producción
- **★★★★★ Mesa Espejo** — prácticas, Gobierno del Estado de B.C. **Caso de estudio con datos ficticios**, sin código ni capturas reales. Año: pendiente.
- **★★★★ Sistema de Reportes Docentes — UABC** (2025) — **EN PRODUCCIÓN**. Repo privado.
- **★★ Koa Caffe — Menú digital** (2026, cliente real) — repo `coffe-menu`, GitHub Pages + QR.

### Mundo Sistemas
- **★★★★★ Ecosistema Antigravity** (2026) — repo privado `newsbot`. **Proyecto de ingeniería, no promesa de ganancias**: sin rendimientos, saldos ni cuentas.
- **★★★★ Alerta ACV** (2025) — UABC & Cruz Roja Mexicana. Repo privado. Jefe final: lograr que MediaPipe analizara el rostro en tiempo real dentro de una app Flutter con rendimiento aceptable en Android; se resolvió con un módulo nativo en Kotlin (CameraX + MediaPipe) conectado por method channel.
- **★★ WalletG** (2024, bonus) — Django REST + React.

**Zona clásica** (colapsada): ecommerceShopy, machineLearningJS, proyectos del bootcamp. Solo enlaces.

> No incluir: ElotApp, `langchain-notes`, `test-m` (nunca enlazarlo), SmartMaq.

---

## 6. Modo reclutador

Ruta propia: `/es/cv` y `/en/cv`. Se llega desde la tecla **RECLUTADOR** de la carcasa, desde Opciones o por URL.
- Una sola página limpia, sin consola ni animaciones: nombre, título y contacto; resumen; proyectos destacados (Stepable, Ecosistema Antigravity, Mesa Espejo, Sofonques Explorer, Reportes Docentes, Vector Service API, Alerta ACV); experiencia; habilidades; certificaciones; educación; descargar CV.
- Usa la paleta a color y la tipografía pixel en títulos, con cuerpo en fuente normal.
- Imprimible (`@media print`). Botón "▶ Volver al juego".

---

## 7. Técnico

### Stack
Vite + React + TypeScript · Tailwind CSS 4 · Zustand · React Router · textos en JSON por idioma · Deploy en Vercel (`VITE_SITE_URL` en `src/config.ts`).

### Rutas (una por pestaña, proyecto e idioma)
| ES | EN |
|---|---|
| `/es/proyectos`, `/es/proyectos/:slug` | `/en/projects`, `/en/projects/:slug` |
| `/es/yo` | `/en/about` |
| `/es/skills` | `/en/skills` |
| `/es/misiones` | `/en/missions` |
| `/es/medallas` | `/en/badges` |
| `/es/contacto` | `/en/contact` |
| `/es/cv` | `/en/cv` |

`/` redirige según el idioma del navegador. Cambiar de idioma conserva la sección y el proyecto.

### Distribución responsiva
| Viewport | Consola |
|---|---|
| Celular vertical (< 600px) | **Concha abierta** centrada, al 90% × 88% del viewport; los controles nunca quedan tapados por la barra del navegador. Animación de apertura ≤ 1 s en la primera visita (saltable; desactivada con reduced-motion). |
| Celular horizontal (alto < 500px) | **Horizontal compacta**: la pantalla llena casi toda la altura; controles reducidos a los lados. |
| Tablet vertical (600–1023px) | Concha centrada con ancho máximo. |
| Laptop (1024–1439px) | Horizontal ajustada a la altura; pantalla ≥ 55% del ancho de la consola. |
| ≥ 1440px, 2K, 4K, ultra ancho | Horizontal con **tamaño máximo**, limitada por la altura. El espacio sobrante muestra el fondo sobrio de §2. |

- **Pantalla 3:2** en las consolas horizontales. En la concha la pantalla ocupa todo el alto disponible de la tapa (hasta ~1:1.1) para que el contenido sea legible en celular.
- Escalado con una variable CSS (`--u`) calculada del ancho y alto disponibles (≤ 90% × 88% del viewport), con mínimo y máximo.
- El contenido de la pantalla usa **container queries sobre la pantalla** (no sobre el viewport).
- Sprites, iconos y bordes pixel con escalado entero e `image-rendering: pixelated`. Fuentes pixel en múltiplos de 8px.

### Modo TV
Botón 📺 o tecla F: la pantalla llena el viewport con un marco delgado y la consola se oculta. Usa la Fullscreen API si está disponible. Esc o el mismo botón vuelve.

### Estructura
```
src/
  content/es|en/   profile, projects, skills, experience, badges, ui (.json)
  content/shared/  metadatos sin idioma
  console/         Console (horizontal / concha), partes de la carcasa, input y useControls, useLayout, TV
  ambient/         fondo sobrio
  screens/         GameScreen (pestañas), Projects, ProjectDetail, About, Skills, Missions, Badges, Contact, Options, Boot
  ui/              Menu, Panel, Typewriter, PixelImage, PixelIcon, TipBubble, Toast
  recruiter/       RecruiterPage
  audio/           sfx.ts
  store/           game.ts
  routes.ts        rutas por idioma
public/
  screenshots/  illustrations/  cv/
```

### Calidad mínima
- Lighthouse ≥ 90 en Performance, Accessibility, SEO y Best Practices.
- Open Graph con imagen de vista previa; `lang` por idioma y `hreflang` ES/EN.
- Imágenes optimizadas; fuentes con `font-display: swap`; sin API keys en el cliente.

### Arte
Pixel art propio (SVG/PNG pequeños). Ilustraciones de proyectos sin captura (Mesa Espejo, Reportes Docentes, Antigravity, Alerta ACV, Sofonques, WalletG, Finance Chatbot) con datos ficticios. El dithering de capturas se hace en runtime con un `<canvas>` oculto; la imagen visible sigue siendo `<img>` con `alt`.

---

## 8. Fases

1. **Base** ✅ — proyecto, tokens, contenido ES/EN, controles.
2. **Rediseño de consola y Proyectos** ✅ — consola horizontal y de concha, botones de la carcasa, paleta a color, pestañas con rutas, PROYECTOS completo (lista + vista previa + ficha con ◀ ▶), Opciones y Modo TV. Corrección de estilo: acabado clásico, fondo sobrio, un solo acento.
3. **Resto de pestañas** ✅ — YO, SKILLS, MISIONES, MEDALLAS y CONTACTO pulidas; ilustraciones pixel art propias por proyecto; retrato y medallas pixel.
4. **Modo reclutador, accesibilidad, SEO, rendimiento y deploy** en Vercel.
5. **NPC con IA — "El Profesor"** — responde preguntas sobre Cesar usando el **Vector Service API** (FastAPI + ChromaDB) con su CV y fichas indexadas, más un LLM. Cita la ficha de origen, límite de uso por visitante y respuesta de respaldo.

Un commit por bloque de trabajo terminado; repo público `cesar-programmer/portfolio`.

---

## 9. Decisiones y pendientes

### Decidido
- ElotApp no entra. Teléfono no aparece. Dominio propio después (`*.vercel.app` mientras tanto).
- Sofonques: NASA Space Apps Challenge 2025, Cesar **líder y backend**; también en la vitrina de Medallas.
- Reportes Docentes en uso en la UABC. Antigravity sin cifras de trading. Mesa Espejo solo con datos ficticios.
- "Lo que hice" condensado a 3 viñetas máximo.
- Soft skills como "Habilidades especiales" con evidencia, sin números.
- CV en español e inglés.

### Pendiente
- [ ] URL de LinkedIn.
- [ ] Año de Mesa Espejo.
- [ ] Revisar las Habilidades especiales propuestas (marcadas con `"review": true` en `profile.json`).
- [ ] Revisar textos de "Jefe final" (Mesa Espejo, Reportes Docentes, Koa Caffe, Finance Chatbot, WalletG).
- [ ] CV en PDF (ES y EN) en `public/cv/`.
- [ ] Capturas reales de Vector Service API (panel Streamlit y `/docs`) y Koa Caffe, si se quieren en lugar de las ilustraciones.

## 10. Fuera del sitio (pero suma)
- Fijar en GitHub: portfolio, Stepable, Vector Service API y Koa Caffe Menu.
- Bio y README de perfil con enlace al portafolio; "About" en cada repo destacado; renombrar el microservicio vectorial.

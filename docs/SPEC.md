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

### Referencia
Consolas portátiles de la era Game Boy Advance (horizontal y de concha) con el lenguaje de interfaz de los menús arcade y RPG retro: cursor ▶, cajas con borde pixel, efecto máquina de escribir.
**Homenaje, no copia**: nada de logos, nombres, personajes ni sprites de Nintendo o Pokémon. Todo el arte y los nombres son originales.

### Pantalla a color (por defecto) — paleta "Arcade"
Referencia: menús arcade retro tipo "START GAME / PLAYER 1". Pixel duro siempre (sombras sin desenfoque).

| Token | Valor | Uso |
|---|---|---|
| `--scr-bg` | `#140c2e` | fondo de la pantalla |
| `--scr-surface` / `--scr-surface-2` | `#1e1442` / `#2a1c5c` | cajas y elementos elevados |
| `--scr-ink` | `#f3eeff` | texto |
| `--scr-muted` | `#bfb2e8` | texto secundario |
| `--scr-title` | `#ffb000` | títulos (ámbar, con sombra pixel dura) |
| `--scr-accent` | `#38e8ff` | acento cian (cursor, foco, enlaces) |
| `--scr-accent-2` | `#ff4fa3` | acento rosa (etiquetas, avisos) |

**Easter eggs en Opciones:** paleta *Verde clásico* (los 4 tonos `#0f380f · #306230 · #8bac0f · #9bbc0f`) y *Pocket* (grises). Se guardan en `localStorage` con try/catch.

### Carcasa
- Color por defecto: **morado índigo**. Opciones: **plateado** y **negro**. Todo con tokens CSS (`data-shell` en `<html>`).
- Rótulos: START = **"MENÚ"**, SELECT = **"ES/EN"**, L = **"◀ L"**, R = **"R ▶"**.
- Botones físicos siempre visibles, fuera de la pantalla:
  - **"CV ⬇"**: descarga directa del CV en el idioma activo.
  - **"✉ CONTACTO"**: abre la pestaña Contacto.
  - **"📺"**: Modo TV (§7).
  - **Bocina**: activa/silencia el sonido (empieza silenciado).

### Tipografía
- Títulos, pestañas de la carcasa y etiquetas: **Press Start 2P** en múltiplos de 8px.
- Texto largo: **Pixelify Sans**. Cuerpo mínimo **16px reales** (24px y 32px en pantallas grandes).

### Sonido
- Efectos chiptune con **Web Audio API** (onda cuadrada: cursor, confirmar, cancelar, pestaña, logro). Sin archivos de audio.
- **Silenciado por defecto.**

### Movimiento
- Animaciones en pasos discretos (`steps()`).
- Con `prefers-reduced-motion`: sin parpadeos, sin parallax, sin animación de concha; el texto aparece completo.

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
- Encabezado compacto: nombre, "AI & Backend Developer" y botón **"Modo reclutador ⏩"**.
- **Lista** a la izquierda agrupada por mundo (**IA / Producción / Sistemas**) con filtro rápido. Visitados marcados ✓. Al final, "Zona clásica" colapsada (solo enlaces).
- **Vista previa** a la derecha (imagen o ilustración, misión, stack, etiquetas como EN PRODUCCIÓN, NASA 2025, PRIVADO) que cambia con **hover** o con las flechas, sin clic.
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
Credencial: nombre, clase "AI / Backend Dev", base "Tijuana, B.C.", idiomas, estudios y resumen de 2–3 líneas.
**Habilidades especiales** (estilo movimientos de RPG): nombre + una línea con evidencia concreta. Sin valores numéricos ni barras.

### 4.6 SKILLS (Mochila)
Bolsillos: IA & ML · Backend · Frontend · Herramientas. Al elegir un ítem se ve en qué proyectos se usó (enlaces a las fichas).

### 4.7 MISIONES (Experiencia y educación)
Bitácora: Clever Cloud (Full-Stack, mar–sep 2025), Gobierno del Estado de B.C. (prácticas, Mesa Espejo), formación UABC y SDGKU (2024).

### 4.8 MEDALLAS
Vitrina de 8 huecos: AWS Academy Graduate — Cloud Architecting · DeepLearning.AI — TensorFlow Developer · **NASA Space Apps 2025 — líder del equipo Sofonques** · (secreta) **Explorador**. Huecos vacíos con "???". Cada medalla abre su detalle y enlace de verificación si existe.

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

Ruta propia: `/es/cv` y `/en/cv`. Se llega desde el encabezado de PROYECTOS, desde Opciones o por URL.
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
| Celular vertical (< 600px) | **Concha abierta** a pantalla completa (`100dvh`); controles nunca tapados por la barra del navegador. Animación de apertura ≤ 1 s en la primera visita (saltable; desactivada con reduced-motion). |
| Celular horizontal (alto < 500px) | **Horizontal compacta**: la pantalla llena casi toda la altura; controles reducidos a los lados. |
| Tablet vertical (600–1023px) | Concha centrada con ancho máximo. |
| Laptop (1024–1439px) | Horizontal ajustada a la altura; pantalla ≥ 55% del ancho de la consola. |
| ≥ 1440px, 2K, 4K, ultra ancho | Horizontal con **tamaño máximo**, limitada por la altura. El espacio sobrante muestra un **fondo ambiental**: habitación arcade nocturna con neón y estrellas pixel, con parallax sutil (desactivado con reduced-motion). |

- **Pantalla 3:2** en las consolas horizontales. En la concha la pantalla ocupa todo el alto disponible de la tapa (hasta ~1:1.1) para que el contenido sea legible en celular.
- Escalado con una variable CSS (`--u`) calculada del ancho y alto disponibles, con mínimo y máximo.
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
  ambient/         fondo arcade
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
2. **Rediseño de consola y Proyectos** ✅ — consola horizontal y de concha, botones de la carcasa, paleta a color, pestañas con rutas, PROYECTOS completo (lista + vista previa + ficha con ◀ ▶), Opciones, Modo TV, fondo ambiental.
3. **Resto de pestañas** — pulir YO, SKILLS, MISIONES, MEDALLAS y CONTACTO; ilustraciones pixel art de los proyectos sin captura.
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
- [ ] Capturas de Vector Service API (panel Streamlit y `/docs`) y Koa Caffe.

## 10. Fuera del sitio (pero suma)
- Fijar en GitHub: portfolio, Stepable, Vector Service API y Koa Caffe Menu.
- Bio y README de perfil con enlace al portafolio; "About" en cada repo destacado; renombrar el microservicio vectorial.

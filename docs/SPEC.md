# CESAR.DEV — Portafolio estilo Game Boy

Especificación para construir el portafolio de Cesar Cordova Contreras con Claude Code.
Léela completa antes de escribir código. Si algo aquí contradice una instrucción más reciente de Cesar, gana la instrucción de Cesar.

---

## 1. Objetivo

Un portafolio que consiga entrevistas para puestos de **AI Developer / Backend Developer (Python · JS)**.
El estilo Game Boy es el gancho para que lo recuerden; el contenido es lo que consigue el trabajo. Reglas que nunca se rompen:

1. Un reclutador debe poder ver **quién es Cesar, qué sabe hacer y cómo contactarlo en menos de 30 segundos**, sin tener que "jugar".
2. Todo el contenido es **HTML real** (no canvas): se puede seleccionar, indexar (SEO), leer con lector de pantalla y traducir.
3. Funciona perfecto en **celular**, que es donde muchos reclutadores abren el link desde LinkedIn.
4. **Bilingüe ES / EN** de principio a fin.

---

## 2. Dirección visual

### Referencia
Game Boy original (DMG) con el lenguaje de interfaz de los RPG de esa consola: menús con cursor ▶, cajas de texto con borde doble, efecto máquina de escribir, mapa de región con rutas y nodos.
**Homenaje, no copia**: nada de logos, nombres, personajes ni sprites de Nintendo o Pokémon. Todo el arte y los nombres son originales.

### Paleta (4 tonos, como la pantalla real)
| Token | Hex | Uso |
|---|---|---|
| `--gb-darkest` | `#0f380f` | texto, bordes, sombras |
| `--gb-dark` | `#306230` | elementos secundarios |
| `--gb-light` | `#8bac0f` | fondos de cajas |
| `--gb-lightest` | `#9bbc0f` | fondo de pantalla |

**Easter egg:** en Opciones se puede cambiar la paleta de la pantalla: *Verde clásico* (default), *Pocket* (grises) y *Color* (variante con acentos de color). Se guarda en `localStorage` dentro de try/catch.

### La consola
- **Escritorio:** la pantalla queda dentro de una carcasa de Game Boy dibujada con CSS/SVG (original, sin marcas), centrada. La cruceta, A, B, START y SELECT **funcionan con clic**. Debajo de la carcasa va un texto pequeño: "Usa ← ↑ → ↓, Enter y Esc · o haz clic".
- **Celular:** la carcasa ocupa toda la pantalla en vertical; la cruceta y los botones son **los controles táctiles reales**. Así el formato del Game Boy resuelve la navegación móvil de forma natural.
- Proporción de pantalla 10:9 (160×144), escalada a múltiplos enteros cuando se pueda (`image-rendering: pixelated`).
- Efectos sutiles: rejilla de píxeles con baja opacidad, leve "ghosting" en transiciones y encendido con fundido de la pantalla. Nada que canse la vista.

### Tipografía
- Menús y títulos: **Press Start 2P** (Google Fonts).
- Texto largo (descripciones de proyectos): **Pixelify Sans** o **VT323**, en un tamaño legible (mínimo 16px equivalentes en móvil).

### Sonido
- Efectos chiptune generados con **Web Audio API** (onda cuadrada: cursor, confirmar, cancelar, logro, encendido). Sin archivos de audio.
- **Silenciado por defecto.** Un icono de bocina en la carcasa lo activa.

### Movimiento
- Animaciones con **Framer Motion** (o CSS) en pasos discretos (`steps()`) para que se sientan de 8 bits.
- Con `prefers-reduced-motion`: sin parpadeos ni sacudidas; el texto aparece completo, sin efecto máquina de escribir.

---

## 3. Controles

| Entrada | Acción |
|---|---|
| Flechas / WASD / cruceta | Mover cursor |
| Enter / Z / botón **A** | Confirmar, avanzar texto |
| Esc / X / Backspace / botón **B** | Regresar, saltar texto |
| **START** | Abrir menú principal desde cualquier pantalla |
| **SELECT** | Cambiar idioma ES ⇄ EN |
| Clic / toque | Funciona directamente sobre cualquier opción |

Todo es accesible con teclado y con foco visible (borde ▶ parpadeante y `outline` real para lectores de pantalla).

> Implementación: START = tecla **M**, SELECT = tecla **L** (ver `src/console/input.ts`).

---

## 4. Flujo de pantallas

```
Encendido → Título (PRESS START) → Menú principal
                                    ├── MAPA DE PROYECTOS → Ficha de proyecto
                                    ├── TARJETA DE ENTRENADOR (sobre mí)
                                    ├── MOCHILA (habilidades)
                                    ├── DIARIO (experiencia y educación)
                                    ├── MEDALLAS (certificaciones)
                                    ├── GUARDAR (contacto + CV)
                                    └── OPCIONES (idioma, sonido, paleta, modo reclutador)
```

### 4.1 Encendido (≤ 2.5 s, se salta con cualquier tecla)
Pantalla en blanco → el logo original **CESAR.DEV** baja desde arriba → "ding" de dos notas → transición al título.
Solo se reproduce en la primera visita de la sesión.

### 4.2 Título
- Sprite original de Cesar (pixel art, de frente, animación de respiración de 2 cuadros).
- "CESAR CORDOVA" / "AI & Backend Developer".
- **PRESS START** parpadeando.
- Esquina superior: botón visible **"Modo reclutador ⏩"** (ver §6). Debe verse desde el primer segundo.

### 4.3 Menú principal
Caja a la derecha con cursor ▶, como el menú de pausa de un RPG. Al lado, un pequeño texto que describe la opción seleccionada.

### 4.4 Mapa de proyectos (el selector de niveles)
Un mapa de región original con **3 zonas** unidas por rutas. Cada proyecto es un nodo.
- Mover el cursor entre nodos hace que un pequeño sprite de Cesar camine por la ruta hasta el nodo (animación automática; el usuario no controla al personaje).
- Una caja inferior muestra: nombre del nivel, stack en iconos y "dificultad" (★).
- **A** entra a la ficha del proyecto. **B** vuelve al menú.
- Los nodos visitados quedan marcados ✓ (se guarda en `localStorage`).
- Visitar todos los proyectos desbloquea la medalla secreta "Explorador" con sonido de logro.

Zonas y niveles en §5.

### 4.5 Ficha de proyecto ("Entrada de la enciclopedia")
Estructura fija para cada proyecto:
1. **Imagen.** Si hay captura real: se muestra convertida a la paleta de 4 tonos (dithering) y al presionar **A** o "Ver a color" se transforma con una animación de "evolución" (parpadeo blanco) en la captura a todo color. Si no hay captura (proyectos privados o entregados): se usa una **ilustración en pixel art** de la interfaz hecha para el portafolio, con datos ficticios, con la etiqueta "Ilustración" y sin la opción de ver a color.
2. **Nombre**, rol de Cesar y año.
3. **Misión** — el problema, en 1–2 frases.
4. **Lo que hice** — 3 viñetas máximo, con verbos de acción.
5. **Jefe final** — el reto técnico más difícil y cómo se resolvió.
6. **Stack** — iconos pixel.
7. **Botones:** `Ver demo` · `Ver código` · `Caso de estudio` (solo los que existan; si el código es privado se muestra "Código privado 🔒").

El texto de Misión y Jefe final aparece con efecto máquina de escribir; **A** lo completa al instante.

### 4.6 Tarjeta de entrenador (Sobre mí)
Formato de credencial: sprite de Cesar, nombre, clase "AI / Backend Dev", base "Tijuana, B.C.", idiomas (Español nativo · Inglés B2), estudios (Ingeniería en Software — UABC) y un resumen de 2–3 líneas.
Estadísticas en barras de 8 segmentos para las soft skills (Comunicación, Trabajo en equipo, Resolución de problemas, Organización, Pensamiento crítico, Proactividad, Empatía).

### 4.7 Mochila (Habilidades)
Inventario con pestañas como bolsillos:
- **IA & ML:** Python, TensorFlow, LangChain, LangGraph, OpenAI API, RAG (embeddings, vector DBs, retrieval), FastAPI, MCP, MediaPipe / visión por computadora, n8n.
- **Backend:** Node.js, Express, PHP (POO), Medoo, PostgreSQL / PostGIS / pgvector, MySQL, REST APIs, JWT, Docker.
- **Frontend:** JavaScript, TypeScript, React, Next.js, Vue.js, Vite, Tailwind, Bootstrap.
- **Herramientas:** Git/GitHub, Supabase, Playwright, Vitest, Agile/Scrum, CI/CD.

Al seleccionar un ítem, la caja inferior dice en qué proyectos se usó (enlaces a esas fichas). Esto conecta habilidades con pruebas.

### 4.8 Diario (Experiencia y educación)
Formato de bitácora de misiones:
- **Misión completada — Full-Stack Developer, Clever Cloud** (mar–sep 2025): Vue.js + PHP con arquitectura limpia; APIs REST con Medoo y documentación técnica; entregas continuas en Agile/Scrum.
- **Misión completada — Prácticas profesionales, Gobierno del Estado de B.C.** (Coordinación de Gabinete): Mesa Espejo.
- **Formación:** Ingeniería en Software — UABC · Full Stack Developer — San Diego Global Knowledge University (2024).

### 4.9 Medallas (Certificaciones)
Vitrina con 8 huecos (como estuche de medallas). Desbloqueadas:
- AWS Academy Graduate — Cloud Architecting
- DeepLearning.AI — TensorFlow Developer Specialization
- (Secreta) Explorador — visitar todos los proyectos

Huecos vacíos con "???" (sugiere crecimiento). Cada medalla abre su detalle y enlace de verificación si existe.

### 4.10 Guardar (Contacto)
"¿Quieres guardar tu progreso?" → **SÍ** muestra la caja de contacto:
- Email `cesarcordova.developer@gmail.com` (botón copiar con "¡Copiado!")
- LinkedIn, GitHub `cesar-programmer`
- **Descargar CV** (PDF, versión ES y EN)
- **Sin teléfono** en ninguna parte del sitio (decisión de Cesar).

Animación "GUARDANDO… ▓▓▓▓▓░░" antes de mostrar los datos (≤ 1 s).

### 4.11 Opciones
Idioma · Sonido · Paleta · Velocidad de texto (lenta / normal / instantánea) · **Modo reclutador**.

---

## 5. Contenido de proyectos

Los textos viven en `src/content/{es,en}/projects.json` y los metadatos (stack, enlaces, estrellas, imágenes) en `src/content/shared/projects.json`.

### Zona 1 — LABORATORIO IA (lo que respalda el título "AI Developer")
- **★★★★★ Stepable** — jefe de la zona, primer nodo destacado. Repo público `cesar-programmer/stepable`. Capturas: `docs/assets/recorrido.png`, `asistente.png`, `editor.png` del repo.
- **★★★★ Vector Service API** — segundo nodo; conectado por una ruta a Stepable y al NPC "El Profesor". Repo público (recomendado renombrarlo a `vector-service-api`). Capturas: panel Streamlit y `/docs` de FastAPI. En su ficha, un "¿Sabías que…?" indica que será el cerebro del NPC (fase 6).
- **★★★★ Sofonques Explorer — NASA Space Apps Challenge 2025** — equipo Sofonques; Cesar fue **líder del equipo y desarrollador backend** (mostrar el rol en grande). Repo privado `base-nasa-proyect` → "Código privado 🔒". El nodo tiene forma de estrella y su ficha muestra una medalla "Space Apps 2025".
- **★★ Finance Chatbot** (nivel bonus, 2024) — repo `financeChatbot-`, primer RAG con Chainlit. "Primer paso" en la línea de tiempo de IA.

### Zona 2 — CIUDAD (software en producción para clientes e instituciones reales)
- **★★★★★ Mesa Espejo** — jefe de la zona. Prácticas, Gobierno del Estado de B.C. **Caso de estudio, sin enlace al código y solo con datos ficticios**. Ilustraciones pixel art (semáforos, mapa de calor, tabla de incidencias) marcadas como "Ilustración".
- **★★★★ Sistema de Reportes Docentes — UABC** — en producción. Repo privado. Etiqueta "EN PRODUCCIÓN" parpadeante en la ficha y en el nodo.
- **★★ Koa Caffe — Menú digital** (cliente real) — repo público `coffe-menu`, GitHub Pages + QR.

### Zona 3 — TALLER (móvil, tiempo real y sistemas)
- **★★★★★ Ecosistema Antigravity** — jefe de la zona. Repo privado `newsbot`. **Proyecto de ingeniería de sistemas, no promesa de ganancias**: sin rendimientos, saldos ni nombres de cuentas.
- **★★★★ Alerta ACV** — UABC & Cruz Roja Mexicana. Repo privado `stroke`. Ilustraciones de las pruebas (rostro, brazos, habla) y botón de emergencia.
- **★★ WalletG** (nivel bonus) — Django REST (`WalletG-backend`) + React (`WalletG-Front`).

**Zona clásica (colapsada, "Ver más")**: ecommerceShopy, machineLearningJS, proyectos del bootcamp. Solo lista con enlaces, sin ficha.

> No incluir: ElotApp, `langchain-notes`, `test-m` (código de Mesa Espejo; nunca enlazarlo), SmartMaq.

---

## 6. Modo reclutador

Ruta propia: `/es/cv` y `/en/cv`. Se llega desde el botón del título, desde Opciones o directamente por URL.
- Una sola página limpia, sin carcasa ni animaciones: encabezado con nombre, título y contacto; resumen; proyectos destacados (Stepable, Ecosistema Antigravity, Mesa Espejo, Sofonques Explorer, Sistema de Reportes Docentes, Vector Service API, Alerta ACV); experiencia; habilidades; certificaciones; educación; botón de descargar CV.
- Conserva la paleta y la tipografía pixel en títulos, con texto de cuerpo en fuente normal.
- Imprimible (`@media print`).
- Botón "▶ Volver al juego".

---

## 7. Técnico

### Stack
- Vite + React + TypeScript · Tailwind CSS (tokens de la paleta como variables CSS) · Framer Motion · Zustand · React Router (rutas reales por pantalla y por idioma, p. ej. `/es/proyectos/stepable`) · textos en `src/content/{es,en}/*.json`, nunca dentro de los componentes.
- Deploy en **Vercel** (`*.vercel.app` primero). La URL base vive en una sola variable (`VITE_SITE_URL`, ver `src/config.ts`).

### Estructura
```
src/
  content/es|en/   profile.json, projects.json, skills.json, experience.json, badges.json, ui.json
  content/shared/  metadatos sin idioma (stack, enlaces, estrellas, imágenes)
  console/         Shell (carcasa), Screen, DPad, Buttons, input/useControls (teclado + táctil + clic)
  ui/              TextBox (máquina de escribir), Menu (cursor ▶), Window, PixelImage (dithering ⇄ color)
  screens/         Boot, Title, MainMenu, WorldMap, ProjectEntry, TrainerCard, Bag, Journal, Badges, Save, Options
  recruiter/       RecruiterPage
  audio/           sfx.ts (Web Audio)
  store/           game.ts (Zustand)
public/
  sprites/  screenshots/  illustrations/  cv/cesar-cordova-es.pdf  cv/cesar-cordova-en.pdf
```

### Calidad mínima
- Lighthouse ≥ 90 en Performance, Accessibility, SEO y Best Practices.
- Open Graph con imagen de vista previa estilo Game Boy.
- `lang` correcto por idioma y `hreflang` entre ES y EN.
- Sprites y capturas optimizados; fuentes con `font-display: swap`.
- Sin API keys en el cliente.

### Arte
Pixel art propio como SVG o PNG pequeños (16×16 o 32×32), en archivos sueltos.

**Sprite de Cesar (genérico, no un retrato):** hombre joven, piel morena, cabello negro-café corto, lentes de armazón oscuro, sudadera o playera sencilla. Versiones: de frente con respiración (2 cuadros); caminando en 4 direcciones (2 cuadros cada una); retrato de busto 32×32. En 4 tonos, la piel usa el tono medio y el cabello el más oscuro; en la paleta "Color", piel café y cabello negro-café (`--gb-skin`, `--gb-hair`).

**Ilustraciones de proyectos sin captura** (Mesa Espejo, Reportes Docentes, Antigravity, Alerta ACV): pantallas simplificadas en pixel art con datos ficticios. El dithering de capturas se hace en build o en runtime con un `<canvas>` oculto; la imagen visible sigue siendo `<img>` con `alt`.

---

## 8. Fases

Trabajar en este orden y mostrar el resultado al terminar cada fase.

1. **Base:** proyecto, tokens, fuentes, contenido JSON (ES + EN), carcasa responsive con controles (teclado, clic y táctil). ✅
2. **Esqueleto del juego:** Encendido, Título, Menú principal, navegación con rutas reales, cambio de idioma con SELECT.
3. **Mapa y fichas:** mapa de 3 zonas, sprite caminando entre nodos, ficha de proyecto completa con imagen dithering ⇄ color.
4. **Resto de pantallas:** Tarjeta, Mochila, Diario, Medallas, Guardar, Opciones; sonido y paletas.
5. **Modo reclutador, accesibilidad, SEO, rendimiento y deploy** en Vercel.
6. **(Fase 2 del portafolio) NPC con IA — "El Profesor":** responde preguntas sobre Cesar usando el **Vector Service API** (FastAPI + ChromaDB) con su CV y fichas indexadas, más un LLM. Cita la ficha de origen. Límite de uso por visitante y respuesta de respaldo si el servicio no está disponible.

---

## 9. Decisiones y pendientes

### Decidido
- ElotApp **no** entra.
- Sofonques: equipo **Sofonques**, **NASA Space Apps Challenge 2025**, Cesar fue **líder y desarrollador backend**.
- Reportes Docentes: **en uso actualmente en la UABC**.
- Antigravity (`newsbot`): **sí se muestra**, como proyecto de ingeniería, sin cifras de trading.
- Mesa Espejo: **solo datos ficticios** e ilustraciones; sin código ni capturas reales.
- Proyectos sin capturas: ilustraciones pixel art.
- Teléfono: **no** aparece en el sitio.
- Dominio propio: después; mientras tanto, `*.vercel.app`.
- CV: versiones en **español e inglés**.
- Sprite: genérico, piel morena, cabello negro-café, lentes.

### Pendiente
- [ ] Crear el CV en inglés (PDF) y ponerlo en `public/cv/`.
- [ ] Revisar los textos de las fichas (en especial Reportes Docentes y Antigravity).
- [ ] Repo `test-m` (código de Mesa Espejo) está **público**: valorar hacerlo privado.
- [ ] Conseguir capturas de Alerta ACV, Stepable y Vector Service API si existen.

## 10. Fuera del sitio (pero suma)
- Fijar en GitHub: el repo del portafolio, Stepable, Vector Service API y Koa Caffe Menu.
- Bio y README de perfil con enlace al portafolio.
- Descripción y "About" en cada repo destacado; renombrar el microservicio vectorial.

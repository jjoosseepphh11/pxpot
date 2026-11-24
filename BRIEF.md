# Portfolio Build Brief (for Antigravity)

Put this file in the project root (for example as BRIEF.md) and tell the agent to read it first and follow it for every task.

## 1. Role and goal
You are helping me build my personal portfolio website: an immersive, polished, non-template site. Work in small milestones, show me a working result after each one, and wait for my approval before starting the next.

## 2. Hard constraints
- The concept is not tied to my profession. It is personal and general.
- No external assets. No downloaded 3D models, stock images, or video. Everything visual is made with code (CSS, SVG, canvas, or procedural Three.js). I will add my own project images later.
- No exaggeration. Restrained, clean, smooth. If an effect hurts readability or performance, remove it.
- Smooth and not laggy. Animate only transform and opacity where possible. No layout-thrashing animations.
- Pin all dependency versions. Don't add libraries I haven't approved.
- If something is unclear or missing (content, colors, fonts), ask me or use a clearly marked placeholder. Don't invent my project details, bio, or contact info.

## 3. Concept: "One day, in chapters"
- The page moves from morning to night as the visitor scrolls. Color palette and light shift gradually.
- Each part of the day is a chapter with a title and mood. My projects appear as moments inside the chapters.
- A short tunnel transition ("falling into the next chapter") is used once or twice between chapters, not everywhere.
- Optional later phase: a small interactive "room" for the About section, made from simple shapes. Not in the first version.

## 4. Design direction
Backbone reference: leoparpeix.com. Take the principles, not the layout:
- Large, confident typography and generous whitespace
- Restrained palette with one accent color per chapter
- Small guiding labels that tell the visitor what to do (for example "Scroll", "Drag", "Click to open")
- Smooth, calm motion with no gimmicks

Secondary references (adapt one idea each):
- conwest.com: smooth, simple flowing transitions between sections (details to be confirmed by me)
- ledboise.com: the loading sequence
- kolfest.bermet.design: horizontal side-panel scrolling, possibly for the projects section
- micaeladl.xyz: personal touches in the About section

Palette and typefaces are undecided. Propose two palette options (day-to-night gradient with accents) and two font pairings, with rationale, then wait for my choice.

## 5. Suggested stack (default, override if I say otherwise)
- Vite + vanilla JavaScript (or TypeScript), plain CSS with custom properties for theme tokens
- GSAP + ScrollTrigger for scroll-driven animation
- Lenis for smooth scrolling
- Three.js only if and when we do the procedural tunnel or the room
- Deployable as a static site (Vercel, Netlify or GitHub Pages)
Ask me to confirm the stack before scaffolding.

## 6. Page structure
- Loader: counts up through the day (sunrise to page open), then reveals the intro. Inspired by the LED Boise loading sequence.
- Intro / Morning: my name in large type and one subtle interaction (cursor reaction).
- Work / Afternoon: projects as chapters or horizontal panels. Each project: title, one-line summary, problem, approach, result, image placeholder.
- About / Evening: short, personal section. Placeholder text only.
- Contact / Night: simple closing screen with links.
- Persistent UI: minimal nav with quick links to Work and Contact, so nobody is stuck inside an animation.

## 7. Tunnel transition (no assets)
Build in this order and stop at the first version that looks good:
1. Typographic CSS 3D tunnel (preferred first version): a container with perspective; frames made of chapter words or numbers placed at increasing translateZ; GSAP scrubs the camera forward on scroll; frames fade as they pass.
2. Procedural Three.js tunnel (only if I ask): code-generated cylinder or rings, camera moves along the z-axis on scroll.

Requirements: runs smoothly on a mid-range phone, respects prefers-reduced-motion (replace with a simple crossfade), and lasts only a few seconds.

## 8. Quality requirements
- Works on mobile, tablet, and desktop
- prefers-reduced-motion fallback for every animation
- Lighthouse performance target: 90+ on desktop
- Visitors can reach projects and contact within about 10 seconds
- Semantic HTML, keyboard navigable, sufficient color contrast through the day-to-night shifts
- Lazy-load anything heavy and keep the first load small

## 9. Milestones (stop and show me after each)
1. Scaffold and layout: project setup, theme tokens, static layout of all sections with placeholder content.
2. Scroll flow: Lenis + GSAP ScrollTrigger, chapter structure, nav.
3. Day-to-night shift: palette interpolation across chapters.
4. Loader: sunrise-to-open sequence.
5. Tunnel transition: typographic CSS version, with reduced-motion fallback.
6. Projects section: horizontal panels or chapter cards with my real content.
7. Polish and performance: audit, fix, deploy.
8. Optional: the room, and a Three.js tunnel.

For each milestone: list what you changed, how to run it, and what you'd like me to check.

## 10. Open items to ask me about
- Stack confirmation
- Palette and font choice
- Number and details of projects (I'll supply the content)
- What specifically to adapt from Conwest
- What I like most about the LED Boise loader
- Whether the room is in version one or later

## 11. First task
Read this brief, summarize your understanding in a few lines, ask me the open items you need before starting, and then begin Milestone 1 only after I confirm.

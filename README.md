# pxpot ✦ Patrick Lontok Portfolio

> An atmospheric personal portfolio inspired by Alto's Adventure — featuring day-to-night dynamic lighting, a 3D typographic camera tunnel, and procedural vector craft.

[![Deploy to GitHub Pages](https://github.com/jjoosseepphh11/pxpot/actions/workflows/deploy.yml/badge.svg)](https://github.com/jjoosseepphh11/pxpot/actions/workflows/deploy.yml)

---

## ✦ Architectural Overview

`pxpot` is structured around a continuous 24-hour diurnal cycle, seamlessly connecting engineering disciplines through synchronized atmospheric transitions and compositor-locked motion:

- **Chapter 01 // Dawn (06:45 AM PHT)**: Foundational introduction, academic credentials, and interactive bash cloud mascot.
- **Transition // 3D Camera Tunnel**: Typographic perspective tunnel with discrete per-panel focal snapping along the Z-axis.
- **Chapter 02 // Midday (01:15 PM ➔ 06:15 PM PHT)**: Selected works carousel featuring 3D cylinder curvature (`rotateY` & depth scale) with live sunset color interpolation across 6 moments.
- **Chapter 03 // Evening (07:30 PM PHT)**: Engineering craft, core principles, academic leadership, and illuminated waxing crescent moon.
- **Chapter 04 // Midnight Nocturne (11:58 PM PHT)**: Full-bleed landscape canvas, typographic depth parallax, and direct hyperlinks.

---

## 🛠️ Tech Stack & Constraints

- **Language & Runtime**: TypeScript, Vite 8, HTML5 semantic canvas & SVG.
- **Motion & Kinetics**: GSAP 3 (ScrollTrigger), Lenis smooth scrolling.
- **Audio**: Web Audio API procedural synthesis (pure synthesized sound, zero audio MP3s).
- **Core Constraints**:
  - **Zero External Media Assets**: 100% of visual elements, horizons, stars, sun, moon, and mascots are procedurally generated via code/SVG.
  - **Compositor-Locked (Transform & Opacity Only)**: Zero layout thrashing or browser reflows.
  - **Strict WCAG Compliance**: Full `prefers-reduced-motion` fallbacks and keyboard navigation support (`ArrowDown`/`ArrowUp` panel stepping).

---

## 🚀 Local Development

```bash
# Clone repository
git clone https://github.com/jjoosseepphh11/pxpot.git
cd pxpot

# Install pinned dependencies
npm install

# Start local development server
npm run dev
```

---

## 📦 Production Build & Audit

```bash
# Typecheck verification
npx tsc --noEmit

# Compile production bundle
npm run build
```

---

## 🌐 Deployment

Automated CI/CD is configured via **GitHub Actions** (`.github/workflows/deploy.yml`):
- Runs typechecks (`tsc --noEmit`) and production build on every push to `main`.
- Deploys directly to **GitHub Pages**.
- Supports both `https://jjoosseepphh11.github.io/pxpot/` and custom domain mapping (e.g. `pxpot.com`).

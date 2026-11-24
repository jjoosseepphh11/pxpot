/* ==========================================================================
   PORTFOLIO FOUNDATION LOGIC (main.ts)
   Milestone 2: Lenis + GSAP ScrollTrigger, Chapter Structure & Nav
   ========================================================================== */

import { initSmoothScroll } from './motion/lenis';
import {
  initChapterScrollTriggers,
  initNavScrollLinks,
  initSectionEntrances,
  revealMorningHero,
} from './motion/scrollFlow';
import { initHeroCursorReaction } from './motion/cursorReaction';
import { initCustomCursor } from './motion/customCursor';
import { initMascotMotion } from './motion/mascotMotion';
import { initPaletteInterpolation } from './motion/paletteInterpolation';
import { initCelestialMotion } from './motion/celestialMotion';
import { initLoaderSequence } from './motion/loaderSequence';
import { initTunnelTransition } from './motion/tunnelTransition';
import { initProjectsHorizontal } from './motion/projectsHorizontal';
import { initProceduralAudio } from './audio/proceduralAudio';
import { initShareCardModal } from './motion/shareCardModal';
import { initHeroNameRotor } from './motion/heroNameRotor';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Validates that design tokens are loaded properly on :root.
 */
function verifyThemeTokens(): void {
  const computed = getComputedStyle(document.documentElement);
  const morningBg = computed.getPropertyValue('--ch-morning-bg').trim();
  const afternoonAccent = computed.getPropertyValue('--ch-afternoon-accent').trim();

  if (!morningBg || !afternoonAccent) {
    console.warn('[Milestone 4] Theme tokens may not be initialized properly.');
  }
}

// Expose ScrollTrigger for diagnostic and testing instrumentation
(window as unknown as { ScrollTrigger: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger;

// Lifecycle boot
function boot(): void {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  verifyThemeTokens();

  // 1. Initialize Lenis smooth scrolling (synchronized with GSAP ticker)
  initSmoothScroll();

  // 2. Initialize Structural Pinning Sections FIRST (Tunnel & Horizontal Projects)
  // Ensures ScrollTrigger calculates pin-spacers before chapter boundaries are measured.
  initTunnelTransition();
  initProjectsHorizontal();

  // 3. Initialize chapter tracking, palette interpolation, celestial sky & smooth anchor navigation
  initPaletteInterpolation();
  initCelestialMotion();
  initChapterScrollTriggers();
  initNavScrollLinks();

  // 4. Initialize scroll-triggered section entrances (Chapters 03 - 04)
  initSectionEntrances();

  // 5. Initialize subtle cursor reaction, Leo-style contextual cursor, and Bash-cloud mascot
  initHeroCursorReaction();
  initCustomCursor();
  initMascotMotion();
  initProceduralAudio();
  initShareCardModal();
  initHeroNameRotor();

  // Baseline calibration before opening sequence
  ScrollTrigger.refresh();

  // 6. Execute Sunrise-to-Open Loader Sequence (LED Boise inspiration)
  initLoaderSequence({
    onComplete: () => {
      revealMorningHero();
    },
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

/* ==========================================================================
   SMOOTH SCROLL SYSTEM (lenis.ts)
   Initializes Lenis and wires it into the GSAP Ticker & ScrollTrigger
   Strictly respects prefers-reduced-motion
   ========================================================================== */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion: bypass smooth lerp entirely for accessibility
  if (prefersReduced) {
    document.documentElement.style.scrollBehavior = 'auto';
    return null;
  }

  lenisInstance = new Lenis({
    lerp: 0.08,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    infinite: false,
    autoRaf: false, // Driven via GSAP ticker
  });

  // Direct sync with ScrollTrigger
  lenisInstance.on('scroll', () => {
    ScrollTrigger.update();
  });

  // Run Lenis through GSAP ticker for synchronized 60fps frame updates
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  // Disable GSAP lag smoothing to keep scroll animations responsive
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollToTarget(target: string | HTMLElement, offset: number = 0): void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (lenisInstance && !prefersReduced) {
    lenisInstance.scrollTo(target, {
      offset,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  }
}

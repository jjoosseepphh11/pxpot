/* ==========================================================================
   SUBTLE CURSOR REACTION (cursorReaction.ts)
   Restrained, weightless interactive reaction on Morning Hero
   Conforms to BRIEF.md Section 6: "Intro / Morning: my name in large type
   and one subtle interaction (cursor reaction)."
   Uses gsap.quickTo() for 60fps performance without layout thrashing.
   ========================================================================== */

import { gsap } from 'gsap';

export function initHeroCursorReaction(): () => void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  // Disabled on touch devices and when user prefers reduced motion
  if (prefersReduced || isTouchDevice) {
    return () => {};
  }

  const morningSection = document.getElementById('chapter-morning');
  const heroTitle = morningSection?.querySelector<HTMLElement>('.hero-title');
  const scrollPrompt = morningSection?.querySelector<HTMLElement>('.scroll-prompt');

  if (!morningSection || !heroTitle) {
    return () => {};
  }

  // Pre-hint compositor
  heroTitle.style.willChange = 'transform';

  // Smooth interpolators via gsap.quickTo (gsap-performance best practice)
  const titleXTo = gsap.quickTo(heroTitle, 'x', { duration: 0.8, ease: 'power2.out' });
  const titleYTo = gsap.quickTo(heroTitle, 'y', { duration: 0.8, ease: 'power2.out' });

  let promptXTo: ((v: number) => void) | null = null;
  if (scrollPrompt) {
    scrollPrompt.style.willChange = 'transform';
    promptXTo = gsap.quickTo(scrollPrompt, 'x', { duration: 1.1, ease: 'power2.out' });
  }

  const handlePointerMove = (e: PointerEvent) => {
    const rect = morningSection.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    // Relative offset from section center (-0.5 to +0.5)
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    // Restrained displacement: max +/- 8px on X, +/- 5px on Y
    titleXTo(normX * 16);
    titleYTo(normY * 10);

    if (promptXTo) {
      promptXTo(normX * 8);
    }
  };

  const handlePointerLeave = () => {
    titleXTo(0);
    titleYTo(0);
    if (promptXTo) {
      promptXTo(0);
    }
  };

  morningSection.addEventListener('pointermove', handlePointerMove, { passive: true });
  morningSection.addEventListener('pointerleave', handlePointerLeave);

  // Return cleanup function
  return () => {
    morningSection.removeEventListener('pointermove', handlePointerMove);
    morningSection.removeEventListener('pointerleave', handlePointerLeave);
  };
}

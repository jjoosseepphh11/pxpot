/* ==========================================================================
   DAY-TO-NIGHT PALETTE INTERPOLATION (paletteInterpolation.ts)
   Smoothly scrubs atmospheric light and color across chapters on scroll.
   Strictly compositor-driven: operates via opacity on dedicated planes.
   Conforms to BRIEF.md: "Color palette and light shift gradually."
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPaletteInterpolation(): void {
  const morningPlane = document.querySelector<HTMLElement>('.atmosphere-plane--morning');
  const afternoonPlane = document.querySelector<HTMLElement>('.atmosphere-plane--afternoon');
  const eveningPlane = document.querySelector<HTMLElement>('.atmosphere-plane--evening');
  const nightPlane = document.querySelector<HTMLElement>('.atmosphere-plane--night');

  if (!morningPlane || !afternoonPlane || !eveningPlane || !nightPlane) {
    return;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------------------
  // 1. Reduced Motion Mode: Instant, discrete chapter swaps (Zero Scrub)
  // -------------------------------------------------------------------------
  if (prefersReduced) {
    const planes = [morningPlane, afternoonPlane, eveningPlane, nightPlane];
    const chapterIds = ['chapter-morning', 'chapter-afternoon', 'chapter-evening', 'chapter-night'];
    const chapterNames = ['morning', 'afternoon', 'evening', 'night'];

    chapterIds.forEach((id, idx) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          planes.forEach((p, i) => (p.style.opacity = i === idx ? '1' : '0'));
          document.body.setAttribute('data-active-chapter', chapterNames[idx]);
        },
        onEnterBack: () => {
          planes.forEach((p, i) => (p.style.opacity = i === idx ? '1' : '0'));
          document.body.setAttribute('data-active-chapter', chapterNames[idx]);
        },
      });
    });
    return;
  }

  // -------------------------------------------------------------------------
  // 2. High-Performance Compositor-Scrubbed Palette Shifts
  // -------------------------------------------------------------------------

  // Phase A: Morning ➔ Afternoon (Dawn ➔ Solar Zenith across Tunnel Transition)
  gsap.timeline({
    scrollTrigger: {
      trigger: '#tunnel-morning-afternoon',
      start: 'top 45%',
      end: 'bottom 45%',
      scrub: 0.8,
    },
  })
    .to(morningPlane, { opacity: 0, ease: 'power1.inOut' }, 0)
    .to(afternoonPlane, { opacity: 1, ease: 'power1.inOut' }, 0);

  // Phase B (Mobile < 768px): Afternoon ➔ Evening Twilight across vertical scroll
  // (Desktop & Tablet >= 768px is handled with frame-perfect synchronization in projectsHorizontal.ts)
  const mm = gsap.matchMedia();
  mm.add('(max-width: 767px)', () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: '#chapter-afternoon',
        start: 'top 30%',
        end: 'bottom 60%',
        scrub: 0.8,
      },
    })
      .to(afternoonPlane, { opacity: 0, ease: 'power1.inOut' }, 0)
      .to(eveningPlane, { opacity: 1, ease: 'power1.inOut' }, 0);
  });

  // Phase C: Evening ➔ Night Abyss (Exiting Chapter 03 into Chapter 04 / Contact)
  // eveningPlane stays fully opaque as the solid foundation floor;
  // nightPlane fades in from 0 to 1 over eveningPlane smoothly as user arrives in Chapter 04
  gsap.timeline({
    scrollTrigger: {
      trigger: '#chapter-night',
      start: 'top 65%',
      end: 'top 20%',
      scrub: 0.8,
    },
  })
    .to(nightPlane, { opacity: 1, ease: 'power1.inOut' }, 0);
}

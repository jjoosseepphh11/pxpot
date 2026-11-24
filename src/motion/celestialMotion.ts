/* ==========================================================================
   CELESTIAL ATMOSPHERE MOTION (celestialMotion.ts)
   Orchestrates procedural Sun, Slow-Moving Ambient Clouds,
   Horizontally Flying Silhouette Birds, Selected Works Sunset,
   Twilight Stars, and Lunar Moon across the day-to-night scroll flow.
   Conforms to BRIEF.md & AGENTS.md:
   - Zero external assets (100% SVG & CSS)
   - Strictly transform & opacity only (zero reflow, 60fps locked)
   - Mandatory prefers-reduced-motion fallback
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCelestialMotion(): () => void {
  const sun = document.getElementById('celestial-sun');
  const sunset = document.getElementById('celestial-sunset');
  const stars = document.getElementById('celestial-stars');
  const moon = document.getElementById('celestial-moon');
  const birds = document.getElementById('celestial-birds');
  const cloud1 = document.querySelector<SVGElement>('.celestial-cloud--1');
  const cloud2 = document.querySelector<SVGElement>('.celestial-cloud--2');
  const cloud3 = document.querySelector<SVGElement>('.celestial-cloud--3');
  const horizonFar = document.querySelector<SVGElement>('.celestial-horizon__svg--far');
  const horizonNear = document.querySelector<SVGElement>('.celestial-horizon__svg--near');

  if (!sun || !sunset || !stars || !moon) {
    return () => {};
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------------------
  // 1. Reduced Motion Mode: Discrete, static celestial states (Zero Movement)
  // -------------------------------------------------------------------------
  if (prefersReduced) {
    gsap.set(sun, { x: '64vw', y: '12vh', opacity: 1, scale: 1 });
    gsap.set(moon, { x: '68vw', y: '12vh', opacity: 0 });
    gsap.set(stars, { opacity: 0 });
    gsap.set(sunset, { opacity: 0 });
    if (birds) gsap.set(birds, { opacity: 0.85 });
    if (cloud1) gsap.set(cloud1, { opacity: 0.75 });
    if (cloud2) gsap.set(cloud2, { opacity: 0.65 });
    if (cloud3) gsap.set(cloud3, { opacity: 0 });

    const observer = new MutationObserver(() => {
      const chapter = document.body.getAttribute('data-active-chapter') || 'morning';
      if (chapter === 'morning') {
        sun.style.opacity = '1';
        sun.style.transform = 'translate(64vw, 12vh) scale(1)';
        moon.style.opacity = '0';
        stars.style.opacity = '0';
        sunset.style.opacity = '0';
        if (birds) birds.style.opacity = '0.85';
        if (cloud3) cloud3.style.opacity = '0';
      } else if (chapter === 'afternoon') {
        sun.style.opacity = '1';
        sun.style.transform = 'translate(48vw, 40vh) scale(1.4)';
        sunset.style.opacity = '0.85';
        moon.style.opacity = '0';
        stars.style.opacity = '0';
        if (birds) birds.style.opacity = '0.9';
        if (cloud3) cloud3.style.opacity = '0.75';
      } else if (chapter === 'evening') {
        sun.style.opacity = '0';
        sunset.style.opacity = '0';
        moon.style.opacity = '0.35';
        stars.style.opacity = '0.75';
        if (birds) birds.style.opacity = '0';
        if (cloud3) cloud3.style.opacity = '0.2';
      } else if (chapter === 'night') {
        sun.style.opacity = '0';
        sunset.style.opacity = '0';
        moon.style.opacity = '1';
        moon.style.transform = 'translate(68vw, 12vh) scale(1)';
        stars.style.opacity = '0.9';
        if (birds) birds.style.opacity = '0';
        if (cloud3) cloud3.style.opacity = '0.15';
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['data-active-chapter'] });
    return () => observer.disconnect();
  }

  // -------------------------------------------------------------------------
  // 2. Initial Setup: Dawn Morning Position (06:45 AM PHT)
  // -------------------------------------------------------------------------
  const isMobile = window.innerWidth < 768;
  const vw = window.innerWidth / 100;
  const vh = window.innerHeight / 100;

  // Sun starts rising in the morning dawn sky
  gsap.set(sun, {
    x: 64 * vw,
    y: 12 * vh,
    opacity: 0.95,
    scale: 1,
  });

  // Birds start visible in the sky
  if (birds) {
    gsap.set(birds, { opacity: 0.85 });
  }

  // Clouds start at their baseline opacity
  if (cloud1) gsap.set(cloud1, { opacity: 0.75 });
  if (cloud2) gsap.set(cloud2, { opacity: 0.65 });
  if (cloud3) gsap.set(cloud3, { opacity: 0.1 });

  // Moon rests dormant below nocturnal horizon
  gsap.set(moon, {
    x: 72 * vw,
    y: 75 * vh,
    opacity: 0,
    scale: 0.85,
  });

  gsap.set(sunset, { opacity: 0 });
  gsap.set(stars, { opacity: 0 });

  const triggers: ScrollTrigger[] = [];

  // -------------------------------------------------------------------------
  // 3. Phase 1: Tunnel Transition (Dawn ➔ Midday Sun Zenith)
  // -------------------------------------------------------------------------
  const tunnelEl = document.getElementById('tunnel-morning-afternoon');
  if (tunnelEl) {
    const tunnelSunST = gsap.timeline({
      scrollTrigger: {
        trigger: tunnelEl,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    // Sun climbs toward high midday sky
    tunnelSunST.to(sun, {
      x: isMobile ? 54 * vw : 50 * vw,
      y: 4 * vh,
      scale: 1.15,
      opacity: 1,
      ease: 'power1.inOut',
    }, 0);

    if (tunnelSunST.scrollTrigger) triggers.push(tunnelSunST.scrollTrigger);
  }

  // -------------------------------------------------------------------------
  // 4. Phase 2: Selected Works Scrub ➔ Golden Sunset Horizon ➔ Twilight
  // (Directly embedded into Chapter 02: Selected Works as requested by user)
  // -------------------------------------------------------------------------
  const afternoonEl = document.getElementById('chapter-afternoon');
  if (afternoonEl) {
    const worksSunsetST = gsap.timeline({
      scrollTrigger: {
        trigger: afternoonEl,
        start: 'top 35%',
        end: 'bottom 30%',
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    // [0.0 -> 0.65]: Midday into Sunset Horizon descent (Moments 01-04)
    worksSunsetST
      // Sun descends into glowing golden horizon
      .to(sun, {
        x: isMobile ? 42 * vw : 46 * vw,
        y: isMobile ? 38 * vh : 44 * vh,
        scale: isMobile ? 1.35 : 1.58,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      }, 0.1)
      // Sunset horizon glow blooms warmly over the projects
      .to(sunset, {
        opacity: 0.88,
        duration: 0.55,
        ease: 'power1.inOut',
      }, 0.2)
      // Cloud 3 catches golden-crimson sunset lighting
      .to(cloud3, {
        opacity: 0.85,
        duration: 0.55,
        ease: 'power1.inOut',
      }, 0.2);

    // [0.65 -> 1.0]: Approaching Moments 05 & 06 and Chapter 03 (Evening) - Twilight
    worksSunsetST
      // Sun dips below horizon into twilight
      .to(sun, {
        y: 85 * vh,
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: 'power2.in',
      }, 0.65)
      // Sunset horizon gently recedes into evening indigo
      .to(sunset, {
        opacity: 0,
        duration: 0.35,
        ease: 'power1.out',
      }, 0.70)
      // Birds gently fade as dusk turns to night
      .to(birds, {
        opacity: 0,
        duration: 0.35,
        ease: 'power1.in',
      }, 0.70)
      // Twilight Stars gently emerge
      .to(stars, {
        opacity: 0.75,
        duration: 0.4,
        ease: 'power1.inOut',
      }, 0.65)
      // Luminous Moon ascends gracefully in late Chapter 02 and glows throughout Chapter 03 (Evening Dusk)
      .to(moon, {
        x: isMobile ? 62 * vw : 70 * vw,
        y: isMobile ? 16 * vh : 14 * vh,
        scale: 1,
        opacity: 0.95,
        duration: 0.45,
        ease: 'power2.out',
      }, 0.65)
      // Clouds soften to quiet dusk mist
      .to(cloud1, { opacity: 0.2, duration: 0.4 }, 0.65)
      .to(cloud2, { opacity: 0.2, duration: 0.4 }, 0.65)
      .to(cloud3, { opacity: 0.2, duration: 0.4 }, 0.65);

    if (worksSunsetST.scrollTrigger) triggers.push(worksSunsetST.scrollTrigger);
  }

  // -------------------------------------------------------------------------
  // 5. Phase 3: Chapter 04 Midnight Nocturne (Lunar Moon Zenith)
  // -------------------------------------------------------------------------
  const nightEl = document.getElementById('chapter-night');
  if (nightEl) {
    const moonST = gsap.timeline({
      scrollTrigger: {
        trigger: nightEl,
        start: 'top 85%',
        end: 'top 25%',
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    // Sun and sunset guaranteed dark
    moonST
      .to(sun, { opacity: 0, duration: 0.1 }, 0)
      .to(sunset, { opacity: 0, duration: 0.1 }, 0)
      .to(birds, { opacity: 0, duration: 0.1 }, 0);

    // Moon smoothly aligns to its midnight zenith position
    moonST
      .to(moon, {
        x: isMobile ? 60 * vw : 68 * vw,
        y: 12 * vh,
        scale: 1.05,
        opacity: 1,
        ease: 'power2.out',
      }, 0)
      .to(stars, {
        opacity: 0.9,
        ease: 'power1.out',
      }, 0);

    if (cloud1) moonST.to(cloud1, { opacity: 0.15, ease: 'power1.out' }, 0);
    if (cloud2) moonST.to(cloud2, { opacity: 0.15, ease: 'power1.out' }, 0);
    if (cloud3) moonST.to(cloud3, { opacity: 0.15, ease: 'power1.out' }, 0);

    if (moonST.scrollTrigger) triggers.push(moonST.scrollTrigger);
  }

  // -------------------------------------------------------------------------
  // 6. Atmospheric Horizon Parallax Depth (GPU-Composited Aerial Perspective)
  // -------------------------------------------------------------------------
  if (horizonFar && horizonNear) {
    const horizonST = gsap.timeline({
      scrollTrigger: {
        trigger: '#main-content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      },
    });

    horizonST
      .to(horizonFar, { y: -12, ease: 'none' }, 0)
      .to(horizonNear, { y: -26, ease: 'none' }, 0);

    if (horizonST.scrollTrigger) triggers.push(horizonST.scrollTrigger);
  }

  return () => {
    triggers.forEach((st) => st.kill());
  };
}

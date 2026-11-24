/* ==========================================================================
   INTERACTIVE CONTEXTUAL CURSOR (customCursor.ts)
   Inspired by leoparpeix.com (Leo Parpeix Portfolio)
   - Dynamic capsule label tilting with mouse velocity & expanding on move
   - Direct audio instructions on cursor: "CLICK TO ENABLE SOUND"
   - Clicking anywhere un-mutes and activates organic calm wind soundscape
   - Mobile Legends Starlight starry diamond trail with crystal chimes
   Strictly compositor-driven: operates via transform and opacity only.
   ========================================================================== */

import { gsap } from 'gsap';
import { proceduralAudio } from '../audio/proceduralAudio';

export function initCustomCursor(): () => void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  // Disabled on touch devices and when user prefers reduced motion
  if (prefersReduced || isTouchDevice) {
    return () => {};
  }

  const cursorEl = document.getElementById('custom-cursor');
  if (!cursorEl) return () => {};

  const dot = cursorEl.querySelector<HTMLElement>('.custom-cursor__dot');
  const ring = cursorEl.querySelector<HTMLElement>('.custom-cursor__ring');
  const label = cursorEl.querySelector<HTMLElement>('.custom-cursor__label');

  if (!dot || !ring || !label) return () => {};

  // Center alignment via xPercent/yPercent so center is always on the pointer
  gsap.set(dot, { xPercent: -50, yPercent: -50 });
  gsap.set(ring, { xPercent: -50, yPercent: -50 });

  // Pre-hint compositor
  dot.style.willChange = 'transform';
  ring.style.willChange = 'transform';

  // Smooth interpolators via gsap.quickTo for instant 60/120fps response
  const dotXTo = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power1.out' });
  const dotYTo = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power1.out' });

  const ringXTo = gsap.quickTo(ring, 'x', { duration: 0.22, ease: 'power2.out' });
  const ringYTo = gsap.quickTo(ring, 'y', { duration: 0.22, ease: 'power2.out' });

  // -------------------------------------------------------------------------
  // Mobile Legends Starlight Cosmic Star Trail Particle Pool
  // -------------------------------------------------------------------------
  const trailContainer = document.getElementById('cursor-trail');
  const starPool: HTMLElement[] = [];
  const sparklePool: HTMLElement[] = [];
  const POOL_SIZE = 16;
  let particleIndex = 0;
  let lastParticleX = -100;
  let lastParticleY = -100;

  if (trailContainer) {
    trailContainer.innerHTML = '';
    for (let i = 0; i < POOL_SIZE; i++) {
      const star = document.createElement('div');
      star.className = 'starlight-star';
      trailContainer.appendChild(star);
      starPool.push(star);

      const sparkle = document.createElement('div');
      sparkle.className = 'starlight-sparkle';
      trailContainer.appendChild(sparkle);
      sparklePool.push(sparkle);
    }
  }

  let isVisible = false;
  let currentLabelText = '';
  let labelTimeline: gsap.core.Timeline | null = null;
  let lastTarget: HTMLElement | null = null;
  let flashStatusTimeout: number | null = null;
  let isFlashingStatus = false;

  // Velocity tilt tracking (Leo Parpeix dynamic capsule tilt)
  let prevMouseX = 0;
  let mouseVelocityX = 0;
  let settleTimeout: number | null = null;

  const setLabel = (text: string, isSoundPrompt: boolean = false, isFlash: boolean = false) => {
    if (isFlashingStatus && !isFlash && text !== currentLabelText) {
      return;
    }

    if (currentLabelText === text) return;
    currentLabelText = text;

    labelTimeline?.kill();
    labelTimeline = gsap.timeline();

    if (text) {
      label.textContent = text;
      cursorEl.classList.add('custom-cursor--has-label');
      if (isSoundPrompt) {
        cursorEl.classList.add('custom-cursor--sound-prompt');
        gsap.to(ring, { yPercent: 40, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
      } else {
        cursorEl.classList.remove('custom-cursor--sound-prompt');
        gsap.to(ring, { yPercent: 30, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
      }

      labelTimeline.fromTo(
        label,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 0.16, ease: 'power2.out' }
      );
    } else {
      cursorEl.classList.remove('custom-cursor--has-label');
      cursorEl.classList.remove('custom-cursor--sound-prompt');
      gsap.to(ring, { yPercent: -50, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
      labelTimeline.to(label, {
        opacity: 0,
        scale: 0.8,
        duration: 0.12,
        ease: 'power2.in',
        onComplete: () => {
          if (!currentLabelText) label.textContent = '';
        },
      });
    }
  };

  /**
   * Temporarily flash sound status on the cursor capsule.
   */
  const flashSoundStatus = (msg: string) => {
    isFlashingStatus = true;
    if (flashStatusTimeout) window.clearTimeout(flashStatusTimeout);

    setLabel(msg, false, true);

    flashStatusTimeout = window.setTimeout(() => {
      isFlashingStatus = false;
      updateContextualLabel();
    }, 1800);
  };

  // Subscribe to procedural audio state changes
  const unsubscribeAudio = proceduralAudio.subscribe((active) => {
    if (active) {
      flashSoundStatus('SOUND ON ♪');
    } else {
      flashSoundStatus('SOUND MUTED');
    }
  });

  // -------------------------------------------------------------------------
  // Instruction Display Lifecycle (Leo Parpeix Style):
  // When sound is off, shows "CLICK TO ENABLE SOUND 🔊"
  // When sound is on, shows contextual cues (SCROLL, DRAG, EXPLORE, SPIN ME)
  // -------------------------------------------------------------------------
  let isAmbientHintActive = true;
  let isSoundPromptEligible = true;
  let ambientHintTimer: number | null = null;
  let lastScrollTriggerTime = 0;

  // Retire sound prompt after initial reading window (9s) if user hasn't clicked
  window.setTimeout(() => {
    if (isSoundPromptEligible && !proceduralAudio.isActive) {
      isSoundPromptEligible = false;
      updateContextualLabel();
    }
  }, 9000);

  const updateContextualLabel = () => {
    if (isFlashingStatus) return;

    const target = lastTarget || document.getElementById('chapter-morning');
    if (!target) return;

    const activeChapter = document.body.getAttribute('data-active-chapter') || 'morning';
    const mascot = target.closest<HTMLElement>('#bash-mascot');
    const clickable = target.closest<HTMLElement>('a, button, [role="button"], .project-panel__actions');
    const projectCard = target.closest<HTMLElement>('.project-panel');
    const isProjectTrack = target.closest<HTMLElement>('.projects-track-wrap');
    const isAfternoon = target.closest<HTMLElement>('#chapter-afternoon') || activeChapter === 'afternoon';
    const isTunnel = target.closest<HTMLElement>('.tunnel-section');
    const isContactCard = target.closest<HTMLElement>('.contact-card, .editorial-link, .landscape-connect-links');
    const isReadingText = target.closest<HTMLElement>(
      'h1, h2, h3, h4, p, span, dl, dt, dd, .item-title, .project-card__summary, .tunnel-frame__card, .principle-card'
    );

    // 1. Reading content protection: never obscure headings or body text with large cursor capsules
    if (isReadingText && !clickable && !mascot) {
      cursorEl.classList.remove('custom-cursor--hover');
      setLabel('', false);
      return;
    }

    // 2. Direct interactive hovers: display action cue
    if (mascot) {
      cursorEl.classList.add('custom-cursor--hover');
      setLabel('SPIN ME ↺', false);
    } else if (clickable) {
      cursorEl.classList.add('custom-cursor--hover');
      if (clickable.classList.contains('action-link') || clickable.closest('.project-panel__actions')) {
        setLabel('EXPLORE ↗', false);
      } else if (clickable.closest('.site-nav')) {
        setLabel('', false); // Keep bottom dock navigation clean
      } else if (isContactCard) {
        setLabel('CONNECT ↗', false);
      } else {
        setLabel('OPEN ↗', false);
      }
    } else if (projectCard && target.closest('.project-media-placeholder, .action-link')) {
      cursorEl.classList.add('custom-cursor--hover');
      const idx = projectCard.getAttribute('data-index') || '1';
      setLabel(`EXPLORE [0${idx}] ↗`, false);
    } else {
      // 3. Default / Ambient Cursor Prompt
      cursorEl.classList.remove('custom-cursor--hover');

      // Leo Parpeix Signature: Prompt user to enable calm wind soundscape
      if (!proceduralAudio.isActive && isSoundPromptEligible) {
        setLabel('CLICK TO ENABLE SOUND 🔊', true);
      } else if (isAmbientHintActive && proceduralAudio.isActive) {
        if (isProjectTrack || isAfternoon) {
          setLabel('DRAG ↔', false);
        } else if (isTunnel) {
          setLabel('DESCEND ✦', false);
        } else {
          setLabel('SCROLL ↓', false);
        }
      } else {
        // Quiet dot/ring state after instruction has turned off
        setLabel('', false);
      }
    }
  };

  // Re-hint when scrolling into new chapters & dismiss sound prompt on scroll down
  const handleScroll = () => {
    if (window.scrollY > 350 && isSoundPromptEligible) {
      isSoundPromptEligible = false;
      updateContextualLabel();
    }

    const now = Date.now();
    if (now - lastScrollTriggerTime > 3000) {
      lastScrollTriggerTime = now;
      if (!isAmbientHintActive && proceduralAudio.isActive) {
        isAmbientHintActive = true;
        updateContextualLabel();
        if (ambientHintTimer) clearTimeout(ambientHintTimer);
        ambientHintTimer = window.setTimeout(() => {
          isAmbientHintActive = false;
          updateContextualLabel();
        }, 3500);
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  const handlePointerMove = (e: PointerEvent) => {
    if (!isVisible) {
      isVisible = true;
      cursorEl.style.opacity = '1';
    }

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Leo Parpeix Dynamic Velocity Tilt (-20deg to +20deg)
    mouseVelocityX = mouseX - prevMouseX;
    prevMouseX = mouseX;

    const tilt = Math.max(-20, Math.min(20, mouseVelocityX * 0.16));
    gsap.to(ring, {
      rotation: tilt,
      scale: Math.abs(mouseVelocityX) > 2.5 ? 1.05 : 1,
      duration: 0.2,
      ease: 'power1.out',
      overwrite: 'auto',
    });

    // Settle straight when stopped
    if (settleTimeout) window.clearTimeout(settleTimeout);
    settleTimeout = window.setTimeout(() => {
      gsap.to(ring, { rotation: 0, scale: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    }, 110);

    // Mobile Legends Starlight Cosmic Star Trail Particle Emission
    const dist = Math.hypot(mouseX - lastParticleX, mouseY - lastParticleY);
    if (dist > 12 && starPool.length > 0) {
      lastParticleX = mouseX;
      lastParticleY = mouseY;
      const star = starPool[particleIndex];
      const sparkle = sparklePool[particleIndex];
      particleIndex = (particleIndex + 1) % POOL_SIZE;

      const jitterX = (Math.random() - 0.5) * 8;
      const jitterY = (Math.random() - 0.5) * 8;
      const initialRot = Math.random() * 45;

      // 1. Four-pointed diamond starburst (twinkles, rotates, scales, and dissolves)
      gsap.fromTo(
        star,
        {
          x: mouseX - 11 + jitterX,
          y: mouseY - 11 + jitterY,
          scale: 0.5,
          rotation: initialRot,
          opacity: 0.95,
        },
        {
          y: mouseY - 16,
          scale: 1.15,
          rotation: initialRot + 90,
          opacity: 0,
          duration: 0.62,
          ease: 'power2.out',
          overwrite: 'auto',
        }
      );

      // 2. Sparkling neon stardust glitter offset
      const sparkleOffsetX = (Math.random() - 0.5) * 16;
      const sparkleOffsetY = (Math.random() - 0.5) * 16;
      gsap.fromTo(
        sparkle,
        {
          x: mouseX - 4 + sparkleOffsetX,
          y: mouseY - 4 + sparkleOffsetY,
          scale: 0.4,
          opacity: 0.9,
        },
        {
          y: mouseY - 12 + sparkleOffsetY,
          scale: 1.2,
          opacity: 0,
          duration: 0.5,
          ease: 'power1.out',
          overwrite: 'auto',
        }
      );

      // Trigger procedural crystal chime sparkle
      proceduralAudio.playSparkle();
    }

    const target =
      e.target && typeof (e.target as any).closest === 'function'
        ? (e.target as HTMLElement)
        : document.body;
    lastTarget = target;

    let ringTargetX = mouseX;
    let ringTargetY = mouseY;

    // Subtle magnetic latch on interactive items (22% pull toward element center)
    const magneticTarget = target.closest<HTMLElement>(
      '.site-nav__link, .contact-card__link, #bash-mascot'
    );
    if (magneticTarget) {
      const rect = magneticTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      ringTargetX = mouseX + (centerX - mouseX) * 0.22;
      ringTargetY = mouseY + (centerY - mouseY) * 0.22;
    }

    // Keep capsule label comfortably inside the viewport boundaries (prevents off-screen clipping)
    const isLabeled = cursorEl.classList.contains('custom-cursor--has-label');
    const safePadX = isLabeled ? 72 : 16;
    const safePadY = isLabeled ? 32 : 16;
    ringTargetX = Math.max(safePadX, Math.min(window.innerWidth - safePadX, ringTargetX));
    ringTargetY = Math.max(safePadY, Math.min(window.innerHeight - safePadY, ringTargetY));

    dotXTo(mouseX);
    dotYTo(mouseY);
    ringXTo(ringTargetX);
    ringYTo(ringTargetY);

    updateContextualLabel();
  };

  /**
   * Pointer down: Leo Parpeix Click-to-Enable Sound
   */
  const handlePointerDown = () => {
    cursorEl.classList.add('custom-cursor--pressed');
    gsap.to(ring, { scale: 0.86, duration: 0.1, ease: 'power2.out', overwrite: 'auto' });

    // Leo Parpeix mechanism: If sound is not yet active, first click anywhere enables calm wind sound!
    if (!proceduralAudio.isActive) {
      proceduralAudio.enable();
    }
  };

  const handlePointerUp = () => {
    cursorEl.classList.remove('custom-cursor--pressed');
    gsap.to(ring, { scale: 1, duration: 0.35, ease: 'back.out(2)', overwrite: 'auto' });
  };

  const handleMouseLeave = () => {
    isVisible = false;
    cursorEl.style.opacity = '0';
    setLabel('', false);
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointerup', handlePointerUp);
  document.addEventListener('mouseleave', handleMouseLeave);

  // Initial trigger to set up the Leo sound prompt
  updateContextualLabel();

  return () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerdown', handlePointerDown);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('mouseleave', handleMouseLeave);
    if (ambientHintTimer) clearTimeout(ambientHintTimer);
    if (flashStatusTimeout) clearTimeout(flashStatusTimeout);
    if (settleTimeout) clearTimeout(settleTimeout);
    unsubscribeAudio();
    labelTimeline?.kill();
    starPool.forEach((p) => p.remove());
    sparklePool.forEach((p) => p.remove());
  };
}

/* ==========================================================================
   PROCEDURAL BASH-CLOUD MASCOT COMPANION (mascotMotion.ts)
   Code-generated SVG software tool mascot.
   Interactive Companion:
   - Draggable across screen with flash rocket dash spring snapback
   - 360° / 720° acrobatic spins
   - Funny, personalized situational script with 5-second silence breaks
     between conversations
   - Multi-chapter flight pathing across scroll
   Conforms to BRIEF.md & AGENTS.md:
   - Zero external assets (100% SVG & CSS)
   - Transform & Opacity only (60fps guaranteed)
   - Accessible: pauses on prefers-reduced-motion
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { proceduralAudio } from '../audio/proceduralAudio';

gsap.registerPlugin(ScrollTrigger);

const BASH_CLICK_QUOTES = [
  '>_ welcome to Patrick\'s portfolio! ✨',
  '>_ BSIT Dean\'s List Scholar 🎓',
  '>_ AWS Learning Club – Polar Founder & Former Lead ☁️',
  '>_ Santa Rosa, Laguna 🇵🇭',
  '>_ explore selected systems below ✦',
  '>_ tap to flip & spin! ↺',
  '>_ let\'s build enduring systems 🏛️',
  '>_ PUP Santa Rosa Pride! 🎓',
  '>_ open for collaborations 🤝',
  '>_ connect on LinkedIn & GitHub 🚀',
];

const SIDE_CHEERS = [
  '>_ welcome! ✨',
  '>_ check out Patrick\'s works 👀',
  '>_ crafted with pride 💖',
  '>_ clean architecture ✦',
  '>_ explore the systems below 🚀',
];

const CONTACT_CUES = [
  '>_ let\'s connect! 🤝',
  '>_ patrickalcalalontok@gmail.com 📬',
  '>_ reach out to Patrick! 👉',
  '>_ open for cloud & dev collaborations ✨',
];

const IDLE_DIALOGUES: Record<string, string[]> = {
  morning: [
    '>_ good morning from Santa Rosa! ☀️',
    '>_ BSIT student at PUP Santa Rosa 🎓',
    '>_ consistent Dean\'s List standing 📚',
    '>_ morning focus & clean systems ☕',
    '>_ AWS Learning Club – Polar Founder & Former Lead ☁️',
    '>_ scroll down to explore works ↓',
  ],
  afternoon: [
    '>_ explore ARAL & PUP SkillSwap 👀',
    '>_ serverless & deterministic systems 💡',
    '>_ FastAPI & DynamoDB architectures ⚡',
    '>_ transactional Google Apps Script 🔒',
    '>_ interactive LIBRO reading app 📖',
    '>_ tap me for a quick spin! ↺',
    '>_ smooth interactive works scrub ✦',
  ],
  evening: [
    '>_ AWS Learning Club – Polar Founder & Former Lead ☁️',
    '>_ deterministic systems & craft 🏛️',
    '>_ human-centered engineering 🤝',
    '>_ zero-waste cloud efficiency ⚡',
    '>_ clarity over complexity 🎯',
    '>_ Laguna tech community leadership 🇵🇭',
  ],
  night: [
    '>_ let\'s connect on LinkedIn! 📬',
    '>_ patrickalcalalontok@gmail.com ✉️',
    '>_ open for backend & cloud roles 🚀',
    '>_ github.com/jjoosseepphh11 ⭐',
    '>_ (+63) 912-347-9575 direct line 📞',
    '>_ thank you for visiting! 💖',
  ],
};

const EXPRESSION_PROMPTS = ['>_', '^^', '✦✦', '~o', '>>'];

export function initMascotMotion(): () => void {
  const mascot = document.getElementById('bash-mascot');
  if (!mascot) return () => {};

  const svgEl = mascot.querySelector<SVGElement>('.bash-mascot__svg');
  const bubbleEl = mascot.querySelector<HTMLElement>('.bash-mascot__bubble');
  const speechEl = mascot.querySelector<HTMLElement>('.bash-mascot__speech');
  const promptEl = mascot.querySelector<SVGTextElement>('.bash-mascot__prompt');
  const eyeLeft = mascot.querySelector<HTMLElement>('.bash-mascot__eye--left');
  const eyeRight = mascot.querySelector<HTMLElement>('.bash-mascot__eye--right');
  const sparkEl = mascot.querySelector<SVGPathElement>('.bash-mascot__spark');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion: keep mascot static and quiet
  if (prefersReduced) {
    if (speechEl) speechEl.textContent = '>_ ready';
    return () => {};
  }

  // Pre-hint compositor & lock parent container rotation strictly to 0
  mascot.style.willChange = 'transform';
  gsap.set(mascot, { rotation: 0 });
  if (svgEl) svgEl.style.willChange = 'transform';

  // 1. Gentle idle floating breath on SVG child so parent can travel freely
  const floatTween = svgEl
    ? gsap.to(svgEl, {
        y: -7,
        duration: 2.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    : null;

  // 2. Eye glance tracking pointer smoothly
  let leftEyeXTo: ((v: number) => void) | null = null;
  let leftEyeYTo: ((v: number) => void) | null = null;
  let rightEyeXTo: ((v: number) => void) | null = null;
  let rightEyeYTo: ((v: number) => void) | null = null;

  if (eyeLeft && eyeRight) {
    eyeLeft.style.willChange = 'transform';
    eyeRight.style.willChange = 'transform';
    leftEyeXTo = gsap.quickTo(eyeLeft, 'x', { duration: 0.18, ease: 'power2.out' });
    leftEyeYTo = gsap.quickTo(eyeLeft, 'y', { duration: 0.18, ease: 'power2.out' });
    rightEyeXTo = gsap.quickTo(eyeRight, 'x', { duration: 0.18, ease: 'power2.out' });
    rightEyeYTo = gsap.quickTo(eyeRight, 'y', { duration: 0.18, ease: 'power2.out' });
  }

  let isDragging = false;
  let isHovered = false;
  let isSpinning = false;
  let clickCount = 0;

  const handlePointerMove = (e: PointerEvent) => {
    if (isDragging) return; // Managed by drag listener

    const rect = mascot.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2)));
    const deltaY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2)));

    // Restrained pupil displacement (max +/- 2.5px)
    if (leftEyeXTo && leftEyeYTo && rightEyeXTo && rightEyeYTo) {
      leftEyeXTo(deltaX * 2.5);
      leftEyeYTo(deltaY * 2.5);
      rightEyeXTo(deltaX * 2.5);
      rightEyeYTo(deltaY * 2.5);
    }
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });

  // 3. DIALOGUE SYSTEM WITH 5-SECOND SILENCE BREAKS
  let bubbleFadeTimer: number | null = null;
  let bubbleSilenceTimer: number | null = null;
  let idleDialogueIndex = 0;
  let expressionIndex = 0;

  const showDialogue = (text: string, prompt?: string, durationMs: number = 3800) => {
    if (bubbleFadeTimer) clearTimeout(bubbleFadeTimer);
    if (bubbleSilenceTimer) clearTimeout(bubbleSilenceTimer);

    if (speechEl) speechEl.textContent = text;
    if (prompt && promptEl) promptEl.textContent = prompt;

    if (bubbleEl) {
      gsap.fromTo(
        bubbleEl,
        { opacity: 0, y: 5, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.6)', overwrite: 'auto' }
      );
    }

    // After durationMs, fade speech bubble out
    bubbleFadeTimer = window.setTimeout(() => {
      if (bubbleEl) {
        gsap.to(bubbleEl, {
          opacity: 0,
          y: 4,
          scale: 0.9,
          duration: 0.28,
          ease: 'power2.in',
          overwrite: 'auto',
        });
      }

      // 5-second silence break with no text, then trigger next dialogue
      bubbleSilenceTimer = window.setTimeout(() => {
        triggerNextIdleDialogue();
      }, 5000);
    }, durationMs);
  };

  const triggerNextIdleDialogue = () => {
    if (isDragging || isHovered || isSpinning) {
      // Re-schedule check after 3 seconds if user is actively interacting
      bubbleSilenceTimer = window.setTimeout(triggerNextIdleDialogue, 3000);
      return;
    }

    const currentChapter = document.body.getAttribute('data-active-chapter') || 'morning';
    const list = IDLE_DIALOGUES[currentChapter] || IDLE_DIALOGUES.morning;

    idleDialogueIndex = (idleDialogueIndex + 1) % list.length;
    expressionIndex = (expressionIndex + 1) % EXPRESSION_PROMPTS.length;

    showDialogue(list[idleDialogueIndex], EXPRESSION_PROMPTS[expressionIndex], 3800);
  };

  // Initial greeting on load: shows for 4.0s, then enters first 5-second break
  showDialogue('>_ 06:45 AM PHT', '>_', 4000);

  // 4. MULTI-CHAPTER FLIGHT PATHING (Desktop / Tablet >= 768px)
  const mm = gsap.matchMedia();
  let pathTriggers: ScrollTrigger[] = [];

  mm.add('(min-width: 768px)', () => {
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;

    // Flight Phase 1: Dive into 3D Tunnel Transition
    const tunnelEl = document.getElementById('tunnel-morning-afternoon');
    if (tunnelEl) {
      const tunnelST = gsap.timeline({
        scrollTrigger: {
          trigger: tunnelEl,
          start: 'top 85%',
          end: 'bottom 15%',
          scrub: 0.8,
          onEnter: () => showDialogue('>_ wooohooo diving in! 🚀', '>>', 3200),
          onLeave: () => showDialogue('>_ take a look at that! 👀', '^^', 3200),
          onEnterBack: () => showDialogue('>_ tunnel flip! ✦', '>>', 3200),
          onLeaveBack: () => showDialogue('>_ 06:45 AM PHT', '>_', 3200),
        },
      });

      tunnelST
        // Leap to screen center through the tunnel
        .to(mascot, {
          x: -36 * vw,
          y: -25 * vh,
          scale: 1.35,
          ease: 'power2.inOut',
          duration: 0.5,
        })
        // Settle smoothly and safely back into the bottom-right dock before Chapter 02
        .to(mascot, {
          x: 0,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          duration: 0.5,
        });

      // Corkscrew rotation applied strictly to SVG child so bubble stays 100% horizontal
      if (svgEl) {
        tunnelST
          .to(svgEl, {
            rotation: 360,
            ease: 'power2.inOut',
            duration: 0.5,
            transformOrigin: 'center center',
          }, 0)
          .to(svgEl, {
            rotation: 720,
            ease: 'power2.out',
            duration: 0.5,
            transformOrigin: 'center center',
          }, 0.5);
      }

      if (tunnelST.scrollTrigger) pathTriggers.push(tunnelST.scrollTrigger);
    }

    // Flight Phase 2: Gentle sky arc into Chapter 03 (Evening Principles)
    const eveningSection = document.getElementById('chapter-evening');
    if (eveningSection) {
      const eveningST = gsap.timeline({
        scrollTrigger: {
          trigger: eveningSection,
          start: 'top 85%',
          end: 'top 20%',
          scrub: 0.8,
          onEnter: () => showDialogue('>_ systems & craft ✦', '✦✦', 3500),
          onLeaveBack: () => showDialogue('>_ take a look at that! 👀', '^^', 3500),
        },
      });

      // Floats in upper-right open sky above the principles column (never covering text)
      eveningST.to(mascot, {
        x: -2 * vw,
        y: -52 * vh,
        scale: 1.0,
        ease: 'power1.inOut',
      });
      if (svgEl) {
        eveningST.to(svgEl, {
          rotation: -4, // gentle tilt on SVG child only
          ease: 'power1.inOut',
          transformOrigin: 'center center',
        }, 0);
      }

      if (eveningST.scrollTrigger) pathTriggers.push(eveningST.scrollTrigger);
    }

    // Flight Phase 3: Drift down to Chapter 04 (Midnight Nocturne)
    const nightSection = document.getElementById('chapter-night');
    if (nightSection) {
      let contactIdx = 0;
      const nightST = gsap.timeline({
        scrollTrigger: {
          trigger: nightSection,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 0.8,
          onEnter: () => {
            contactIdx = (contactIdx + 1) % CONTACT_CUES.length;
            showDialogue(CONTACT_CUES[contactIdx], '~o', 3800); // Wink at contacts!
          },
          onLeaveBack: () => {
            showDialogue('>_ systems & craft ✦', '✦✦', 3500);
          },
        },
      });

      // Returns smoothly to bottom right near contact footer
      nightST.to(mascot, {
        x: 0,
        y: 0,
        scale: 1.0,
        ease: 'power1.out',
      });
      if (svgEl) {
        nightST.to(svgEl, {
          rotation: 0, // resets to upright on SVG child
          ease: 'power1.out',
          transformOrigin: 'center center',
        }, 0);
      }

      if (nightST.scrollTrigger) pathTriggers.push(nightST.scrollTrigger);
    }
  });

  // 5. Chapter State Speech Updates on Mobile / Snap fallback
  let sideCheerIdx = 0;
  const updateSpeechForChapter = (chapter: string) => {
    if (chapter === 'morning') {
      showDialogue('>_ 06:45 AM PHT', '>_', 3500);
    } else if (chapter === 'afternoon') {
      sideCheerIdx = (sideCheerIdx + 1) % SIDE_CHEERS.length;
      showDialogue(SIDE_CHEERS[sideCheerIdx], '^^', 3500);
    } else if (chapter === 'evening') {
      showDialogue('>_ systems & craft', '✦✦', 3500);
    } else if (chapter === 'night') {
      showDialogue(">_ let's connect! 🤝", '~o', 3800);
    }
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-active-chapter') {
        const chapter = document.body.getAttribute('data-active-chapter') || 'morning';
        updateSpeechForChapter(chapter);
      }
    });
  });

  observer.observe(document.body, { attributes: true });

  // 6. DRAG & THROW INTERACTION WITH FLASH ROCKET DASH BACK
  let dragStartX = 0;
  let dragStartY = 0;
  let baseX = 0;
  let baseY = 0;
  let hasMoved = false;

  const onPointerDown = (e: PointerEvent) => {
    isDragging = true;
    hasMoved = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;

    baseX = (gsap.getProperty(mascot, 'x') as number) || 0;
    baseY = (gsap.getProperty(mascot, 'y') as number) || 0;

    mascot.setPointerCapture(e.pointerId);
    mascot.classList.add('bash-mascot--dragging');

    proceduralAudio.playPop();
    showDialogue('>_ wheeeee! ☁️', '>>', 4000);

    gsap.to(mascot, {
      scale: 1.18,
      duration: 0.15,
      ease: 'power2.out',
    });
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;

    if (Math.hypot(deltaX, deltaY) > 6) {
      hasMoved = true;
    }

    gsap.set(mascot, {
      x: baseX + deltaX,
      y: baseY + deltaY,
      rotation: 0,
    });
    if (svgEl) {
      gsap.set(svgEl, {
        rotation: Math.max(-20, Math.min(20, deltaX * 0.15)),
      });
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging) return;
    isDragging = false;
    mascot.releasePointerCapture(e.pointerId);
    mascot.classList.remove('bash-mascot--dragging');

    const totalDist = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);

    if (hasMoved && totalDist > 12) {
      // FLASH ROCKET DASH BACK WITH SPEED TRAIL!
      mascot.classList.add('bash-mascot--flash');
      showDialogue('>_ flash rocket! ⚡', '>>', 3200);

      gsap.timeline()
        .to(mascot, {
          x: baseX,
          y: baseY,
          scale: 1.25,
          duration: 0.28,
          ease: 'power4.in',
        })
        .to(mascot, {
          scale: 0.92,
          duration: 0.1,
          ease: 'power2.out',
        })
        .to(mascot, {
          scale: 1,
          rotation: 0,
          duration: 0.35,
          ease: 'elastic.out(1, 0.4)',
          onComplete: () => {
            mascot.classList.remove('bash-mascot--flash');
          },
        });

      if (svgEl) {
        gsap.to(svgEl, {
          rotation: 0,
          duration: 0.35,
          ease: 'elastic.out(1, 0.4)',
        });
      }
    } else {
      // Reset SVG child tilt and trigger playful spin flip
      if (svgEl) gsap.to(svgEl, { rotation: 0, duration: 0.2 });
      triggerAcrobaticSpin();
    }
  };

  // 7. ACROBATIC 360° / 720° SPINS
  const triggerAcrobaticSpin = () => {
    if (isSpinning || !svgEl) return;
    isSpinning = true;
    clickCount++;

    proceduralAudio.playPop();

    // Cycle through personalized quotes
    const quote = BASH_CLICK_QUOTES[clickCount % BASH_CLICK_QUOTES.length];
    showDialogue(quote, '^^', 3500);

    // Spark antenna electrical wiggle
    if (sparkEl) {
      gsap.timeline()
        .to(sparkEl, { scale: 1.5, rotation: 30, duration: 0.15, transformOrigin: 'center bottom' })
        .to(sparkEl, { scale: 1, rotation: 0, duration: 0.25, ease: 'power2.out' });
    }

    // Acrobatic Spin Flip applied strictly to SVG child so speech bubble stays 100% horizontal
    const spinAmount = clickCount % 3 === 0 ? 720 : 360;

    gsap.timeline({
      onComplete: () => {
        isSpinning = false;
        // Cleanly reset SVG child to upright / hover tilt without rewind spins
        gsap.set(svgEl, { rotation: isHovered ? -12 : 0 });
      },
    })
      .to(svgEl, {
        rotation: `+=${spinAmount}`,
        scale: 1.25,
        duration: 0.5,
        ease: 'back.out(2)',
        transformOrigin: 'center center',
      })
      .to(svgEl, {
        scale: isHovered ? 1.12 : 1,
        duration: 0.25,
        ease: 'power2.out',
        transformOrigin: 'center center',
      });
  };

  // Hover reaction: tilting with "wooohooo twisting!" (locally on SVG only)
  const handleMouseEnter = () => {
    isHovered = true;
    if (isDragging || isSpinning) return;

    showDialogue('>_ wooohooo twisting! 🌪️', '>>', 3500);

    if (svgEl) {
      gsap.to(svgEl, {
        scale: 1.12,
        rotation: -12,
        duration: 0.25,
        ease: 'power2.out',
        transformOrigin: 'center center',
      });
    }
  };

  const handleMouseLeave = () => {
    isHovered = false;
    if (isDragging || isSpinning) return;

    if (svgEl) {
      gsap.to(svgEl, {
        scale: 1,
        rotation: 0,
        duration: 0.25,
        ease: 'power2.out',
        transformOrigin: 'center center',
      });
    }
  };

  mascot.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  mascot.addEventListener('mouseenter', handleMouseEnter);
  mascot.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    floatTween?.kill();
    pathTriggers.forEach((st) => st.kill());
    mm.revert();
    window.removeEventListener('pointermove', handlePointerMove);
    mascot.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    mascot.removeEventListener('mouseenter', handleMouseEnter);
    mascot.removeEventListener('mouseleave', handleMouseLeave);
    if (bubbleFadeTimer) clearTimeout(bubbleFadeTimer);
    if (bubbleSilenceTimer) clearTimeout(bubbleSilenceTimer);
    observer.disconnect();
  };
}

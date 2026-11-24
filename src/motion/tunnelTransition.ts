/* ==========================================================================
   TYPOGRAPHIC CSS 3D TUNNEL TRANSITION (tunnelTransition.ts)
   "Falling into the next chapter: Morning ➔ Afternoon"
   Conforms strictly to BRIEF.md Section 7 & AGENTS.md:
   - 3D container with perspective
   - Typographic frames positioned at increasing translateZ depths
   - GSAP scrubs camera forward on scroll; frames fade as they pass
   - Pure transform & opacity only (zero layout reflow)
   - Complete prefers-reduced-motion fallback
   - Deliberate, weighted pacing with discrete per-panel snap
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './lenis';

gsap.registerPlugin(ScrollTrigger);

export interface TunnelOptions {
  onComplete?: () => void;
}

export function initTunnelTransition(_options: TunnelOptions = {}): ScrollTrigger | null {
  const tunnelSection = document.getElementById('tunnel-morning-afternoon');
  const worldEl = tunnelSection?.querySelector<HTMLElement>('.tunnel-world');
  const hudEl = tunnelSection?.querySelector<HTMLElement>('.tunnel-hud');
  const frames = tunnelSection?.querySelectorAll<HTMLElement>('.tunnel-frame');

  if (!tunnelSection || !worldEl || !frames || frames.length === 0) {
    return null;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------------------
  // 1. Reduced Motion Accessibility Mode
  // -------------------------------------------------------------------------
  if (prefersReduced) {
    // Pure static crossfade fallback
    const fallbackEl = tunnelSection.querySelector<HTMLElement>('.tunnel-fallback');
    if (fallbackEl) {
      fallbackEl.style.display = 'block';
    }
    return null;
  }

  // -------------------------------------------------------------------------
  // 2. 3D Camera Scrub Architecture (Heavy Kinetic Zoom & Physical Fly-Through)
  // Calibrated with deliberate physical weight so every scroll advances one panel
  // -------------------------------------------------------------------------
  const perspectiveEl = tunnelSection?.querySelector<HTMLElement>('.tunnel-perspective');
  // Calibrated frame spacing along Z-axis ensuring seamless continuity across all 12 panels
  const FRAME_STEP = 540;
  const TOTAL_TRAVEL = (frames.length - 1) * FRAME_STEP + 800;
  // Reduced weight runway: ~0.5x lighter than previous 850px for nimble, responsive travel
  const SCROLL_PER_FRAME = 560;
  const SCROLL_DISTANCE = (frames.length - 1) * SCROLL_PER_FRAME + 800;

  // Discrete snap points for every panel focal plane + final chapter exit
  const snapPoints: number[] = [];
  for (let i = 0; i < frames.length; i++) {
    snapPoints.push((i * FRAME_STEP) / TOTAL_TRAVEL);
  }
  snapPoints.push(1.0); // smooth release into Chapter 02: Selected Works

  // Initial setup: set starting Z positions and hardware acceleration
  frames.forEach((frame, idx) => {
    const baseZ = -idx * FRAME_STEP;
    frame.dataset.baseZ = baseZ.toString();
    frame.style.transform = `translate3d(-50%, -50%, ${baseZ}px) scale3d(0.75, 0.75, 1)`;
    frame.style.opacity = idx === 0 ? '1' : '0';
    frame.style.willChange = 'transform, opacity';
  });

  const cameraState = { z: 0 };
  const reticleEl = hudEl?.querySelector<HTMLElement>('.tunnel-hud__reticle');

  const updateFramesDepth = (curZ: number) => {
    frames.forEach((frame) => {
      const baseZ = parseFloat(frame.dataset.baseZ || '0');
      const effZ = baseZ + curZ;

      let opacity = 0;
      let scale = 1.0;

      if (effZ < -350) {
        // Distant frames: 100% invisible! Zero overlapping text in the center
        opacity = 0;
        scale = 0.7;
      } else if (effZ < -80) {
        // Smoothly fade in only as oncoming frame approaches focal center
        const progress = (effZ - (-350)) / 270; // 0 to 1
        opacity = Math.pow(progress, 2.0);
        scale = 0.78 + 0.22 * progress;
      } else if (effZ <= 60) {
        // Prime focal plane: 100% full, razor-sharp opacity!
        opacity = 1.0;
        scale = 1.0 + ((effZ + 80) / 140) * 0.08;
      } else if (effZ < 360) {
        // Smooth fly-through zoom: scales up past camera while fading from 1.0 to 0 cleanly
        const zoomProgress = (effZ - 60) / 300; // 0 to 1
        opacity = Math.max(0, 1.0 - Math.pow(zoomProgress, 1.2));
        scale = 1.08 + Math.pow(zoomProgress, 1.5) * 2.2;
      } else {
        // Completely penetrated and behind camera
        opacity = 0;
        scale = 3.3;
      }

      frame.style.transform = `translate3d(-50%, -50%, ${effZ.toFixed(1)}px) scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1)`;
      frame.style.opacity = opacity.toFixed(3);
    });
  };

  // -------------------------------------------------------------------------
  // 3. GSAP Timeline Linked to ScrollTrigger Scrub (Pinned, High-Weight Runway)
  // -------------------------------------------------------------------------
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: tunnelSection,
      start: 'top top',
      end: () => `+=${SCROLL_DISTANCE}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.7, // Nimble, responsive scrub (~0.5x lighter physical feel)
      snap: {
        snapTo: snapPoints,
        duration: { min: 0.25, max: 0.45 },
        delay: 0.05,
        ease: 'power2.out',
      },
      invalidateOnRefresh: true,
      onEnter: () => {
        const lenis = getLenis() as any;
        if (lenis?.virtualScroll?.options) {
          lenis.virtualScroll.options.wheelMultiplier = 0.85;
        }
      },
      onLeave: () => {
        const lenis = getLenis() as any;
        if (lenis?.virtualScroll?.options) {
          lenis.virtualScroll.options.wheelMultiplier = 0.9;
        }
      },
      onEnterBack: () => {
        const lenis = getLenis() as any;
        if (lenis?.virtualScroll?.options) {
          lenis.virtualScroll.options.wheelMultiplier = 0.85;
        }
      },
      onLeaveBack: () => {
        const lenis = getLenis() as any;
        if (lenis?.virtualScroll?.options) {
          lenis.virtualScroll.options.wheelMultiplier = 0.9;
        }
      },
      onUpdate: (self) => {
        updateFramesDepth(cameraState.z);

        // Update active panel indicator in HUD
        const currentFrameIndex = Math.min(
          frames.length,
          Math.max(1, Math.round(cameraState.z / FRAME_STEP) + 1)
        );
        const promptLabel = hudEl?.querySelector<HTMLElement>('.guiding-cue--accent');
        if (promptLabel) {
          promptLabel.textContent = `FALLING INTO CHAPTER 02 // PANEL ${currentFrameIndex.toString().padStart(2, '0')}/${frames.length}`;
        }

        // Heavy Kinetic Banking: Camera rolls dynamically with scroll velocity
        const velocity = self.getVelocity();
        const roll = Math.max(-8, Math.min(8, velocity * 0.0015));
        const pitch = Math.max(-4.5, Math.min(4.5, velocity * 0.001));
        worldEl.style.transform = `rotateZ(${roll.toFixed(2)}deg) rotateX(${pitch.toFixed(2)}deg)`;

        // Dynamic Camera FOV Zoom: Modulate 3D perspective during high velocity
        if (perspectiveEl) {
          const fovWarp = Math.min(120, Math.abs(velocity) * 0.03);
          perspectiveEl.style.perspective = `${Math.round(1000 - fovWarp)}px`;
        }

        // HUD Reticle spins dynamically with scroll progress
        if (reticleEl) {
          reticleEl.style.transform = `translate(-50%, -50%) rotate(${(self.progress * 720).toFixed(1)}deg)`;
        }
      },
    },
  });

  // Camera moves forward from z=0 to TOTAL_TRAVEL
  tl.to(
    cameraState,
    {
      z: TOTAL_TRAVEL,
      ease: 'none',
      duration: 1,
    },
    0
  );

  // HUD prompt gently fades out as we get deep into the tunnel
  if (hudEl) {
    tl.to(
      hudEl,
      {
        opacity: 0,
        ease: 'power2.in',
        duration: 0.35,
      },
      0.65
    );
  }

  // Keyboard Navigation: ArrowDown/PageDown advances 1 panel, ArrowUp/PageUp returns 1 panel
  const handleKeyNav = (e: KeyboardEvent) => {
    const pinSt = tl.scrollTrigger;
    if (!pinSt || !pinSt.isActive) return;

    let targetIdx = -1;
    const currentIdx = Math.min(
      snapPoints.length - 1,
      Math.max(0, Math.round(cameraState.z / FRAME_STEP))
    );

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      if (currentIdx < snapPoints.length - 1) {
        targetIdx = currentIdx + 1;
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (currentIdx > 0) {
        targetIdx = currentIdx - 1;
      }
    }

    if (targetIdx >= 0) {
      e.preventDefault();
      const targetProgress = snapPoints[targetIdx];
      const targetScroll = pinSt.start + targetProgress * (pinSt.end - pinSt.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  window.addEventListener('keydown', handleKeyNav);

  // Initial render at z=0
  updateFramesDepth(0);

  return tl.scrollTrigger || null;
}

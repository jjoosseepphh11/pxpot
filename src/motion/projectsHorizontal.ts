/* ==========================================================================
   HORIZONTAL SIDE-PANEL PROJECTS SCROLL (projectsHorizontal.ts)
   Inspired by kolfest.bermet.design & leoparpeix.com
   Transforms Chapter 02 (Afternoon / Work) into a smooth horizontal panel scrub.
   - Desktop/Tablet (>= 768px): Pinned GSAP ScrollTrigger scrubbing track along X axis.
   - Mobile (< 768px): Smooth CSS scroll-snap carousel with live touch progress tracking.
   - Reduced Motion: Seamless static vertical card flow with zero layout thrashing.
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initProjectsHorizontal(): () => void {
  const section = document.getElementById('chapter-afternoon');
  const viewport = section?.querySelector<HTMLElement>('.projects-horizontal-viewport');
  const track = section?.querySelector<HTMLElement>('.projects-track');
  const trackWrap = section?.querySelector<HTMLElement>('.projects-track-wrap');
  const panels = section?.querySelectorAll<HTMLElement>('.project-panel');
  const progressBar = document.getElementById('projects-progress-bar');
  const activeMoment = document.getElementById('projects-active-moment');
  const afternoonPlane = document.querySelector<HTMLElement>('.atmosphere-plane--afternoon');
  const eveningPlane = document.querySelector<HTMLElement>('.atmosphere-plane--evening');

  if (!section || !viewport || !track || !panels || panels.length === 0) {
    return () => {};
  }

  const totalPanels = panels.length;
  const mm = gsap.matchMedia();

  // -------------------------------------------------------------------------
  // 1. Desktop & Tablet Pinned Scrub (>= 768px with motion enabled)
  // Weighted scrub with deliberate pace and synchronized halfway palette shift
  // -------------------------------------------------------------------------
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    // Reset any mobile touch inline styles
    track.style.transform = 'translate3d(0, 0, 0)';
    if (progressBar) {
      progressBar.style.transform = `scaleX(${1 / totalPanels})`;
    }

    const getScrollDistance = () => {
      // Precise horizontal delta required to bring the last panel fully into view
      return -(track.scrollWidth - window.innerWidth + 80);
    };

    // Substantial pinned scroll distance giving physical weight and deliberate pace
    const pinDistance = () => {
      return Math.round((track.scrollWidth - window.innerWidth + 80) * 1.4 + 400);
    };

    // Kolfest 3D Cylinder Curve: Center card scales bigger, side panels bend on the ends
    const updatePanelFocus = () => {
      const viewportCenterX = window.innerWidth / 2;
      const halfVw = window.innerWidth / 2;

      panels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const panelCenterX = rect.left + rect.width / 2;
        const diff = (panelCenterX - viewportCenterX) / halfVw;
        const clampedDiff = Math.max(-1.4, Math.min(1.4, diff));
        const absDiff = Math.abs(clampedDiff);

        const rotateY = -clampedDiff * 20;
        const scale = Math.max(0.88, 1.05 - absDiff * 0.15);
        const translateZ = Math.round((1 - Math.min(1, absDiff)) * 32);
        const opacity = Math.max(0.68, 1 - absDiff * 0.28);

        panel.style.transform = `scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1) rotateY(${rotateY.toFixed(2)}deg) translateZ(${translateZ}px)`;
        panel.style.opacity = opacity.toFixed(2);
      });
    };

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${pinDistance()}`,
        pin: true,
        scrub: 0.7, // Heavy, responsive tactile scrub
        invalidateOnRefresh: true,
        onEnter: () => document.body.setAttribute('data-active-chapter', 'afternoon'),
        onLeave: () => document.body.setAttribute('data-active-chapter', 'evening'),
        onEnterBack: () => document.body.setAttribute('data-active-chapter', 'evening'),
        onLeaveBack: () => document.body.setAttribute('data-active-chapter', 'afternoon'),
        onUpdate: (self) => {
          // Update progress runner bar
          if (progressBar) {
            progressBar.style.transform = `scaleX(${Math.max(1 / totalPanels, self.progress)})`;
          }

          // Update active moment counter (01 through 06)
          const currentMoment = Math.min(
            totalPanels,
            Math.max(1, Math.round(self.progress * (totalPanels - 1)) + 1)
          );
          if (activeMoment) {
            const formatted = currentMoment.toString().padStart(2, '0');
            if (activeMoment.textContent !== formatted) {
              activeMoment.textContent = formatted;
            }
          }

          // Update chapter indicator time and active theme header contrast across 6 moments
          if (self.isActive) {
            const indicator = document.getElementById('current-chapter-indicator');
            if (self.progress >= 0.7) {
              if (indicator && indicator.textContent !== 'CH 02 // 06:15 PM PHT') {
                indicator.textContent = 'CH 02 // 06:15 PM PHT';
              }
              if (document.body.getAttribute('data-active-chapter') !== 'sunset') {
                document.body.setAttribute('data-active-chapter', 'sunset');
              }
            } else if (self.progress >= 0.35) {
              if (indicator && indicator.textContent !== 'CH 02 // 05:00 PM PHT') {
                indicator.textContent = 'CH 02 // 05:00 PM PHT';
              }
              if (document.body.getAttribute('data-active-chapter') !== 'sunset') {
                document.body.setAttribute('data-active-chapter', 'sunset');
              }
            } else {
              if (indicator && indicator.textContent !== 'CH 02 // 01:15 PM PHT') {
                indicator.textContent = 'CH 02 // 01:15 PM PHT';
              }
              if (document.body.getAttribute('data-active-chapter') !== 'afternoon') {
                document.body.setAttribute('data-active-chapter', 'afternoon');
              }
            }
          }

          // Apply Kolfest 3D cylindrical curve & focal weighting
          updatePanelFocus();
        },
      },
    });

    // 1. Horizontal track travel
    timeline.to(track, { x: getScrollDistance, ease: 'none', duration: 1 }, 0);

    // 2. Synchronized Sunset Palette Shift across 6 Moments:
    // Moments 01-02 (Daylight) ➔ Moments 03-04 (Sunset Gold) ➔ Moments 05-06 (Twilight Navy)
    if (afternoonPlane && eveningPlane) {
      timeline
        .to(afternoonPlane, { opacity: 0, ease: 'power1.inOut', duration: 0.45 }, 0.35)
        .to(eveningPlane, { opacity: 1, ease: 'power1.inOut', duration: 0.45 }, 0.35)
        .to('#chapter-afternoon .section-title', { color: '#FFFFFF', ease: 'power2.out', duration: 0.35 }, 0.35)
        .to('#chapter-afternoon .chapter-meta', { color: '#FBBF24', ease: 'power2.out', duration: 0.35 }, 0.35)
        .to('#chapter-afternoon .projects-counter__sep', { color: '#A3C5E4', ease: 'power2.out', duration: 0.35 }, 0.35)
        .to('#chapter-afternoon .projects-counter__total', { color: '#A3C5E4', ease: 'power2.out', duration: 0.35 }, 0.35)
        .to('#chapter-afternoon .projects-counter__current', { color: '#FBBF24', ease: 'power2.out', duration: 0.35 }, 0.35)
        .to('#chapter-afternoon .projects-progress-bar', { backgroundColor: '#FBBF24', ease: 'power2.out', duration: 0.35 }, 0.35)
        .to('#chapter-afternoon .guiding-cue', { color: '#A3C5E4', ease: 'power2.out', duration: 0.35 }, 0.35);
    }

    // Initial focus on panel 0
    updatePanelFocus();

    // Keyboard navigation (WCAG 2.1.1): Arrow keys navigate panels when track wrap is focused
    const handleKeyNav = (e: KeyboardEvent) => {
      const pinSt = timeline.scrollTrigger;
      if (!pinSt) return;
      let targetProgress = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const curIdx = Math.min(totalPanels - 1, Math.round(pinSt.progress * (totalPanels - 1)));
        if (curIdx < totalPanels - 1) {
          targetProgress = (curIdx + 1) / (totalPanels - 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const curIdx = Math.max(0, Math.round(pinSt.progress * (totalPanels - 1)));
        if (curIdx > 0) {
          targetProgress = (curIdx - 1) / (totalPanels - 1);
        }
      } else if (e.key === 'Home') {
        targetProgress = 0;
      } else if (e.key === 'End') {
        targetProgress = 1;
      }

      if (targetProgress >= 0) {
        e.preventDefault();
        const targetScroll = pinSt.start + targetProgress * (pinSt.end - pinSt.start);
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    };

    // Auto-align when an element inside a panel receives keyboard focus
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const panel = target.closest<HTMLElement>('.project-panel');
      if (panel && timeline.scrollTrigger) {
        const idx = Array.from(panels).indexOf(panel);
        if (idx >= 0) {
          const pinSt = timeline.scrollTrigger;
          const targetProgress = idx / (totalPanels - 1);
          const targetScroll = pinSt.start + targetProgress * (pinSt.end - pinSt.start);
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      }
    };

    if (trackWrap) {
      trackWrap.addEventListener('keydown', handleKeyNav);
      trackWrap.addEventListener('focusin', handleFocusIn);
    }

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      if (trackWrap) {
        trackWrap.removeEventListener('keydown', handleKeyNav);
        trackWrap.removeEventListener('focusin', handleFocusIn);
      }
      panels.forEach((p) => {
        p.style.opacity = '';
        p.style.transform = '';
      });
    };
  });

  // -------------------------------------------------------------------------
  // 2. Mobile Touch Scroll Snap with 3D Side-Panel Bend (< 768px)
  // -------------------------------------------------------------------------
  mm.add('(max-width: 767px)', () => {
    track.style.transform = 'none';

    if (!trackWrap) return;

    const updateMobilePanelFocus = () => {
      const wrapRect = trackWrap.getBoundingClientRect();
      const wrapCenterX = wrapRect.left + wrapRect.width / 2;
      const halfWidth = wrapRect.width / 2;

      panels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const panelCenterX = rect.left + rect.width / 2;
        const diff = (panelCenterX - wrapCenterX) / halfWidth;
        const clampedDiff = Math.max(-1.3, Math.min(1.3, diff));
        const absDiff = Math.abs(clampedDiff);

        // Kolfest curve on mobile: Center card scales bigger, side cards bend inward!
        const rotateY = -clampedDiff * 16;
        const scale = Math.max(0.88, 1.04 - absDiff * 0.15);
        const translateZ = Math.round((1 - Math.min(1, absDiff)) * 24);
        const opacity = Math.max(0.72, 1 - absDiff * 0.25);

        panel.style.transform = `scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1) rotateY(${rotateY.toFixed(2)}deg) translateZ(${translateZ}px)`;
        panel.style.opacity = opacity.toFixed(2);
      });
    };

    const handleMobileScroll = () => {
      const maxScroll = trackWrap.scrollWidth - trackWrap.clientWidth;
      if (maxScroll <= 0) return;

      const progress = Math.min(1, Math.max(0, trackWrap.scrollLeft / maxScroll));
      if (progressBar) {
        progressBar.style.transform = `scaleX(${Math.max(1 / totalPanels, progress)})`;
      }

      const currentMoment = Math.min(
        totalPanels,
        Math.max(1, Math.floor(progress * totalPanels) + 1)
      );
      if (activeMoment) {
        activeMoment.textContent = currentMoment.toString().padStart(2, '0');
      }

      updateMobilePanelFocus();
    };

    trackWrap.addEventListener('scroll', handleMobileScroll, { passive: true });
    // Initial call to set center card bigger and side panels bent
    requestAnimationFrame(updateMobilePanelFocus);

    return () => {
      trackWrap.removeEventListener('scroll', handleMobileScroll);
      panels.forEach((p) => {
        p.style.transform = '';
        p.style.opacity = '';
      });
    };
  });

  // -------------------------------------------------------------------------
  // 3. Reduced Motion Mode
  // -------------------------------------------------------------------------
  mm.add('(prefers-reduced-motion: reduce)', () => {
    track.style.transform = 'none';
    if (progressBar) {
      progressBar.style.transform = 'scaleX(1)';
    }
  });

  return () => {
    mm.revert();
  };
}

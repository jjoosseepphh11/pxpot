/* ==========================================================================
   SCROLL FLOW & CHAPTER PROGRESSION (scrollFlow.ts)
   Orchestrates ScrollTrigger chapter boundaries, nav synchronization,
   smooth click-to-scroll, and restrained entrance tweens.
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToTarget } from './lenis';
import { proceduralAudio } from '../audio/proceduralAudio';

gsap.registerPlugin(ScrollTrigger);

export interface ChapterMeta {
  id: string;
  code: string;
  time: string;
}

export const CHAPTERS: ChapterMeta[] = [
  { id: 'chapter-morning', code: 'CH 01', time: '06:45 AM PHT' },
  { id: 'chapter-afternoon', code: 'CH 02', time: '01:15 PM PHT' },
  { id: 'chapter-evening', code: 'CH 03', time: '07:30 PM PHT' },
  { id: 'chapter-night', code: 'CH 04', time: '11:50 PM PHT' },
];

/**
 * Updates UI headers, ARIA attributes, and nav link active states.
 */
function updateActiveChapter(chapter: ChapterMeta): void {
  const indicator = document.getElementById('current-chapter-indicator');
  const timeDisplay = document.getElementById('time-display');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.site-nav__link');

  const chapterKey = chapter.id.replace('chapter-', '');
  document.body.setAttribute('data-active-chapter', chapterKey);
  proceduralAudio.setChapter(chapterKey);

  if (indicator) {
    indicator.textContent = `${chapter.code} // ${chapter.time}`;
  }

  if (timeDisplay) {
    timeDisplay.setAttribute('aria-label', `Current Chapter: ${chapter.code}, Time: ${chapter.time}`);
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${chapter.id}`) {
      link.classList.add('site-nav__link--active');
      link.setAttribute('aria-current', 'location');
    } else {
      link.classList.remove('site-nav__link--active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Initializes ScrollTrigger instances for tracking chapters with calibrated threshold.
 * Prevents premature chapter flash before user has truly scrolled into the section.
 */
export function initChapterScrollTriggers(): void {
  CHAPTERS.forEach((chapter, index) => {
    const el = document.getElementById(chapter.id);
    if (!el) return;

    // First chapter triggers near top; subsequent chapters trigger once 65% in view
    const startThreshold = index === 0 ? 'top 70%' : 'top 35%';
    const endThreshold = index === CHAPTERS.length - 1 ? 'bottom 10%' : 'bottom 35%';

    ScrollTrigger.create({
      trigger: el,
      start: startThreshold,
      end: endThreshold,
      onEnter: () => updateActiveChapter(chapter),
      onEnterBack: () => updateActiveChapter(chapter),
    });
  });
}

/**
 * Binds all anchor links to Lenis smooth scrolling with proper offset.
 */
export function initNavScrollLinks(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector<HTMLElement>(href);
      if (target) {
        e.preventDefault();
        // Clean alignment at section boundary
        scrollToTarget(target, 0);

        // Keep accessibility intact: set focus to target if main content
        if (href === '#main-content') {
          target.focus();
        }
      }
    });
  });
}

/**
 * Reveals the Morning Hero section when the loader completes.
 * Smoothly maintains settled state to prevent flash-resets.
 */
export function revealMorningHero(): void {
  // Page is already revealed smoothly by the fading loader overlay.
  // Preserves calm, stable visual continuity with zero flash or re-refresh.
}

/**
 * Restrained entrance animations strictly constrained to transform and opacity.
 * Respects prefers-reduced-motion.
 */
export function initSectionEntrances(): void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion: do not animate transforms, keep content statically visible
  if (prefersReduced) {
    return;
  }

  // 1. Evening About Section Elements
  const aboutElements = document.querySelectorAll('.about-statement, .principle-item, .room-deferred-note');
  aboutElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true,
      },
      y: 22,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
    });
  });

  // 4. Night Closing & Cinematic Landscape Profile Canvas
  const landscapeSection = document.querySelector<HTMLElement>('#chapter-night');
  const landscapeImg = document.querySelector<HTMLElement>('.landscape-canvas__img');
  const headlineLines = document.querySelectorAll<HTMLElement>('.landscape-headline-line');
  const bottomBlock = document.querySelector<HTMLElement>('.landscape-canvas__bottom-block');

  if (landscapeSection) {
    // A. Multi-Plane Parallax Camera Scrub: Background Photo
    if (landscapeImg) {
      gsap.fromTo(
        landscapeImg,
        { yPercent: -12, scale: 1.12 },
        {
          yPercent: 12,
          scale: 1.0,
          ease: 'none',
          scrollTrigger: {
            trigger: landscapeSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }

    // B. Leo Parpeix Signature Flow-Up (Pop-Up) & Flow-Out Sequence on Scroll
    if (headlineLines.length > 0) {
      // Flow-Up Entrance: As user enters Chapter 04, letters smoothly flow/pop up from below
      const flowInTl = gsap.timeline({
        scrollTrigger: {
          trigger: landscapeSection,
          start: 'top 75%',
          end: 'top 20%',
          scrub: 1,
        },
      });

      headlineLines.forEach((line, idx) => {
        flowInTl.fromTo(
          line,
          {
            y: 70 + idx * 25,
            opacity: 0,
            scale: 0.93,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
          },
          idx * 0.12
        );
      });

      // Flow-Out Exit: As user scrolls through to the footer, letters smoothly flow upward and fade
      const flowOutTl = gsap.timeline({
        scrollTrigger: {
          trigger: landscapeSection,
          start: 'center 40%',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      headlineLines.forEach((line, idx) => {
        const depth = parseFloat(line.getAttribute('data-depth') || '0.25');
        flowOutTl.to(
          line,
          {
            yPercent: -45 * depth,
            xPercent: (depth - 0.3) * 12,
            opacity: 0.25,
            ease: 'power1.in',
          },
          idx * 0.08
        );
      });
    }

    // C. Name & Pure Typographic Links Smooth Pop-Up
    if (bottomBlock) {
      gsap.fromTo(
        bottomBlock,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: landscapeSection,
            start: 'top 65%',
            end: 'top 25%',
            scrub: 0.9,
          },
        }
      );
    }
  }
}

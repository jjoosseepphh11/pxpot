/**
 * Interactive 3D Flippable Share & Profile Connect Card Modal (shareCardModal.ts)
 * Conforms strictly to BRIEF.md, AGENTS.md and Altos Adventure UI standards.
 * Pure vector SVG QR codes, transform & opacity only kinetics, zero layout reflow.
 */

import { gsap } from 'gsap';
import { PROFILE_LINKS } from '../utils/qrSvg';
import { getLenis } from './lenis';

export function initShareCardModal(): () => void {
  const modalEl = document.getElementById('share-card-modal');
  const flipperEl = document.getElementById('share-card-flipper');
  const backdrop = document.getElementById('share-modal-backdrop');
  const closeBtn = document.getElementById('share-modal-close');
  const flipToBackBtn = document.getElementById('btn-flip-to-back');
  const flipToFrontBtn = document.getElementById('btn-flip-to-front');
  const openBtnHeader = document.getElementById('btn-open-share-card');
  const openBtnContact = document.getElementById('btn-open-share-card-contact');
  const copyPortfolioBtn = document.getElementById('btn-copy-portfolio-link');
  const copyEmailBtn = document.getElementById('btn-copy-email');
  const toast = document.getElementById('share-modal-toast');
  const toastText = document.getElementById('share-toast-text');

  // Playful Mascot & Lettering Elements
  const cardMascot = document.getElementById('card-playful-mascot');
  const cardMascotBody = cardMascot?.querySelector<HTMLElement>('.card-playful-mascot__body');
  const cardMascotSpeech = document.getElementById('card-mascot-speech');
  const cardMascotEyes = cardMascot?.querySelectorAll<SVGElement>('.mascot-eye');
  const cardMascotSpark = cardMascot?.querySelector<SVGPathElement>('.mascot-spark-antenna');
  const fullCharSpans = document.querySelectorAll<HTMLElement>('.name-display--full .name-char');

  if (!modalEl || !flipperEl) return () => {};
  const modal = modalEl;
  const flipper = flipperEl;

  let isOpen = false;
  let isFlipped = false;
  let toastTimeout: number | null = null;
  let lastActiveElement: HTMLElement | null = null;
  let speechTimeout: number | null = null;
  let playfulRoutineTimer: number | null = null;
  let phraseIndex = 0;

  const mascotPhrases = [
    '>_ hi! ☁️',
    '>_ Patrick Dohn Joseph! ✨',
    '>_ Polar Founder 🚀',
    '>_ data & automation ⚡',
    '>_ @pxpot on GitHub ✦',
    '>_ clean code & calm UI 🏛️',
    ">_ let's connect! 🤝",
    '>_ click me to spin! ↺'
  ];

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mascot Ambient Floating & Eye Blinking
  let mascotIdleAnim: gsap.core.Tween | null = null;
  let mascotBlinkAnim: gsap.core.Timeline | null = null;

  if (!prefersReduced && cardMascotBody) {
    mascotIdleAnim = gsap.to(cardMascotBody, {
      y: -6,
      rotation: 3.5,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    if (cardMascotEyes && cardMascotEyes.length > 0) {
      mascotBlinkAnim = gsap.timeline({ repeat: -1, repeatDelay: 2.8 })
        .to(cardMascotEyes, { scaleY: 0.1, transformOrigin: 'center center', duration: 0.08 })
        .to(cardMascotEyes, { scaleY: 1, duration: 0.08 });
    }
  }

  function triggerMascotSpeak(customText?: string): void {
    if (!cardMascotSpeech || !cardMascot) return;
    const textSpan = cardMascotSpeech.querySelector('span');
    if (textSpan) {
      if (customText) {
        textSpan.textContent = customText;
      } else {
        textSpan.textContent = mascotPhrases[phraseIndex % mascotPhrases.length];
        phraseIndex++;
      }
    }

    cardMascot.classList.add('is-speaking');
    if (speechTimeout) window.clearTimeout(speechTimeout);
    speechTimeout = window.setTimeout(() => {
      cardMascot.classList.remove('is-speaking');
    }, 2400);
  }

  function bounceLetter(letterEl: HTMLElement): void {
    if (prefersReduced) return;
    gsap.timeline()
      .to(letterEl, { scaleY: 0.78, scaleX: 1.25, color: '#F59E0B', duration: 0.12, ease: 'power2.out' })
      .to(letterEl, { scaleY: 1.26, scaleX: 0.88, y: -6, duration: 0.22, ease: 'back.out(2)' })
      .to(letterEl, { scaleY: 1, scaleX: 1, y: 0, color: 'inherit', duration: 0.2, ease: 'power2.out' });
  }

  function playCardMascotGreeting(): void {
    if (prefersReduced || !cardMascot) return;
    gsap.timeline({ delay: 0.25 })
      .to(cardMascot, { scale: 0.9, duration: 0.1, ease: 'power2.out' })
      .to(cardMascot, { y: -14, rotation: 12, scale: 1.15, duration: 0.35, ease: 'back.out(2)' })
      .to(cardMascot, { y: 0, rotation: 0, scale: 1, duration: 0.22, ease: 'bounce.out' });
    triggerMascotSpeak('>_ hi! ☁️');

    // Stagger a gentle ripple through the first letters of Patrick's name
    const initialLetters = Array.from(fullCharSpans).slice(0, 7);
    initialLetters.forEach((char, idx) => {
      window.setTimeout(() => bounceLetter(char), 320 + idx * 50);
    });
  }

  function executePlayfulRoutine(): void {
    if (prefersReduced || !cardMascot || !isOpen) return;

    const action = Math.floor(Math.random() * 3);
    if (action === 0) {
      // Action 0: playful double hop and wiggle
      gsap.timeline()
        .to(cardMascot, { y: -10, rotation: -8, duration: 0.2, ease: 'power2.out' })
        .to(cardMascot, { y: 0, rotation: 8, duration: 0.18, ease: 'power2.in' })
        .to(cardMascot, { y: -6, rotation: -4, duration: 0.16, ease: 'power2.out' })
        .to(cardMascot, { y: 0, rotation: 0, duration: 0.14, ease: 'bounce.out' });
    } else if (action === 1) {
      // Action 1: spark flash + speech
      if (cardMascotSpark) {
        gsap.fromTo(
          cardMascotSpark,
          { stroke: '#FFFFFF', strokeWidth: 3 },
          { stroke: '#FBBF24', strokeWidth: 1.5, duration: 0.4 }
        );
      }
      triggerMascotSpeak();
    } else {
      // Action 2: joyful nod and letter ripple
      gsap.timeline()
        .to(cardMascot, { y: -8, scale: 1.08, duration: 0.2, ease: 'back.out(1.5)' })
        .to(cardMascot, { y: 0, scale: 1, duration: 0.18, ease: 'bounce.out' });
      const randomIdx = Math.floor(Math.random() * Math.max(1, fullCharSpans.length - 4));
      const slice = Array.from(fullCharSpans).slice(randomIdx, randomIdx + 4);
      slice.forEach((c, idx) => {
        window.setTimeout(() => bounceLetter(c), idx * 60);
      });
    }
  }

  function handleMascotClick(e: Event): void {
    e.stopPropagation();
    if (!prefersReduced && cardMascot) {
      gsap.timeline()
        .to(cardMascot, { scale: 0.86, duration: 0.1, ease: 'power2.out' })
        .to(cardMascot, {
          y: -20,
          rotation: '+=360',
          scale: 1.2,
          duration: 0.55,
          ease: 'back.out(1.8)'
        })
        .to(cardMascot, { y: 0, scale: 1, duration: 0.2, ease: 'bounce.out' });

      if (cardMascotSpark) {
        gsap.fromTo(
          cardMascotSpark,
          { stroke: '#FFFFFF', strokeWidth: 3 },
          { stroke: '#FBBF24', strokeWidth: 1.5, duration: 0.4 }
        );
      }
    }
    triggerMascotSpeak();

    // Wave bounce across all letters of Patrick Dohn Joseph A. Lontok
    fullCharSpans.forEach((letter, idx) => {
      window.setTimeout(() => bounceLetter(letter), idx * 45);
    });
  }

  function showToast(message: string): void {
    if (!toast || !toastText) return;
    toastText.textContent = message;

    if (toastTimeout) {
      window.clearTimeout(toastTimeout);
      toastTimeout = null;
    }

    toast.classList.add('is-visible');
    if (!prefersReduced) {
      gsap.fromTo(
        toast,
        { opacity: 0, y: 14, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.8)' }
      );
    }

    toastTimeout = window.setTimeout(() => {
      if (!prefersReduced) {
        gsap.to(toast, {
          opacity: 0,
          y: 10,
          scale: 0.96,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            toast.classList.remove('is-visible');
          }
        });
      } else {
        toast.classList.remove('is-visible');
      }
    }, 2400);
  }

  async function copyToClipboard(text: string, successMessage: string): Promise<void> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(successMessage);
    } catch {
      showToast('Copied text: ' + text);
    }
  }

  function setFlipped(flipped: boolean): void {
    isFlipped = flipped;
    if (flipper) {
      if (isFlipped) {
        flipper.classList.add('is-flipped');
      } else {
        flipper.classList.remove('is-flipped');
      }
    }
  }

  function openModal(): void {
    if (isOpen) return;
    isOpen = true;
    lastActiveElement = document.activeElement as HTMLElement;

    // Reset to front face
    setFlipped(false);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Lock background scrolling while modal is open
    const lenis = getLenis();
    if (lenis) {
      lenis.stop();
    }

    const dialog = modal.querySelector('.share-modal__dialog');

    if (!prefersReduced && dialog) {
      gsap.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo(
        dialog,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }
      );
    }

    // Set focus into modal for accessibility
    window.setTimeout(() => {
      closeBtn?.focus();
    }, 100);

    // Playful mascot greeting sequence & recurring routine
    playCardMascotGreeting();
    if (playfulRoutineTimer) window.clearInterval(playfulRoutineTimer);
    playfulRoutineTimer = window.setInterval(executePlayfulRoutine, 4600);
  }

  function closeModal(): void {
    if (!isOpen) return;
    isOpen = false;

    // Unlock background scrolling
    const lenis = getLenis();
    if (lenis) {
      lenis.start();
    }
    document.body.classList.remove('modal-open');

    if (playfulRoutineTimer) {
      window.clearInterval(playfulRoutineTimer);
      playfulRoutineTimer = null;
    }

    const dialog = modal.querySelector('.share-modal__dialog');

    if (!prefersReduced && dialog) {
      gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in' });
      gsap.to(dialog, {
        opacity: 0,
        scale: 0.94,
        y: 12,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          modal.classList.remove('is-open');
          modal.setAttribute('aria-hidden', 'true');
          lastActiveElement?.focus();
        }
      });
    } else {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      lastActiveElement?.focus();
    }
  }

  // Event Listeners
  const handleOpenHeader = (e: Event) => {
    e.preventDefault();
    openModal();
  };

  const handleOpenContact = (e: Event) => {
    e.preventDefault();
    openModal();
  };

  const handleClose = (e: Event) => {
    e.preventDefault();
    closeModal();
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === backdrop) {
      closeModal();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
  };

  const handleFlipToBack = (e: Event) => {
    e.preventDefault();
    setFlipped(true);
  };

  const handleFlipToFront = (e: Event) => {
    e.preventDefault();
    setFlipped(false);
  };

  const handleCopyPortfolio = (e: Event) => {
    e.preventDefault();
    copyToClipboard(PROFILE_LINKS.portfolio, 'Portfolio link copied! ✨');
  };

  const handleCopyEmail = (e: Event) => {
    e.preventDefault();
    copyToClipboard('patrickalcalalontok@gmail.com', 'Email copied to clipboard! ✉️');
  };

  // Wire elements
  openBtnHeader?.addEventListener('click', handleOpenHeader);
  openBtnContact?.addEventListener('click', handleOpenContact);
  closeBtn?.addEventListener('click', handleClose);
  backdrop?.addEventListener('click', handleBackdropClick);
  document.addEventListener('keydown', handleKeyDown);

  flipToBackBtn?.addEventListener('click', handleFlipToBack);
  flipToFrontBtn?.addEventListener('click', handleFlipToFront);

  copyPortfolioBtn?.addEventListener('click', handleCopyPortfolio);
  copyEmailBtn?.addEventListener('click', handleCopyEmail);

  // Wire playful mascot and letter interactions
  const handleMascotHover = () => triggerMascotSpeak();
  cardMascot?.addEventListener('click', handleMascotClick);
  cardMascot?.addEventListener('mouseenter', handleMascotHover);

  const letterClickHandlers: { el: HTMLElement; fn: () => void }[] = [];
  fullCharSpans.forEach((char) => {
    const fn = () => bounceLetter(char);
    char.addEventListener('click', fn);
    letterClickHandlers.push({ el: char, fn });
  });

  // Return cleanup
  return () => {
    openBtnHeader?.removeEventListener('click', handleOpenHeader);
    openBtnContact?.removeEventListener('click', handleOpenContact);
    closeBtn?.removeEventListener('click', handleClose);
    backdrop?.removeEventListener('click', handleBackdropClick);
    document.removeEventListener('keydown', handleKeyDown);
    flipToBackBtn?.removeEventListener('click', handleFlipToBack);
    flipToFrontBtn?.removeEventListener('click', handleFlipToFront);
    copyPortfolioBtn?.removeEventListener('click', handleCopyPortfolio);
    copyEmailBtn?.removeEventListener('click', handleCopyEmail);
    cardMascot?.removeEventListener('click', handleMascotClick);
    cardMascot?.removeEventListener('mouseenter', handleMascotHover);
    letterClickHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
    if (toastTimeout) window.clearTimeout(toastTimeout);
    if (speechTimeout) window.clearTimeout(speechTimeout);
    if (playfulRoutineTimer) window.clearInterval(playfulRoutineTimer);
    mascotIdleAnim?.kill();
    mascotBlinkAnim?.kill();
  };
}

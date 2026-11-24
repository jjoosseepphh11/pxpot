/**
 * Hero Name Typographic Rotor & Playful Letter Mascot (heroNameRotor.ts)
 * 1. Desktop & Laptop: Full Name "Patrick Dohn Joseph A. Lontok" with playful companion mascot.
 * 2. Medium/Tablet: Downward rotating first name (Patrick -> Dohn -> Joseph -> Patrick Lontok)
 *    with dynamic width locking (zero extra gap, tight horizontal baseline alignment).
 * 3. Mobile: Compact "Pat Lontok" with companion mascot playfully hopping across letters.
 * Conforms strictly to transform & opacity only, zero layout reflow.
 */

import { gsap } from 'gsap';

export function initHeroNameRotor(): () => void {
  // Desktop Full Name Elements
  const fullGroup = document.getElementById('hero-full-name-group');
  const fullWords = fullGroup?.querySelectorAll<HTMLElement>('.hero-name-word');
  const fullChars = fullGroup?.querySelectorAll<HTMLElement>('.hero-name-char');
  const fullMascot = document.getElementById('hero-full-mascot');
  const fullSpeech = document.getElementById('hero-full-mascot-speech');
  const fullEyes = fullMascot?.querySelectorAll<SVGElement>('.hero-full-mascot-eye');
  const fullSpark = fullMascot?.querySelector<SVGPathElement>('.hero-full-mascot-spark');

  // Medium Screen Rotor Elements
  const rotorStage = document.getElementById('hero-rotor-stage');
  const rotorWords = rotorStage?.querySelectorAll<HTMLElement>('.hero-rotor-word');

  // Small Screen Compact "Pat" Elements
  const heroMascot = document.getElementById('hero-pat-mascot');
  const heroLetters = document.querySelectorAll<HTMLElement>('.hero-pat-char');
  const heroSpeech = heroMascot?.querySelector<HTMLElement>('.hero-pat-mascot__speech');
  const heroSpark = heroMascot?.querySelector<SVGPathElement>('.hero-mascot-spark');
  const heroEyes = heroMascot?.querySelectorAll<SVGElement>('.hero-mascot-eye');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let rotorIndex = 0;
  let rotorTimer: number | null = null;
  let mobileHopTimer: number | null = null;
  let desktopHopTimer: number | null = null;
  let speechTimer: number | null = null;
  let fullSpeechTimer: number | null = null;

  let fullIdleTween: gsap.core.Tween | null = null;
  let fullBlinkTL: gsap.core.Timeline | null = null;
  let mobileIdleTween: gsap.core.Tween | null = null;
  let mobileBlinkTL: gsap.core.Timeline | null = null;

  function bounceElement(el: HTMLElement, accentColor = '#F59E0B'): void {
    if (prefersReduced) return;
    gsap.timeline()
      .to(el, { scaleY: 0.8, scaleX: 1.25, color: accentColor, duration: 0.12, ease: 'power2.out' })
      .to(el, { scaleY: 1.28, scaleX: 0.86, y: -6, duration: 0.22, ease: 'back.out(2)' })
      .to(el, { scaleY: 1, scaleX: 1, y: 0, color: 'inherit', duration: 0.2, ease: 'power2.out' });
  }

  // =========================================================================
  // 1. DESKTOP & LAPTOP FULL NAME WITH PLAYFUL COMPANION MASCOT
  // =========================================================================
  if (fullMascot && fullWords && fullWords.length > 0) {
    if (!prefersReduced) {
      fullIdleTween = gsap.to(fullMascot, {
        y: -5,
        rotation: 3,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      if (fullEyes && fullEyes.length > 0) {
        fullBlinkTL = gsap.timeline({ repeat: -1, repeatDelay: 3.2 })
          .to(fullEyes, { scaleY: 0.1, transformOrigin: 'center center', duration: 0.08 })
          .to(fullEyes, { scaleY: 1, duration: 0.08 });
      }
    }

    const fullPhrases = [
      '>_ Patrick! ✨',
      '>_ full stack & cloud ⚡',
      '>_ @pxpot 🚀',
      '>_ let\'s build! 🏛️',
      '>_ calm UI & systems ✦'
    ];
    let fullPhraseIdx = 0;

    function showFullMascotSpeech(text?: string, duration = 2200): void {
      if (!fullSpeech) return;
      fullSpeech.textContent = text || fullPhrases[fullPhraseIdx % fullPhrases.length];
      if (!text) fullPhraseIdx++;
      fullSpeech.classList.add('is-active');
      if (fullSpeechTimer) window.clearTimeout(fullSpeechTimer);
      fullSpeechTimer = window.setTimeout(() => {
        fullSpeech.classList.remove('is-active');
      }, duration);
    }

    const wordSpeechMap: Record<string, string> = {
      Patrick: '>_ Patrick! ✨',
      Dohn: '>_ Dohn! ⚡',
      Joseph: '>_ Joseph! ☁️',
      'A.': '>_ A.! ✦',
      Lontok: '>_ Patrick Dohn Joseph A. Lontok! 🚀'
    };

    function hopAcrossFullName(): void {
      if (prefersReduced || !fullMascot || !fullWords || fullWords.length === 0 || !fullGroup) return;
      // Only execute hop if on desktop/laptop screen (>= 860px)
      if (window.innerWidth < 860) return;

      const mascotBaseRect = fullMascot.getBoundingClientRect();
      const mascotCenterX = mascotBaseRect.left + mascotBaseRect.width / 2;

      const hopTL = gsap.timeline();
      fullWords.forEach((wordEl, i) => {
        const wordRect = wordEl.getBoundingClientRect();
        const wordCenterX = wordRect.left + wordRect.width / 2;
        const targetX = wordCenterX - mascotCenterX;
        const wordName = wordEl.getAttribute('data-word') || '';

        hopTL
          .to(fullMascot, {
            x: targetX,
            y: -16,
            rotation: i % 2 === 0 ? 10 : -10,
            duration: 0.28,
            ease: 'power2.out'
          })
          .to(fullMascot, {
            y: 0,
            rotation: 0,
            duration: 0.2,
            ease: 'bounce.out',
            onStart: () => {
              bounceElement(wordEl, '#F59E0B');
              const speech = wordSpeechMap[wordName] || `>_ ${wordName}! ✨`;
              showFullMascotSpeech(speech, wordName === 'Lontok' ? 3600 : 1600);

              // When landing on surname Lontok, trigger ripple celebration across all letters!
              if (wordName === 'Lontok' && fullChars && fullChars.length > 0) {
                gsap.to(fullChars, {
                  y: -6,
                  scaleY: 1.18,
                  scaleX: 0.9,
                  stagger: 0.02,
                  duration: 0.16,
                  ease: 'back.out(2)',
                  yoyo: true,
                  repeat: 1
                });
              }
            }
          });
      });

      // Joyfully return to resting spot above Patrick
      hopTL
        .to(fullMascot, {
          x: 0,
          y: -10,
          duration: 0.3,
          ease: 'power2.out'
        })
        .to(fullMascot, {
          x: 0,
          y: 0,
          duration: 0.2,
          ease: 'bounce.out'
        });

      hopTL.call(() => {
        // Keep Patrick Dohn Joseph A. Lontok! 🚀 proudly displayed
        showFullMascotSpeech('>_ Patrick Dohn Joseph A. Lontok! 🚀', 3400);
        if (fullSpark) {
          gsap.fromTo(
            fullSpark,
            { stroke: '#FFFFFF', strokeWidth: 3 },
            { stroke: '#FBBF24', strokeWidth: 1.5, duration: 0.4 }
          );
        }
      });
    }

    // Interactive Full Mascot Click
    const handleFullMascotClick = (e: Event) => {
      e.stopPropagation();
      if (!prefersReduced && fullMascot) {
        gsap.timeline()
          .to(fullMascot, { scale: 0.86, duration: 0.1, ease: 'power2.out' })
          .to(fullMascot, {
            y: -22,
            rotation: '+=360',
            scale: 1.2,
            duration: 0.55,
            ease: 'back.out(1.8)'
          })
          .to(fullMascot, { y: 0, scale: 1, duration: 0.22, ease: 'bounce.out' });

        if (fullSpark) {
          gsap.fromTo(
            fullSpark,
            { stroke: '#FFFFFF', strokeWidth: 3 },
            { stroke: '#FBBF24', strokeWidth: 1.5, duration: 0.4 }
          );
        }
      }
      showFullMascotSpeech();
      fullChars?.forEach((charEl, idx) => {
        window.setTimeout(() => bounceElement(charEl, '#F59E0B'), idx * 30);
      });
    };

    fullMascot.addEventListener('click', handleFullMascotClick);

    // Wire individual letter clicks in full name
    fullChars?.forEach((charEl) => {
      charEl.addEventListener('click', () => bounceElement(charEl, '#F59E0B'));
    });

    // Start desktop hopping routine
    desktopHopTimer = window.setInterval(hopAcrossFullName, 6800);
    window.setTimeout(hopAcrossFullName, 1600);
  }

  // =========================================================================
  // 2. MEDIUM/TABLET ROTOR WITH DYNAMIC SNUG WIDTH & BASELINE ALIGNMENT
  // =========================================================================
  if (rotorWords && rotorWords.length > 1 && rotorStage) {
    // Measure individual word widths so Dohn and Lontok are always tight & close!
    const getWordWidths = () => {
      return Array.from(rotorWords).map((w) => {
        const prevOpacity = w.style.opacity;
        const prevDisplay = w.style.display;
        w.style.opacity = '1';
        w.style.display = 'inline-block';
        const wWidth = Math.ceil(w.getBoundingClientRect().width);
        w.style.opacity = prevOpacity;
        w.style.display = prevDisplay;
        return Math.max(wWidth, 20);
      });
    };

    let wordWidths = getWordWidths();

    const handleResize = () => {
      wordWidths = getWordWidths();
      if (rotorStage && wordWidths[rotorIndex]) {
        rotorStage.style.width = `${wordWidths[rotorIndex]}px`;
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Initial setup: word 0 active, rotorStage matches word 0 width
    rotorWords.forEach((w, i) => {
      if (i === 0) {
        gsap.set(w, { y: 0, rotateX: 0, opacity: 1 });
      } else {
        gsap.set(w, { y: -38, rotateX: 65, opacity: 0 });
      }
    });

    if (wordWidths[0]) {
      rotorStage.style.width = `${wordWidths[0]}px`;
    }

    function rotateNextWord(): void {
      if (!rotorWords || !rotorStage) return;
      const currentWord = rotorWords[rotorIndex];
      rotorIndex = (rotorIndex + 1) % rotorWords.length;
      const nextWord = rotorWords[rotorIndex];
      const targetWidth = wordWidths[rotorIndex] || Math.ceil(nextWord.getBoundingClientRect().width);

      if (prefersReduced) {
        gsap.to(currentWord, { opacity: 0, duration: 0.35, onComplete: () => {
          rotorStage.style.width = `${targetWidth}px`;
          gsap.to(nextWord, { opacity: 1, duration: 0.35 });
        }});
      } else {
        // Smoothly animate stage width to fit current word snugly with ZERO gap before Lontok!
        gsap.to(rotorStage, {
          width: targetWidth,
          duration: 0.42,
          ease: 'power2.inOut'
        });

        // Smooth downward 3D rotation: current flips DOWN & OUT, next enters from TOP & IN
        gsap.timeline()
          .to(currentWord, {
            y: 38,
            rotateX: -65,
            opacity: 0,
            duration: 0.42,
            ease: 'power2.in',
            onComplete: () => {
              gsap.set(currentWord, { y: -38, rotateX: 65, opacity: 0 });
            }
          })
          .fromTo(
            nextWord,
            { y: -38, rotateX: 65, opacity: 0 },
            { y: 0, rotateX: 0, opacity: 1, duration: 0.52, ease: 'back.out(1.5)' },
            '-=0.15'
          );
      }
    }

    rotorTimer = window.setInterval(rotateNextWord, 2800);
  }

  // =========================================================================
  // 3. SMALL-SCREEN "PAT" WITH PLAYFUL HOPPING MASCOT
  // =========================================================================
  if (heroMascot) {
    const patGroup = document.querySelector<HTMLElement>('.hero-compact-pat-group');

    if (!prefersReduced) {
      mobileIdleTween = gsap.to(heroMascot, {
        y: -4,
        rotation: 3,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      if (heroEyes && heroEyes.length > 0) {
        mobileBlinkTL = gsap.timeline({ repeat: -1, repeatDelay: 3.2 })
          .to(heroEyes, { scaleY: 0.1, transformOrigin: 'center center', duration: 0.1 })
          .to(heroEyes, { scaleY: 1, duration: 0.1 });
      }
    }

    const mascotGreetings = [
      '>_ Pat! ✨',
      '>_ @pxpot 🚀',
      '>_ Patrick! ☁️',
      '>_ let\'s build! ⚡'
    ];
    let greetIndex = 0;

    function showMascotSpeech(text?: string): void {
      if (!heroSpeech) return;
      heroSpeech.textContent = text || mascotGreetings[greetIndex % mascotGreetings.length];
      greetIndex++;
      heroSpeech.classList.add('is-active');
      if (speechTimer) window.clearTimeout(speechTimer);
      speechTimer = window.setTimeout(() => {
        heroSpeech.classList.remove('is-active');
      }, 2000);
    }

    function hopAcrossPat(): void {
      if (prefersReduced || !heroMascot || heroLetters.length === 0 || !patGroup) return;
      // Only execute hop if on mobile screen (<= 540px)
      if (window.innerWidth > 540) return;

      const mascotRect = heroMascot.getBoundingClientRect();
      const mascotCenterX = mascotRect.left + mascotRect.width / 2;

      const hopTL = gsap.timeline();
      heroLetters.forEach((letter, i) => {
        const letterRect = letter.getBoundingClientRect();
        const letterCenterX = letterRect.left + letterRect.width / 2;
        const targetX = letterCenterX - mascotCenterX;

        hopTL
          .to(heroMascot, {
            x: targetX,
            y: -14,
            rotation: i % 2 === 0 ? 10 : -10,
            duration: 0.22,
            ease: 'power2.out'
          })
          .to(heroMascot, {
            y: 0,
            rotation: 0,
            duration: 0.18,
            ease: 'bounce.out',
            onStart: () => bounceElement(letter, '#F59E0B')
          });
      });

      // Joyfully return to resting center position above letters
      hopTL
        .to(heroMascot, {
          x: 0,
          y: -8,
          duration: 0.22,
          ease: 'power2.out'
        })
        .to(heroMascot, {
          x: 0,
          y: 0,
          duration: 0.16,
          ease: 'bounce.out'
        });

      hopTL.call(() => {
        showMascotSpeech('>_ Pat! ☁️');
        if (heroSpark) {
          gsap.fromTo(
            heroSpark,
            { stroke: '#FFFFFF', strokeWidth: 3 },
            { stroke: '#FBBF24', strokeWidth: 1.5, duration: 0.4 }
          );
        }
      });
    }

    // Interactive Mascot Click
    const handleMascotClick = (e: Event) => {
      e.stopPropagation();
      if (!prefersReduced && heroMascot) {
        gsap.timeline()
          .to(heroMascot, { scale: 0.88, duration: 0.1, ease: 'power2.out' })
          .to(heroMascot, {
            y: -18,
            rotation: '+=360',
            scale: 1.15,
            duration: 0.55,
            ease: 'back.out(1.8)'
          })
          .to(heroMascot, { y: 0, scale: 1, duration: 0.2, ease: 'bounce.out' });
      }
      showMascotSpeech();
      heroLetters.forEach((l, idx) => {
        window.setTimeout(() => bounceElement(l, '#F59E0B'), idx * 80);
      });
    };

    heroMascot.addEventListener('click', handleMascotClick);

    // Wire individual letter clicks
    heroLetters.forEach((letter) => {
      letter.addEventListener('click', () => bounceElement(letter, '#F59E0B'));
    });

    // Hop periodically on small screens
    mobileHopTimer = window.setInterval(hopAcrossPat, 5600);
    window.setTimeout(hopAcrossPat, 1400);
  }

  // Cleanup
  return () => {
    if (rotorTimer) window.clearInterval(rotorTimer);
    if (mobileHopTimer) window.clearInterval(mobileHopTimer);
    if (desktopHopTimer) window.clearInterval(desktopHopTimer);
    if (speechTimer) window.clearTimeout(speechTimer);
    if (fullSpeechTimer) window.clearTimeout(fullSpeechTimer);
    fullIdleTween?.kill();
    fullBlinkTL?.kill();
    mobileIdleTween?.kill();
    mobileBlinkTL?.kill();
  };
}

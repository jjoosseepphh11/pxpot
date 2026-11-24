/* ==========================================================================
   SUNRISE-TO-OPEN LOADER SEQUENCE (loaderSequence.ts)
   Inspired by ledboise.com loading sequence
   Counts up through the day (pre-dawn to sunrise 06:45 AM PHT), blooms ambient light,
   features the atmospheric Weather Cloud Mascot waking up and flying down
   to guide you into Chapter 1 (Morning).
   Respects prefers-reduced-motion and provides immediate skip options.
   ========================================================================== */

import { gsap } from 'gsap';

export interface LoaderOptions {
  onComplete?: () => void;
}

export function initLoaderSequence(options: LoaderOptions = {}): void {
  const loaderEl = document.getElementById('loader');
  if (!loaderEl) {
    options.onComplete?.();
    return;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Immediate bypass for reduced motion accessibility
  if (prefersReduced) {
    loaderEl.style.display = 'none';
    loaderEl.setAttribute('aria-hidden', 'true');
    options.onComplete?.();
    return;
  }

  const timeEl = document.getElementById('loader-time');
  const percentEl = document.getElementById('loader-percent');
  const statusEl = document.getElementById('loader-status');
  const progressBar = document.getElementById('loader-progress-bar');
  const bloomEl = loaderEl.querySelector<HTMLElement>('.loader-bloom');
  const contentEl = loaderEl.querySelector<HTMLElement>('.loader-content');
  const skipBtn = document.getElementById('loader-skip');

  const weatherEl = document.getElementById('loader-weather');
  const weatherSpeech = document.getElementById('loader-weather-speech');
  const weatherStop1 = document.getElementById('loaderCloudStop1');
  const weatherStop2 = document.getElementById('loaderCloudStop2');

  let isDismissed = false;

  const dismissLoader = (immediate = false) => {
    if (isDismissed) return;
    isDismissed = true;

    gsap.killTweensOf([loaderEl, progressBar, bloomEl, contentEl, weatherEl]);

    const mascotTarget = document.getElementById('bash-mascot');

    if (immediate) {
      if (weatherEl) weatherEl.style.display = 'none';
      if (mascotTarget) mascotTarget.style.opacity = '1';
      loaderEl.style.display = 'none';
      loaderEl.setAttribute('aria-hidden', 'true');
      document.body.classList.add('page-revealed');
      options.onComplete?.();
      return;
    }

    // Weather cloud flight animation towards Chapter 01 resting corner
    if (weatherEl && mascotTarget) {
      const sourceRect = weatherEl.getBoundingClientRect();
      const targetRect = mascotTarget.getBoundingClientRect();
      const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
      const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

      gsap.set(mascotTarget, { opacity: 0 });

      gsap.to(weatherEl, {
        x: deltaX,
        y: deltaY,
        scale: 0.8,
        duration: 0.65,
        ease: 'power2.inOut',
        onComplete: () => {
          weatherEl.style.display = 'none';
          // Clean, seamless handoff to companion mascot without double-settle or delayed bounce
          gsap.to(mascotTarget, {
            opacity: 1,
            duration: 0.2,
            ease: 'power1.out',
          });
        },
      });
    }

    gsap.to(contentEl, {
      opacity: 0,
      scale: 0.98,
      duration: 0.45,
      ease: 'power2.in',
    });

    gsap.to(loaderEl, {
      opacity: 0,
      duration: 0.65,
      delay: 0.15,
      ease: 'power2.out',
      onComplete: () => {
        loaderEl.style.display = 'none';
        loaderEl.setAttribute('aria-hidden', 'true');
        document.body.classList.add('page-revealed');
        options.onComplete?.();
      },
    });
  };

  // Keyboard accessibility: Escape or Enter skips loader immediately
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      window.removeEventListener('keydown', handleKeyDown);
      dismissLoader(true);
    }
  };
  window.addEventListener('keydown', handleKeyDown);

  // Skip button click
  skipBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    dismissLoader(true);
  });

  // Numeric and time progress simulation with Manila PHT time
  const progressObj = { value: 0 };

  const timeSteps = [
    { p: 0, time: '05:00', status: 'PRE-DAWN // 05:00 AM PHT', speech: '>_ waking up... 🌙', c1: '#1E3A5F', c2: '#0B1A2E' },
    { p: 25, time: '05:30', status: 'FIRST TWILIGHT // 05:30 AM PHT', speech: '>_ first twilight ✦', c1: '#385E8A', c2: '#162C46' },
    { p: 50, time: '06:00', status: 'HORIZON GLOW // 06:00 AM PHT', speech: '>_ horizon glow 🌅', c1: '#F59E0B', c2: '#648FB9' },
    { p: 75, time: '06:30', status: 'DAWN BREAKING // 06:30 AM PHT', speech: '>_ dawn breaking ✦', c1: '#FDE68A', c2: '#BAE6FD' },
    { p: 100, time: '06:45', status: 'SUNRISE REACHED // 06:45 AM PHT', speech: '>_ 06:45 AM sunrise! ☀️', c1: '#FFFFFF', c2: '#DCEBFA' },
  ];

  const updateProgressDisplay = () => {
    const val = Math.round(progressObj.value);
    loaderEl.setAttribute('aria-valuenow', val.toString());

    if (percentEl) {
      percentEl.textContent = `${val.toString().padStart(2, '0')}%`;
    }

    if (progressBar) {
      progressBar.style.transform = `scaleX(${val / 100})`;
    }

    // Determine current time step
    let currentStep = timeSteps[0];
    for (const step of timeSteps) {
      if (val >= step.p) {
        currentStep = step;
      }
    }

    if (timeEl && timeEl.textContent !== currentStep.time) {
      timeEl.textContent = currentStep.time;
    }

    if (statusEl && statusEl.textContent !== currentStep.status) {
      statusEl.textContent = currentStep.status;
    }

    if (weatherSpeech && weatherSpeech.textContent !== currentStep.speech) {
      weatherSpeech.textContent = currentStep.speech;
    }

    if (weatherStop1 && weatherStop2) {
      weatherStop1.setAttribute('stop-color', currentStep.c1);
      weatherStop2.setAttribute('stop-color', currentStep.c2);
    }
  };

  // Timeline orchestrating the 5-second sunrise count-up
  const tl = gsap.timeline({
    onComplete: () => {
      window.removeEventListener('keydown', handleKeyDown);
      dismissLoader();
    },
  });

  // 1. Ambient Light Expansion (Bloom)
  if (bloomEl) {
    tl.to(
      bloomEl,
      {
        opacity: 1,
        scale: 1.15,
        duration: 4.5,
        ease: 'power2.out',
      },
      0
    );
  }

  // 2. Background color shift from pre-dawn deep navy into soft sky blue
  tl.to(
    loaderEl,
    {
      backgroundColor: '#EAF3FA',
      color: '#0A1C2E',
      duration: 4.5,
      ease: 'power2.inOut',
    },
    0
  );

  // 3. Count up progress from 0% to 100% over 4.5 seconds
  tl.to(
    progressObj,
    {
      value: 100,
      duration: 4.5,
      ease: 'power2.inOut',
      onUpdate: updateProgressDisplay,
    },
    0
  );

  // 4. Weather cloud gentle float during count-up
  if (weatherEl) {
    gsap.to(weatherEl, {
      y: -6,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  // 5. Brief hold at 100% sunrise (06:45 AM PHT) before reveal (0.5s)
  tl.to({}, { duration: 0.5 });
}

/**
 * utils.js
 * ----------------------------------------------------------------------
 * Shared helper functions used across multiple day pages:
 *   - Utils.typewriter()       -> reveal text one character at a time
 *   - Utils.HintManager        -> shows magical, non-spoiling hints only
 *                                 after genuine waiting / failed attempts
 *   - Utils.initNicknameEggs() -> global "type a nickname" easter egg
 *   - Utils.celebrate()        -> shared gold-glow + leaf-burst micro reward
 * ----------------------------------------------------------------------
 */

const Utils = (() => {

  /**
   * Reveals `text` inside `el` one character at a time, like a typewriter.
   * Returns a Promise that resolves when finished (so callers can chain
   * the next animation beat after the letter finishes "writing itself").
   */
  function typewriter(el, text, speed = 32) {
    return new Promise((resolve) => {
      el.textContent = '';
      let i = 0;
      const tick = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(tick, speed);
        } else {
          resolve();
        }
      };
      tick();
    });
  }

  /**
   * HintManager — a small state machine for the "magical hint" pattern
   * used on every puzzle page. Hints are never given immediately; they
   * surface only after real waiting or real attempts, per design.
   *
   * Usage:
   *   const hints = Utils.HintManager(hintBoxEl, [
   *     "The garden feels a little too quiet...",
   *     "Some things reveal themselves only if you stop rushing."
   *   ]);
   *   hints.startIdleTimer(15000);   // show hint 1 after 15s of inactivity
   *   hints.registerFailedAttempt(); // call this on every wrong guess
   */
  function HintManager(hintBoxEl, hintLines = []) {
    let shownIndex = -1;
    let idleTimerId = null;
    let failedAttempts = 0;

    function reveal(index) {
      if (!hintBoxEl || index >= hintLines.length || index <= shownIndex) return;
      shownIndex = index;
      hintBoxEl.textContent = hintLines[index];
      // Force reflow so the transition re-triggers even if already visible
      hintBoxEl.classList.remove('visible');
      void hintBoxEl.offsetWidth;
      hintBoxEl.classList.add('visible');
    }

    function startIdleTimer(delayMs = 15000) {
      clearTimeout(idleTimerId);
      idleTimerId = setTimeout(() => reveal(0), delayMs);
    }

    function registerFailedAttempt() {
      failedAttempts++;
      // First real hint after 2 misses, deeper hint after 4 misses, etc.
      if (failedAttempts === 2 && hintLines.length > 0) reveal(0);
      if (failedAttempts === 4 && hintLines.length > 1) reveal(1);
      if (failedAttempts >= 6 && hintLines.length > 2) reveal(2);
    }

    function revealNext() {
      reveal(shownIndex + 1);
    }

    return { startIdleTimer, registerFailedAttempt, revealNext };
  }

  /**
   * Listens for the girlfriend typing one of the CONFIG.NICKNAMES anywhere
   * on the page (no input focus needed) and shows a tiny floating
   * compliment toast. Purely optional/delightful — never required to
   * progress. Safe to call once per page load.
   */
  function initNicknameEggs() {
    let buffer = '';
    const maxLen = Math.max(...CONFIG.NICKNAMES.map(n => n.length)) + 2;

    window.addEventListener('keydown', (e) => {
      if (e.key.length !== 1) return; // ignore Shift, Enter, arrows, etc.
      buffer = (buffer + e.key.toLowerCase()).slice(-maxLen);

      for (const name of CONFIG.NICKNAMES) {
        if (buffer.endsWith(name)) {
          showFloatingCompliment();
          buffer = '';
          break;
        }
      }
    });
  }

  function showFloatingCompliment() {
    const line = CONFIG.EASTER_EGG_COMPLIMENTS[
      Math.floor(Math.random() * CONFIG.EASTER_EGG_COMPLIMENTS.length)
    ];
    const toast = document.createElement('div');
    toast.textContent = line;
    toast.setAttribute('role', 'status');
    toast.style.cssText = `
      position: fixed; left: 50%; bottom: 8vh; transform: translateX(-50%) translateY(10px);
      background: var(--dark-chocolate, #2e1c12); color: var(--cream-paper, #f4ead9);
      font-family: 'Caveat', cursive; font-size: 1.3rem; padding: 0.8em 1.4em;
      border-radius: 999px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); z-index: 9999;
      opacity: 0; transition: opacity 600ms ease, transform 600ms ease; pointer-events: none;
      max-width: 80vw; text-align: center;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 700);
    }, 3200);
  }

  /** Shared "you solved it" micro celebration — gold glow + a few leaves, no confetti. */
  function celebrate(targetEl) {
    if (targetEl) {
      targetEl.style.animation = 'glowPulse 1.6s ease 2';
    }
    if (window.Particles) {
      Particles.spawnDust(16);
      Particles.spawnLeaves(4);
    }
  }

  return { typewriter, HintManager, initNicknameEggs, celebrate };
})();

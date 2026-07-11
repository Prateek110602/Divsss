/**
 * particles.js
 * ----------------------------------------------------------------------
 * Lightweight, dependency-free ambient particle effects: falling leaves,
 * drifting gold dust, and floating hearts. Pure DOM + CSS animation
 * (no canvas loop), so it stays cheap on mobile.
 *
 * Each function spawns a handful of elements with class "particle" and
 * removes them from the DOM automatically once their animation ends.
 * ----------------------------------------------------------------------
 */

const Particles = (() => {

  const LEAF_GLYPHS = ['🍂', '🍁'];

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnOne(className, glyph, style) {
    const el = document.createElement('div');
    el.className = `particle ${className}`;
    el.setAttribute('aria-hidden', 'true');
    if (glyph) el.textContent = glyph;
    Object.assign(el.style, style);
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
    // Safety cleanup in case animationend doesn't fire (e.g. tab backgrounded)
    setTimeout(() => el.remove(), 20000);
  }

  /** Drifts `count` autumn leaves down the screen over time. */
  function spawnLeaves(count = 6) {
    for (let i = 0; i < count; i++) {
      const delay = randomBetween(0, 4);
      const duration = randomBetween(7, 13);
      const left = randomBetween(0, 100);
      spawnOne('particle-leaf', LEAF_GLYPHS[Math.floor(Math.random() * LEAF_GLYPHS.length)], {
        left: `${left}vw`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      });
    }
  }

  /** Gentle upward-drifting gold dust motes — used for "magic reveal" moments. */
  function spawnDust(count = 14) {
    for (let i = 0; i < count; i++) {
      const left = randomBetween(30, 70);
      const duration = randomBetween(2.5, 4.5);
      const delay = randomBetween(0, 1.2);
      spawnOne('particle-dust', null, {
        left: `${left}vw`,
        bottom: '10vh',
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      });
    }
  }

  /** Floating hearts — used sparingly for emotional beats (never confetti). */
  function spawnHearts(count = 8) {
    for (let i = 0; i < count; i++) {
      const left = randomBetween(20, 80);
      const duration = randomBetween(3, 5);
      const delay = randomBetween(0, 1.5);
      spawnOne('particle-heart', '❤', {
        left: `${left}vw`,
        bottom: '5vh',
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      });
    }
  }

  /** Keeps a slow trickle of leaves falling for the lifetime of the page. */
  function startAmbientLeaves(intervalMs = 3500) {
    spawnLeaves(2);
    return setInterval(() => spawnLeaves(2), intervalMs);
  }

  return { spawnLeaves, spawnDust, spawnHearts, startAmbientLeaves };
})();

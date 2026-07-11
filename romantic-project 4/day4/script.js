/**
 * day4/script.js — "What The Sky Remembers"
 * Puzzle: connect stars in the correct order to draw a hidden heart shape.
 * The "correct next" star twinkles very slightly brighter — a reward for
 * attentiveness rather than random guessing. Decoy stars do nothing but
 * twinkle; clicking one out of order just fizzles, no penalty.
 */
(function () {
  const DAY = 4;
  const contentEl = document.getElementById('day-content');
  const lockedMain = document.getElementById('locked-screen');

  Progress.enforceLock(DAY, { contentEl, lockedEl: lockedMain, onUnlocked: init });
  Progress.renderDevPanelIfNeeded();
  Utils.initNicknameEggs();

  const NS = 'http://www.w3.org/2000/svg';

  // Points forming a heart silhouette when connected in this order.
  const PATH_POINTS = [
    { x: 150, y: 90 },
    { x: 112, y: 46 },
    { x: 64,  y: 64 },
    { x: 44,  y: 114 },
    { x: 72,  y: 164 },
    { x: 150, y: 232 },
    { x: 228, y: 164 },
    { x: 256, y: 114 },
    { x: 236, y: 64 },
    { x: 188, y: 46 },
  ];

  const DECOY_POINTS = [
    { x: 30, y: 30 }, { x: 270, y: 30 }, { x: 20, y: 200 },
    { x: 280, y: 200 }, { x: 150, y: 20 }, { x: 150, y: 270 },
  ];

  function init() {
    Particles.startAmbientLeaves(6000);

    const starsGroup = document.getElementById('stars');
    const linesGroup = document.getElementById('lines');
    const skyHint = document.getElementById('skyHint');
    const revealBox = document.getElementById('revealBox');
    const revealFragment = document.getElementById('revealFragment');
    const revealText = document.getElementById('revealText');

    const hints = Utils.HintManager(skyHint, [
      "Some stars shine just a little brighter than the rest...",
      "Follow the brightest one. Then the next brightest. One at a time.",
    ]);
    hints.startIdleTimer(11000);

    let currentIndex = 0;
    const starEls = [];

    // Render decoys first (so path stars draw on top visually)
    DECOY_POINTS.forEach((p) => {
      const c = makeStar(p, 'decoy');
      c.addEventListener('click', () => flashWrong(c));
      starsGroup.appendChild(c);
    });

    PATH_POINTS.forEach((p, i) => {
      const c = makeStar(p, 'path-star');
      c.dataset.index = i;
      c.addEventListener('click', () => handlePathClick(c, i));
      starsGroup.appendChild(c);
      starEls.push(c);
    });

    updateNextStarGlow();

    function makeStar(p, cls) {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', p.x);
      c.setAttribute('cy', p.y);
      c.setAttribute('r', 4.5);
      c.setAttribute('class', `star ${cls}`);
      c.setAttribute('tabindex', '0');
      c.setAttribute('role', 'button');
      c.setAttribute('aria-label', 'star');
      c.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') c.dispatchEvent(new Event('click'));
      });
      return c;
    }

    function updateNextStarGlow() {
      starEls.forEach((el, i) => el.classList.toggle('next-star', i === currentIndex));
    }

    function handlePathClick(el, i) {
      if (i !== currentIndex) {
        flashWrong(el);
        hints.registerFailedAttempt();
        return;
      }

      el.classList.remove('path-star', 'next-star');
      el.classList.add('connected');

      if (currentIndex > 0) {
        drawSegment(PATH_POINTS[currentIndex - 1], PATH_POINTS[currentIndex]);
      }

      currentIndex++;

      if (currentIndex >= PATH_POINTS.length) {
        // close the shape back to the first point
        drawSegment(PATH_POINTS[PATH_POINTS.length - 1], PATH_POINTS[0]);
        completeConstellation();
      } else {
        updateNextStarGlow();
      }
    }

    function flashWrong(el) {
      el.classList.add('wrong-flash');
      setTimeout(() => el.classList.remove('wrong-flash'), 350);
    }

    function drawSegment(a, b) {
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', a.x);
      line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x);
      line.setAttribute('y2', b.y);
      line.setAttribute('class', 'constellation-line');
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      line.style.strokeDasharray = String(len);
      line.style.strokeDashoffset = String(len);
      linesGroup.appendChild(line);
      requestAnimationFrame(() => {
        line.style.strokeDashoffset = '0';
      });
    }

    async function completeConstellation() {
      Utils.celebrate(document.getElementById('sky'));
      Particles.spawnDust(18);

      revealBox.hidden = false;
      revealFragment.textContent =
        '"that evening at Red Fort, half-listening to the guide, mostly just watching you get excited over every little carving."';

      await Utils.typewriter(
        revealText,
        "That's the shape the sky was hiding. Some nights just stay with you. Tomorrow, we piece a few more of them back together.",
        20
      );

      Progress.completeDay(DAY);
    }
  }
})();

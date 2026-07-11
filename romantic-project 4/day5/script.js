/**
 * day5/script.js — "Pieces Of Us"
 * Puzzle: classic memory-match flip game. Each icon pair is a nod to a
 * different day in the story (envelope=1, cup=2, book=3, star=4, key=6, heart=7).
 */
(function () {
  const DAY = 5;
  const contentEl = document.getElementById('day-content');
  const lockedMain = document.getElementById('locked-screen');

  Progress.enforceLock(DAY, { contentEl, lockedEl: lockedMain, onUnlocked: init });
  Progress.renderDevPanelIfNeeded();
  Utils.initNicknameEggs();

  const ICONS = ['✉️', '☕', '📖', '⭐', '🔑', '❤️'];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function init() {
    Particles.startAmbientLeaves(6000);

    const grid = document.getElementById('memoryGrid');
    const memoryHint = document.getElementById('memoryHint');
    const revealBox = document.getElementById('revealBox');
    const revealFragment = document.getElementById('revealFragment');
    const revealText = document.getElementById('revealText');

    const hints = Utils.HintManager(memoryHint, [
      "Take your time — nothing here is timed.",
      "Try to remember what you've already seen, not just what you're clicking now."
    ]);
    hints.startIdleTimer(13000);

    const deck = shuffle([...ICONS, ...ICONS]);
    let flipped = [];
    let matchedCount = 0;
    let lock = false;
    let misses = 0;

    deck.forEach((icon, i) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.innerHTML = `
        <div class="memory-card-inner">
          <div class="card-face card-back" aria-hidden="true"></div>
          <div class="card-face card-front">${icon}</div>
        </div>`;
      card.dataset.icon = icon;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'memory card, face down');

      card.addEventListener('click', () => flipCard(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') flipCard(card);
      });

      grid.appendChild(card);
    });

    function flipCard(card) {
      if (lock || card.classList.contains('matched') || card.classList.contains('flipped')) return;
      card.classList.add('flipped');
      flipped.push(card);

      if (flipped.length === 2) {
        lock = true;
        const [a, b] = flipped;
        if (a.dataset.icon === b.dataset.icon) {
          a.classList.add('matched');
          b.classList.add('matched');
          matchedCount++;
          flipped = [];
          lock = false;
          if (matchedCount === ICONS.length) completeMemory();
        } else {
          misses++;
          hints.registerFailedAttempt();
          setTimeout(() => {
            a.classList.remove('flipped');
            b.classList.remove('flipped');
            flipped = [];
            lock = false;
          }, 750);
        }
      }
    }

    async function completeMemory() {
      Utils.celebrate(grid);
      Particles.spawnHearts(8);

      revealBox.hidden = false;
      revealFragment.textContent =
        '"every little piece of us, somehow, keeps finding its match."';

      await Utils.typewriter(
        revealText,
        "All matched. That's us, more or less — a few scattered pieces that somehow always find their way back to each other. Tomorrow's page is locked. You'll need something you already know to open it.",
        20
      );

      Progress.completeDay(DAY);
    }
  }
})();

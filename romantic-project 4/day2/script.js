/**
 * day2/script.js — "The Quiet Room"
 * Puzzle: find all 5 hidden hearts scattered around a hand-drawn (CSS-only) desk scene.
 */
(function () {
  const DAY = 2;
  const contentEl = document.getElementById('day-content');
  const lockedMain = document.getElementById('locked-screen');

  Progress.enforceLock(DAY, { contentEl, lockedEl: lockedMain, onUnlocked: init });
  Progress.renderDevPanelIfNeeded();
  Utils.initNicknameEggs();

  function init() {
    Particles.startAmbientLeaves(5000);

    const hearts = Array.from(document.querySelectorAll('.hidden-heart'));
    const counterEl = document.getElementById('foundCount');
    const roomHint = document.getElementById('roomHint');
    const revealBox = document.getElementById('revealBox');
    const revealText = document.getElementById('revealText');
    const coffeeCup = document.getElementById('coffeeCup');

    let found = 0;
    const TOTAL = hearts.length;

    const hints = Utils.HintManager(roomHint, [
      "The room feels quiet... maybe too quiet.",
      "Some things only reveal themselves to those who stop rushing.",
      "Try lingering near the little things — the cup, the leaves, the frame."
    ]);
    hints.startIdleTimer(12000);

    let hoverCount = 0;
    hearts.forEach((heart) => {
      heart.addEventListener('mouseenter', () => {
        hoverCount++;
        if (hoverCount === 4) hints.revealNext();
      });

      heart.addEventListener('click', () => {
        if (heart.classList.contains('found')) return;
        heart.classList.add('found');
        found++;
        counterEl.textContent = String(found);

        if (found >= TOTAL) {
          completeRoom();
        }
      });
    });

    // Small optional easter egg — clicking the coffee cup itself (not a hidden heart).
    coffeeCup.addEventListener('click', (e) => {
      if (e.target.classList.contains('hidden-heart')) return;
      Utils.celebrate ? null : null;
      const note = document.createElement('span');
      note.textContent = "cold coffee, warm thoughts of you";
      note.className = 'handwritten';
      note.style.cssText = 'position:absolute;top:-30px;left:0;font-size:1rem;color:var(--rose-accent);white-space:nowrap;opacity:0;transition:opacity .5s;';
      coffeeCup.appendChild(note);
      requestAnimationFrame(() => (note.style.opacity = '1'));
      setTimeout(() => note.remove(), 2200);
    });

    async function completeRoom() {
      Utils.celebrate(document.getElementById('scene'));
      Particles.spawnHearts(10);

      revealBox.hidden = false;
      await Utils.typewriter(
        revealText,
        "Found all five. Of course you did — you always find the things people try to hide. Tomorrow, one book on my shelf doesn't belong. See if you can tell which.",
        20
      );

      Progress.completeDay(DAY);
    }
  }
})();

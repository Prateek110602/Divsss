/**
 * day7/script.js — "Hiding In Plain Sight"
 * Puzzle: press and hold specific phrases within an ordinary paragraph of
 * text to reveal a hidden heart next to them. No visual hint distinguishes
 * a trigger phrase from normal text — reward for slowing down and reading.
 */
(function () {
  const DAY = 7;
  const contentEl = document.getElementById('day-content');
  const lockedMain = document.getElementById('locked-screen');

  Progress.enforceLock(DAY, { contentEl, lockedEl: lockedMain, onUnlocked: init });
  Progress.renderDevPanelIfNeeded();
  Utils.initNicknameEggs();

  const HOLD_MS = 650;

  function init() {
    Particles.startAmbientLeaves(6000);

    const triggers = Array.from(document.querySelectorAll('.heart-trigger'));
    const counterEl = document.getElementById('foundCount');
    const heartsHint = document.getElementById('heartsHint');
    const revealBox = document.getElementById('revealBox');
    const revealFragment = document.getElementById('revealFragment');
    const revealText = document.getElementById('revealText');

    let found = 0;
    const TOTAL = triggers.length;

    const hints = Utils.HintManager(heartsHint, [
      "Some phrases feel a little warmer than the rest of the paragraph.",
      "Try pressing and holding — not clicking — on the words that feel personal."
    ]);
    hints.startIdleTimer(12000);

    triggers.forEach((span) => {
      let timer = null;

      const start = () => {
        if (span.classList.contains('found')) return;
        span.classList.add('pressing');
        timer = setTimeout(() => reveal(span), HOLD_MS);
      };
      const cancel = () => {
        clearTimeout(timer);
        span.classList.remove('pressing');
      };

      span.addEventListener('pointerdown', start);
      span.addEventListener('pointerup', cancel);
      span.addEventListener('pointerleave', cancel);
      span.addEventListener('contextmenu', (e) => e.preventDefault());
    });

    function reveal(span) {
      span.classList.remove('pressing');
      span.classList.add('found');
      const heart = document.createElement('span');
      heart.className = 'found-heart';
      heart.textContent = '❤';
      heart.setAttribute('aria-hidden', 'true');
      span.appendChild(heart);

      found++;
      counterEl.textContent = String(found);

      if (found >= TOTAL) {
        completeHearts();
      }
    }

    async function completeHearts() {
      Utils.celebrate(document.querySelector('.love-note'));
      Particles.spawnHearts(12);

      revealBox.hidden = false;
      revealFragment.textContent =
        '"turns out the things hardest to say out loud are easiest to hide in a paragraph."';

      await Utils.typewriter(
        revealText,
        "Six hearts, all found. Tomorrow's page won't just ask you questions — it'll ask you to remember. Everything you've collected so far actually matters now.",
        20
      );

      Progress.completeDay(DAY);
    }
  }
})();

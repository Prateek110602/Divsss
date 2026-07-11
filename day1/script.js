/**
 * day1/script.js — "A Sealed Beginning"
 * Puzzle: hold the wax seal to crack it open, then find the invisible ink
 * inside the letter (revealed by selecting/dragging over the hidden line).
 */
(function () {
  const DAY = 1;
  const contentEl = document.getElementById('day-content');
  const lockedEl = document.getElementById('locked-screen').querySelector('.locked-screen');
  const lockedMain = document.getElementById('locked-screen');

  const unlocked = Progress.enforceLock(DAY, {
    contentEl,
    lockedEl: lockedMain,
    onUnlocked: init,
  });

  Progress.renderDevPanelIfNeeded();
  Utils.initNicknameEggs();

  function init() {
    Particles.startAmbientLeaves(4500);

    const waxSeal = document.getElementById('waxSeal');
    const sealHint = document.getElementById('sealHint');
    const introStage = document.getElementById('introStage');
    const envelopeStage = document.getElementById('envelopeStage');
    const envelope = document.getElementById('envelope');
    const letterStage = document.getElementById('letterStage');
    const letter = document.getElementById('letter');
    const invisibleInk = document.getElementById('invisibleInk');
    const solvedNote = document.getElementById('solvedNote');

    const hints = Utils.HintManager(sealHint, [
      "Wax doesn't crack on its own. Try pressing and holding.",
      "A little longer than you think — patience is part of the gift."
    ]);
    hints.startIdleTimer(9000);

    let pressTimer = null;
    const HOLD_MS = 950;

    function startPress() {
      waxSeal.classList.add('cracking');
      pressTimer = setTimeout(crackSeal, HOLD_MS);
    }
    function cancelPress() {
      clearTimeout(pressTimer);
      waxSeal.classList.remove('cracking');
    }
    function crackSeal() {
      waxSeal.classList.remove('cracking');
      waxSeal.classList.add('broken');
      setTimeout(() => {
        introStage.hidden = true;
        envelopeStage.hidden = false;
        setTimeout(() => {
          envelope.classList.add('open');
          setTimeout(revealLetter, 700);
        }, 500);
      }, 550);
    }

    waxSeal.addEventListener('pointerdown', startPress);
    waxSeal.addEventListener('pointerup', cancelPress);
    waxSeal.addEventListener('pointerleave', cancelPress);
    waxSeal.addEventListener('contextmenu', (e) => e.preventDefault());

    async function revealLetter() {
      envelopeStage.hidden = true;
      letterStage.hidden = false;
      requestAnimationFrame(() => letter.classList.add('unfolded'));

      const greetingEl = document.getElementById('typedGreeting');
      const bodyEl = document.getElementById('typedBody1');

      await Utils.typewriter(greetingEl, "Hi Puchuuu.", 45);
      await Utils.typewriter(
        bodyEl,
        "Cute girl with a gazillion hobbies somehow still manages to live rent-free in my head. So I built you nine little rooms to wander through. This is the first one.",
        18
      );

      setupInvisibleInkPuzzle();
    }

    function setupInvisibleInkPuzzle() {
      let solved = false;

      function markSolved() {
        if (solved) return;
        solved = true;
        invisibleInk.classList.add('revealed');
        solvedNote.hidden = false;
        Utils.celebrate(letter);
        Progress.completeDay(DAY);
      }

      // Primary mechanic: detect a genuine text selection covering the hidden line.
      document.addEventListener('selectionchange', () => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return;
        const text = sel.toString();
        if (text.includes('next note') && text.length > 15) {
          markSolved();
        }
      });

      // Mobile-friendly fallback: double-tap the paragraph reveals it directly,
      // since drag-to-select can be fiddly on some touch devices.
      invisibleInk.addEventListener('dblclick', markSolved);
      let lastTap = 0;
      invisibleInk.addEventListener('touchend', () => {
        const now = Date.now();
        if (now - lastTap < 400) markSolved();
        lastTap = now;
      });
    }
  }
})();

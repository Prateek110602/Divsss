/**
 * day6/script.js — "The Locked Diary"
 * Puzzle: type a password to open the diary. The password is a genuine
 * inside joke — what she already calls him — so it never needs inventing.
 * Edit ANSWER below if you ever want to change the required word/phrase.
 */
(function () {
  const DAY = 6;
  const contentEl = document.getElementById('day-content');
  const lockedMain = document.getElementById('locked-screen');

  // The accepted password. Normalised (lowercase, punctuation stripped) before comparing.
  const ANSWER = 'dumb prateek';

  Progress.enforceLock(DAY, { contentEl, lockedEl: lockedMain, onUnlocked: init });
  Progress.renderDevPanelIfNeeded();
  Utils.initNicknameEggs();

  function normalise(str) {
    return str.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/\s+/g, ' ');
  }

  function init() {
    Particles.startAmbientLeaves(6000);

    const form = document.getElementById('lockForm');
    const input = document.getElementById('lockInput');
    const cover = document.getElementById('diaryCover');
    const pages = document.getElementById('diaryPages');
    const lockHint = document.getElementById('lockHint');
    const revealFragment = document.getElementById('revealFragment');
    const revealText = document.getElementById('revealText');

    const hints = Utils.HintManager(lockHint, [
      "Not my name. Not one of the sweet nicknames either.",
      "It's the thing you say right before you start laughing at me.",
      "Two words. The first one is basically your verdict on my life choices."
    ]);
    hints.startIdleTimer(12000);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const guess = normalise(input.value);

      if (guess === ANSWER) {
        unlockDiary();
      } else {
        cover.classList.add('shake');
        input.value = '';
        setTimeout(() => cover.classList.remove('shake'), 500);
        hints.registerFailedAttempt();
      }
    });

    async function unlockDiary() {
      cover.hidden = true;
      pages.hidden = false;

      Utils.celebrate(pages);
      Particles.spawnDust(14);

      revealFragment.textContent =
        '"you call me that like it\'s an insult, but somehow it always sounds like you\'re fond of me."';

      await Utils.typewriter(
        revealText,
        "There it is. Dumb Prateek, present and accounted for. Tomorrow, look for what's hiding in plain sight — hearts have a habit of doing that around here.",
        20
      );

      Progress.completeDay(DAY);
    }
  }
})();

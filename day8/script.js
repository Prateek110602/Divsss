/**
 * day8/script.js — "The Vault"
 * Puzzle: enter three answers gathered from earlier days (colour, place,
 * inside-joke nickname). All three must be correct at once to open the vault.
 * Edit the ANSWERS object below if you ever change an earlier day's clue.
 */
(function () {
  const DAY = 8;
  const contentEl = document.getElementById('day-content');
  const lockedMain = document.getElementById('locked-screen');

  const ANSWERS = {
    slot1: ['brown', 'beige', 'brown and beige', 'beige and brown'], // Day 1 clue
    slot2: ['red fort'],                                              // Day 4 clue
    slot3: ['dumb prateek'],                                          // Day 6 clue
  };

  Progress.enforceLock(DAY, { contentEl, lockedEl: lockedMain, onUnlocked: init });
  Progress.renderDevPanelIfNeeded();
  Utils.initNicknameEggs();

  function normalise(str) {
    return str.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/\s+/g, ' ');
  }

  function init() {
    Particles.startAmbientLeaves(6000);

    const form = document.getElementById('vaultForm');
    const vaultOpen = document.getElementById('vaultOpen');
    const vaultHint = document.getElementById('vaultHint');
    const revealFragment = document.getElementById('revealFragment');
    const revealText = document.getElementById('revealText');

    const hints = Utils.HintManager(vaultHint, [
      "Think back — a colour, a place, a name you've already unlocked.",
      "Day one had a colour. Day four had a place. Day six had a name.",
    ]);
    hints.startIdleTimer(14000);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const values = {
        slot1: normalise(document.getElementById('slot1').value),
        slot2: normalise(document.getElementById('slot2').value),
        slot3: normalise(document.getElementById('slot3').value),
      };

      const correct = Object.keys(ANSWERS).every((key) => ANSWERS[key].includes(values[key]));

      if (correct) {
        openVault();
      } else {
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
        hints.registerFailedAttempt();
      }
    });

    async function openVault() {
      form.hidden = true;
      vaultOpen.hidden = false;

      Utils.celebrate(vaultOpen);
      Particles.spawnDust(20);

      revealFragment.textContent =
        '"turns out I remembered every small thing about you without even trying to."';

      await Utils.typewriter(
        revealText,
        "All three, correct. You've officially collected everything I hid for you. Tomorrow, the last note opens on its own — no puzzle left to solve, just something I've been waiting eight days to ask.",
        20
      );

      Progress.completeDay(DAY);
    }
  }
})();

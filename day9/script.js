/**
 * day9/script.js — "The Last Note"
 * No puzzle here — but it strictly verifies that days 1-8 are genuinely
 * complete before revealing anything. If not, a warm, spoiler-free message
 * is shown instead (never the invitation, never a clue).
 */
(function () {
  const DAY = 9;
  const contentEl = document.getElementById('day-content');
  const incompleteEl = document.getElementById('incomplete-screen');

  Progress.renderDevPanelIfNeeded();
  Utils.initNicknameEggs();

  const allPriorComplete = Progress.areAllPriorDaysComplete(DAY);
  const timeGateOk = Progress.isDayUnlocked(DAY);

  if (!allPriorComplete || !timeGateOk) {
    showIncomplete(allPriorComplete, timeGateOk);
  } else {
    contentEl.hidden = false;
    contentEl.setAttribute('aria-hidden', 'false');
    init();
  }

  function showIncomplete(allPriorComplete, timeGateOk) {
    incompleteEl.hidden = false;
    const msg = document.getElementById('incompleteMessage');

    if (!allPriorComplete) {
      const completed = Progress.getCompletedCount();
      msg.textContent = `You've completed ${completed} of 8 earlier notes so far. ` +
        `This page waits patiently for the rest of them — no shortcuts, no peeking.`;
    } else {
      const remainingMs = Progress.getTimeRemainingMs(DAY);
      const hoursLeft = Math.max(1, Math.ceil(remainingMs / (60 * 60 * 1000)));
      msg.textContent = `Every note is done. This last one just needs a little more time — ` +
        `about ${hoursLeft} more hour${hoursLeft === 1 ? '' : 's'}.`;

      // Auto-refresh once the wait is over, same as every other locked day.
      if (remainingMs > 0) {
        setTimeout(() => location.reload(), remainingMs + 1000);
      }
    }

    Particles.startAmbientLeaves(5000);
  }

  function init() {
    // Calm, quiet atmosphere — deliberately sparser and slower than earlier days.
    Particles.startAmbientLeaves(6500);

    const seal = document.getElementById('finalSeal');
    const calmStage = document.getElementById('calmStage');
    const envelopeStage = document.getElementById('envelopeStage');
    const envelope = document.getElementById('envelope');
    const letterStage = document.getElementById('letterStage');
    const letter = document.getElementById('letter');
    const inviteCard = document.getElementById('inviteCard');
    const rsvpBtn = document.getElementById('rsvpBtn');
    const rsvpResponse = document.getElementById('rsvpResponse');

    let pressTimer = null;
    const HOLD_MS = 950;

    function startPress() {
      seal.classList.add('cracking');
      pressTimer = setTimeout(crack, HOLD_MS);
    }
    function cancelPress() {
      clearTimeout(pressTimer);
      seal.classList.remove('cracking');
    }
    function crack() {
      seal.classList.remove('cracking');
      seal.classList.add('broken');
      setTimeout(() => {
        calmStage.hidden = true;
        envelopeStage.hidden = false;
        setTimeout(() => {
          envelope.classList.add('open');
          setTimeout(revealLetter, 800);
        }, 600);
      }, 600);
    }

    seal.addEventListener('pointerdown', startPress);
    seal.addEventListener('pointerup', cancelPress);
    seal.addEventListener('pointerleave', cancelPress);
    seal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') crack();
    });
    seal.addEventListener('contextmenu', (e) => e.preventDefault());

    async function revealLetter() {
      envelopeStage.hidden = true;
      letterStage.hidden = false;
      requestAnimationFrame(() => letter.classList.add('unfolded'));

      const greetingEl = document.getElementById('typedGreeting');
      const bodyEl = document.getElementById('typedBody');

      await Utils.typewriter(greetingEl, "Hi Mrignaini.", 45);
      await Utils.typewriter(
        bodyEl,
        "Nine notes. A wax seal, a quiet room, a shelf, a sky, a shuffled memory, a locked diary, some hidden hearts, and a vault that needed all of you to open it. " +
        "You solved every single one, which honestly wasn't a surprise — you're the only person I know who'd actually enjoy homework if I hid it well enough. " +
        "There's just one more thing I've been building toward this whole time.",
        16
      );

      Utils.celebrate(letter);
      Particles.spawnDust(24);
      Particles.spawnLeaves(8);

      setTimeout(() => {
        inviteCard.hidden = false;
        Particles.spawnHearts(6);
      }, 900);

      Progress.completeDay(DAY);
    }

    rsvpBtn.addEventListener('click', () => {
      rsvpBtn.disabled = true;
      rsvpResponse.hidden = false;
      rsvpResponse.textContent = "knew you'd say yes. see you on the 1st, Cutuuuu.";
      Particles.spawnHearts(14);
      Utils.celebrate(inviteCard);
    });
  }
})();

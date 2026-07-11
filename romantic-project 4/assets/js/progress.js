/**
 * progress.js
 * ----------------------------------------------------------------------
 * The progression / locking engine shared by every day page.
 * Relies purely on localStorage — no backend, no cookies, no server.
 *
 * Storage shape (all values are the string "true"):
 *   romantic_journey_day1_complete
 *   romantic_journey_day2_complete
 *   ...
 *   romantic_journey_day9_complete
 *
 * A day is only ever marked complete by its OWN puzzle logic calling
 * Progress.completeDay(n) after a genuine solve. There is no manual
 * "mark as done" button anywhere — this is intentional (see README).
 * ----------------------------------------------------------------------
 */

const Progress = (() => {

  /** Build the localStorage key for a given day number. */
  function keyFor(day) {
    return `${CONFIG.STORAGE_PREFIX}day${day}_complete`;
  }

  /** Whether a specific day has been genuinely completed. */
  function isDayComplete(day) {
    try {
      return localStorage.getItem(keyFor(day)) === 'true';
    } catch (e) {
      // localStorage can throw in private-browsing/edge cases — fail safe (locked).
      console.warn('Progress: localStorage unavailable', e);
      return false;
    }
  }

  /**
   * Marks a day complete. Should ONLY be called from within that day's own
   * script.js, at the exact moment its puzzle is genuinely solved.
   */
  function completeDay(day) {
    try {
      localStorage.setItem(keyFor(day), 'true');
      localStorage.setItem(`${CONFIG.STORAGE_PREFIX}day${day}_completedAt`, new Date().toISOString());
    } catch (e) {
      console.warn('Progress: could not save completion', e);
    }
  }

  /** Returns the Date a given day was completed, or null if not completed / unavailable. */
  function getCompletedAt(day) {
    try {
      const raw = localStorage.getItem(`${CONFIG.STORAGE_PREFIX}day${day}_completedAt`);
      return raw ? new Date(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Milliseconds still remaining before `day` is allowed to unlock, based on
   * MIN_HOURS_BETWEEN_DAYS since the previous day was completed. Returns 0
   * once the wait is over (or if the time gate is disabled / not applicable).
   */
  function getTimeRemainingMs(day) {
    if (!CONFIG.MIN_HOURS_BETWEEN_DAYS || CONFIG.MIN_HOURS_BETWEEN_DAYS <= 0) return 0;
    if (day <= 1) return 0;
    const completedAt = getCompletedAt(day - 1);
    if (!completedAt) return 0; // previous day not even solved yet — that's a different lock reason
    const requiredMs = CONFIG.MIN_HOURS_BETWEEN_DAYS * 60 * 60 * 1000;
    const elapsedMs = Date.now() - completedAt.getTime();
    return Math.max(0, requiredMs - elapsedMs);
  }

  /**
   * A day is unlocked if:
   *  - DEV_MODE is true, OR
   *  - it's Day 1 (always open), OR
   *  - the previous day is complete AND the minimum wait time has passed
   */
  function isDayUnlocked(day) {
    if (CONFIG.DEV_MODE) return true;
    if (day <= 1) return true;
    if (!isDayComplete(day - 1)) return false;
    return getTimeRemainingMs(day) <= 0;
  }

  /** Count how many days have been completed so far (used by Day 9 verification). */
  function getCompletedCount() {
    let count = 0;
    for (let d = 1; d <= CONFIG.TOTAL_DAYS; d++) {
      if (isDayComplete(d)) count++;
    }
    return count;
  }

  /** True only when every single day (1..TOTAL_DAYS-1, i.e. all prior chapters) is complete. */
  function areAllPriorDaysComplete(uptoExclusive) {
    if (CONFIG.DEV_MODE) return true;
    for (let d = 1; d < uptoExclusive; d++) {
      if (!isDayComplete(d)) return false;
    }
    return true;
  }

  /** Wipes all progress. Used by the reset-progress dev utility / troubleshooting. */
  function resetAllProgress() {
    for (let d = 1; d <= CONFIG.TOTAL_DAYS; d++) {
      localStorage.removeItem(keyFor(d));
      localStorage.removeItem(`${CONFIG.STORAGE_PREFIX}day${d}_completedAt`);
    }
  }

  /**
   * The core gatekeeper every day page calls on load.
   *
   * @param {number} day - which day this page represents (1-9)
   * @param {object} opts
   *    contentEl   - the DOM element containing the actual puzzle (hidden until unlocked)
   *    lockedEl    - the DOM element containing the locked-screen markup (hidden until locked)
   *    onUnlocked  - optional callback fired when content is shown
   */
  function enforceLock(day, { contentEl, lockedEl, onUnlocked } = {}) {
    const unlocked = isDayUnlocked(day);

    if (unlocked) {
      if (lockedEl) lockedEl.hidden = true;
      if (contentEl) {
        contentEl.hidden = false;
        contentEl.setAttribute('aria-hidden', 'false');
      }
      if (typeof onUnlocked === 'function') onUnlocked();
    } else {
      if (contentEl) {
        contentEl.hidden = true;
        contentEl.setAttribute('aria-hidden', 'true');
      }
      if (lockedEl) {
        lockedEl.hidden = false;
        renderLockedMessage(lockedEl, day);
      }

      // If the ONLY thing standing in the way is the time gate (the previous
      // puzzle is already solved), automatically re-check once the wait is
      // over so she never has to manually refresh at the right moment.
      if (!CONFIG.DEV_MODE && isDayComplete(day - 1)) {
        const remainingMs = getTimeRemainingMs(day);
        if (remainingMs > 0) {
          setTimeout(() => location.reload(), remainingMs + 1000);
        }
      }
    }

    return unlocked;
  }

  /** Fills the locked screen with a gentle, spoiler-free message. */
  function renderLockedMessage(lockedEl, day) {
    const prevSolved = isDayComplete(day - 1);

    if (prevSolved) {
      // Previous puzzle is done — she's just waiting out the time gate.
      const remainingMs = getTimeRemainingMs(day);
      const hoursLeft = Math.max(1, Math.ceil(remainingMs / (60 * 60 * 1000)));
      lockedEl.innerHTML = `
        <div class="locked-icon" aria-hidden="true">⏳</div>
        <h1>This page is still waiting for its story.</h1>
        <p>Come back in about ${hoursLeft} hour${hoursLeft === 1 ? '' : 's'} — some things are worth letting sit for a while.</p>
        <p class="handwritten" style="font-size:1.3rem;">— this page will open on its own when it's ready —</p>
      `;
    } else {
      const messages = [
        "This page is still waiting for its story.",
        "Some memories can only be discovered in order.",
        "Not yet, sweet thing. This chapter isn't ready for you."
      ];
      const line = messages[(day + getCompletedCount()) % messages.length];
      lockedEl.innerHTML = `
        <div class="locked-icon" aria-hidden="true">🔒</div>
        <h1>${line}</h1>
        <p>Please finish the previous sticky note before returning here.</p>
        <p class="handwritten" style="font-size:1.3rem;">— find the note you haven't opened yet —</p>
      `;
    }
  }

  /** Small dev-only badge + jump panel, only rendered when CONFIG.DEV_MODE is true. */
  function renderDevPanelIfNeeded() {
    if (!CONFIG.DEV_MODE) return;
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;bottom:12px;right:12px;background:#2e1c12;color:#f4ead9;' +
      'font:12px Inter,sans-serif;padding:10px 12px;border-radius:10px;z-index:9999;opacity:0.92;max-width:220px;';
    let links = '';
    for (let d = 1; d <= CONFIG.TOTAL_DAYS; d++) {
      links += `<a href="../day${d}/" style="color:#d9b26a;margin-right:6px;">D${d}</a>`;
    }
    panel.innerHTML = `<strong>DEV MODE</strong><br>${links}<br><button id="devReset" style="margin-top:6px;cursor:pointer;">reset progress</button>`;
    document.body.appendChild(panel);
    document.getElementById('devReset').addEventListener('click', () => {
      resetAllProgress();
      location.reload();
    });
  }

  return {
    isDayComplete,
    completeDay,
    isDayUnlocked,
    getCompletedCount,
    areAllPriorDaysComplete,
    getCompletedAt,
    getTimeRemainingMs,
    resetAllProgress,
    enforceLock,
    renderDevPanelIfNeeded,
  };
})();

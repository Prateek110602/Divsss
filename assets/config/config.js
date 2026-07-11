/**
 * config.js
 * ----------------------------------------------------------------------
 * Central configuration for the entire 9-day experience.
 * Every day/index.html loads this file BEFORE progress.js / utils.js.
 *
 * This is the only file you should need to touch to:
 *   - toggle developer/testing mode
 *   - change the total number of days
 *   - update the easter-egg nicknames
 * ----------------------------------------------------------------------
 */

const CONFIG = {
  /**
   * DEV_MODE
   * When true: every day is unlocked regardless of progress, and a small
   * "DEV" badge + jump-to-day panel appears in the corner of every page.
   * MUST be false before she ever opens a real sticky note.
   */
  DEV_MODE: false,

  /** Total number of days/pages in the story. */
  TOTAL_DAYS: 9,

  /**
   * MIN_HOURS_BETWEEN_DAYS
   * Even after a day's puzzle is solved, the NEXT day won't unlock until
   * this many hours have passed since that completion. This stops her from
   * binge-solving everything in one sitting even if she somehow has every
   * link already. Set to 0 to disable the time gate entirely (puzzle-only
   * progression, unlocks the instant the previous day is solved).
   */
  MIN_HOURS_BETWEEN_DAYS: 20,

  /** Prefix used for every localStorage key, e.g. "romantic_journey_day1_complete". */
  STORAGE_PREFIX: 'romantic_journey_',

  /**
   * Nicknames used for the optional "type a nickname" easter egg.
   * Typing any of these anywhere on any page (no input box needed)
   * triggers a small hidden compliment. Lowercase, no spaces.
   */
  NICKNAMES: ['puchuuu', 'mrigguuu', 'mrignaini', 'cutuuuu', 'divvsss'],

  /** Secret nickname-triggered compliments (rotates, picked at random). */
  EASTER_EGG_COMPLIMENTS: [
    "found you. exactly like i always find myself thinking of you.",
    "hi. yes, this was hidden here just for you.",
    "you weren't supposed to find this so easily. i'm impressed. as usual.",
    "okay fine, you're adorable. there, i said it.",
    "a tiny secret, just for the person who somehow lives rent-free in my head."
  ],

  /** The final date being revealed on Day 9. */
  FINAL_DATE: "1st August",
};

// Freeze so nothing accidentally mutates config at runtime.
Object.freeze(CONFIG);
Object.freeze(CONFIG.NICKNAMES);
Object.freeze(CONFIG.EASTER_EGG_COMPLIMENTS);

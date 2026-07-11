# A Nine-Note Story — Documentation

A handcrafted, 9-page interactive romantic puzzle experience, built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no backend — everything runs directly on GitHub Pages.

This README assumes very little web development experience and explains everything: what each file does, how the puzzle/progression system works, how to customize the writing, images, music, and colors, and how to deploy and maintain the site.

---

## 1. Folder Structure

```
romantic-project/
├── README.md                  <- you are here
├── assets/
│   ├── css/
│   │   └── main.css           <- shared design system (colors, fonts, components, animations)
│   ├── js/
│   │   ├── progress.js        <- the locking/progression engine (localStorage)
│   │   ├── particles.js       <- leaves / gold dust / hearts ambient effects
│   │   └── utils.js           <- typewriter effect, hint system, easter eggs
│   └── config/
│       └── config.js          <- DEV_MODE, nicknames, total day count
├── day1/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── day2/  (same 3-file pattern)
├── day3/
├── day4/
├── day5/
├── day6/
├── day7/
├── day8/
└── day9/
```

Every `dayN/` folder is a **fully independent webpage**. Each has its own `index.html`, `style.css`, and `script.js`, and each is directly hostable at its own URL:

```
https://YOURUSERNAME.github.io/romantic-project/day1/
https://YOURUSERNAME.github.io/romantic-project/day2/
...
https://YOURUSERNAME.github.io/romantic-project/day9/
```

(Replace `YOURUSERNAME` with your actual GitHub username, and `romantic-project` with whatever you name the repository — see Section 11.)

---

## 2. Purpose Of Every File

| File | Purpose |
|---|---|
| `assets/css/main.css` | The vintage brown design system shared by all 9 pages: CSS variables (colors, spacing, fonts), the paper texture, reusable components (wax seal, envelope, letter, locked screen, hint box, buttons), and shared animation keyframes. |
| `assets/config/config.js` | The one file that controls global behavior: `DEV_MODE` (true/false), total day count, the secret nicknames, and the final date text. |
| `assets/js/progress.js` | The "brain" of the progression system. Reads/writes `localStorage`, decides whether a day is locked or unlocked, and renders the locked screen. |
| `assets/js/particles.js` | Generates the falling leaves, gold dust, and floating hearts you see drifting across every page. Pure CSS animation, no canvas, so it's light on performance. |
| `assets/js/utils.js` | Shared helpers: the typewriter text effect, the "magical hint" system (never spoils answers), and the hidden nickname-typing easter egg. |
| `dayN/index.html` | The actual page structure/content for that day — the puzzle, the journal fragment, the hidden message, and the clue. |
| `dayN/style.css` | Page-specific visual styling unique to that day's puzzle (on top of the shared `main.css`). |
| `dayN/script.js` | Page-specific puzzle logic. Calls `Progress.enforceLock()` on load, and calls `Progress.completeDay(N)` only at the exact moment the puzzle is genuinely solved. |

---

## 3. HTML Explanation

Every day's `index.html` follows the same skeleton:

```html
<main id="locked-screen" hidden>...</main>   <!-- shown if the day is locked -->
<main id="day-content" hidden>...</main>     <!-- shown once the day is unlocked -->
```

Both start `hidden` by default. When the page loads, `script.js` asks `progress.js` which one should actually be visible, and reveals it. This means the puzzle markup and its answers are still present in the page source even when locked — but see Section 8 for why this is fine (short version: this is a private gift for one person, not a public secret; if you want to harden this further, see the note at the end of that section).

HTML is written semantically: `<main>`, `<article>`, `<h1>`, `<form>`, `<label>`, `<button>` are used for their real purpose, and interactive custom elements have `role`, `aria-label`, and keyboard handlers so the pages remain accessible.

---

## 4. CSS Explanation

`assets/css/main.css` defines everything visual that's shared:

- **CSS variables** (`:root { --coffee-brown: ...; }`) — the entire palette, spacing scale, fonts, and shadows live here. Change a variable once and it updates across all 9 days.
- **Paper texture** — created with layered CSS gradients (no image files), so the site stays lightweight and works instantly with no assets to upload.
- **Reusable components** — `.paper-card`, `.wax-seal`, `.envelope`, `.letter`, `.locked-screen`, `.hint-box`, `.btn-primary`, `.journal-fragment`, etc. Every day reuses these instead of reinventing styles.
- **Each `dayN/style.css`** only contains styles specific to that day's unique layout (the bookshelf, the constellation sky, the memory-match grid, etc.).

---

## 5. JavaScript Explanation

Four shared scripts, loaded in this order on every page:

1. `config.js` — constants (must load first, everything else reads from `CONFIG`).
2. `progress.js` — the `Progress` object: `isDayComplete()`, `completeDay()`, `isDayUnlocked()`, `enforceLock()`, `resetAllProgress()`.
3. `particles.js` — the `Particles` object: `spawnLeaves()`, `spawnDust()`, `spawnHearts()`, `startAmbientLeaves()`.
4. `utils.js` — the `Utils` object: `typewriter()`, `HintManager()`, `initNicknameEggs()`, `celebrate()`.

Then each day's own `script.js` runs last, using all of the above.

Everything is wrapped in an IIFE `(function () { ... })()` per file so nothing leaks into the global scope except the four intentional shared objects (`CONFIG`, `Progress`, `Particles`, `Utils`).

---

## 6. Animation Explanation

All animation is done with **CSS transitions and `@keyframes`**, triggered by adding/removing classes in JavaScript — nothing relies on animation libraries.

- **Envelope opening**: `.envelope-flap` rotates on the X-axis (`transform: rotateX(180deg)`) when `.open` is added.
- **Letter unfolding**: `.letter` scales from `scaleY(0.05)` to `scaleY(1)` with `opacity` fading in.
- **Wax seal breaking**: a `pointerdown`+`setTimeout` hold gesture adds `.cracking` (a shake) then `.broken` (a scale-and-fade break) after ~950ms of holding.
- **Leaves / dust / hearts**: `particles.js` spawns small `<div>`s with a `@keyframes` animation (`leafFall`, `dustFloat`, `heartFloat`) and removes them once the animation ends.
- **Typewriter text**: `Utils.typewriter()` reveals one character at a time via `setTimeout`, returning a `Promise` so pages can chain "type this, then reveal that" sequences.
- **Reduced motion**: a `@media (prefers-reduced-motion: reduce)` block shortens all animations to near-zero for anyone who needs that.

---

## 7. Puzzle Explanation (Day By Day)

| Day | Concept | Mechanic |
|---|---|---|
| 1 | A Sealed Beginning | Press-and-hold the wax seal to crack it open → envelope opens → letter unfolds. Inside, one line is written in "invisible ink" (text colored to match the page background) that only becomes readable when selected/dragged over — or double-tapped on mobile. |
| 2 | The Quiet Room | A hand-drawn (pure CSS) desk scene with 5 nearly-invisible hidden hearts tucked into the window, photo frame, books, coffee cup, and plant. Click each one to collect it. |
| 3 | The Shelf | A row of book spines, one of which is printed upside-down. Clicking the wrong book just gives a gentle shake; clicking the odd one out slides it from the shelf, revealing a hidden note in the cubby behind it. |
| 4 | What The Sky Remembers | A night sky of stars. Some are decoys; the real ones must be clicked in the correct order to draw a hidden heart shape. The correct "next" star always twinkles very slightly brighter as a fairness cue. |
| 5 | Pieces Of Us | A classic memory-match (flip-card) game. Each of the 6 icon pairs is a nod to a different day in the story. |
| 6 | The Locked Diary | A password-locked diary. The password is a genuine inside joke (see `day6/script.js`, the `ANSWER` constant) rather than anything generic. |
| 7 | Hiding In Plain Sight | An ordinary-looking paragraph of text where 6 specific phrases are secretly "press-and-hold" hotspots. Holding one for ~650ms reveals a small heart next to it. |
| 8 | The Vault | Three text inputs, each asking for something learned in an earlier day (a colour, a place, a nickname). All three must be correct at once to open the vault. |
| 9 | The Last Note | No puzzle — but it strictly checks that Days 1–8 are genuinely complete before revealing anything. If they are, a calm final letter unfolds into the actual date invitation. |

Every day also includes, per the brief: one journal fragment (a handwritten quoted line), one hidden message, one clue pointing toward the next day, and at least one small "surprise" interaction (easter eggs, hover reveals, etc.).

**Hints never spoil answers.** Every puzzle uses `Utils.HintManager`, which only reveals a hint after genuine idle time (10-14 seconds of inactivity) or after 2+ wrong attempts — and even then, hints are written as atmosphere ("some stars shine a little brighter than the rest"), never as direct instructions ("click the third star").

---

## 8. LocalStorage Explanation

The entire progression system is powered by the browser's `localStorage` — a small key/value store built into every browser, tied to that specific browser on that specific device. No server, no account, no internet connection required after the first page load.

Keys used (see `assets/config/config.js` → `STORAGE_PREFIX`):

```
romantic_journey_day1_complete       "true"
romantic_journey_day1_completedAt    "2026-07-11T10:32:00.000Z"
romantic_journey_day2_complete       "true"
...
romantic_journey_day9_complete       "true"
```

A day is marked complete **only** by that day's own `script.js` calling `Progress.completeDay(N)` at the exact moment its puzzle is solved — there is no button anywhere that lets a user manually flip a day to "done." This satisfies the "genuine completion only" requirement.

**Important caveat**: `localStorage` is per-browser, per-device. If she opens Day 1 on her phone and Day 2 on a laptop, the laptop won't know Day 1 was completed (each browser has its own separate storage). Make sure she uses the same browser/device throughout the 9 days.

---

## 9. Progression System Explanation

The rule, enforced by `Progress.isDayUnlocked(day)` in `assets/js/progress.js`:

- Day 1 is always unlocked.
- Day N (for N > 1) is unlocked only if Day (N−1)'s completion key is `"true"` in `localStorage`, **and** at least `CONFIG.MIN_HOURS_BETWEEN_DAYS` hours have passed since Day (N−1) was completed.
- If `CONFIG.DEV_MODE` is `true`, every day is treated as unlocked (for your own testing only).

**The time gate** (`MIN_HOURS_BETWEEN_DAYS`, default `20`, set in `assets/config/config.js`): even if she solves a puzzle and somehow already has the next sticky note's link, the next day won't actually open until this many hours have passed. This means the pacing isn't only up to when you physically hand her a note — the site itself enforces roughly one day at a time. Every completion is timestamped (`..._completedAt` in `localStorage`), which is what this check is based on.

- Set `MIN_HOURS_BETWEEN_DAYS: 0` to disable the time gate entirely (pure puzzle-only progression — next day unlocks the instant the previous one is solved).
- While a day is locked purely by the time gate (the previous puzzle is already solved, she's just waiting), the locked screen shows a friendly "come back in about N hours" message instead of the generic "finish the previous note" message — and the page automatically re-checks and unlocks itself once the wait is over, no manual refresh needed.
- Day 9 respects the same time gate relative to Day 8, even though it uses its own verification screen rather than the shared locked-screen markup.

Every `dayN/index.html` contains **both** the locked-screen markup and the real puzzle markup, both hidden by default. `script.js` calls `Progress.enforceLock(N, {...})` on load, which decides which one to reveal. This is a genuine gate based on stored progress — not just a hidden `<div>` that anyone could un-hide by guessing a URL, since the actual unlock decision is made from `localStorage` state that only gets set by solving the previous day's puzzle.

Day 9 goes one step further: it checks that **all** of Days 1–8 are complete (`Progress.areAllPriorDaysComplete(9)`), not just Day 8, before showing anything.

---

## 10. Developer Mode Explanation

In `assets/config/config.js`:

```js
const CONFIG = {
  DEV_MODE: false, // set to true only while you're testing
  ...
};
```

Set `DEV_MODE` to `true` while you're building/testing the site yourself. This:
- Unlocks every day regardless of stored progress.
- Adds a small "DEV MODE" panel in the bottom-right corner of every page with quick links to jump to any day, plus a "reset progress" button.

**Before you hand over the real sticky notes, set `DEV_MODE` back to `false`** and re-upload. Otherwise every page will be unlocked for her from day one, which defeats the whole point.

---

## 11. GitHub Pages Deployment Guide

### Step 1 — Create the repository
1. Go to [github.com](https://github.com) and log in (create a free account if you don't have one).
2. Click the **+** icon (top right) → **New repository**.
3. Name it something like `romantic-project` (this name becomes part of the URL).
4. Set it to **Public** (GitHub Pages on a free account requires a public repo, unless you have GitHub Pro/Team/Enterprise).
5. Do **not** initialize with a README (you already have one) — or if you do, you'll merge it later.
6. Click **Create repository**.

### Step 2 — Upload the project
Easiest method (no command line needed):
1. On your new repo's page, click **Add file → Upload files**.
2. Drag the entire contents of the `romantic-project` folder (the `assets/` folder, all 9 `dayN/` folders, and `README.md`) into the browser window.
3. Scroll down, add a commit message like "Initial upload," and click **Commit changes**.

Alternative (if you're comfortable with git/terminal):
```bash
cd romantic-project
git init
git add .
git commit -m "Initial upload"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/romantic-project.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. In your repository, go to **Settings** → **Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Under **Branch**, choose `main` and folder `/ (root)`, then click **Save**.
4. Wait 1-2 minutes. GitHub will show a green banner with your live URL, something like:
   `https://YOURUSERNAME.github.io/romantic-project/`

### Step 4 — Get the 9 individual URLs
Each day's URL is simply the base URL plus the folder name:
```
https://YOURUSERNAME.github.io/romantic-project/day1/
https://YOURUSERNAME.github.io/romantic-project/day2/
...
https://YOURUSERNAME.github.io/romantic-project/day9/
```
Write each of these on its own sticky note.

### Step 5 — Test everything before handing over sticky notes
1. Set `DEV_MODE = true` in `assets/config/config.js`, re-upload that one file (Section 13 explains how), and click through all 9 pages to confirm the puzzles work.
2. Once satisfied, set `DEV_MODE = false` again and re-upload the file.
3. Open Day 1 in a private/incognito browser window (simulates her opening it fresh) and play through for real, in order, to make sure locking behaves correctly.

### Updating the site later
Any time you want to change something: edit the file locally, then either drag-and-drop the changed file back into **Add file → Upload files** on GitHub (it will ask to overwrite), or `git add . && git commit -m "update" && git push` if using the command line. Changes usually go live within about a minute.

### Testing locally before uploading
You don't need any install for basic testing — just open `day1/index.html` directly in your browser by double-clicking it. Because everything uses relative paths (`../assets/...`), it works fine straight from your file system.

If you want it to behave exactly like a real web server (recommended for final testing, since some browsers restrict certain features on `file://` pages), you can use Python (already on most Macs) — open a terminal in the `romantic-project` folder and run:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000/day1/` in your browser.

---

## 12. How To Customize Messages

Every day's personal writing lives directly in that day's `index.html` (for the letter text) and `script.js` (for typewriter lines and reveal text). Open the file, find the text between HTML tags or inside the quotation marks in `Utils.typewriter(el, "...", speed)` calls, and edit directly. No other file needs to change.

---

## 13. How To Replace Images

This project intentionally uses **zero image files** — every visual (the desk scene, the bookshelf, the coffee cup, the constellation) is drawn with pure CSS shapes so the site works instantly with nothing to upload. If you'd like to add real photos:
1. Create a folder `assets/images/`.
2. Drop your `.jpg`/`.png` files in there.
3. In the relevant `dayN/index.html`, add an `<img src="../assets/images/yourphoto.jpg" alt="description">` wherever you'd like, and style it in that day's `style.css`.

---

## 14. How To Add Music

You chose to skip background music for now. If you'd like to add it later (e.g. for the Day 9 finale):
1. Create `assets/music/` and add a file, e.g. `theme.mp3`.
2. In `day9/index.html`, add just before `</body>`:
   ```html
   <audio id="bgMusic" src="../assets/music/theme.mp3" loop></audio>
   ```
3. In `day9/script.js`, inside the `revealLetter()` function, add:
   ```js
   const audio = document.getElementById('bgMusic');
   audio.volume = 0;
   audio.play().catch(() => {}); // autoplay may be blocked until a click has occurred, which the wax-seal press already provides
   let vol = 0;
   const fade = setInterval(() => {
     vol += 0.05;
     audio.volume = Math.min(vol, 0.6);
     if (vol >= 0.6) clearInterval(fade);
   }, 200);
   ```

---

## 15. How To Change Colors

Open `assets/css/main.css` and edit the variables at the top under `:root`:
```css
--coffee-brown:   #5b3a29;
--dark-chocolate: #2e1c12;
--cream-paper:    #f4ead9;
--warm-beige:     #e6d5b8;
--soft-gold:      #c9a25c;
```
Every page pulls its colors from these variables, so changing one value here updates the whole site.

---

## 16. How To Add More Puzzles

To add a new interaction within an existing day: write the HTML in that day's `index.html`, style it in that day's `style.css`, and add its logic to that day's `script.js`. You can reuse `Utils.typewriter()`, `Utils.HintManager()`, and `Utils.celebrate()` for consistency with the rest of the site.

---

## 17. How To Add More Days

1. Duplicate any `dayN/` folder (e.g. copy `day8/` to make `day10/`).
2. In the new `day10/index.html`, update `<title>`, the day-label text, and the puzzle content.
3. In the new `day10/script.js`, change `const DAY = 8;` to `const DAY = 10;`.
4. In `assets/config/config.js`, update `TOTAL_DAYS: 9` to `TOTAL_DAYS: 10`.
5. If Day 10 should be the new finale, move the Day 9 "final reveal" logic there instead, and turn Day 9 back into a normal puzzle day.

---

## 18. How To Reset Progress

**For yourself while testing**: with `DEV_MODE = true`, use the "reset progress" button in the dev panel (bottom-right corner of any page).

**Manually, in any browser**: open Developer Tools (F12 or right-click → Inspect) → Console tab, and run:
```js
Progress.resetAllProgress();
```
Then refresh the page. This clears every `romantic_journey_*` key from that browser's `localStorage`.

**To reset just one day**: in the console, run e.g. `localStorage.removeItem('romantic_journey_day3_complete')`.

---

## 19. Troubleshooting Guide

| Symptom | Likely cause | Fix |
|---|---|---|
| A day always shows "locked" even after solving the previous one | She opened the previous day in a different browser/device, so `localStorage` doesn't carry over | Make sure the same browser + device is used for every day. |
| Fonts look like a generic serif instead of the intended style | No internet connection when the page loaded (fonts load from Google Fonts) | Make sure the device has an internet connection the first time each page loads. |
| A puzzle doesn't seem to respond to clicks | JavaScript error — check the browser console (F12 → Console tab) for a red error message | Re-check that all 4 shared `<script>` tags are present and in order in that day's `index.html`. |
| She solved a puzzle but the next day still shows a countdown, not the puzzle | This is the time gate working as intended (`MIN_HOURS_BETWEEN_DAYS` in `assets/config/config.js`), not a bug | Either wait it out (it unlocks itself automatically), or lower/disable `MIN_HOURS_BETWEEN_DAYS` if you want faster pacing. |
| Nothing shows up at all, blank page | A typo in a file path (e.g. `../asset/css/main.css` instead of `../assets/css/main.css`) | Open DevTools → Network tab, reload, look for any red/failed file request. |
| Site shows a 404 on GitHub Pages | Pages hasn't finished deploying yet, or the branch/folder setting is wrong | Wait 1-2 minutes after enabling Pages; double-check Settings → Pages shows the green "your site is live" banner. |
| The invisible-ink puzzle on Day 1 won't reveal on mobile | Text selection can be finicky on some phones | The fallback double-tap on that paragraph works as an alternate way to reveal it. |

---

## 20. Maintenance Guide

- This project has **no dependencies to update** — no `package.json`, no npm packages, nothing that goes out of date except the Google Fonts CDN link (which is stable long-term).
- If GitHub ever changes how Pages works, the fix is always the same: Settings → Pages → confirm branch/folder is still set correctly.
- Keep a backup copy of the whole `romantic-project` folder locally (or in a private note) before making big edits, in case you want to roll back.
- Because every day is a fully independent folder, you can safely edit one day (say, fixing a typo in Day 4) without any risk of breaking Days 1, 2, 3, or 5-9.

---

Built with care, coffee, and probably too many `setTimeout` calls. Enjoy handing over the sticky notes.

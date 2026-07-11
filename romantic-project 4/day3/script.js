/**
 * day3/script.js — "The Shelf"
 * Puzzle: spot the one upside-down book spine among a normal row of books,
 * pull it out to reveal a hidden cubby with a folded note.
 */
(function () {
  const DAY = 3;
  const contentEl = document.getElementById('day-content');
  const lockedMain = document.getElementById('locked-screen');

  Progress.enforceLock(DAY, { contentEl, lockedEl: lockedMain, onUnlocked: init });
  Progress.renderDevPanelIfNeeded();
  Utils.initNicknameEggs();

  // Book data lives here so titles are easy to edit later (see README "How to customize").
  const BOOKS = [
    { title: 'The Art of Overthinking About You', color: '#6d3b2a' },
    { title: '101 Excuses To Text First', color: '#8a5a34' },
    { title: 'A Memoir On Being Dangerously Attractive', color: '#4a2f1c' },
    { title: 'Left On Read: A Tragedy', color: '#7a4f30' },
    { title: 'The Book You Have Not Found Yet', color: '#c9a25c', special: true },
    { title: 'Coffee, Cardigans & Distractions', color: '#5b3a22' },
    { title: 'How To Be Unfairly Adorable', color: '#8a5a34' },
  ];

  function init() {
    Particles.startAmbientLeaves(5000);

    const container = document.getElementById('shelfBooks');
    const cubby = document.getElementById('cubby');
    const foldedNote = document.getElementById('foldedNote');
    const shelfHint = document.getElementById('shelfHint');
    const revealBox = document.getElementById('revealBox');
    const revealFragment = document.getElementById('revealFragment');
    const revealText = document.getElementById('revealText');

    const hints = Utils.HintManager(shelfHint, [
      "Not every book here is standing the way it should.",
      "One of the titles reads a little... upside down.",
    ]);
    hints.startIdleTimer(11000);

    BOOKS.forEach((book, i) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'book-spine' + (book.special ? ' upside-down' : '');
      el.style.background = book.color;
      el.style.height = `${150 + (i % 3) * 18}px`;
      el.setAttribute('aria-label', book.special ? 'a book that looks slightly odd' : 'a book');
      el.innerHTML = `<span class="title">${book.title}</span>`;

      el.addEventListener('click', () => {
        if (book.special) {
          pullBook(el);
        } else {
          el.classList.add('wrong', 'shake');
          hints.registerFailedAttempt();
          setTimeout(() => el.classList.remove('shake'), 500);
        }
      });

      container.appendChild(el);
    });

    function pullBook(el) {
      el.classList.add('pulled');
      setTimeout(() => {
        cubby.hidden = false;
      }, 300);
    }

    foldedNote.addEventListener('click', openNote);
    foldedNote.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openNote();
    });

    let opened = false;
    async function openNote() {
      if (opened) return;
      opened = true;
      foldedNote.style.pointerEvents = 'none';

      revealBox.hidden = false;
      revealFragment.textContent =
        '"I keep meaning to reorganise this shelf. I keep getting distracted by you instead."';

      await Utils.typewriter(
        revealText,
        "You found the one that didn't belong — which is honestly a very you thing to do. Tomorrow, look up. The sky remembers something we do.",
        20
      );

      Utils.celebrate(document.getElementById('bookshelf'));
      Particles.spawnDust(14);
      Progress.completeDay(DAY);
    }
  }
})();

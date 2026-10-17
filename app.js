document.querySelector('#print-button').addEventListener('click', () => window.print());
const chapters = [...document.querySelectorAll('.chapter')];
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const count = document.querySelector('#chapter-count');
const title = document.querySelector('#chapter-title');
let current = 0;
function updateChapter() {
  const point = window.innerHeight * .38;
  let index = 0;
  chapters.forEach((chapter, i) => { if (chapter.getBoundingClientRect().top <= point) index = i; });
  current = index;
  count.replaceChildren(document.createTextNode(String(current + 1).padStart(2, '0') + ' '));
  const total = document.createElement('span'); total.textContent = '/ ' + chapters.length; count.append(total);
  title.textContent = chapters[current].dataset.title;
  previous.disabled = current === 0;
  next.disabled = current === chapters.length - 1;
}
function goTo(index) { const chapter = chapters[Math.max(0, Math.min(index, chapters.length - 1))]; try { history.replaceState(null, '', '#' + chapter.id); } catch { /* Local viewers may restrict history. */ } chapter.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'}); }
previous.addEventListener('click', () => goTo(current - 1));
next.addEventListener('click', () => goTo(current + 1));
let ticking = false;
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { updateChapter(); ticking = false; }); } }, {passive:true});
window.addEventListener('resize', updateChapter);
updateChapter();

const posters = [...document.querySelectorAll('.poster')];
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const dots = [...document.querySelectorAll('.dots span')];
const progress = document.querySelector('.dots');
const lightbox = document.querySelector('#lightbox');
const zoomImage = document.querySelector('#zoom-image');
let current = 0;
let returnFocus = null;
function update() {
  const point = window.innerHeight * .4;
  current = 0;
  posters.forEach((poster, i) => { if (poster.getBoundingClientRect().top <= point) current = i; });
  previous.disabled = current === 0;
  next.disabled = current === posters.length - 1;
  dots.forEach((dot,i) => dot.classList.toggle('active',i===current));
  progress.setAttribute('aria-label',`Изображение ${current+1} из ${posters.length}`);
}
function move(delta) {
  const index = Math.max(0,Math.min(posters.length-1,current+delta));
  posters[index].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  try { history.replaceState(null,'','#'+posters[index].id); } catch {}
}
function openImage(index, trigger) {
  const source = posters[index].querySelector('img');
  zoomImage.src = source.src;
  zoomImage.alt = source.alt;
  returnFocus = trigger;
  lightbox.showModal();
  lightbox.scrollTo(0,0);
  document.querySelector('#close').focus();
}
document.querySelectorAll('.poster-link').forEach(link => link.addEventListener('click',event => { event.preventDefault(); openImage(Number(link.dataset.index),link); }));
previous.addEventListener('click',()=>move(-1));
next.addEventListener('click',()=>move(1));
document.querySelector('#zoom').addEventListener('click',event=>openImage(current,event.currentTarget));
document.querySelector('#close').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('close',()=>returnFocus?.focus({preventScroll:true}));
document.querySelector('#print').addEventListener('click',()=>window.print());
document.addEventListener('keydown',event=>{
  if(lightbox.open || event.altKey || event.ctrlKey || event.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
  if(event.key==='ArrowRight'){event.preventDefault();move(1);}
  if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}
});
let pending = false;
window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(()=>{update();pending=false;});}},{passive:true});
window.addEventListener('resize',update);
update();

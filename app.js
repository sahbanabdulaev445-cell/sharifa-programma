const posters=[...document.querySelectorAll('.poster')];
const previous=document.querySelector('#previous');
const next=document.querySelector('#next');
const progress=document.querySelector('.progress');
const lightbox=document.querySelector('#lightbox');
const zoomImage=document.querySelector('#zoom-image');
let current=0,returnFocus=null,pending=false;
function update(){
 current=0;posters.forEach((p,i)=>{if(p.getBoundingClientRect().top<=innerHeight*.4)current=i;});
 previous.disabled=current===0;next.disabled=current===posters.length-1;
 progress.firstElementChild.style.width=`${(current+1)/posters.length*100}%`;
 progress.setAttribute('aria-valuenow',String(current+1));
}
function moveTo(requested){
 const p=posters[Math.max(0,Math.min(posters.length-1,requested))];
 p.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 try{history.replaceState(null,'','#'+p.id);}catch{}
}
function openImage(index,trigger){
 const p=posters[index].querySelector('img');zoomImage.src=p.src;zoomImage.alt=p.alt;returnFocus=trigger;
 lightbox.showModal();lightbox.scrollTo(0,0);document.querySelector('#close').focus();
}
document.querySelectorAll('.poster-link').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();openImage(Number(link.dataset.index),link);}));
previous.addEventListener('click',()=>moveTo(current-1));next.addEventListener('click',()=>moveTo(current+1));
document.querySelector('#zoom').addEventListener('click',e=>openImage(current,e.currentTarget));
document.querySelector('#close').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('close',()=>returnFocus?.focus({preventScroll:true}));
const printButton=document.querySelector('#print');
printButton.addEventListener('click',async()=>{
 printButton.disabled=true;
 try{
  await Promise.all(posters.map(async poster=>{const img=poster.querySelector('img');img.loading='eager';try{await img.decode();}catch{}}));
  window.print();
 }finally{printButton.disabled=false;}
});
document.addEventListener('keydown',event=>{
 if(lightbox.open||event.altKey||event.ctrlKey||event.metaKey||/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))return;
 const targets={ArrowLeft:current-1,ArrowRight:current+1,Home:0,End:posters.length-1};
 if(event.key in targets){event.preventDefault();moveTo(targets[event.key]);}
});
window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(()=>{update();pending=false;});}},{passive:true});
window.addEventListener('resize',update);update();

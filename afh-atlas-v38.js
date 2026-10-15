/* AFH V38 / Knowledge Atlas — progressive enhancements; semantic anchors.
 * Works with static HTML and existing client-side topic navigation. */
(()=>{'use strict';
const banner=document.querySelector('body.archive-v4 .archive-banner');
if(!banner)return;
const shell=banner.querySelector('.shell'),title=document.getElementById('bannerTitle');
if(!shell||!title)return;
if(!banner.querySelector('.afh38-art')){
 const art=document.createElement('div');art.className='afh38-art';art.setAttribute('aria-hidden','true');
 const orb=document.createElement('div');orb.className='afh38-orb';
 const axis=document.createElement('div');axis.className='afh38-line';
 const foot=document.createElement('div');foot.className='afh38-coordinate';foot.textContent='AFH / THE KNOWLEDGE ATLAS · MMXXVI';
 art.append(orb,axis,foot);banner.insertBefore(art,banner.firstChild);
}
let actions=shell.querySelector('.afh38-actions');
if(!actions){actions=document.createElement('nav');actions.className='afh38-actions';actions.setAttribute('aria-label','Explore this learning field');shell.appendChild(actions)}
function link(label,href,mark){
 const a=document.createElement('a');a.href=href;
 const text=document.createElement('span');text.textContent=label;
 const arrow=document.createElement('span');arrow.textContent=mark;arrow.setAttribute('aria-hidden','true');
 a.append(text,arrow);return a;
}
function updateLinks(){
 const isAi=title.textContent.toLowerCase().includes('ai &');
 actions.replaceChildren(link('Explore learning notes','#toolbar','↘'));
 if(isAi&&document.getElementById('ai-automation-projects'))actions.appendChild(link('Explore AI applications','#ai-automation-projects','↗'));
}
updateLinks();
new MutationObserver(updateLinks).observe(title,{childList:true,characterData:true,subtree:true});
const up=document.createElement('button');
up.type='button';up.className='afh38-backtotop';up.setAttribute('aria-label','Back to top');
up.textContent='↑';
up.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));
document.body.appendChild(up);
let raf=0;
function onScroll(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;up.classList.toggle('is-visible',scrollY>1100)})}
addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
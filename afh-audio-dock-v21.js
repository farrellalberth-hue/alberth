/* AFH V21 — compact accessible sound dock; old Web Audio soundtrack unchanged. */
(()=>{'use strict';
const root=document.getElementById('afh17-audio');
const open=document.getElementById('afh21-audio-expand');
const panel=document.getElementById('afh21-audio-panel');
const close=document.getElementById('afh21-audio-close');
if(!root||!open||!panel)return;
const setOpen=(on,focus=false)=>{
 root.dataset.expanded=String(on);
 open.setAttribute('aria-expanded',String(on));
 open.setAttribute('aria-label',on?'Close music controls':'Open music controls');
 panel.hidden=!on;
 if(on&&focus)panel.querySelector('#afh17-audio-toggle')?.focus();
};
open.addEventListener('click',()=>setOpen(root.dataset.expanded!=='true'));
close?.addEventListener('click',()=>{setOpen(false);open.focus()});
document.addEventListener('pointerdown',e=>{
 if(root.dataset.expanded==='true'&&!root.contains(e.target))setOpen(false);
},{passive:true});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&root.dataset.expanded==='true'){setOpen(false);open.focus()}
});
setOpen(false);
})();

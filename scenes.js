/* VTM chronicle presentation widgets.
   VTMScene(scene, mount)      scene title card, with the status strip inside when status.js is loaded
   VTMEntrance(people, mount)  character entrance name plates
   VTMDoc(doc, mount)          in-world documents: text, letter, memo, dossier, news, summons
   Every function renders into `mount`, or the element with id "vtm". All text is escaped. */
(function(){
var FONTS="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=IM+Fell+English:ital@0;1&family=Special+Elite&family=Playfair+Display:wght@700;900&family=Mrs+Saint+Delafield&family=La+Belle+Aurore&family=Petit+Formal+Script&family=Homemade+Apple&family=Poiret+One&display=swap";
var CSS=[
":root{--vtm-blood:#A32D2D;--vtm-brass:#854F0B}",
"@media (prefers-color-scheme:dark){:root{--vtm-blood:#E24B4A;--vtm-brass:#EF9F27}}",
"@keyframes vtm-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
"@keyframes vtm-wide{from{opacity:0;letter-spacing:.5em;filter:blur(6px)}to{opacity:1;letter-spacing:.14em;filter:blur(0)}}",
"@keyframes vtm-line{to{width:min(260px,60%)}}",
"@keyframes vtm-slide{to{opacity:1;transform:none}}",
"@keyframes vtm-pop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}",
".vtm-wrap{padding:1rem 0}",
".vtm-sc{position:relative;overflow:hidden;border-radius:12px;background:var(--surface-2);border:0.5px solid var(--border);padding:2rem 1.5rem 1.25rem;text-align:center}",
".vtm-sc .eb{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:var(--text-secondary);opacity:0;animation:vtm-up .9s ease-out .2s forwards}",
".vtm-sc .ti{font-family:'Cinzel',serif;font-weight:600;font-size:clamp(24px,6vw,34px);letter-spacing:.14em;margin:.35rem 0 .2rem;color:var(--text-primary);opacity:0;animation:vtm-wide 1.6s cubic-bezier(.2,.7,.2,1) .5s forwards;line-height:1.2}",
".vtm-sc .wh{font-family:'Cinzel',serif;font-size:13px;letter-spacing:.12em;color:var(--vtm-brass);opacity:0;animation:vtm-up .9s ease-out 1.3s forwards}",
".vtm-sc .ru{height:1px;background:var(--vtm-blood);width:0;margin:1rem auto;animation:vtm-line 1.2s ease-out 1.5s forwards}",
".vtm-sc .mo{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:19px;line-height:1.5;color:var(--text-secondary);max-width:30em;margin:0 auto;opacity:0;animation:vtm-up 1.2s ease-out 2.1s forwards}",
".vtm-sc .st{margin-top:1.25rem;opacity:0;animation:vtm-up .9s ease-out 2.8s forwards;text-align:left}",
".vtm-ent{display:flex;align-items:center;gap:14px;background:var(--surface-2);border:0.5px solid var(--border);border-left:3px solid var(--vtm-brass);border-radius:0;padding:12px 16px;margin:0 0 12px;opacity:0;transform:translateX(-24px);animation:vtm-slide .8s cubic-bezier(.2,.7,.2,1) forwards}",
".vtm-ent.threat{border-left-color:var(--vtm-blood)}.vtm-ent.unknown{border-left-color:var(--text-muted)}",
".vtm-ent .se{flex:none;width:52px;height:52px;border-radius:50%;border:1.5px solid var(--vtm-brass);display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-weight:600;font-size:18px;color:var(--vtm-brass)}",
".vtm-ent.threat .se{border-color:var(--vtm-blood);color:var(--vtm-blood)}.vtm-ent.unknown .se{border-color:var(--text-muted);color:var(--text-muted)}",
".vtm-ent .nm{font-family:'Cinzel',serif;font-weight:600;font-size:19px;letter-spacing:.04em;line-height:1.2;color:var(--text-primary)}",
".vtm-ent .tt{font-size:13px;color:var(--text-secondary);margin-top:2px}",
".vtm-ent .lk{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:17px;color:var(--text-secondary);margin-top:4px;line-height:1.4}",
".vtm-phone{max-width:340px;margin:0 auto;background:#0f0f10;border-radius:28px;padding:14px 12px 16px;border:1px solid #2a2a2c}",
".vtm-phone .hd{text-align:center;padding:4px 0 10px;border-bottom:1px solid #222}",
".vtm-phone .av{width:52px;height:52px;border-radius:50%;background:#5c5c62;color:#f2f2f4;display:flex;align-items:center;justify-content:center;margin:0 auto 4px;font-size:22px;font-weight:500;font-family:var(--font-sans)}",
".vtm-phone .cn{color:#f2f2f4;font-size:13px;font-family:var(--font-sans)}",
".vtm-phone .ms{padding:10px 4px 0;display:flex;flex-direction:column;gap:6px;font-family:var(--font-sans)}",
".vtm-phone .m{max-width:78%;padding:8px 12px;border-radius:18px;font-size:15px;line-height:1.35;background:#2b2b2e;color:#f2f2f4;align-self:flex-start;opacity:0;animation:vtm-pop .35s ease-out forwards;white-space:pre-wrap;word-wrap:break-word}",
".vtm-phone .m.me{background:#8e1b1b;align-self:flex-end}",
".vtm-phone .ts{text-align:center;font-size:11px;color:#8a8a8e;margin:4px 0}",
".vtm-phone .m.old{opacity:1;animation:none}",
".vtm-phone .dv{align-self:flex-end;font-size:11px;color:#8a8a8e;margin-top:-2px}",
".vtm-phone .rb{display:flex;gap:8px;align-items:flex-end;margin-top:12px;padding:0 2px}",
".vtm-phone .rb textarea{flex:1;resize:none;min-height:36px;max-height:120px;border-radius:18px;border:1px solid #3a3a3e;background:#1c1c1e;color:#f2f2f4;padding:8px 14px;font:15px/1.35 var(--font-sans);outline:none}",
".vtm-phone .rb textarea:focus{border-color:#8e1b1b}",
".vtm-phone .rb textarea:disabled{opacity:.5}",
".vtm-phone .sd{flex:none;width:36px;height:36px;border-radius:50%;border:none;background:#8e1b1b;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;padding:0}",
".vtm-phone .sd:disabled{background:#3a3a3e;cursor:default}",
".vtm-phone .er{color:#ff8a8a;font:12px var(--font-sans);min-height:16px;padding:4px 6px 0}",
".vtm-phone .aw{display:block;margin:6px auto 0;background:none;border:none;color:#8a8a8e;font:12px var(--font-sans);cursor:pointer;text-decoration:underline}",
".vtm-paper,.vtm-paper *{color:#2b1d14 !important}",
".vtm-letter{position:relative;max-width:480px;margin:0 auto;background:#efe4cf;border-radius:2px;padding:2rem 2rem 2.25rem;box-shadow:0 1px 0 #d6c6a8}",
".vtm-letter .bd{transition:filter 1.2s ease,opacity 1.2s ease}",
".vtm-letter.sealed .bd{filter:blur(6px);opacity:.25}",
".vtm-letter p{margin:0 0 .6em}",
".vtm-letter .sg{margin-top:.4em}",
".vtm-wax{position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;background:#7c1418;display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-weight:600;font-size:30px;cursor:pointer;border:none;transition:transform .5s ease,opacity .6s ease}",
".vtm-paper .vtm-wax{color:#efd9b5 !important}",
".vtm-wax::after{content:'';position:absolute;inset:6px;border-radius:50%;border:1.5px dashed rgba(239,217,181,.45)}",
".vtm-letter.open .vtm-wax{transform:scale(1.5) rotate(25deg);opacity:0;pointer-events:none}",
".vtm-hint{text-align:center;font-size:12px;color:var(--text-muted);margin-top:6px}",
".vtm-memo{max-width:480px;margin:0 auto;background:#f6f1e6;padding:1.5rem 1.75rem;border-top:3px solid #1b1b1b;border-bottom:3px solid #1b1b1b}",
".vtm-memo .lh{font-family:'Cinzel',serif;font-weight:600;letter-spacing:.3em;text-align:center;font-size:14px;border-bottom:1px solid #b89a5a;padding-bottom:6px}",
".vtm-memo .lh2{font-family:'Poiret One',sans-serif;text-align:center;font-size:13px;letter-spacing:.12em;margin:4px 0 14px}",
".vtm-memo .rw{font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5}",
".vtm-memo .bd{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:19px;line-height:1.55;margin-top:12px}",
".vtm-memo .bd p{margin:0 0 .6em}",
".vtm-dos{max-width:480px;margin:0 auto;background:#dcd3bf;padding:1.25rem 1.5rem;font-family:'Special Elite',monospace;font-size:15px;line-height:1.7;border-top:22px solid #b9ad92;position:relative}",
".vtm-dos .sp{position:absolute;right:16px;top:-16px;color:#8e1b1b !important;border:2px solid #8e1b1b;padding:2px 8px;transform:rotate(-6deg);font-size:13px;letter-spacing:.1em;background:#dcd3bf}",
".vtm-dos .rd{background:#141414;color:transparent !important;border-radius:1px;user-select:none}",
".vtm-dos p{margin:0}",
".vtm-news{max-width:480px;margin:0 auto;background:#ece6d8;padding:1rem 1.25rem 1.25rem;font-family:'IM Fell English',serif;border:1px solid #cfc6b2;transform:rotate(-.6deg)}",
".vtm-news,.vtm-news *{color:#1b1b1b !important}",
".vtm-news .ma{font-family:'Playfair Display',serif;font-weight:900;font-size:24px;text-align:center;border-bottom:3px double #1b1b1b;padding-bottom:4px}",
".vtm-news .dl{font-size:12px;text-align:center;margin:4px 0 8px;letter-spacing:.08em}",
".vtm-news .hl{font-family:'Playfair Display',serif;font-weight:700;font-size:22px;line-height:1.15;margin:.25rem 0 .5rem}",
".vtm-news .tx{font-size:15px;line-height:1.5;columns:2;column-gap:1.25rem;text-align:justify}",
".vtm-news .tx p{margin:0 0 .5em}",
"@media (max-width:420px){.vtm-news .tx{columns:1}}",
".vtm-sum{max-width:480px;margin:0 auto;background:#f4efe4;padding:1.75rem 2rem;border:1px solid #c9b68a;outline:1px solid #c9b68a;outline-offset:-8px;text-align:center}",
".vtm-sum .hd{font-family:'Cinzel',serif;font-weight:600;letter-spacing:.18em;font-size:15px;margin-bottom:12px}",
".vtm-sum .bd{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:19px;line-height:1.55}",
".vtm-sum .bd p{margin:0 0 .6em}",
".vtm-sum .sg{font-family:'Cinzel',serif;letter-spacing:.1em;font-size:14px;margin-top:10px}",
".vtm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}"
].join("\n");
var HANDS={
 gabrielle:["'Mrs Saint Delafield',cursive","30px","1.4"],
 anika:["'La Belle Aurore',cursive","21px","1.6"],
 gerard:["'Petit Formal Script',cursive","17px","1.8"],
 victor:["'IM Fell English',serif","19px","1.6"],
 type:["'Special Elite',monospace","16px","1.7"],
 stationery:["'Cormorant Garamond',serif;font-style:italic","20px","1.55"],
 rushed:["'Homemade Apple',cursive","17px","1.85"],
 fell:["'IM Fell English',serif","19px","1.6"]
};
var WRITER={gabrielle:"gabrielle",anika:"anika",ace:"anika",gerard:"gerard",victor:"victor",gary:"type","gary golden":"type"};
function setup(){
 if(!document.getElementById('vtm-fonts')){var l=document.createElement('link');l.id='vtm-fonts';l.rel='stylesheet';l.href=FONTS;document.head.appendChild(l);}
 if(!document.getElementById('vtm-css')){var s=document.createElement('style');s.id='vtm-css';s.textContent=CSS;document.head.appendChild(s);}
}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function paras(t){return String(t==null?'':t).split(/\n+/).filter(function(x){return x.trim();}).map(function(x){return '<p>'+esc(x)+'</p>';}).join('');}
function mountOf(m){return m||document.getElementById('vtm')||document.body;}
function sr(text){return '<h2 class="vtm-sr">'+esc(text)+'</h2>';}

window.VTMScene=function(sc,mount){
 setup();mount=mountOf(mount);sc=sc||{};
 var eb=[sc.session,sc.scene].filter(Boolean).join(' · ');
 var wh=[sc.place,sc.time].filter(Boolean).join(' · ');
 mount.innerHTML=sr('Scene: '+(sc.title||''))+'<div class="vtm-wrap"><div class="vtm-sc">'+(eb?'<div class="eb">'+esc(eb)+'</div>':'')+'<div class="ti">'+esc(sc.title)+'</div>'+(wh?'<div class="wh">'+esc(wh)+'</div>':'')+'<div class="ru"></div>'+(sc.mood?'<p class="mo">'+esc(sc.mood)+'</p>':'')+'<div class="st"><div class="vtm-st"></div></div></div></div>';
 if(sc.status&&window.VTMStatus){window.VTMStatus(sc.status,mount.querySelector('.vtm-st'));}
};

window.VTMEntrance=function(people,mount){
 setup();mount=mountOf(mount);people=[].concat(people||[]);
 mount.innerHTML=sr('Arriving: '+people.map(function(p){return p.name;}).join(', '))+'<div class="vtm-wrap">'+people.map(function(p,i){
  var tone=p.tone==='threat'||p.tone==='unknown'?p.tone:'';
  var ini=p.initials||(tone==='unknown'?'?':String(p.name||'?').charAt(0));
  return '<div class="vtm-ent '+tone+'" style="animation-delay:'+(0.1+i*0.6).toFixed(1)+'s"><div class="se">'+esc(ini)+'</div><div><div class="nm">'+esc(p.name)+'</div>'+(p.title?'<div class="tt">'+esc(p.title)+'</div>':'')+(p.look?'<div class="lk">'+esc(p.look)+'</div>':'')+'</div></div>';
 }).join('')+'</div>';
};

function textThread(d){
 var name=d.contact||'Unknown';var ini=(d.initial||name.charAt(0)).toUpperCase();
 var html='<div class="vtm-phone"><div class="hd"><div class="av">'+esc(ini)+'</div><div class="cn">'+esc(name)+'</div></div><div class="ms">'+(d.time?'<div class="ts">'+esc(d.time)+'</div>':'');
 var ms=d.messages||[];var anyNew=ms.some(function(m){return m.new;});var k=0;
 ms.forEach(function(m){var anim=!anyNew||m.new;html+='<div class="m'+(m.from==='me'?' me':'')+(anim?'':' old')+'"'+(anim?' style="animation-delay:'+(0.2+(k++)*0.7).toFixed(1)+'s"':'')+'>'+esc(m.text)+'</div>';});
 html+='</div>';
 if(d.reply!==false)html+='<div class="rb"><textarea rows="1" aria-label="Message '+esc(name)+'" placeholder="Text '+esc(name)+'"></textarea><button class="sd" aria-label="Send">\u2191</button></div><div class="er"></div><button class="aw">Put the phone away</button>';
 return html+'</div>';
}
function letter(d){
 var key=d.hand||WRITER[String(d.writer||'').toLowerCase()]||'rushed';var h=HANDS[key]||HANDS.rushed;
 var sealed=!!d.seal;
 var html='<div class="vtm-paper"><div class="vtm-letter'+(sealed?' sealed':'')+'"><div class="bd" style="font-family:'+h[0]+';font-size:'+h[1]+';line-height:'+h[2]+'">'+(d.greeting?'<p>'+esc(d.greeting)+'</p>':'')+paras(d.body)+(d.sign?'<div class="sg">'+esc(d.sign)+'</div>':'')+'</div>'+(sealed?'<button class="vtm-wax" aria-label="Break the seal">'+esc(d.seal)+'</button>':'')+'</div></div>'+(sealed?'<div class="vtm-hint">Tap the seal to open</div>':'');
 return html;
}
function memo(d){
 return '<div class="vtm-paper"><div class="vtm-memo"><div class="lh">'+esc(d.letterhead||'A C E')+'</div><div class="lh2">'+esc(d.office||'Office of the Casino Manager')+'</div>'+(d.to?'<div class="rw">To: '+esc(d.to)+'</div>':'')+(d.from?'<div class="rw">From: '+esc(d.from)+'</div>':'')+(d.subject?'<div class="rw">Re: '+esc(d.subject)+'</div>':'')+'<div class="bd">'+paras(d.body)+'</div>'+(d.sign?'<div class="rw" style="margin-top:6px">'+esc(d.sign)+'</div>':'')+'</div></div>';
}
function redact(s){return esc(s).replace(/\[REDACTED(?::(\d+))?\]/g,function(_,n){var len=n?+n:12;return '<span class="rd">'+new Array(len+1).join('x')+'</span>';});}
function dossier(d){
 var html='<div class="vtm-paper"><div class="vtm-dos">'+(d.stamp!==''?'<span class="sp">'+esc(d.stamp||'Eyes only')+'</span>':'');
 (d.lines||[]).forEach(function(l){html+='<p>'+(l[0]?esc(String(l[0]).toUpperCase())+': ':'')+redact(l[1])+'</p>';});
 if(d.notes)html+='<p>NOTES: '+redact(d.notes)+'</p>';
 if(d.sign)html+='<p style="margin-top:.5rem">— '+esc(d.sign)+'</p>';
 return html+'</div></div>';
}
function news(d){
 return '<div class="vtm-news"><div class="ma">'+esc(d.paper||'The Desert Courier')+'</div><div class="dl">'+esc(d.dateline||'LAS VEGAS · LATE EDITION')+'</div><div class="hl">'+esc(d.headline)+'</div><div class="tx">'+paras(d.body)+'</div></div>';
}
function summons(d){
 return '<div class="vtm-paper"><div class="vtm-sum"><div class="hd">'+esc(d.heading||'By order of the Prince')+'</div><div class="bd">'+paras(d.body)+'</div>'+(d.sign?'<div class="sg">'+esc(d.sign)+'</div>':'')+'</div></div>';
}
window.VTMDoc=function(d,mount){
 setup();mount=mountOf(mount);d=d||{};
 var f={text:textThread,letter:letter,note:letter,memo:memo,dossier:dossier,news:news,summons:summons}[d.type]||letter;
 if(d.type==='note'&&!d.hand)d.hand='rushed';
 mount.innerHTML=sr('Document: '+(d.type||'letter'))+'<div class="vtm-wrap">'+f(d)+'</div>';
 var ph=mount.querySelector('.vtm-phone');
 if(ph&&d.type==='text'&&d.reply!==false){
  var ta=ph.querySelector('textarea'),sd=ph.querySelector('.sd'),er=ph.querySelector('.er'),aw=ph.querySelector('.aw'),list=ph.querySelector('.ms'),who=d.contact||'Unknown',done=false;
  var post=window.sendPrompt||function(){};
  ta.addEventListener('input',function(){er.textContent='';ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,120)+'px';});
  function send(){if(done)return;var t=ta.value.trim();if(!t){er.textContent='Type a message first.';return;}
   done=true;var b=document.createElement('div');b.className='m me';b.textContent=t;list.appendChild(b);var dv=document.createElement('div');dv.className='dv';dv.textContent='Delivered';list.appendChild(dv);
   ta.value='';ta.disabled=true;sd.disabled=true;aw.style.display='none';ta.placeholder='Waiting for a reply\u2026';
   post('[Text to '+who+'] '+t);}
  sd.onclick=send;ta.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
  aw.onclick=function(){if(done)return;done=true;ta.disabled=true;sd.disabled=true;aw.textContent='Phone put away';post('[Put the phone away] Anika ends the conversation with '+who+'.');};
 }
 var w=mount.querySelector('.vtm-wax');
 if(w)w.onclick=function(){var L=mount.querySelector('.vtm-letter');L.classList.remove('sealed');L.classList.add('open');var h=mount.querySelector('.vtm-hint');if(h)h.textContent='';};
};
})();

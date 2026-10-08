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
".vtm-sc .ti{font-family:'Cinzel',serif;font-weight:600;font-size:clamp(24px,6vw,34px);letter-spacing:.14em;margin:.35rem 0 .8rem;color:var(--text-primary);opacity:0;animation:vtm-wide 1.6s cubic-bezier(.2,.7,.2,1) .5s forwards;line-height:1.2}",
".vtm-sc .wh{font-family:'Cinzel',serif;font-size:13px;letter-spacing:.12em;color:var(--vtm-brass);opacity:0;animation:vtm-up .9s ease-out 1.3s forwards}",
".vtm-sc .ru{height:1px;background:var(--vtm-blood);width:0;margin:1rem auto;animation:vtm-line 1.2s ease-out 1.5s forwards}",
".vtm-sc .mo{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:19px;line-height:1.5;color:var(--text-secondary);max-width:30em;margin:0 auto;opacity:0;animation:vtm-up 1.2s ease-out 2.1s forwards}",
".vtm-sc .st{margin-top:1.25rem;opacity:0;animation:vtm-up .9s ease-out 2.8s forwards;text-align:left}",
".vtm-ent{display:flex;align-items:center;gap:14px;background:var(--surface-2);border:0.5px solid var(--border);border-left:3px solid var(--vtm-brass);border-radius:0;padding:12px 16px;margin:0 0 12px;opacity:0;transform:translateX(-24px);animation:vtm-slide .8s cubic-bezier(.2,.7,.2,1) forwards}",
".vtm-ent.threat{border-left-color:var(--vtm-blood)}.vtm-ent.unknown{border-left-color:var(--text-muted)}",
".vtm-ent .se{flex:none;width:52px;height:52px;border-radius:50%;border:1.5px solid var(--vtm-brass);display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-weight:600;font-size:18px;color:var(--vtm-brass)}",
".vtm-ent.threat .se{border-color:var(--vtm-blood);color:var(--vtm-blood)}.vtm-ent.unknown .se{border-color:var(--text-muted);color:var(--text-muted)}",
".vtm-ent .pt{flex:none;width:76px;margin:2px 0}",
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
".vtm-phone .en{display:flex;align-items:center;justify-content:center;gap:4px;font-size:11px;color:#8a8a8e;margin:2px 0 0;letter-spacing:.02em}",
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
 if(sc.status&&window.VTMStatus){var st={};for(var k in sc.status)st[k]=sc.status[k];if(!st.change)st.change={trait:'',note:''};try{window.VTMStatus(st,mount.querySelector('.vtm-st'));}catch(e){mount.querySelector('.st').style.display='none';}}
};

window.VTMEntrance=function(people,mount){
 setup();mount=mountOf(mount);people=[].concat(people||[]);
 mount.innerHTML=sr('Arriving: '+people.map(function(p){return p.name;}).join(', '))+'<div class="vtm-wrap">'+people.map(function(p,i){
  var tone=p.tone==='threat'||p.tone==='unknown'?p.tone:'';
  var ini=p.initials||(tone==='unknown'?'?':String(p.name||'?').charAt(0));
  return '<div class="vtm-ent '+tone+'" style="animation-delay:'+(0.1+i*0.6).toFixed(1)+'s">'+((p.portrait||p.frame)&&window.VTMPortrait?'<div class="pt">'+window.VTMPortrait(p.portrait||'hooded',p.frame||'unknown',76)+'</div>':'<div class="se">'+esc(ini)+'</div>')+'<div><div class="nm">'+esc(p.name)+'</div>'+(p.title?'<div class="tt">'+esc(p.title)+'</div>':'')+(p.look?'<div class="lk">'+esc(p.look)+'</div>':'')+'</div></div>';
 }).join('')+'</div>';
};

function textThread(d){
 var name=d.contact||'Unknown';var ini=(d.initial||name.charAt(0)).toUpperCase();
 var html='<div class="vtm-phone"><div class="hd"><div class="av">'+esc(ini)+'</div><div class="cn">'+esc(name)+'</div></div><div class="ms">'+(d.encrypted===false?'':'<div class="en"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Encrypted</div>')+(d.time?'<div class="ts">'+esc(d.time)+'</div>':'');
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

/* Cameo portraits: VTMPortrait(id, frame, size) */
(function(){
var INK='#16120f',DET='#5a5048',CREAM='#ece3cf',PEARL='#f4efe4';
var F_HEAD='M37 99 C38 92 39 86 39 81 C31 75 30 59 33 47 C37 35 47 30 56 31 C63 33 66 39 66 45 L67 50 C67 53 68 55 72 59 C73 61 71 62 68 62 L69 65 L67 67 L68 69 C68 72 67 75 65 77 C62 79 59 79 57 80 L58 99 Z';
var M_HEAD='M36 99 C37 92 38 86 38 81 C30 75 29 58 32 46 C36 33 47 28 57 30 C64 32 67 38 67 44 L69 49 C69 52 70 54 75 59 C76 61 74 63 70 63 L71 66 L69 68 L70 70 C70 74 70 77 67 79 C63 81 60 81 58 82 L60 99 Z';
var F_BODY='M12 131 C14 113 24 103 37 99 L58 99 C72 101 84 111 88 131 Z';
var M_BODY='M6 131 C8 110 21 101 36 98 L60 98 C76 100 90 109 94 131 Z';
function p(d,f,extra){return '<path d="'+d+'" fill="'+(f||INK)+'"'+(extra||'')+'/>';}
function s(d,c,w){return '<path d="'+d+'" fill="none" stroke="'+(c||DET)+'" stroke-width="'+(w||1.2)+'" stroke-linecap="round"/>';}
function c(x,y,r,f){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(f||PEARL)+'"/>';}
var LAPELS=s('M48 100 L56 118 L62 106')+s('M60 99 L64 106');
var WIDE_LAPELS=s('M46 99 L57 122 L66 104')+s('M61 98 L68 104 L66 104');
var P={
 anika:function(){return p(F_BODY)+p(F_HEAD)+p('M33 47 C34 34 46 28 57 30 C65 32 68 38 67 46 C64 42 60 41 57 43 C52 46 48 52 46 60 C44 64 40 66 37 66 C34 62 32 55 33 47 Z')+s('M40 36 C46 34 52 36 56 38')+s('M38 44 C44 41 50 43 54 46')+LAPELS+p('M27 108 L33 104 L36 112 L30 116 Z',PEARL)+p('M30.5 109 L31.5 111',INK);},
 gabrielle:function(){return p(F_BODY)+p(F_HEAD)+p('M31 66 C25 58 26 42 34 34 C42 27 55 26 63 32 C68 36 68 42 66 46 C62 40 56 39 53 42 C56 44 55 48 52 49 C49 50 47 54 46 58 C44 64 40 70 34 70 C32 69 31 68 31 66 Z')+s('M33 40 C37 37 41 39 45 36 C49 33 53 35 57 33',DET,1)+s('M30 50 C34 47 38 49 42 46',DET,1)+s('M30 60 C33 57 37 59 40 56',DET,1)+c(48,70,1.8)+c(48,74,1.4)+[[47,85],[50,87],[53,88],[56,88],[59,87]].map(function(q){return c(q[0],q[1],1.3);}).join('')+WIDE_LAPELS;},
 victor:function(){return p(M_BODY)+p(M_HEAD)+p('M10 44 C20 46 34 45 48 43 C62 41 78 39 88 34 C86 40 78 44 66 46 C52 48 34 50 20 49 C15 48 11 47 10 44 Z')+p('M32 44 C30 34 34 22 42 20 C47 19 49 23 52 22 C56 21 58 18 62 20 C68 24 68 34 66 42 Z')+s('M36 38 C46 36 56 36 65 36','#7a6a55',2)+p('M38 50 C42 58 42 70 40 80 C36 76 33 66 34 56 Z')+s('M60 86 L58 104')+s('M64 86 L62 104')+'<ellipse cx="61" cy="88" rx="3" ry="2.4" fill="#5b8f8a" stroke="'+PEARL+'" stroke-width=".8"/>'+WIDE_LAPELS;},
 gary:function(){return p('M4 131 C6 104 18 94 34 92 L62 96 C78 100 90 110 94 131 Z')+p('M35 96 C37 90 37 84 37 79 C29 73 30 58 33 47 C36 36 47 30 57 31 C64 33 67 40 67 46 L69 50 C70 54 74 58 77 64 C78 67 75 68 71 66 L71 69 L69 71 C69 75 68 78 65 80 C62 82 59 82 57 83 L60 97 Z')+p('M38 58 L30 46 L40 54 Z')+p('M14 44 C24 46 40 45 56 43 C66 42 76 41 84 38 C82 43 74 46 64 47 C50 49 32 50 20 49 C16 48 14 46 14 44 Z')+p('M30 45 C28 34 31 24 40 21 C46 19 50 24 54 21 C60 19 66 24 66 34 C66 38 66 41 65 44 Z')+s('M33 39 L64 37','#6e655a',2.5)+[20,26,72,78,84].map(function(x){return s('M'+x+' 108 L'+(x+1)+' 131','#3a332c',.8);}).join('')+s('M48 99 L56 118 L62 106')+c(84,106,3.5,'#b8a67a')+s('M84 110 L82 131','#b8a67a',2);},
 elise:function(){return p(F_BODY)+p(F_HEAD)+p('M28 60 C20 46 24 24 40 16 C52 10 66 14 70 24 C73 31 70 38 66 42 C62 38 57 38 54 41 C50 45 47 52 45 58 C43 64 40 68 35 68 C31 67 29 64 28 60 Z')+s('M36 22 C44 18 54 18 62 22',DET,1)+c(48,72,1.3)+'<rect x="47.2" y="73" width="1.6" height="7" rx=".8" fill="'+PEARL+'"/>'+c(48,81,1.8)+s('M46 101 L52 112 L58 101',DET,1)+s('M60 100 C64 104 66 110 66 116',DET,1);},
 celeste:function(){var b='M27 72 C18 70 17 60 21 56 C15 50 18 40 24 38 C22 30 30 23 37 25 C40 18 50 17 54 22 C60 18 68 22 68 30 C72 34 70 40 67 44 C63 40 58 40 55 42 C52 46 49 52 47 58 C45 64 42 70 38 74 C34 77 29 76 27 72 Z';return p(F_BODY)+p(F_HEAD)+p(b)+s('M56 47 C59 44 64 44 67 46 L70 43')+s('M56 47 L52 47',DET,1)+'<ellipse cx="45" cy="74" rx="3.2" ry="4" fill="none" stroke="'+PEARL+'" stroke-width="1"/>'+s('M44 102 L50 116 L58 101',DET,1);},
 idris:function(){return p(M_BODY)+p(M_HEAD)+p('M33 49 C33 36 44 29 55 30 C62 31 66 35 67 41 C62 38 56 38 50 40 C45 42 41 46 39 52 C37 55 35 55 33 49 Z')+p('M50 70 C54 72 56 76 58 80 C62 80 66 79 69 76 C70 72 70 70 70 70 L68 72 C64 73 60 73 56 71 C54 69 51 68 50 70 Z')+p('M36 92 L38 82 L62 84 L64 94 Z')+s('M38 88 L63 90',DET,1)+s('M50 98 L50 131',DET,1);},
 leanne:function(){return p(F_BODY)+p(F_HEAD)+p('M30 72 C26 58 27 42 33 35 C40 28 54 26 62 31 C67 34 68 39 67 43 L58 43 C54 44 52 46 52 50 L48 72 Z')+'<circle cx="61" cy="50" r="4" fill="none" stroke="'+DET+'" stroke-width="1.1"/>'+s('M57 50 L49 49',DET,1)+p('M37 99 L48 99 L56 126 L46 131 L30 131 L33 110 Z',CREAM,' opacity=".85"')+p('M58 99 L70 101 L72 112 L62 120 Z',CREAM,' opacity=".85"');},
 esteban:function(){return p(M_BODY)+p(M_HEAD)+p('M31 62 C27 50 30 36 40 31 C48 27 58 28 64 33 C66 36 66 39 64 40 C58 37 52 37 46 39 C42 41 38 46 37 52 C36 58 34 62 31 62 Z')+s('M40 33 C48 31 56 32 62 35',DET,1)+p('M66 64 C70 63 74 64 76 67 C73 67 70 67 68 66 Z')+p('M40 96 L42 84 L60 86 L64 96 Z',PEARL)+p('M52 92 L58 92 L56 104 L54 104 Z',DET);},
 lucia:function(){return p(F_BODY)+p(F_HEAD)+p('M31 64 C26 52 28 38 37 33 C46 28 58 29 64 35 C60 37 54 38 50 42 C47 46 46 52 44 58 C41 63 36 66 31 64 Z')+c(30,52,7,INK)+p('M28 34 C32 22 52 18 66 26 C70 28 74 32 76 30 C74 36 66 37 60 35 C50 32 40 32 28 34 Z')+'<path d="M64 30 C72 34 78 46 77 60 C76 66 73 70 70 72 L66 60 Z" fill="'+INK+'" opacity=".55"/>'+s('M66 34 L74 62',DET,.6)+s('M70 32 L77 52',DET,.6)+s('M44 101 L50 114 L56 101',DET,1);},
 rook:function(){return p(M_BODY)+p(M_HEAD)+p('M38 84 C30 82 24 74 24 64 C22 54 26 40 34 34 C42 27 56 26 63 32 C68 36 68 40 66 44 C61 40 55 40 51 43 C48 46 46 50 44 54 C42 62 42 70 40 78 Z')+s('M27 70 L24 78',INK,2.2)+s('M30 74 L28 82',INK,2.2)+c(47,66,1.3,'#c9c3b5')+p('M30 96 L40 86 L48 104 L36 110 Z')+p('M58 86 L68 92 L66 106 L58 100 Z')+s('M40 87 L48 104 L36 110 Z',DET,1)+s('M60 88 L67 93 L66 105',DET,1)+s('M50 100 L54 131',DET,1.2);},
 don:function(){return p(M_BODY)+p(M_HEAD)+p('M33 52 C32 44 34 38 38 36 C40 40 41 46 40 52 Z')+p('M38 36 C42 33 46 33 48 34 C46 36 44 37 42 38 Z')+'<rect x="56" y="47" width="9" height="6" rx="2" fill="none" stroke="'+DET+'" stroke-width="1.2"/>'+s('M56 49 L45 48',DET,1)+p('M48 98 L56 112 L52 98 Z',PEARL)+p('M58 97 L68 112 L62 98 Z',PEARL)+s('M53 99 L57 112 L61 99',DET,1);},
 gerard:function(){return p(M_BODY)+p(M_HEAD)+p('M32 54 C30 42 36 32 46 30 C54 28 62 30 66 36 C66 39 64 40 60 39 L50 39 C45 40 41 44 39 50 C38 54 35 56 32 54 Z')+s('M52 31 L58 39',CREAM,.8)+p('M52 88 L58 85 L58 93 L52 90 L46 93 L46 85 Z',PEARL)+c(52,89,1.2,INK)+p('M44 94 L48 98 L56 98 L60 94 L58 104 L46 104 Z',PEARL,' opacity=".9"')+s('M42 98 L50 124',DET,1.2)+s('M62 98 L56 124',DET,1.2);},
 frank:function(){return p(M_BODY)+p(M_HEAD)+p('M33 50 C33 38 42 30 52 29 C60 28 66 31 70 37 C66 38 62 37 58 38 C50 39 44 41 40 46 C38 50 36 54 33 50 Z')+s('M44 33 C52 31 60 32 68 36',DET,1)+p('M44 98 L52 108 L60 98 Z',PEARL)+p('M14 131 C16 116 24 106 36 101 L48 116 L46 131 Z','#2a2420')+p('M62 101 C74 104 82 114 86 131 L60 131 L58 116 Z','#2a2420')+s('M38 103 L48 116 L46 131',DET,1.3)+s('M60 103 L58 116 L60 131',DET,1.3);},
 bobby:function(){return p('M2 131 C4 106 18 96 34 93 L62 95 C80 98 94 108 98 131 Z')+p('M34 97 C35 90 36 84 36 78 C29 72 29 58 32 47 C35 36 46 31 56 32 C63 34 66 39 67 45 L69 50 C69 53 70 55 74 59 C75 61 73 63 70 63 L71 66 L69 68 L70 70 C70 74 70 78 67 80 C63 82 60 82 58 83 L60 98 Z')+s('M34 44 C40 36 50 33 60 34',DET,1)+s('M37 41 L40 39 M42 37 L45 36 M48 35 L51 35',DET,.8)+c(43,58,2.4,'#c9c3b5')+s('M43 60 C40 66 38 72 40 80 C42 86 40 92 38 96','#c9c3b5',1)+s('M48 97 L55 110 L62 97',DET,1.2)+s('M55 110 L55 131',DET,1);},
 dana:function(){return p(F_BODY)+p(F_HEAD)+p('M33 52 C32 40 40 31 50 30 C58 29 64 32 67 38 C62 37 56 38 52 41 C48 44 44 50 42 56 C40 58 35 58 33 52 Z')+p('M34 50 C28 52 22 58 20 68 C19 74 22 80 26 82 C26 76 27 70 30 66 C33 62 36 58 36 54 Z')+c(33,51,2.2,DET)+s('M44 100 L52 116 L60 100',DET,1.2)+s('M60 100 L66 104 L64 108',DET,1)+'<rect x="40" y="112" width="6" height="4" rx="1" fill="#b8a67a"/>';},
 'generic-f':function(){return p(F_BODY)+p(F_HEAD)+p('M31 62 C27 50 30 36 40 31 C48 28 58 29 64 35 C60 37 55 38 51 42 C48 46 46 52 44 58 C41 63 35 66 31 62 Z');},
 'generic-m':function(){return p(M_BODY)+p(M_HEAD)+p('M32 52 C31 40 40 31 50 30 C58 29 64 32 66 38 C60 37 54 38 50 41 C46 44 42 48 40 54 C38 57 34 57 32 52 Z')+LAPELS;},
 hooded:function(){return p('M4 131 C6 104 18 92 30 86 C24 70 24 46 34 32 C44 18 62 18 72 30 C80 40 82 58 78 76 C86 84 94 100 96 131 Z')+'<path d="M44 52 C50 44 62 44 70 52 C72 62 70 74 64 80 C56 82 48 78 44 70 Z" fill="#000"/>';}
};
var CLANS={ventrue:'#6b4fa8',toreador:'#b8476b',nosferatu:'#5f7a46',tremere:'#a3263d',malkavian:'#3b8f8f',banu:'#a47a24',lasombra:'#5d5d72',hecata:'#968f7c',brujah:'#b8552b',gangrel:'#86613a',ministry:'#3f8350',ravnos:'#c4902a',tzimisce:'#8f5a70',salubri:'#bfa660',caitiff:'#8a8a8a',thinblood:'#8a8a8a',ghoul:'#b08d57',mortal:'#8c8c8c',unknown:'#777777'};
var GOLD='#c9a24a';
function ring(n,fn){var o='';for(var i=0;i<n;i++){var a=i/n*Math.PI*2;fn&&(o+=fn(50+42*Math.sin(a),65-56*Math.cos(a),a));}return o;}
var ORN={
 ventrue:function(k){return '<path d="M38 11 L37 1 L43.5 6 L50 -3 L56.5 6 L63 1 L62 11 Z" fill="'+GOLD+'" stroke="'+k+'" stroke-width="1"/>'+c(37,1,1.6,GOLD)+c(50,-3,1.8,GOLD)+c(63,1,1.6,GOLD)+c(50,7,1.4,k);},
 toreador:function(k){return '<circle cx="50" cy="7" r="7" fill="'+k+'"/>'+s('M50 7 m-4 0 a4 4 0 1 1 4 4 a2.5 2.5 0 1 1 -2 -3',PEARL,.9)+'<path d="M42 10 C37 8 34 11 33 14 C37 14 40 13 42 10 Z M58 10 C63 8 66 11 67 14 C63 14 60 13 58 10 Z" fill="#4c6b3a"/>'+ring(14,function(x,y,a){if(Math.abs(Math.sin(a))<.3)return '';var dx=Math.sin(a),dy=-Math.cos(a)*56/42;var L=Math.hypot(dx,dy);dx/=L;dy/=L;return '<path d="M'+(x-dy*2).toFixed(1)+' '+(y+dx*2).toFixed(1)+' L'+(x+dx*5).toFixed(1)+' '+(y+dy*5).toFixed(1)+' L'+(x+dy*2).toFixed(1)+' '+(y-dx*2).toFixed(1)+' Z" fill="'+k+'"/>';});},
 nosferatu:function(k){return ring(16,function(x,y){return c(x.toFixed(1),y.toFixed(1),1.7,'#3a3f33')+'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="1.7" fill="none" stroke="'+k+'" stroke-width=".7"/>';})+'<path d="M44 128 L56 128 L58 134 L42 134 Z" fill="'+k+'"/>'+s('M46 129 L46 133 M50 129 L50 133 M54 129 L54 133','#2a2e25',1);},
 tremere:function(k){var g=['M0 -3 L0 3 M-2 -1 L2 1','M-2 -3 L2 3 M2 -3 L-2 3','M0 -3 L0 3 M-2 0 L2 0','M-2 -3 L0 3 L2 -3'];return ring(12,function(x,y,a){if(Math.abs(Math.cos(a))>.97)return '';return '<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')">'+s(g[Math.round(a*7)%4],k,1.1)+'</g>';})+'<path d="M50 -4 L54 6 L50 16 L46 6 Z" fill="'+k+'"/>'+c(50,6,2,PEARL);},
 malkavian:function(k){return '<path d="M38 6 C44 -2 56 -2 62 6 C56 14 44 14 38 6 Z" fill="'+PEARL+'" stroke="'+k+'" stroke-width="1.6"/>'+c(51,6,3.6,k)+c(51,6,1.6,'#111');},
 banu:function(k){return '<path d="M43 -1 A9 9 0 1 0 57 -1 A7 7 0 1 1 43 -1 Z" fill="'+k+'"/>'+'<path d="M50 120 L52 128 L50 137 L48 128 Z" fill="'+k+'"/>'+s('M45 124 L55 124',k,1.6);},
 lasombra:function(k){return s('M14 104 C6 96 10 86 4 78 C2 72 6 66 4 60',k,2.2)+s('M86 104 C94 96 90 86 96 78 C98 72 94 66 96 60',k,2.2)+s('M30 122 C24 128 18 126 14 132',k,2)+s('M70 122 C76 128 82 126 86 132',k,2)+s('M40 9 C44 3 48 6 50 0 C52 6 56 3 60 9',k,2);},
 hecata:function(k){return '<path d="M43 124 C43 117 57 117 57 124 C57 128 55 129 55 131 L45 131 C45 129 43 128 43 124 Z" fill="'+PEARL+'" stroke="'+k+'" stroke-width="1"/>'+c(47,124,1.7,'#222')+c(53,124,1.7,'#222')+s('M48 131 L48 133 M50 131 L50 133 M52 131 L52 133',k,.8)+s('M40 8 C44 4 48 8 50 4 C52 8 56 4 60 8',k,1.4);},
 brujah:function(k){return '<ellipse cx="41" cy="6" rx="5" ry="3.2" fill="none" stroke="'+k+'" stroke-width="2"/><ellipse cx="50" cy="6" rx="5" ry="3.2" fill="none" stroke="'+k+'" stroke-width="2"/>'+s('M57 3 C61 3 63 5 63 7',k,2)+s('M64 9 C64 11 61 11 59 9',k,2);},
 gangrel:function(k){return s('M84 48 L94 66',k,2)+s('M82 54 L92 72',k,2)+s('M80 60 L89 77',k,2);},
 ministry:function(k){return s('M12 100 C2 90 12 80 4 70 C-2 60 8 50 4 40 C2 30 14 18 22 16',k,2.6)+'<path d="M20 12 L28 15 L21 20 Z" fill="'+k+'"/>';},
 ravnos:function(k){return ring(1,function(){return '';})+'<path d="M50 -4 L53 4 L61 3 L55 8 L58 15 L50 11 L42 15 L45 8 L39 3 L47 4 Z" fill="'+k+'"/>';},
 tzimisce:function(k){return ring(14,function(x,y,a){var dx=Math.sin(a),dy=-Math.cos(a)*56/42;var L=Math.hypot(dx,dy);dx/=L;dy/=L;return '<path d="M'+(x-dy*1.8).toFixed(1)+' '+(y+dx*1.8).toFixed(1)+' L'+(x+dx*6).toFixed(1)+' '+(y+dy*6).toFixed(1)+' L'+(x+dy*1.8).toFixed(1)+' '+(y-dx*1.8).toFixed(1)+' Z" fill="'+k+'"/>';});},
 salubri:function(k){return '<path d="M50 -6 C56 0 56 12 50 18 C44 12 44 0 50 -6 Z" fill="'+PEARL+'" stroke="'+k+'" stroke-width="1.5"/>'+c(50,6,2.6,k);},
 ghoul:function(k){return '<path d="M50 -3 C53 3 56 6 56 9 A6 6 0 0 1 44 9 C44 6 47 3 50 -3 Z" fill="#8e1b1b"/>';}
};
window.VTMPortrait=function(id,frame,size){
 var k=CLANS[frame]||CLANS.unknown,u='vp'+Math.random().toString(36).slice(2,8);
 var body=(P[id]||P['generic-'+(id==='f'?'f':'m')]||P.hooded)();
 var dash=frame==='unknown'?' stroke-dasharray="3 3"':'';
 var tilt=frame==='malkavian'?' transform="rotate(-4 50 65)"':'';
 return '<svg viewBox="-8 -10 116 150" width="'+(size||84)+'" height="'+Math.round((size||84)*150/116)+'" aria-hidden="true" style="display:block;overflow:visible"><defs><clipPath id="'+u+'"><ellipse cx="50" cy="65" rx="39" ry="53"/></clipPath></defs><g'+tilt+'>'+'<ellipse cx="50" cy="65" rx="42" ry="56" fill="'+CREAM+'" stroke="'+k+'" stroke-width="4"'+dash+'/>'+'<g clip-path="url(#'+u+')"><g transform="translate(50 80) scale(1.14) translate(-50 -76)">'+body+'</g></g>'+'<ellipse cx="50" cy="65" rx="39" ry="53" fill="none" stroke="'+k+'" stroke-width="1" opacity=".7"/>'+(ORN[frame]?ORN[frame](k):'')+'</g></svg>';
};
window.VTMPortrait.clans=CLANS;window.VTMPortrait.people=Object.keys(P);
})();

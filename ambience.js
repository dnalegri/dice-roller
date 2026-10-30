/* Scene music: VTMAmbience.play(name), .stop(), .names, .playing()

   Routing. A scene's `ambience` name picks a row in TRACKS. scenes.js AMB must list the same
   names: it holds the button label, and a scene shows no music button for a name it lacks.
     casino   'Casino floor'      audio/casino-1..3.mp3
     haven    'The haven'         audio/haven-1..3.mp3
     velvet   'The Velvet Room'   audio/velvet-1..3.mp3
     desert   'Desert night'      audio/desert-1..3.mp3
     sewers   'The sewers'        audio/sewers-1..3.mp3
     elysium  'Elysium'           audio/elysium-1..3.mp3
     lounge   alias of haven (ALIAS), so older saves still play
   A scene plays its tracks in shuffled order and crossfades between them.
   Track rows: [file, music starts (s), music ends (s), gain]. Start and end skip the quiet
   intros and fade-outs the generator added; gain evens out loudness. Measured with librosa. */
(function(){
var BASE=((document.currentScript&&document.currentScript.src)||'').replace(/ambience\.js.*$/,'')+'audio/';
var TRACKS={
 casino:[['casino-1.mp3',12.2,120.0,0.88],['casino-2.mp3',25.8,115.7,0.87],['casino-3.mp3',13.6,112.4,0.54]],
 haven:[['haven-1.mp3',0.3,108.0,0.60],['haven-2.mp3',13.5,111.5,0.75],['haven-3.mp3',0.0,116.7,0.59]],
 velvet:[['velvet-1.mp3',0.0,119.8,0.57],['velvet-2.mp3',13.5,109.9,0.56],['velvet-3.mp3',6.2,119.1,0.90]],
 desert:[['desert-1.mp3',13.5,120.0,0.59],['desert-2.mp3',0.0,114.4,0.47],['desert-3.mp3',0.0,120.0,1.00]],
 sewers:[['sewers-1.mp3',29.4,120.0,0.73],['sewers-2.mp3',0.0,117.9,0.53],['sewers-3.mp3',11.4,120.0,0.83]],
 elysium:[['elysium-1.mp3',27.9,114.1,0.65],['elysium-2.mp3',0.0,119.8,0.59],['elysium-3.mp3',0.0,118.2,0.71]]
};
var ALIAS={lounge:'haven'};
var XF=4,A=null,P=null,cur=null,chan=null,id=Math.random().toString(36).slice(2);
try{chan=new BroadcastChannel('vtm-ambience');chan.onmessage=function(e){if(e.data&&e.data.from!==id&&e.data.type==='play')stop();};}catch(e){}
/* Safari only lets an audio player make sound if a tap started it, so the whole rotation reuses two players
   that the first tap unlocks. scenes.js unlocks them the same way (VTMAudioKit) when the tap comes before this file has loaded. */
var SILENT='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
function kit(){var C=window.AudioContext||window.webkitAudioContext,k={ctx:new C(),els:[new Audio(),new Audio()]};k.els.forEach(function(el){el.crossOrigin='anonymous';el.src=SILENT;el.play().catch(function(){});});return k;}
function setup(){if(!P){var k=window.VTMAudioKit||(window.VTMAudioKit=kit());A=k.ctx;
  P=k.els.map(function(el){var g=A.createGain();g.gain.value=0;A.createMediaElementSource(el).connect(g);g.connect(A.destination);el.preload='auto';return {el:el,g:g,busy:false,t:0};});}
 if(A.state==='suspended')A.resume();}
function ramp(g,to,sec){var t=A.currentTime;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);g.gain.linearRampToValueAtTime(to,t+sec);}
function shuffle(a,avoid){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}if(a.length>1&&a[0]===avoid)a.push(a.shift());return a;}
function quiet(el){el.onplaying=el.ontimeupdate=el.onended=el.onerror=null;}
function release(p){clearTimeout(p.t);quiet(p.el);p.busy=false;ramp(p.g,0,0);p.el.pause();p.el.removeAttribute('src');p.el.load();}
function fadeOut(p,sec){quiet(p.el);ramp(p.g,0,sec);clearTimeout(p.t);p.t=setTimeout(function(){release(p);},sec*1000+100);}
/* shortcut: the next track starts loading only at the crossfade, so a slow connection hears a short dip; preload it a few seconds early if that shows up */
function next(c,fadeSec){if(cur!==c)return;if(!c.queue.length)c.queue=shuffle(c.list.slice(),c.last);
 var tr=c.last=c.queue.shift(),p=!P[0].busy?P[0]:!P[1].busy?P[1]:P[0],el=p.el,done=false,live=false;
 release(p);p.busy=true;
 function handOff(failed){if(done)return;done=true;fadeOut(p,failed?0:XF);if(failed&&++c.fails>=c.list.length){if(cur===c)cur=null;return;}next(c,failed?fadeSec:XF);}
 el.onplaying=function(){if(live)return;live=true;c.fails=0;ramp(p.g,tr[3],fadeSec);};
 el.ontimeupdate=function(){if(el.currentTime>=tr[2]-XF)handOff(false);};
 el.onended=function(){handOff(false);};
 el.onerror=function(){handOff(true);};
 el.src=BASE+tr[0]+'#t='+tr[1];el.play().catch(function(){});}
function stop(){if(!cur)return;cur=null;P.forEach(function(p){if(p.busy)fadeOut(p,1.5);});}
function play(name){var list=TRACKS[ALIAS[name]||name];if(!list)return false;stop();setup();
 var c={name:name,list:list,queue:[],fails:0,last:null};cur=c;next(c,2.5);
 try{chan&&chan.postMessage({type:'play',from:id});}catch(e){}return true;}
window.VTMAmbience={play:play,stop:stop,tracks:TRACKS,names:Object.keys(TRACKS).concat(Object.keys(ALIAS)),playing:function(){return cur&&cur.name;}};
})();

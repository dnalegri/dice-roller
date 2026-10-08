
/* Ambient soundscapes: VTMAmbience.play(name), .stop(), .names */
(function(){
var A=null,cur=null,chan=null,id=Math.random().toString(36).slice(2);
try{chan=new BroadcastChannel('vtm-ambience');chan.onmessage=function(e){if(e.data&&e.data.from!==id&&e.data.type==='play')stop();};}catch(e){}
function ctx(){var C=window.AudioContext||window.webkitAudioContext;var a=new C();if(a.state==='suspended')a.resume();return a;}
function noiseBuf(a,sec,kind){var n=Math.floor(a.sampleRate*sec),b=a.createBuffer(2,n,a.sampleRate);for(var ch=0;ch<2;ch++){var d=b.getChannelData(ch),l=0,b0=0,b1=0,b2=0;for(var i=0;i<n;i++){var w=Math.random()*2-1;if(kind==='brown'){l=(l+0.02*w)/1.02;d[i]=l*3.5;}else if(kind==='pink'){b0=0.997*b0+w*0.029591;b1=0.985*b1+w*0.032534;b2=0.95*b2+w*0.048056;d[i]=(b0+b1+b2+w*0.05)*0.6;}else d[i]=w;}}return b;}
function noise(a,kind,out){var s=a.createBufferSource();s.buffer=noiseBuf(a,4,kind);s.loop=true;s.connect(out);s.start();return s;}
function verb(a,sec,decay){var n=Math.floor(a.sampleRate*sec),b=a.createBuffer(2,n,a.sampleRate);for(var ch=0;ch<2;ch++){var d=b.getChannelData(ch);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,decay);}var c=a.createConvolver();c.buffer=b;return c;}
function filt(a,type,f,q){var x=a.createBiquadFilter();x.type=type;x.frequency.value=f;if(q)x.Q.value=q;return x;}
function gain(a,v){var g=a.createGain();g.gain.value=v;return g;}
function lfo(a,rate,depth,target){var o=a.createOscillator(),g=gain(a,depth);o.frequency.value=rate;o.connect(g);g.connect(target);o.start();return o;}
function every(lo,hi,fn,S){(function tick(){if(!S.on)return;fn();S.t.push(setTimeout(tick,lo+Math.random()*(hi-lo)));})();}
function ping(a,out,f,t,dur,vol,type){var o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+0.008);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(out);o.start(t);o.stop(t+dur+0.05);}
function burst(a,out,t,dur,vol,f,q){var s=a.createBufferSource();s.buffer=noiseBuf(a,dur+0.05,'white');var b=filt(a,'bandpass',f,q||1),g=a.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(b);b.connect(g);g.connect(out);s.start(t);}

function mtof(m){return 440*Math.pow(2,(m-69)/12);}
function seq(a,S,bpm,div,fn){var spb=60/bpm/div,next=a.currentTime+0.15,i=0;var iv=setInterval(function(){if(!S.on){clearInterval(iv);return;}while(next<a.currentTime+0.2){fn(i,next,spb);i++;next+=spb;}},25);S.t.push(iv);}
function env(a,t,peak,att,dec){var g=a.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(peak,t+att);g.gain.exponentialRampToValueAtTime(0.0001,t+att+dec);return g;}
function nsrc(a,t,dur){var s=a.createBufferSource();s.buffer=noiseBuf(a,dur+0.05,'white');s.start(t);s.stop(t+dur+0.05);return s;}
function kick(a,out,t,v){var o=a.createOscillator(),g=env(a,t,v,0.003,0.35);o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+0.12);o.connect(g);g.connect(out);o.start(t);o.stop(t+0.45);}
function snare(a,out,t,v,brush){var s=nsrc(a,t,brush?0.3:0.22),b=filt(a,brush?'highpass':'bandpass',brush?2200:1900,brush?0.5:0.8),g=env(a,t,v,brush?0.02:0.002,brush?0.24:0.17);s.connect(b);b.connect(g);g.connect(out);if(!brush){var o=a.createOscillator(),og=env(a,t,v*0.5,0.002,0.08);o.type='triangle';o.frequency.setValueAtTime(200,t);o.frequency.exponentialRampToValueAtTime(150,t+0.08);o.connect(og);og.connect(out);o.start(t);o.stop(t+0.12);}}
function hat(a,out,t,v,open){var s=nsrc(a,t,open?0.3:0.06),b=filt(a,'highpass',7500),g=env(a,t,v,0.001,open?0.25:0.035);s.connect(b);b.connect(g);g.connect(out);}
function ride(a,out,t,v){var s=nsrc(a,t,0.5),b=filt(a,'bandpass',8200,1.2),g=env(a,t,v,0.001,0.42);s.connect(b);b.connect(g);g.connect(out);[1,1.483,1.932].forEach(function(r){var o=a.createOscillator(),og=env(a,t,v*0.12,0.001,0.3);o.type='square';o.frequency.value=3150*r;var hp=filt(a,'highpass',5000);o.connect(hp);hp.connect(og);og.connect(out);o.start(t);o.stop(t+0.35);});}
function pluck(a,out,f,t,dur,v){var o=a.createOscillator(),o2=a.createOscillator(),lp=filt(a,'lowpass',900,1),g=a.createGain();o.type='triangle';o.frequency.value=f;o2.frequency.value=f*2;var g2=gain(a,0.25);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+0.012);g.gain.exponentialRampToValueAtTime(v*0.35,t+0.18);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);lp.frequency.setValueAtTime(1400,t);lp.frequency.exponentialRampToValueAtTime(400,t+0.25);o.connect(lp);o2.connect(g2);g2.connect(lp);lp.connect(g);g.connect(out);o.start(t);o2.start(t);o.stop(t+dur+0.05);o2.stop(t+dur+0.05);}
function brass(a,out,f,t,dur,v){var lp=filt(a,'lowpass',500,2),g=a.createGain(),vib=a.createOscillator(),vg=gain(a,0);vib.frequency.value=5.6;vib.connect(vg);vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(f*0.012,t+Math.min(dur,0.5));
 [-6,6].forEach(function(d){var o=a.createOscillator();o.type='sawtooth';o.frequency.value=f;o.detune.value=d;vg.connect(o.frequency);o.connect(lp);o.start(t);o.stop(t+dur+0.15);});
 lp.frequency.setValueAtTime(400,t);lp.frequency.linearRampToValueAtTime(2600,t+0.06);lp.frequency.exponentialRampToValueAtTime(1500,t+0.25);
 g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+0.04);g.gain.setValueAtTime(v*0.8,t+Math.max(0.05,dur-0.06));g.gain.exponentialRampToValueAtTime(0.0001,t+dur+0.1);lp.connect(g);g.connect(out);vib.start(t);vib.stop(t+dur+0.15);}
function swell(a,out,f,t,dur,v){var lp=filt(a,'lowpass',300,1.5),g=a.createGain();[-7,7].forEach(function(d){var o=a.createOscillator();o.type='sawtooth';o.frequency.value=f;o.detune.value=d;o.connect(lp);o.start(t);o.stop(t+dur+0.2);});lp.frequency.setValueAtTime(300,t);lp.frequency.linearRampToValueAtTime(2200,t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+dur);g.gain.exponentialRampToValueAtTime(0.0001,t+dur+0.18);lp.connect(g);g.connect(out);}
function keys(a,out,f,t,dur,v,trem){var o=a.createOscillator(),o2=a.createOscillator(),g=a.createGain(),g2=gain(a,0.18);o.frequency.value=f;o2.frequency.value=f*(trem?3.0:2);o2.connect(g2);g2.connect(g);o.connect(g);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+0.008);g.gain.exponentialRampToValueAtTime(v*0.45,t+0.35);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);var dst=g;if(trem){var tg=a.createGain(),l=a.createOscillator(),lg=gain(a,0.3);l.frequency.value=3.2;l.connect(lg);lg.connect(tg.gain);g.connect(tg);dst=tg;l.start(t);l.stop(t+dur+0.1);}dst.connect(out);o.start(t);o2.start(t);o.stop(t+dur+0.1);o2.stop(t+dur+0.1);}

function shaper(a,k){var w=a.createWaveShaper(),c=new Float32Array(512);for(var i=0;i<512;i++){var x=i/256-1;c[i]=Math.tanh(k*x)/Math.tanh(k);}w.curve=c;w.oversample='4x';return w;}
function gtr(a,out,ms,t,dur,v){var d=shaper(a,6),bp=filt(a,'bandpass',1000,0.7),lp=filt(a,'lowpass',2200),g=a.createGain();ms.forEach(function(m,k){[-9,9].forEach(function(dt){var o=a.createOscillator();o.type='sawtooth';o.frequency.value=mtof(m);o.detune.value=dt+k*2;var l=a.createOscillator(),lg=gain(a,4);l.frequency.value=0.3+Math.random()*0.4;l.connect(lg);lg.connect(o.detune);o.connect(d);o.start(t);o.stop(t+dur+0.3);l.start(t);l.stop(t+dur+0.3);});});d.connect(bp);bp.connect(lp);lp.connect(g);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+dur*0.45);g.gain.setValueAtTime(v,t+dur*0.75);g.gain.exponentialRampToValueAtTime(0.0001,t+dur+0.25);g.connect(out);}
function dread(a,out,ms,v){var g=gain(a,0),lp=filt(a,'lowpass',1400,0.5);ms.forEach(function(m,k){var o=a.createOscillator();o.type=k?'sine':'triangle';o.frequency.value=mtof(m);o.detune.value=(k%2?5:-5);o.connect(lp);o.start();});lp.connect(g);g.connect(out);g.gain.linearRampToValueAtTime(v,a.currentTime+8);lfo(a,0.05,v*0.6,g.gain);return g;}
function dubThump(a,out,f,t,v){var o=a.createOscillator(),g=env(a,t,v,0.02,1.4);o.frequency.setValueAtTime(f*1.6,t);o.frequency.exponentialRampToValueAtTime(f,t+0.08);o.connect(g);g.connect(out);o.start(t);o.stop(t+1.6);}
var SC={
 casino:function(a,o,S){
  var mix=gain(a,0.85),tape=shaper(a,1.1),tl=filt(a,'lowpass',9000);mix.connect(tape);tape.connect(tl);tl.connect(o);
  var rv=verb(a,5.5,1.8),rg=gain(a,0.5);rv.connect(rg);rg.connect(o);
  function pp(){var L=a.createDelay(2),R=a.createDelay(2),fl=gain(a,0.45),fr=gain(a,0.45),mg=a.createChannelMerger(2),lp=filt(a,'lowpass',2600),inp=gain(a,1);var d=60/80*0.75;L.delayTime.value=d;R.delayTime.value=d;inp.connect(lp);lp.connect(L);L.connect(fl);fl.connect(R);R.connect(fr);fr.connect(L);L.connect(mg,0,0);R.connect(mg,0,1);var w=gain(a,0.6);mg.connect(w);w.connect(o);w.connect(rv);return inp;}
  var echo=pp();
  function chorus(dst){var inp=gain(a,1),mg=a.createChannelMerger(2);[0,1].forEach(function(ch){var d=a.createDelay(0.05);d.delayTime.value=0.014+ch*0.006;var l=a.createOscillator(),lg=gain(a,0.004);l.frequency.value=0.6+ch*0.17;l.connect(lg);lg.connect(d.delayTime);l.start();inp.connect(d);d.connect(mg,0,ch);inp.connect(mg,0,ch);});mg.connect(dst);return inp;}
  var choirBus=gain(a,1);choirBus.connect(rv);
  function choir(m,t,dur,v){var o1=a.createOscillator(),f1=filt(a,'bandpass',320,8),f2=filt(a,'bandpass',800,10),g=a.createGain(),vb=a.createOscillator(),vg=gain(a,4);o1.type='sawtooth';o1.frequency.value=mtof(m);vb.frequency.value=5;vb.connect(vg);vg.connect(o1.detune);o1.connect(f1);o1.connect(f2);var g2=gain(a,0.6);f1.connect(g);f2.connect(g2);g2.connect(g);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+dur*0.4);g.gain.linearRampToValueAtTime(0.0001,t+dur);var pn=a.createStereoPanner?a.createStereoPanner():gain(a,1);if(pn.pan)pn.pan.value=Math.random()*1.4-0.7;g.connect(pn);pn.connect(choirBus);o1.start(t);vb.start(t);o1.stop(t+dur+0.1);vb.stop(t+dur+0.1);}
  dread(a,rv,[64,65],0.006);
  var subx=shaper(a,1.3),slp=filt(a,'lowpass',340,0.8),sg=gain(a,0.8);subx.connect(slp);slp.connect(sg);sg.connect(mix);
  function bass(m,t,dur,v){var o1=a.createOscillator(),o2=a.createOscillator(),o3=a.createOscillator(),g=a.createGain(),g1=gain(a,0.35),g2=gain(a,0.7),g3=gain(a,0.3);o1.frequency.value=mtof(m-12);o2.frequency.value=mtof(m);o3.type='triangle';o3.frequency.value=mtof(m);o1.connect(g1);o2.connect(g2);o3.connect(g3);g1.connect(g);g2.connect(g);g3.connect(g);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+0.03);g.gain.setValueAtTime(v*0.9,t+dur*0.85);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);g.connect(subx);[o1,o2,o3].forEach(function(x){x.start(t);x.stop(t+dur+0.05);});}
  function bongo(t,hi,v,pan){var o1=a.createOscillator(),g=env(a,t,v,0.002,hi?0.12:0.18),f=hi?420:300;o1.frequency.setValueAtTime(f*1.3,t);o1.frequency.exponentialRampToValueAtTime(f,t+0.03);var s=nsrc(a,t,0.03),bp=filt(a,'bandpass',hi?2500:1800,2),sg=env(a,t,v*0.4,0.001,0.02);s.connect(bp);bp.connect(sg);var p=a.createStereoPanner?a.createStereoPanner():gain(a,1);if(p.pan)p.pan.value=pan;o1.connect(g);g.connect(p);sg.connect(p);p.connect(mix);var w=gain(a,0.25);p.connect(w);w.connect(rv);o1.start(t);o1.stop(t+0.25);}
  var cureIn=gain(a,1),cureLP=filt(a,'lowpass',2400,0.7);cureIn.connect(cureLP);var cho=chorus(mix);cureLP.connect(cho);var ce=gain(a,0.8);cureLP.connect(ce);ce.connect(echo);
  function pick(m,t,v){var o1=a.createOscillator(),o2=a.createOscillator(),g=a.createGain(),lp=filt(a,'lowpass',3000,2);o1.type='sawtooth';o2.type='square';o1.frequency.value=mtof(m);o2.frequency.value=mtof(m);o2.detune.value=7;var g2=gain(a,0.3);o2.connect(g2);g2.connect(lp);o1.connect(lp);lp.frequency.setValueAtTime(3200,t);lp.frequency.exponentialRampToValueAtTime(900,t+0.4);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+0.004);g.gain.exponentialRampToValueAtTime(v*0.3,t+0.25);g.gain.exponentialRampToValueAtTime(0.0001,t+0.9);lp.connect(g);g.connect(cureIn);o1.start(t);o2.start(t);o1.stop(t+1);o2.stop(t+1);}
  var wallBus=gain(a,1),whp=filt(a,'highpass',110),wd=shaper(a,8),cab1=filt(a,'lowpass',3300,0.7),cab2=filt(a,'peaking',1600,1),cab3=filt(a,'highpass',90);cab2.gain.value=4;wallBus.connect(whp);whp.connect(wd);wd.connect(cab3);cab3.connect(cab2);cab2.connect(cab1);var wout=gain(a,0.0);cab1.connect(wout);var wch=chorus(mix);wout.connect(wch);var wr=gain(a,0.4);wout.connect(wr);wr.connect(rv);
  function strum(ms,t,dur){ms.forEach(function(m,k){[-8,8].forEach(function(dt){var os=a.createOscillator(),g=a.createGain();os.type='sawtooth';os.frequency.value=mtof(m);os.detune.value=dt;g.gain.setValueAtTime(0.0001,t+k*0.015);g.gain.linearRampToValueAtTime(0.25,t+k*0.015+0.01);g.gain.setValueAtTime(0.22,t+dur-0.05);g.gain.linearRampToValueAtTime(0.0001,t+dur);os.connect(g);g.connect(wallBus);os.start(t);os.stop(t+dur+0.05);});});}
  function riser(t,dur){var s=nsrc(a,t,dur),hp=filt(a,'bandpass',400,1.2),g=a.createGain();hp.frequency.setValueAtTime(300,t);hp.frequency.exponentialRampToValueAtTime(6000,t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.09,t+dur);g.gain.linearRampToValueAtTime(0.0001,t+dur+0.02);s.connect(hp);hp.connect(g);g.connect(mix);var w=gain(a,0.6);g.connect(w);w.connect(rv);}
  function crash(t){var s=nsrc(a,t,2.5),hp=filt(a,'highpass',4500),g=env(a,t,0.08,0.002,2.2);s.connect(hp);hp.connect(g);g.connect(mix);var w=gain(a,0.5);g.connect(w);w.connect(rv);}
  function feedback(m,t,dur){var os=a.createOscillator(),g=a.createGain(),vb=a.createOscillator(),vg=gain(a,10);os.frequency.value=mtof(m);vb.frequency.value=5.5;vb.connect(vg);vg.connect(os.detune);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.018,t+dur*0.6);g.gain.linearRampToValueAtTime(0.0001,t+dur);os.connect(g);g.connect(rv);g.connect(echo);os.start(t);vb.start(t);os.stop(t+dur+0.1);vb.stop(t+dur+0.1);}
  var RIFF=[[0,40,6],[7,40,2],[10,43,4],[14,41,2],[16,40,7],[24,40,2],[26,38,3],[29,39,3]];
  var CURE=[64,71,67,71,66,71,67,71,64,71,67,71,62,69,66,69];
  var WALL=[[40,47,52],[40,47,52],[43,50,55],[41,48,53]];
  var BONG=[[0,0,.12,-.5],[3,1,.08,.5],[6,1,.1,.5],[8,0,.09,-.5],[11,1,.07,.5],[14,0,.1,-.5],[15,1,.06,.5]];
  seq(a,S,80,4,function(i,t,sp){var st=i%16,s32=i%32,bar=Math.floor(i/16),arc=bar%24,sw=(st%2)?sp*0.1:0,tt=t+sw,wall=arc>=16&&arc<22,bars=sp*16;
   if(arc<22||st<8){if(st===0||st===10||(st===3&&bar%2)||(wall&&st===8))kick(a,mix,tt,st===0?0.5:0.38);}
   if(st===4||st===12){if(arc<22){snare(a,mix,tt,0.2,false);var sr=gain(a,0.4);snare(a,sr,tt,0.2,false);sr.connect(rv);}if(arc>=8&&st===12&&bar%2){var sd=gain(a,0.4);snare(a,sd,tt,0.18,false);sd.connect(echo);}}
   if(arc>=2&&arc<22){if(st%2===0)hat(a,mix,tt,st%4===2?0.045:0.028,false);else if(wall||(arc>=8&&Math.random()<0.4))hat(a,mix,tt,0.016,false);}
   if(arc>=1)RIFF.forEach(function(r){if(r[0]===s32)bass(r[1]+(wall&&r[0]===0?0:0),tt,sp*r[2]*0.95,arc>=22?0.3:0.42);});
   if(arc>=4&&arc<16&&st%2===0)pick(CURE[(s32/2)|0],tt,0.05);
   if(arc>=6&&arc<22)BONG.forEach(function(b){if(b[0]===st)bongo(tt,b[1],b[2],b[3]);});
   if(arc===8&&st===0)choir(64,t,bars*4,0.03);if(arc===12&&st===0){choir(71,t,bars*4,0.025);choir(67,t,bars*4,0.02);}
   if(arc===12&&st===0)feedback(76,t,bars*4);
   if(arc===14&&st===0)riser(t,bars*2);
   if(arc===16&&st===0){crash(t);wout.gain.cancelScheduledValues(t);wout.gain.setValueAtTime(0.2,t);choir(76,t,bars*6,0.02);feedback(83,t+bars*2,bars*4);}
   if(wall&&st===0)strum(WALL[(arc-16)%4],t,bars*0.98);
   if(wall&&(st===6||st===14))strum(WALL[(arc-16)%4],tt,sp*1.2);
   if(arc===22&&st===0){wout.gain.setValueAtTime(0.2,t);wout.gain.linearRampToValueAtTime(0.0001,t+0.3);}
  });
  var notes=[659.3,739.9,783.99,987.8,1046.5];
  every(5000,12000,function(){var t=a.currentTime+0.02,pan=a.createStereoPanner?a.createStereoPanner():gain(a,1);if(pan.pan)pan.pan.value=Math.random()*1.6-0.8;var pg=gain(a,0.3),lp=filt(a,'lowpass',1800);pan.connect(lp);lp.connect(pg);pg.connect(rv);pg.connect(echo);
   var n=1+Math.floor(Math.random()*3);for(var i=0;i<n;i++)ping(a,pan,notes[Math.floor(Math.random()*notes.length)]*(Math.random()<0.5?0.5:1)*Math.pow(2,(Math.random()-0.5)*0.04),t+i*0.18,1.2,0.05);},S);
 },
 lounge:function(a,o,S){
  var rv=verb(a,3,2.5),rg=gain(a,0.6);rv.connect(rg);rg.connect(o);var dk=filt(a,'lowpass',1600,0.5);dk.connect(o);dread(a,o,[38,45],0.012);
  var mb=filt(a,'bandpass',450,0.8),mg=gain(a,0.18);noise(a,'pink',mb);mb.connect(mg);mg.connect(o);lfo(a,0.09,0.05,mg.gain);
  var chords=[[146.8,174.6,220,261.6,329.6],[98,174.6,246.9,329.6,349.2],[130.8,164.8,246.9,293.7,392],[110,138.6,196,233.1,277.2]],k=0;
  function chord(){var t=a.currentTime+0.05,c=chords[k++%chords.length];c.forEach(function(f,i){var os=a.createOscillator(),g=a.createGain(),tr=a.createGain();os.type='sine';os.frequency.value=f;g.gain.setValueAtTime(0,t+i*0.04);g.gain.linearRampToValueAtTime(0.024,t+i*0.04+0.03);g.gain.exponentialRampToValueAtTime(0.001,t+4.6);os.connect(g);g.connect(tr);tr.connect(dk);tr.connect(rv);var l=a.createOscillator(),lg=gain(a,0.25);l.frequency.value=4.5;l.connect(lg);lg.connect(tr.gain);l.start(t);l.stop(t+4.8);os.start(t);os.stop(t+4.8);
   var h=a.createOscillator(),hg=a.createGain();h.frequency.value=f*2;hg.gain.setValueAtTime(0,t);hg.gain.linearRampToValueAtTime(0.006,t+0.02);hg.gain.exponentialRampToValueAtTime(0.0005,t+1.5);h.connect(hg);hg.connect(o);h.start(t);h.stop(t+1.6);});}
  chord();every(4800,4800,chord,S);
  var beat=0;every(400,400,function(){var t=a.currentTime+0.02;burst(a,o,t,beat%2?0.18:0.09,beat%2?0.025:0.012,6000,0.6);beat++;},S);
  var bass=[73.4,49,65.4,55],bk=0;every(1200,1200,function(){var t=a.currentTime+0.02;var bf=bass[Math.floor(bk/4)%4]*(bk%4===2?1.5:1);ping(a,o,bf,t,1.1,0.16,'triangle');ping(a,o,bf*2,t,0.6,0.05,'sine');ping(a,o,bf/2,t,1.1,0.12,'sine');bk++;},S);
 },
 desert:function(a,o,S){
  var drv=verb(a,5,1.6),drg=gain(a,0.7);drv.connect(drg);drg.connect(o);dread(a,drv,[64,65],0.006);every(7000,13000,function(){var t=a.currentTime+0.05;dubThump(a,drv,41.2,t,0.35);dubThump(a,o,41.2,t,0.12);},S);
  var wl=filt(a,'lowpass',500,1),wg=gain(a,0.55);noise(a,'pink',wl);wl.connect(wg);wg.connect(o);lfo(a,0.05,300,wl.frequency);lfo(a,0.07,0.3,wg.gain);
  var wh=filt(a,'bandpass',1800,6),whg=gain(a,0.05);noise(a,'white',wh);wh.connect(whg);whg.connect(o);lfo(a,0.11,700,wh.frequency);lfo(a,0.09,0.04,whg.gain);
  every(900,2400,function(){var t=a.currentTime+0.02,f=4300+Math.random()*500,n=2+Math.floor(Math.random()*3);for(var i=0;i<n;i++)for(var j=0;j<4;j++)ping(a,o,f,t+i*0.32+j*0.035,0.03,0.012);},S);
  every(12000,26000,function(){var t=a.currentTime+0.02,s=a.createBufferSource();s.buffer=noiseBuf(a,6,'brown');var lp=filt(a,'lowpass',300),g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.25,t+2.5);g.gain.linearRampToValueAtTime(0,t+5.5);lp.frequency.setValueAtTime(200,t);lp.frequency.linearRampToValueAtTime(700,t+2.5);lp.frequency.linearRampToValueAtTime(200,t+5.5);s.connect(lp);lp.connect(g);g.connect(o);s.start(t);},S);
 },
 sewers:function(a,o,S){
  var rv=verb(a,4.5,2.2),rg=gain(a,1);rv.connect(rg);rg.connect(o);
  var dl=a.createDelay(1.5),fb=gain(a,0.35),dlp=filt(a,'lowpass',1200),dwet=gain(a,0.5);dl.delayTime.value=0.37;dl.connect(dlp);dlp.connect(fb);fb.connect(dl);dlp.connect(dwet);dwet.connect(rv);dwet.connect(o);
  dread(a,rv,[40,41],0.008);every(4500,7000,function(){var t=a.currentTime+0.05;dubThump(a,rv,36.7,t,0.22);dubThump(a,rv,36.7,t+0.32,0.14);},S);
  var rl=filt(a,'lowpass',55,0.7),rgn=gain(a,0.35);noise(a,'brown',rl);rl.connect(rgn);rgn.connect(o);
  function drip(t,v,pan){var f=600+Math.random()*900,os=a.createOscillator(),g=a.createGain(),p=a.createStereoPanner?a.createStereoPanner():gain(a,1);if(p.pan)p.pan.value=pan;
   os.frequency.setValueAtTime(f,t);os.frequency.exponentialRampToValueAtTime(f*2.6,t+0.035);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+0.002);g.gain.exponentialRampToValueAtTime(0.0001,t+0.07);os.connect(g);g.connect(p);
   var s=nsrc(a,t,0.02),hb=filt(a,'bandpass',3500+Math.random()*2000,2),sg=env(a,t,v*0.5,0.001,0.015);s.connect(hb);hb.connect(sg);sg.connect(p);
   p.connect(o);p.connect(rv);p.connect(dl);os.start(t);os.stop(t+0.1);}
  var spots=[[-0.6,1400,700],[0.5,2600,1200],[0.1,5200,2600]];
  spots.forEach(function(sp){var base=sp[1];(function go(){if(!S.on)return;var t=a.currentTime+0.02;drip(t,0.05+Math.random()*0.04,sp[0]);if(Math.random()<0.2)drip(t+0.09+Math.random()*0.05,0.025,sp[0]);S.t.push(setTimeout(go,base+(Math.random()-0.5)*sp[2]));})();});
  every(18000,40000,function(){var t=a.currentTime+0.05,os=a.createOscillator(),bp=filt(a,'bandpass',260,10),g=a.createGain();os.type='sawtooth';var f0=52+Math.random()*18;os.frequency.setValueAtTime(f0,t);os.frequency.linearRampToValueAtTime(f0*0.82,t+3);bp.frequency.setValueAtTime(160,t);bp.frequency.linearRampToValueAtTime(420,t+1.4);bp.frequency.linearRampToValueAtTime(200,t+3);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.02,t+0.9);g.gain.linearRampToValueAtTime(0.0001,t+3.1);os.connect(bp);bp.connect(g);g.connect(rv);g.connect(dl);os.start(t);os.stop(t+3.3);},S);
 },
 elysium:function(a,o,S){
  var mix=gain(a,0.9),rv=verb(a,3.2,2.2),rg=gain(a,0.35);mix.connect(o);rv.connect(rg);rg.connect(o);
  var dust=filt(a,'lowpass',4800);dust.connect(mix);
  var hiss=filt(a,'highpass',4000),hg=gain(a,0.006);noise(a,'white',hiss);hiss.connect(hg);hg.connect(o);
  every(120,700,function(){var t=a.currentTime+0.02;burst(a,o,t,0.008,0.015+Math.random()*0.03,1500+Math.random()*4000,1.5);},S);
  var pad=filt(a,'lowpass',700,0.7),pg=gain(a,0.0);pad.connect(pg);pg.connect(mix);pg.connect(rv);pg.gain.linearRampToValueAtTime(0.018,a.currentTime+5);
  var CH=[[56,60,63,67],[56,60,61,65],[53,56,60,61],[52,55,58,61]],RT=[41,37,34,36],padO=[];
  CH[0].forEach(function(m,k){var os=a.createOscillator();os.type='sawtooth';os.frequency.value=mtof(m-12);os.detune.value=(k%2?8:-8);os.connect(pad);os.start();padO.push(os);});
  var sat=a.createWaveShaper(),cv=new Float32Array(256);for(var i=0;i<256;i++){var x=i/128-1;cv[i]=Math.tanh(2.2*x);}sat.curve=cv;var blp=filt(a,'lowpass',380,2),bg=gain(a,0.55);sat.connect(blp);blp.connect(bg);bg.connect(mix);
  function bass(f,t,dur,v){var o1=a.createOscillator(),o2=a.createOscillator(),g=a.createGain(),g2=gain(a,0.35);o1.frequency.value=f;o2.type='sawtooth';o2.frequency.value=f;o2.connect(g2);g2.connect(g);o1.connect(g);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+0.015);g.gain.setValueAtTime(v*0.85,t+dur*0.8);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);g.connect(sat);o1.start(t);o2.start(t);o1.stop(t+dur+0.05);o2.stop(t+dur+0.05);}
  var BP=[[0,0,5],[6,0,2],[8,0,3],[10,7,2],[14,12,1.5]];
  seq(a,S,72,4,function(i,t,sp){var st=i%16,bar=Math.floor(i/16),ci=Math.floor(bar/2)%4,sw=(st%2)?sp*0.18:0,tt=t+sw;
   if(st===0&&bar%8===4){gtr(a,rv,[RT[ci]+12,RT[ci]+19],t,sp*16*3.5,0.035);}
   if(st===0&&bar%2===0){var c=CH[ci];padO.forEach(function(os,k){os.frequency.setTargetAtTime(mtof(c[k]-12),t,0.6);});}
   if(st===0||st===10||(st===7&&bar%2))kick(a,dust,tt,st===0?0.42:0.3);
   if(st===4||st===12){snare(a,dust,tt,0.13,false);var sg=gain(a,0.6);snare(a,sg,tt,0.13,false);sg.connect(rv);}
   if(st===15&&Math.random()<0.4)snare(a,dust,tt,0.03,false);
   if(st%2===0)hat(a,dust,tt,st%4===0?0.028:0.018,false);else if(Math.random()<0.35)hat(a,dust,tt,0.01,false);
   if(st===14&&bar%4===3)hat(a,dust,tt,0.02,true);
   BP.forEach(function(b){if(b[0]===st){var r=RT[ci],n=r+b[1];if(st===14&&bar%2===1){var nr=RT[(ci+1)%4];n=nr+(nr>r?-1:1);}bass(mtof(n),tt,sp*b[2],0.38);}});
   if(st===0||(st===11&&Math.random()<0.6)){var c2=CH[ci];c2.forEach(function(m,k){keys(a,dust,mtof(m),tt+k*0.012,st===0?sp*7:sp*3,st===0?0.03:0.02,true);});}
  });
 }

};
function stop(){if(!cur)return;var c=cur;cur=null;c.S.on=false;c.S.t.forEach(clearTimeout);var t=c.a.currentTime;c.out.gain.cancelScheduledValues(t);c.out.gain.setValueAtTime(c.out.gain.value,t);c.out.gain.linearRampToValueAtTime(0,t+1.5);setTimeout(function(){try{c.a.close();}catch(e){}},1700);}
function play(name){if(!SC[name])return false;stop();var a=ctx();var LV={casino:0.25,lounge:0.55,desert:1,sewers:1.5,elysium:0.35};var out=a.createGain(),cmp=a.createDynamicsCompressor();cmp.threshold.value=-12;cmp.knee.value=6;cmp.ratio.value=8;cmp.attack.value=0.005;cmp.release.value=0.2;out.gain.value=0;var hpf=filt(a,'highpass',45,0.7);out.connect(hpf);hpf.connect(cmp);cmp.connect(a.destination);out.gain.linearRampToValueAtTime(0.55*(LV[name]||1),a.currentTime+3);var S={on:true,t:[]};SC[name](a,out,S);cur={name:name,out:out,S:S,a:a};try{chan&&chan.postMessage({type:'play',from:id});}catch(e){}return true;}
window.VTMAmbience={play:play,stop:stop,names:Object.keys(SC),playing:function(){return cur&&cur.name;}};
})();

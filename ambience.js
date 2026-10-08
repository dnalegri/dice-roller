
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
var SC={
 casino:function(a,o,S){
  var mb=filt(a,'bandpass',500,0.7),mg=gain(a,0.5);noise(a,'pink',mb);mb.connect(mg);mg.connect(o);lfo(a,0.13,0.12,mg.gain);
  var mb2=filt(a,'bandpass',1400,2),mg2=gain(a,0.08);noise(a,'pink',mb2);mb2.connect(mg2);mg2.connect(o);lfo(a,0.31,0.05,mg2.gain);
  var hum=a.createOscillator(),hg=gain(a,0.03);hum.frequency.value=60;hum.connect(hg);hg.connect(o);hum.start();
  var rv=verb(a,2.2,3),rg=gain(a,0.5);rv.connect(rg);rg.connect(o);
  var notes=[1046.5,1174.7,1318.5,1568,1760,2093];
  every(700,2600,function(){var t=a.currentTime+0.02,pan=a.createStereoPanner?a.createStereoPanner():gain(a,1);if(pan.pan)pan.pan.value=Math.random()*1.6-0.8;pan.connect(o);pan.connect(rv);
   if(Math.random()<0.25){for(var i=0;i<5;i++)ping(a,pan,notes[i%notes.length],t+i*0.09,0.5,0.035);}else ping(a,pan,notes[Math.floor(Math.random()*notes.length)],t,0.7,0.03);},S);
  every(5000,14000,function(){var t=a.currentTime+0.02,n=6+Math.floor(Math.random()*10);for(var i=0;i<n;i++)burst(a,o,t+i*0.05+Math.random()*0.03,0.06,0.05,3500+Math.random()*2500,4);},S);
 },
 lounge:function(a,o,S){
  var rv=verb(a,3,2.5),rg=gain(a,0.6);rv.connect(rg);rg.connect(o);
  var mb=filt(a,'bandpass',450,0.8),mg=gain(a,0.18);noise(a,'pink',mb);mb.connect(mg);mg.connect(o);lfo(a,0.09,0.05,mg.gain);
  var chords=[[146.8,174.6,220,261.6,329.6],[98,174.6,246.9,329.6,349.2],[130.8,164.8,246.9,293.7,392],[110,138.6,196,233.1,277.2]],k=0;
  function chord(){var t=a.currentTime+0.05,c=chords[k++%chords.length];c.forEach(function(f,i){var os=a.createOscillator(),g=a.createGain(),tr=a.createGain();os.type='sine';os.frequency.value=f;g.gain.setValueAtTime(0,t+i*0.04);g.gain.linearRampToValueAtTime(0.05,t+i*0.04+0.03);g.gain.exponentialRampToValueAtTime(0.001,t+4.6);os.connect(g);g.connect(tr);tr.connect(o);tr.connect(rv);var l=a.createOscillator(),lg=gain(a,0.25);l.frequency.value=4.5;l.connect(lg);lg.connect(tr.gain);l.start(t);l.stop(t+4.8);os.start(t);os.stop(t+4.8);
   var h=a.createOscillator(),hg=a.createGain();h.frequency.value=f*2;hg.gain.setValueAtTime(0,t);hg.gain.linearRampToValueAtTime(0.012,t+0.02);hg.gain.exponentialRampToValueAtTime(0.0005,t+1.5);h.connect(hg);hg.connect(o);h.start(t);h.stop(t+1.6);});}
  chord();every(4800,4800,chord,S);
  var beat=0;every(400,400,function(){var t=a.currentTime+0.02;burst(a,o,t,beat%2?0.18:0.09,beat%2?0.025:0.012,6000,0.6);beat++;},S);
  var bass=[73.4,49,65.4,55],bk=0;every(1200,1200,function(){var t=a.currentTime+0.02;ping(a,o,bass[Math.floor(bk/4)%4]*(bk%4===2?1.5:1),t,1.0,0.07,'triangle');bk++;},S);
 },
 desert:function(a,o,S){
  var wl=filt(a,'lowpass',500,1),wg=gain(a,0.55);noise(a,'pink',wl);wl.connect(wg);wg.connect(o);lfo(a,0.05,300,wl.frequency);lfo(a,0.07,0.3,wg.gain);
  var wh=filt(a,'bandpass',1800,6),whg=gain(a,0.05);noise(a,'white',wh);wh.connect(whg);whg.connect(o);lfo(a,0.11,700,wh.frequency);lfo(a,0.09,0.04,whg.gain);
  every(900,2400,function(){var t=a.currentTime+0.02,f=4300+Math.random()*500,n=2+Math.floor(Math.random()*3);for(var i=0;i<n;i++)for(var j=0;j<4;j++)ping(a,o,f,t+i*0.32+j*0.035,0.03,0.012);},S);
  every(12000,26000,function(){var t=a.currentTime+0.02,s=a.createBufferSource();s.buffer=noiseBuf(a,6,'brown');var lp=filt(a,'lowpass',300),g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.25,t+2.5);g.gain.linearRampToValueAtTime(0,t+5.5);lp.frequency.setValueAtTime(200,t);lp.frequency.linearRampToValueAtTime(700,t+2.5);lp.frequency.linearRampToValueAtTime(200,t+5.5);s.connect(lp);lp.connect(g);g.connect(o);s.start(t);},S);
 },
 sewers:function(a,o,S){
  var rv=verb(a,4,1.8),rg=gain(a,0.9);rv.connect(rg);rg.connect(o);
  var rl=filt(a,'lowpass',110),rgn=gain(a,0.6);noise(a,'brown',rl);rl.connect(rgn);rgn.connect(o);lfo(a,0.04,0.2,rgn.gain);
  var wb=filt(a,'bandpass',900,0.9),wg=gain(a,0.05);noise(a,'white',wb);wb.connect(wg);wg.connect(o);wg.connect(rv);lfo(a,0.2,0.02,wg.gain);
  every(500,2200,function(){var t=a.currentTime+0.02,f=900+Math.random()*1400,os=a.createOscillator(),g=a.createGain();os.frequency.setValueAtTime(f,t);os.frequency.exponentialRampToValueAtTime(f*0.45,t+0.06);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.06,t+0.004);g.gain.exponentialRampToValueAtTime(0.0001,t+0.12);os.connect(g);g.connect(rv);g.connect(o);os.start(t);os.stop(t+0.15);},S);
  every(14000,30000,function(){var t=a.currentTime+0.02,os=a.createOscillator(),lp=filt(a,'bandpass',300,8),g=a.createGain();os.type='sawtooth';os.frequency.setValueAtTime(48+Math.random()*20,t);os.frequency.linearRampToValueAtTime(40,t+2.5);lp.frequency.setValueAtTime(180,t);lp.frequency.linearRampToValueAtTime(520,t+1.2);lp.frequency.linearRampToValueAtTime(220,t+2.5);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.05,t+0.6);g.gain.linearRampToValueAtTime(0,t+2.6);os.connect(lp);lp.connect(g);g.connect(rv);os.start(t);os.stop(t+2.8);},S);
 },
 elysium:function(a,o,S){
  var rv=verb(a,5,2),rg=gain(a,0.8);rv.connect(rg);rg.connect(o);
  var lp=filt(a,'lowpass',900,0.5),dg=gain(a,0.0);lp.connect(dg);dg.connect(o);dg.connect(rv);dg.gain.linearRampToValueAtTime(0.06,a.currentTime+4);
  var sets=[[73.4,110,146.8,174.6],[65.4,98,130.8,155.6],[58.3,87.3,116.5,146.8],[55,82.4,110,130.8]],k=0,oscs=[];
  [0,1,2,3].forEach(function(i){[1,2,3].forEach(function(h){var os=a.createOscillator(),g=gain(a,0.22/h);os.type=h===1?'triangle':'sine';os.frequency.value=sets[0][i]*h;os.detune.value=(Math.random()-0.5)*6;os.connect(g);g.connect(lp);os.start();oscs.push([os,i,h]);});});
  every(9000,9000,function(){k++;var t=a.currentTime,s=sets[k%sets.length];oscs.forEach(function(x){x[0].frequency.setTargetAtTime(s[x[1]]*x[2],t,1.4);});},S);
  lfo(a,0.08,120,lp.frequency);
  every(150,900,function(){var t=a.currentTime+0.02;burst(a,o,t,0.015,0.02+Math.random()*0.03,2500+Math.random()*3000,2);},S);
 }
};
function stop(){if(!cur)return;var c=cur;cur=null;c.S.on=false;c.S.t.forEach(clearTimeout);var t=c.a.currentTime;c.out.gain.cancelScheduledValues(t);c.out.gain.setValueAtTime(c.out.gain.value,t);c.out.gain.linearRampToValueAtTime(0,t+1.5);setTimeout(function(){try{c.a.close();}catch(e){}},1700);}
function play(name){if(!SC[name])return false;stop();var a=ctx();var out=a.createGain();out.gain.value=0;out.connect(a.destination);out.gain.linearRampToValueAtTime(0.55,a.currentTime+3);var S={on:true,t:[]};SC[name](a,out,S);cur={name:name,out:out,S:S,a:a};try{chan&&chan.postMessage({type:'play',from:id});}catch(e){}return true;}
window.VTMAmbience={play:play,stop:stop,names:Object.keys(SC),playing:function(){return cur&&cur.name;}};
})();

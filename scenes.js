/* VTM chronicle presentation widgets.
   VTMScene(scene, mount)      scene title card, with the status strip inside when status.js is loaded
   VTMEntrance(people, mount)  character entrance name plates
   VTMDoc(doc, mount)          in-world documents: text, letter, memo, dossier, news, summons
   VTMMail(mail, mount)        desktop email client: inbox, reading pane, reply and compose
   VTMDaysleep(day, mount)     end-of-session dream cards for spending experience
   Every function renders into `mount`, or the element with id "vtm". All text is escaped. */
(function(){
var BASE=((document.currentScript&&document.currentScript.src)||'').replace(/scenes\.js.*$/,'');
var AMB={casino:'Casino floor',lounge:'The lounge',desert:'Desert night',sewers:'The sewers',elysium:'Elysium'};
function loadAmb(cb){if(window.VTMAmbience){cb&&cb();return;}if(!BASE)return;var s=document.createElement('script');s.src=BASE+'ambience.js';s.onload=function(){cb&&cb();};document.head.appendChild(s);}
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
".vtm-sc .am{margin:1rem auto 0;display:inline-flex;align-items:center;gap:7px;background:none;border:none;font:12px/1.4 var(--font-sans,sans-serif);letter-spacing:.06em;color:var(--text-secondary);cursor:pointer;height:auto;padding:4px 8px;opacity:0;animation:vtm-up .9s ease-out 2.4s forwards}",
".vtm-sc .am.on{color:var(--vtm-brass)}.vtm-sc.amb{cursor:pointer}",
".vtm-ds{position:relative;overflow:hidden;border-radius:12px;background:var(--surface-2);border:0.5px solid var(--border);padding:1.75rem 1.25rem 1.25rem}",
".vtm-ds .sky{position:relative;height:54px;margin:0 auto 6px;width:min(260px,70%);overflow:hidden}",
".vtm-ds .sun{position:absolute;left:50%;bottom:-40px;width:64px;height:64px;margin-left:-32px;border-radius:50%;border:1.5px solid var(--vtm-brass);animation:vtm-sun 3s cubic-bezier(.3,.6,.3,1) .3s forwards}",
".vtm-ds .hz{position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vtm-blood)}",
"@keyframes vtm-sun{to{bottom:-14px}}",
".vtm-ds .eb{text-align:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:var(--text-secondary)}",
".vtm-ds .ti{text-align:center;font-family:'Cinzel',serif;font-weight:600;font-size:clamp(22px,5.5vw,30px);letter-spacing:.12em;margin:.2rem 0 .5rem;color:var(--text-primary)}",
".vtm-ds .ln{text-align:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:19px;line-height:1.5;color:var(--text-secondary);max-width:30em;margin:0 auto 1rem}",
".vtm-ds .xp{display:flex;flex-wrap:wrap;gap:6px 18px;align-items:baseline;justify-content:center;border-top:0.5px solid var(--border);border-bottom:0.5px solid var(--border);padding:10px 4px;margin-bottom:1rem}",
".vtm-ds .xp .n{font-family:'Cinzel',serif;font-weight:600;font-size:20px;color:var(--vtm-brass)}",
".vtm-ds .xp .l{font-size:13px;color:var(--text-secondary)}",
".vtm-ds .why{width:100%;text-align:center;font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--text-secondary)}",
".vtm-ds .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}",
".vtm-ds .dr{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;gap:6px;padding:12px 14px;border:0.5px solid var(--border);border-left:3px solid var(--vtm-brass);background:var(--surface-1);min-width:0}",
".vtm-ds .dr:hover{border-color:var(--border-strong);border-left-color:var(--vtm-brass)}",
".vtm-ds .dr:focus-visible{outline:2px solid var(--vtm-brass);outline-offset:2px}",
".vtm-ds .dr.sel{border-left-color:var(--vtm-blood);box-shadow:0 0 0 1.5px var(--vtm-blood)}",
".vtm-ds .dr.far{border-left-color:var(--text-muted)}",
".vtm-ds .dr .dt{font-family:'Cinzel',serif;font-weight:600;font-size:15px;letter-spacing:.04em;color:var(--text-primary);line-height:1.3}",
".vtm-ds .dr .dx{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:17px;line-height:1.45;color:var(--text-secondary)}",
".vtm-ds .dr .rw{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:auto;padding-top:4px}",
".vtm-ds .chip{font-size:12px;padding:3px 9px;border-radius:var(--radius);background:var(--surface-2);color:var(--text-primary)}",
".vtm-ds .chip.c{color:var(--vtm-brass)}",
".vtm-ds .bar{height:3px;background:var(--border);width:100%;margin-top:2px}.vtm-ds .bar i{display:block;height:100%;background:var(--vtm-brass)}",
".vtm-ds .nt{font-size:12px;color:var(--text-muted)}",
".vtm-ds .alt{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}",
".vtm-ds .alt .dr{flex:1 1 200px;border-left-color:var(--border-strong)}",
".vtm-ds .go{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:1rem}",
".vtm-ds .er{font-size:13px;color:var(--text-danger)}",
".vtm-lock{max-width:340px;margin:0 auto;background:#0b0b0d;border-radius:28px;padding:18px 12px 16px;border:1px solid #2a2a2c;position:relative;overflow:hidden;font-family:var(--font-sans,sans-serif);color:#f2f2f4}",
".vtm-lock .wp{position:absolute;left:50%;top:38px;width:220px;height:260px;margin-left:-110px;color:#8e1b1b;opacity:.16;pointer-events:none}",
".vtm-lock .top{position:relative;display:flex;justify-content:center;color:#a8a8ad;font-size:12px;gap:6px;align-items:center}",
".vtm-lock .clk{position:relative;text-align:center;font-size:64px;font-weight:300;letter-spacing:-1px;line-height:1.05;margin-top:10px;font-variant-numeric:tabular-nums}",
".vtm-lock .dt{position:relative;text-align:center;font-size:15px;color:#c9c9ce;margin-bottom:18px}",
".vtm-lock .ns{position:relative;display:flex;flex-direction:column;gap:8px}",
".vtm-lock .nf{all:unset;box-sizing:border-box;display:flex;gap:10px;align-items:flex-start;width:100%;background:#1f1f22;border-radius:16px;padding:10px 12px;cursor:pointer;opacity:0;animation:vtm-pop .35s ease-out forwards}",
".vtm-lock .nf:hover{background:#28282c}.vtm-lock .nf:focus-visible{outline:2px solid #8e1b1b;outline-offset:2px}",
".vtm-lock .nf.done{opacity:.45!important;cursor:default}",
".vtm-lock .ic{flex:none;width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff}",
".vtm-lock .ic.text{background:#2f8f4e}.vtm-lock .ic.missed,.vtm-lock .ic.voicemail{background:#3a3a3e}.vtm-lock .ic.alert{background:#8e1b1b}",
".vtm-lock .bd{flex:1;min-width:0}",
".vtm-lock .hd{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#a8a8ad}",
".vtm-lock .ap{text-transform:uppercase;letter-spacing:.06em}",
".vtm-lock .ti{font-size:14px;font-weight:600;color:#f2f2f4;margin-top:1px}",
".vtm-lock .tx{font-size:14px;color:#d8d8dc;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}",
".vtm-lock .ct{font-size:12px;color:#a8a8ad;margin-top:2px}",
".vtm-lock .em{position:relative;text-align:center;color:#8a8a8e;font-size:14px;padding:30px 0}",
".vtm-lock .ft{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:16px}",
".vtm-lock .bar{width:120px;height:4px;border-radius:2px;background:#f2f2f4;opacity:.8}",
".vtm-lock .aw{background:none;border:none;color:#8a8a8e;font:12px var(--font-sans,sans-serif);cursor:pointer;text-decoration:underline;padding:2px}",
".vtm-vm{max-width:340px;margin:0 auto;background:#0f0f10;border-radius:20px;padding:16px;border:1px solid #2a2a2c;color:#f2f2f4;font-family:var(--font-sans,sans-serif)}",
".vtm-vm .hd{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.vtm-vm .nm{font-size:16px;font-weight:600}.vtm-vm .tm{font-size:12px;color:#8a8a8e}",
".vtm-vm .pl{display:flex;align-items:center;gap:10px;margin:12px 0}",
".vtm-vm .pb{flex:none;width:30px;height:30px;border-radius:50%;background:#2f8f4e;display:flex;align-items:center;justify-content:center}",
".vtm-vm .tr{flex:1;height:4px;background:#3a3a3e;border-radius:2px;overflow:hidden}.vtm-vm .tr i{display:block;height:100%;width:0;background:#f2f2f4;animation:vtm-vm 6s linear .4s forwards}",
"@keyframes vtm-vm{to{width:100%}}",
".vtm-vm .du{font-size:12px;color:#8a8a8e;font-variant-numeric:tabular-nums}",
".vtm-vm .lb{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8a8a8e;margin-bottom:4px}",
".vtm-vm .tx{font-size:15px;line-height:1.5;color:#e4e4e8;white-space:pre-wrap;overflow-wrap:anywhere}",
".vtm-log{max-width:560px;margin:0 auto;background:#070a08;border:1px solid #1e2a22;border-radius:8px;overflow:hidden;font-family:var(--font-mono,ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace);color:#7fe39a;background-image:repeating-linear-gradient(180deg,rgba(255,255,255,.025) 0 1px,transparent 1px 3px)}",
".vtm-log .bar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:7px 12px;background:#0f1612;border-bottom:1px solid #1e2a22;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#5fae76}",
".vtm-log .rec{display:inline-flex;align-items:center;gap:6px;color:#ff5a5a}.vtm-log .rec i{width:7px;height:7px;border-radius:50%;background:#ff5a5a;animation:vtm-blink 1.2s steps(1) infinite}",
"@keyframes vtm-blink{50%{opacity:0}}",
".vtm-log .scr{padding:12px 14px 14px;font-size:13px;line-height:1.6;overflow-x:auto}",
".vtm-log .ln{display:flex;gap:10px;white-space:pre-wrap;overflow-wrap:anywhere;opacity:0;animation:vtm-type .01s linear forwards}",
".vtm-log .ln .ts{flex:none;color:#4a8a5d}",
".vtm-log .ln .lv{flex:none;width:5.5em}",
".vtm-log .ln.info .lv{color:#4a8a5d}.vtm-log .ln.warn .lv,.vtm-log .ln.warn .mg{color:#f2c14e}.vtm-log .ln.alert .lv,.vtm-log .ln.alert .mg{color:#ff6b6b}",
".vtm-log .ln.alert{background:rgba(255,80,80,.08)}",
".vtm-log .mg{min-width:0}",
"@keyframes vtm-type{to{opacity:1}}",
".vtm-log .cur{display:inline-block;width:8px;height:14px;background:#7fe39a;vertical-align:-2px;animation:vtm-blink 1s steps(1) infinite;opacity:0}",
".vtm-log .ft{padding:6px 14px 10px;font-size:11px;color:#4a8a5d}",
".vtm-mail{max-width:680px;margin:0 auto;background:#1c1c1e;border-radius:14px;padding:10px 10px 14px;border:1px solid #2c2c2e}",
".vtm-mail .win{background:#fbfbfc;color:#1d1d1f;border-radius:8px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;min-height:340px;display:flex;flex-direction:column}",
".vtm-mail .tb{display:flex;align-items:center;gap:10px;padding:8px 12px;background:#ececee;border-bottom:1px solid #d9d9dd}",
".vtm-mail .dots{display:flex;gap:6px}.vtm-mail .dots i{width:10px;height:10px;border-radius:50%;background:#ff5f57}.vtm-mail .dots i+i{background:#febc2e}.vtm-mail .dots i+i+i{background:#28c840}",
".vtm-mail .tt{flex:1;text-align:center;font-size:12px;color:#6e6e73;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
".vtm-mail .nb{all:unset;cursor:pointer;font-size:12px;font-weight:600;color:#0a63d8;padding:3px 8px;border-radius:5px}.vtm-mail .nb:hover{background:#dfe8f6}",
".vtm-mail .bd{display:grid;grid-template-columns:minmax(0,230px) minmax(0,1fr);flex:1;min-height:0}",
".vtm-mail .ls{border-right:1px solid #e3e3e6;overflow-y:auto;max-height:440px}",
".vtm-mail .fh{padding:10px 12px 6px;font-size:12px;font-weight:600;color:#6e6e73;display:flex;justify-content:space-between}",
".vtm-mail .it{all:unset;box-sizing:border-box;display:block;width:100%;cursor:pointer;padding:9px 12px 10px 20px;border-bottom:1px solid #eeeef0;position:relative}",
".vtm-mail .it:hover{background:#f1f1f4}.vtm-mail .it.on{background:#0a63d8;color:#fff}.vtm-mail .it:focus-visible{outline:2px solid #0a63d8;outline-offset:-2px}",
".vtm-mail .it .u{position:absolute;left:7px;top:15px;width:7px;height:7px;border-radius:50%;background:#0a63d8}.vtm-mail .it.on .u{background:#fff}",
".vtm-mail .it .r1{display:flex;justify-content:space-between;gap:6px}.vtm-mail .it .fr{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vtm-mail .it .tm{font-size:12px;color:#8e8e93;flex:none}.vtm-mail .it.on .tm{color:#dfe8f6}",
".vtm-mail .it .sb{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vtm-mail .it.rd .fr,.vtm-mail .it.rd .sb{font-weight:400}",
".vtm-mail .it .pv{font-size:12px;color:#8e8e93;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.vtm-mail .it.on .pv{color:#dfe8f6}",
".vtm-mail .it.nw{animation:vtm-pop .4s ease-out both}",
".vtm-mail .pn{padding:16px 18px;overflow-y:auto;max-height:440px;min-width:0}",
".vtm-mail .em{color:#8e8e93;text-align:center;padding:60px 10px}",
".vtm-mail .hs{font-size:18px;font-weight:600;margin:0 0 10px;line-height:1.3}",
".vtm-mail .hr{display:flex;gap:10px;align-items:center;padding-bottom:10px;border-bottom:1px solid #e3e3e6;margin-bottom:12px}",
".vtm-mail .av{flex:none;width:34px;height:34px;border-radius:50%;background:#8e8e93;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600}",
".vtm-mail .hm{min-width:0;flex:1}.vtm-mail .hm .a{font-weight:600}.vtm-mail .hm .b{font-size:12px;color:#6e6e73;overflow-wrap:anywhere}",
".vtm-mail .tx{line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}",
".vtm-mail .at{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.vtm-mail .at span{font-size:12px;border:1px solid #d9d9dd;border-radius:6px;padding:5px 9px;background:#f4f4f6}",
".vtm-mail .ac{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}",
".vtm-mail .bt{all:unset;cursor:pointer;font-size:13px;padding:6px 12px;border-radius:6px;border:1px solid #d1d1d6;background:#fff;color:#1d1d1f}.vtm-mail .bt:hover{background:#f1f1f4}.vtm-mail .bt.p{background:#0a63d8;border-color:#0a63d8;color:#fff}.vtm-mail .bt.p:hover{background:#0857c0}",
".vtm-mail .bt:focus-visible,.vtm-mail .nb:focus-visible{outline:2px solid #0a63d8;outline-offset:2px}",
".vtm-mail .fm{display:flex;flex-direction:column;gap:8px}.vtm-mail .fm label{display:flex;align-items:center;gap:8px;border-bottom:1px solid #e3e3e6;padding:4px 0;font-size:13px;color:#6e6e73}",
".vtm-mail .fm input{flex:1;border:none;outline:none;background:transparent;font-size:14px;font-family:inherit;color:#1d1d1f;height:auto;padding:4px 0;min-width:0}",
".vtm-mail .fm textarea{border:1px solid #e3e3e6;border-radius:6px;min-height:140px;resize:vertical;font-size:14px;line-height:1.5;font-family:inherit;color:#1d1d1f;background:#fff;padding:8px 10px;outline:none}",
".vtm-mail .fm textarea:focus{border-color:#0a63d8}",
".vtm-mail .er{font-size:12px;color:#d70015;min-height:16px}",
".vtm-mail .ok{font-size:13px;color:#248a3d}",
".vtm-mail .qt{margin-top:10px;padding-left:10px;border-left:2px solid #d1d1d6;color:#6e6e73;font-size:13px;white-space:pre-wrap;max-height:120px;overflow:hidden}",
".vtm-mail .back{display:none}",
"@media (max-width:560px){.vtm-mail .bd{grid-template-columns:minmax(0,1fr)}.vtm-mail .ls{border-right:none;max-height:none}.vtm-mail .pn{display:none;max-height:none}.vtm-mail.reading .ls{display:none}.vtm-mail.reading .pn{display:block}.vtm-mail .back{display:inline-block}}",
".vtm-mail .base{height:8px;margin:8px auto 0;width:40%;background:#2c2c2e;border-radius:0 0 8px 8px}",
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
 mount.innerHTML=sr('Scene: '+(sc.title||''))+'<div class="vtm-wrap"><div class="vtm-sc">'+(eb?'<div class="eb">'+esc(eb)+'</div>':'')+'<div class="ti">'+esc(sc.title)+'</div>'+(wh?'<div class="wh">'+esc(wh)+'</div>':'')+'<div class="ru"></div>'+(sc.mood?'<p class="mo">'+esc(sc.mood)+'</p>':'')+(AMB[sc.ambience]?'<button type="button" class="am"></button>':'')+'<div class="st"><div class="vtm-st"></div></div></div></div>';
 if(sc.status&&window.VTMStatus){var st={};for(var k in sc.status)st[k]=sc.status[k];if(!st.change)st.change={trait:'',note:''};try{window.VTMStatus(st,mount.querySelector('.vtm-st'));}catch(e){mount.querySelector('.st').style.display='none';}}
 if(AMB[sc.ambience]){var card=mount.querySelector('.vtm-sc'),btn=mount.querySelector('.am'),nm=AMB[sc.ambience],on=false,started=false;card.classList.add('amb');
  var SPK='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/>',WAV='<path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',MUT='<path d="m16 9 5 6"/><path d="m21 9-5 6"/></svg>';
  function draw(){btn.classList.toggle('on',on);btn.innerHTML=(on?SPK+WAV:SPK+MUT)+'<span>'+(on?nm+' \u00b7 tap to mute':started?nm+' \u00b7 muted, tap to resume':'Tap the card for ambience \u00b7 '+nm)+'</span>';btn.setAttribute('aria-label',on?'Mute ambience':'Play ambience');}
  function play(){loadAmb(function(){if(window.VTMAmbience&&VTMAmbience.play(sc.ambience)){on=true;started=true;draw();}});}
  function mute(){if(window.VTMAmbience)VTMAmbience.stop();on=false;draw();}
  card.addEventListener('click',function(e){if(btn.contains(e.target)){on?mute():play();return;}if(!started)play();});
  setInterval(function(){if(on&&window.VTMAmbience&&VTMAmbience.playing()!==sc.ambience){on=false;draw();}},1500);
  loadAmb();draw();}
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
window.VTMDaysleep=function(d,mount){
 setup();mount=mountOf(mount);d=d||{};var bank=+d.bank||0,dreams=d.dreams||[],sel=-1,sent=false;
 var eb=[d.session,'Daysleep'].filter(Boolean).join(' · ');
 var html=sr('Daysleep: choose a dream to spend experience')+'<div class="vtm-wrap"><div class="vtm-ds"><div class="sky" aria-hidden="true"><div class="sun"></div><div class="hz"></div></div><div class="eb">'+esc(eb)+'</div><div class="ti">'+esc(d.title||'The sun rises')+'</div>'+(d.line?'<p class="ln">'+esc(d.line)+'</p>':'');
 html+='<div class="xp">'+(d.earned!=null?'<span><span class="n">+'+esc(d.earned)+'</span> <span class="l">XP tonight</span></span>':'')+'<span><span class="n">'+esc(bank)+'</span> <span class="l">XP to spend</span></span>'+((d.reasons||[]).length?'<div class="why">'+d.reasons.map(esc).join(' · ')+'</div>':'')+'</div>';
 html+='<div class="grid">'+dreams.map(function(x,i){var c=+x.cost||0,far=c>bank,pct=c?Math.min(100,Math.round(bank/c*100)):100;
  return '<button type="button" class="dr'+(far?' far':'')+'" data-i="'+i+'" aria-pressed="false"><span class="dt">'+esc(x.title)+'</span>'+(x.text?'<span class="dx">'+esc(x.text)+'</span>':'')+'<span class="rw"><span class="chip">'+esc(x.reward)+'</span><span class="chip c">'+c+' XP</span></span>'+(far?'<span class="bar"><i style="width:'+pct+'%"></i></span><span class="nt">'+bank+' of '+c+' XP. Choosing it saves toward it.</span>':'')+'</button>';}).join('')+'</div>';
 html+='<div class="alt"><button type="button" class="dr" data-i="bank"><span class="dt">Dreamless sleep</span><span class="dx">Bank the experience for another day.</span></button><button type="button" class="dr" data-i="other"><span class="dt">Something else</span><span class="dx">Spend it another way. The Storyteller lists what it can buy.</span></button></div>';
 html+='<div class="go"><button type="button" class="send">Choose this dream ↗</button><span class="er" role="status"></span></div></div></div>';
 mount.innerHTML=html;
 var cards=[].slice.call(mount.querySelectorAll('.dr')),er=mount.querySelector('.er'),btn=mount.querySelector('.send');
 cards.forEach(function(b){b.addEventListener('click',function(){if(sent)return;sel=b.getAttribute('data-i');cards.forEach(function(c){c.classList.toggle('sel',c===b);c.setAttribute('aria-pressed',String(c===b));});er.textContent='';});});
 btn.addEventListener('click',function(){
  if(sent){er.textContent='Already sent to the Storyteller.';return;}
  if(sel===-1){er.textContent='Pick a dream first.';return;}
  var msg;if(sel==='bank')msg='[Daysleep] Anika sleeps without dreams. Bank the experience ('+bank+' XP).';
  else if(sel==='other')msg='[Daysleep] I want to spend the experience another way. I have '+bank+' XP.';
  else{var x=dreams[+sel],c=+x.cost||0;msg=c>bank?'[Daysleep] Anika dreams of '+x.title+'. Save toward '+x.reward+' ('+c+' XP) and bank the experience ('+bank+' XP).':'[Daysleep] Anika dreams of '+x.title+'. Spend '+c+' XP on '+x.reward+'.';}
  sent=true;btn.textContent='Sent to the Storyteller';cards.forEach(function(c){if(!c.classList.contains('sel'))c.style.opacity='.45';c.style.cursor='default';});
  if(typeof sendPrompt==='function')sendPrompt(msg);});
};

var LICON={text:'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.6 3.5 6L4.6 21l4.3-2.4c1 .3 2 .4 3.1.4 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/></svg>',
 missed:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/><path d="m15 3 6 6M21 3l-6 6"/></svg>',
 voicemail:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><path d="M6 16h12"/></svg>',
 alert:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>'};
var LAPP={text:'Messages',missed:'Phone',voicemail:'Voicemail',alert:'Alert'};
function lockScreen(d){
 var ns=d.notifications||[];
 var html='<div class="vtm-lock">'+(d.wallpaper===false?'':'<svg class="wp" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6c6 10 22 17 22 30a10 10 0 0 1-17 7c1 5 3 9 7 13H20c4-4 6-8 7-13a10 10 0 0 1-17-7C10 23 26 16 32 6Z" fill="currentColor"/></svg>')+
  '<div class="top"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'+esc(d.owner?d.owner+'’s phone':'Locked')+'</div>'+
  '<div class="clk">'+esc(d.time||'')+'</div><div class="dt">'+esc(d.date||'')+'</div><div class="ns">';
 if(!ns.length)html+='<div class="em">No new notifications</div>';
 ns.forEach(function(n,i){var k=LICON[n.kind]?n.kind:'alert',title=k==='missed'?(n.from||'Unknown')+(n.count>1?' ('+n.count+')':''):k==='alert'?(n.title||''):(n.from||'Unknown');
  var body=k==='missed'?'Missed call':k==='voicemail'?(n.text?'“'+n.text+'”':'New voicemail'+(n.duration?' · '+n.duration:'')):(n.text||'');
  html+='<button type="button" class="nf" data-i="'+i+'" style="animation-delay:'+(0.25+i*0.35).toFixed(2)+'s"><span class="ic '+k+'">'+LICON[k]+'</span><span class="bd"><span class="hd"><span class="ap">'+esc(n.app||LAPP[k])+'</span><span>'+esc(n.time||'')+'</span></span>'+(title?'<span class="ti" style="display:block">'+esc(title)+'</span>':'')+'<span class="tx">'+esc(body)+'</span>'+(k==='text'&&n.count>1?'<span class="ct" style="display:block">'+(n.count-1)+' more from '+esc(n.from||'them')+'</span>':'')+'</span></button>';});
 html+='</div><div class="ft"><button type="button" class="aw">Put the phone away</button><span class="bar" aria-hidden="true"></span></div></div>';
 return html;
}
function voicemail(d){
 return '<div class="vtm-vm"><div class="hd"><span class="nm">'+esc(d.from||'Unknown')+'</span><span class="tm">'+esc(d.time||'')+'</span></div><div class="pl"><span class="pb" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M7 4v16l13-8z"/></svg></span><span class="tr"><i></i></span><span class="du">'+esc(d.duration||'')+'</span></div><div class="lb">Transcript</div><div class="tx">'+esc(d.transcript||d.body||'')+'</div></div>';
}
function sysLog(d){
 var ls=d.lines||[],n=ls.length;
 var html='<div class="vtm-log"><div class="bar"><span>'+esc(d.system||'Security Operations')+(d.source?' · '+esc(d.source):'')+'</span>'+(d.live===false?'':'<span class="rec"><i></i>Live</span>')+'</div><div class="scr">';
 ls.forEach(function(l,i){var o=Array.isArray(l)?{time:l[0],text:l[1],level:l[2]}:l;var lv=/^(alert|warn|info)$/.test(o.level||'')?o.level:'info';
  html+='<div class="ln '+lv+'" style="animation-delay:'+(0.3+i*0.45).toFixed(2)+'s">'+(o.time?'<span class="ts">'+esc(o.time)+'</span>':'')+'<span class="lv">['+lv.toUpperCase()+']</span><span class="mg">'+esc(o.text||'')+'</span></div>';});
 html+='<div class="ln" style="animation-delay:'+(0.3+n*0.45).toFixed(2)+'s"><span class="ts">&gt;</span><span class="cur" style="opacity:1"></span></div></div>'+(d.footer?'<div class="ft">'+esc(d.footer)+'</div>':'')+'</div>';
 return html;
}
window.VTMMail=function(m,mount){
 setup();mount=mountOf(mount);m=m||{};var ems=(m.emails||[]).slice(),cur=-1,mode='',read={},closed=false,post=window.sendPrompt||function(){};
 var who=m.owner||'Anika';
 mount.innerHTML=sr('Email inbox for '+(m.account||who))+'<div class="vtm-wrap"><div class="vtm-mail"><div class="win"><div class="tb"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="tt">Inbox — '+esc(m.account||who)+'</span><button type="button" class="nb" data-a="new">New message</button></div><div class="bd"><div class="ls"></div><div class="pn"></div></div></div><div class="base" aria-hidden="true"></div></div></div>';
 var root=mount.querySelector('.vtm-mail'),ls=root.querySelector('.ls'),pn=root.querySelector('.pn');
 function ini(s){return String(s||'?').trim().charAt(0).toUpperCase()||'?';}
 function list(){var un=ems.filter(function(e,i){return e.unread&&!read[i];}).length;
  ls.innerHTML='<div class="fh"><span>'+esc(m.folder||'Inbox')+'</span><span>'+(un?un+' unread':'')+'</span></div>'+(ems.length?ems.map(function(e,i){var u=e.unread&&!read[i];return '<button type="button" class="it'+(u?'':' rd')+(i===cur?' on':'')+(e.new?' nw':'')+'" data-i="'+i+'">'+(u?'<span class="u" aria-label="Unread"></span>':'')+'<span class="r1"><span class="fr">'+esc(e.from)+'</span><span class="tm">'+esc(e.time||'')+'</span></span><span class="sb" style="display:block">'+esc(e.subject||'(no subject)')+'</span><span class="pv">'+esc(e.preview||String(e.body||'').slice(0,120))+'</span></button>';}).join(''):'<div class="em">No messages</div>');}
 function empty(){pn.innerHTML='<div class="em">Select a message to read it.</div>';}
 function open(i){cur=i;mode='read';read[i]=true;var e=ems[i];root.classList.add('reading');list();
  pn.innerHTML='<button type="button" class="bt back" data-a="back">‹ Inbox</button><h3 class="hs">'+esc(e.subject||'(no subject)')+'</h3><div class="hr"><span class="av" aria-hidden="true">'+esc(ini(e.from))+'</span><span class="hm"><span class="a" style="display:block">'+esc(e.from)+'</span><span class="b" style="display:block">'+esc(e.fromAddr||'')+(e.to?' · to '+esc(e.to):'')+(e.time?' · '+esc(e.time):'')+'</span></span></div><div class="tx">'+esc(e.body||'')+'</div>'+((e.attachments||[]).length?'<div class="at">'+e.attachments.map(function(a){return '<span>📎 '+esc(a)+'</span>';}).join('')+'</div>':'')+(m.reply===false?'':'<div class="ac"><button type="button" class="bt" data-a="reply">Reply</button></div>');}
 function compose(re){mode='compose';var e=re!=null?ems[re]:null;root.classList.add('reading');
  pn.innerHTML='<button type="button" class="bt back" data-a="back">‹ Inbox</button><h3 class="hs">'+(e?'Reply':'New message')+'</h3><div class="fm"><label>To:<input type="text" class="f-to" value="'+esc(e?(e.fromAddr||e.from):'')+'" aria-label="To"></label><label>Subject:<input type="text" class="f-sb" value="'+esc(e?('Re: '+String(e.subject||'').replace(/^Re:\s*/i,'')):'')+'" aria-label="Subject"></label><textarea class="f-bd" aria-label="Message" placeholder="Write your email"></textarea><div class="er" role="status"></div><div class="ac" style="margin-top:0"><button type="button" class="bt p" data-a="send">Send</button><button type="button" class="bt" data-a="cancel">Cancel</button></div></div>'+(e?'<div class="qt">'+esc(e.body||'')+'</div>':'');
  pn.querySelector('.f-bd').focus();pn.dataset.re=re!=null?re:'';}
 function send(){var to=pn.querySelector('.f-to').value.trim(),sb=pn.querySelector('.f-sb').value.trim(),bd=pn.querySelector('.f-bd').value.trim(),er=pn.querySelector('.er');
  if(!to){er.textContent='Add a recipient.';return;}if(!bd){er.textContent='Write a message first.';return;}
  var re=pn.dataset.re!==''?ems[+pn.dataset.re]:null;
  post((re?'[Email reply to '+re.from+'] ':'[Email to '+to+'] ')+'Subject: '+(sb||'(no subject)')+'\n\n'+bd);
  pn.innerHTML='<div class="em"><div class="ok">Sent to '+esc(to)+'.</div><div style="margin-top:6px">Waiting for a reply…</div></div>';mode='sent';}
 root.addEventListener('click',function(ev){var b=ev.target.closest('button');if(!b||closed)return;var a=b.getAttribute('data-a');
  if(b.classList.contains('it')){open(+b.getAttribute('data-i'));return;}
  if(a==='new')compose(null);else if(a==='reply')compose(cur);else if(a==='send')send();else if(a==='cancel'){cur>=0?open(cur):(root.classList.remove('reading'),empty());}else if(a==='back'){root.classList.remove('reading');cur=-1;list();empty();}else if(a==='close'){closed=true;b.textContent='Mail closed';var rd=Object.keys(read).map(function(k){return ems[k].subject||'(no subject)';});post('[Close mail] Anika closes the mail'+(rd.length?'. Read: '+rd.join('; ')+'.':' without reading anything.'));}});
 root.addEventListener('input',function(){var er=pn.querySelector('.er');if(er)er.textContent='';});
 var cl=document.createElement('div');cl.style.cssText='text-align:center;margin-top:8px';cl.innerHTML='<button type="button" class="nb" data-a="close" style="color:#8e8e93;text-decoration:underline;font-weight:400">Close mail</button>';root.appendChild(cl);
 list();empty();
};

window.VTMDoc=function(d,mount){
 setup();mount=mountOf(mount);d=d||{};
 var f={log:sysLog,lock:lockScreen,voicemail:voicemail,text:textThread,letter:letter,note:letter,memo:memo,dossier:dossier,news:news,summons:summons}[d.type]||letter;
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
 var lk=mount.querySelector('.vtm-lock');
 if(lk){var post2=window.sendPrompt||function(){},nsx=d.notifications||[],away=false;
  [].forEach.call(lk.querySelectorAll('.nf'),function(b){b.addEventListener('click',function(){if(away||b.classList.contains('done'))return;var n=nsx[+b.getAttribute('data-i')]||{},w=n.from||'Unknown';b.classList.add('done');
   post2(n.kind==='text'?'[Open texts from '+w+']':n.kind==='missed'?'[Call back '+w+']':n.kind==='voicemail'?'[Play voicemail from '+w+']':'[Open alert] '+(n.app||'Alert')+(n.title?': '+n.title:'')+(n.text?' — '+n.text:''));});});
  lk.querySelector('.aw').addEventListener('click',function(){if(away)return;away=true;this.textContent='Phone put away';post2('[Put the phone away] Anika locks the phone without opening anything else.');});}
 var w=mount.querySelector('.vtm-wax');
 if(w)w.onclick=function(){var L=mount.querySelector('.vtm-letter');L.classList.remove('sealed');L.classList.add('open');var h=mount.querySelector('.vtm-hint');if(h)h.textContent='';};
};
})();

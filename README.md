# dice-roller
Animated dice roller, status strip and scene widgets for a Vampire: The Masquerade V5 chronicle. Load from jsDelivr:

https://cdn.jsdelivr.net/gh/dnalegri/dice-roller@main/roller.js defines VTMCheck(CHECK, STATE, mount)

https://cdn.jsdelivr.net/gh/dnalegri/dice-roller@main/status.js defines VTMStatus(STATUS, mount)

https://cdn.jsdelivr.net/gh/dnalegri/dice-roller@main/scenes.js defines VTMScene, VTMEntrance, VTMDoc, VTMTitle, VTMMail and VTMDaysleep

https://cdn.jsdelivr.net/gh/dnalegri/dice-roller@main/ambience.js defines VTMAmbience (scenes.js loads it on demand)

Each function renders into `mount`, or the element with id vtm.

Scene music: pass `ambience` to VTMScene or VTMTitle as one of casino, haven, velvet, desert, sewers or elysium (lounge still works and plays haven). Each name plays a shuffled rotation of the tracks in `audio/`; the routing table is at the top of ambience.js. Tracks were generated with ElevenLabs Music on a paid plan.

Tests: serve the repo over HTTP with range requests (jsDelivr has them) and open test.html. The music checks need a click on "Run music test".

# dice-roller
Animated dice roller, status strip and scene widgets for a Vampire: The Masquerade V5 chronicle. Load from jsDelivr:

https://cdn.jsdelivr.net/gh/dnalegri/dice-roller@main/roller.js defines VTMCheck(CHECK, STATE, mount)

https://cdn.jsdelivr.net/gh/dnalegri/dice-roller@main/status.js defines VTMStatus(STATUS, mount)

https://cdn.jsdelivr.net/gh/dnalegri/dice-roller@main/scenes.js defines VTMScene, VTMEntrance, VTMDoc, VTMTitle, VTMMail and VTMDaysleep

https://cdn.jsdelivr.net/gh/dnalegri/dice-roller@main/ambience.js defines VTMAmbience (scenes.js loads it on demand)

Each function renders into `mount`, or the element with id vtm.

Tests: open test.html in a browser.

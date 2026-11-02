TPG FP1 Drone

FP1 propeller drone with a rotating launch rail and positional engine sound.
Nominal cruise speed is 170 km/h. Cruise height is 300 m above terrain.
Each launcher carries five rounds with an 3.5-minute interval between shots.
Configured range and endurance limits are 3,400 km and 20 hours; 

INSTALL WITH OVGME
Close DCS. Extract the ZIP and place the "TPG FP1 Drone" folder in your OVGME
mods folder. Set the OVGME configuration root to the Saved Games\DCS folder
you use to play. Enable the mod, then start DCS.
Keep the included Mods and Scripts folders together.

MANUAL INSTALL
Close DCS. Open the extracted "TPG FP1 Drone" folder and copy its Mods and
Scripts folders into C:\Users\<your name>\Saved Games\DCS.
Allow Windows to merge the folders. Use the Saved Games folder for your
active DCS profile if it has a different name.

The finished layout is:
  Mods\tech\TPG FP1 Drone\entry.lua
  Mods\tech\TPG FP1 Drone\bin\TPG_FP1Audio.dll
  Scripts\Hooks\TPG_FP1_Propeller.lua

Leave the DLL in the mod's bin folder. Start DCS after copying both folders.
The files belong in Saved Games; the DCS World program folder is not used.

MISSION SETUP
Ground vehicles > Missiles > TPG FP1 Drone.
Use Advanced Waypoint Actions > Perform Task > Fire at Point.
Place the rail on level ground with a clear path ahead of it.

WHAT TO EXPECT
The launch flame ends shortly after the drone leaves the rail. The booster
separates after launch, and the propeller sound fades in after two seconds.
FP1 follows ground elevation at a nominal 300 m. Airspeed and clearance vary
over steep terrain and during the final dive. Keep the launch corridor and
final approach clear of trees, buildings and ridges. It does not fly a route
around individual obstacles.

REMOVAL
Close DCS. If installed with OVGME, disable the mod there.
For a manual install, remove Mods\tech\TPG FP1 Drone and
Scripts\Hooks\TPG_FP1_Propeller.lua.

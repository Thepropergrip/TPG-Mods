# AKINCI release-planning charts — 5 November 2026

Four PNGs, with every 1,000-foot row from 1,000 to 38,000 ft and six speeds.
Speeds are **KTAS**, not IAS. Table cells are the calculated simulator planning
bands; measured native DCS launches appear in the separate plot below each table.
The reference table is level flight, no wind, and a stationary sea-level target.

- [İHA-230 PNG](iha230-speed-agl.png) · [loaded table CSV](iha230-loaded-table.csv) · 91/91 completed characterization launches had native HIT evidence.
- [QFAB-250 LG PNG](qfab-speed-agl.png) · [loaded table CSV](qfab-loaded-table.csv) · 14/14 completed characterization launches had native HIT evidence.
- [SOM PEN / HE PNG](som-speed-agl.png) · [loaded table CSV](som-loaded-table.csv) · 25/26 completed characterization launches had native HIT evidence.
- [SOM-J GPS / ASM PNG](somj-speed-agl.png) · [loaded table CSV](somj-loaded-table.csv) · 20/24 completed characterization launches had native HIT evidence.

[Actual launch states and dispositions](actual-launch-results.csv).
Unfinished and unlaunched trials are retained there, outside the plotted impact
counts. Five low/slow cruise failures informed the clearance curves; the final
normal-FIRE tests hit with every family. No test bypass is installed in the mod.
The ASM row is native TAS/altitude readback immediately before SHOT, against a
moving ship; its measurement source is explicitly identified in the CSV.

These are DCS 2.9.31.29434 simulation planning limits, not published manufacturer
firing tables or proof of every interpolated cell. All 38 altitude steps have
IHA-230 150-km-class native hit evidence. QFAB has controlled drops at approximately
1,000, 5,000, 10,000, 20,000, 30,000, and 38,000 ft, at two requested speeds each,
plus normal-FIRE low/high checks. Range caps: IHA-230 150 km, SOM 250 km,
SOM-J 275 km. Minimum range and low-speed recovery clearance remain planning
estimates. Native DCS still owns flight, guidance, collisions, fuze and impact.
SOM-J ASM requires a ship track; the GPS 275-km-class proof is separate from
ASM acquisition range. Terrain, target elevation, wind and seeker limits matter.

Nominal-range references: [Roketsan UAV-230](https://roketsan.com.tr/en/products/uav-230-air-surface-ballistic-supersonic-missile),
[TÜBİTAK SAGE SOM](https://www.sage.tubitak.gov.tr/en/cruise-missiles/som/),
[Roketsan SOM-J](https://www.roketsan.com.tr/en/products/som-j-stand-missile).

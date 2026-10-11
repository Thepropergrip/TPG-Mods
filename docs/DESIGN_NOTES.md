# Decisions carried forward

Source: Justin's existing hosting conversation and `CODEX_START_HERE.md`. This prep is infrastructure work, not a new visual proposal.

- Cloudflare Pages hosts the site; GitHub Release assets host mod ZIPs.
- Original homepage grouping was Released, Alpha Tests, Coming Soon. On October 10 Justin requested Released, Alpha Release Test Candidates, and Under Development for the supplied inventory. Use those labels for the initial catalog; keep unconfirmed records hidden.
- Light, warm white, understated presentation; ordinary readable typography and useful documentation.
- Use Justin's actual DCS screenshots. Retain the three-container Grizzly firing hero; do not invent or redesign hardware.
- AN/FPS-132 is a large fixed radar facility.
- Prioritize Grizzly, Akıncı, Shahed-238.
- Quick Look remains in the tab, with background dim/blur, a photo area, quick facts, Download Now and More Info actions, keyboard/backdrop close, and focus returned to its trigger. Photo Coming Soon remains until real images are supplied.
- Each mod uses a repeating six-fact layout, adapted to its type (engagement range/projectile speed, aircraft flight limits, drone cruise/envelope, or static facility capabilities). Use supplied source files and manuals, distinguish declared/configured limits from measured performance, and leave unsupported facts unverified.
- More Info navigates to a real URL such as `/mods/grizzly/`.
- Site traffic comes from Cloudflare Web Analytics; download counts come from GitHub Release assets.
- Only statuses explicitly confirmed by Justin are shown. Release versions come from the supplied ZIP entry.lua files, and download URLs come from GitHub.
- No generated or derived object imagery. Use actual DCS screenshots or a verified free-use photograph of the actual object. If missing, ask for the required photo and leave a Photo Coming Soon placeholder card.
- Under Development entries are website-only: no release upload, download link, or download-stat entry until Justin changes their status.
- Under Development is a section heading above anonymous cards. Supplied preview images can replace placeholders without revealing names; current previews use 50% saturation and the third uses a moderate blur. Do not show development mod names, descriptions, type labels, popup buttons or detail links. Exclude their identities from published JSON and generated routes; source records remain ready for later work.
- Use the supplied package name TPG Containerized SHORAD in public titles. Grizzly is an internal historical identifier, retained only for existing release tags/routes. Show its public version 1.0.23 rather than internal build wording. Do not describe simulated sensors as onboard physical hardware.
- Do not overwrite old release ZIPs. Use exact mod-specific tags/URLs, not the repository-wide latest release.
- Keep supplied ZIP names and original display labels. Do not append versions or replace the mod name in asset filenames. GitHub's own space-to-dot normalization is recorded from its returned asset metadata; internal ZIP folders remain unchanged.
- Kit form 10029231 / UID 19030fcb90 collects email addresses and one required dropdown labeled "Choose your level of alerts". Three cumulative levels: official releases; official releases plus release candidates; all releases, candidates, fixes and news. No separate news checkbox.
- Subscribe uses SimpliSafe's current yellow #f79e00 with dark text, scoped to the Kit form. Color verified from https://simplisafe.com/assets/styles-CEJifqbz.css (aegis-yellow-500), October 10, 2026.
- Email frequency: at most one email per week at the highest alert level; lower levels may receive fewer. Combine relevant items into a single digest, leave at least seven days between announcement broadcasts, and skip sends with no relevant updates. No automatic announcement sending has been configured, and the signup form does not enforce a global sending cap.

## Available source material

The handoff document was read at `D:/DCS Downloads/CODEX_START_HERE.md`. Its referenced `current_mockup/` and `reference_assets/` directories and full `TPG_MODS_CODEX_HANDOFF.zip` were not found directly alongside it during prep. Import them when available before design work. No replacement imagery or new marketing copy has been generated.

- October 10 photo update: use all ten supplied images across Containerized SHORAD, APKWS, Shahed-238, the cannon and three anonymous development previews. Cannon galleries show cannonball and lava ball; Shahed gallery shows the additional cargo-ship scene. Original files stay intact; preview effects are CSS only.
- APKWS remains Alpha Release Test Candidates; the explicit correction overrides the earlier wording calling it released. Shahed-238 is confirmed Released, version 1.0.1 from entry.lua; its README heading still says 1.0.0 and is preserved in the ZIP.

- SAHIN C-UAS uses the supplied front-view DCS screenshot on its card, Quick Look and More Info page; its Alpha status remains unchanged.

- V2 uses the supplied launcher photo as its main image and the two flight screenshots in Quick Look and More Info. SAHIN C-UAS has a secondary combat-scene image. The fourth anonymous development card now has the supplied panel-detail preview at 50% saturation. All six available mods and four development cards have real supplied images; development names and actions stay hidden.

- Photo areas follow each image's natural aspect ratio with no coloured letterboxing or forced 16:9 box. Quick Look photos fit within its available width and 340 px height while preserving their proportions. The third development preview blur is 1.75 px, one quarter of the original strength; no image zoom is applied.

- The on-page Kit signup form background uses Screen_260924_194834.png. Override the embedded form's stock background through scoped CSS, add a translucent dark overlay and white heading/helper labels, and retain the yellow Subscribe button and actual preference/subscription fields. Original screenshot bytes are unchanged.

# Decisions carried forward

Source: Justin's existing hosting conversation and `CODEX_START_HERE.md`. This prep is infrastructure work, not a new visual proposal.

- Cloudflare Pages hosts the site; GitHub Release assets host mod ZIPs.
- Original homepage grouping was Released, Alpha Tests, Coming Soon. On October 10 Justin requested Released, Alpha Release Test Candidates, and Under Development for the supplied inventory. Use those labels for the initial catalog; keep unconfirmed records hidden.
- Light, warm white, understated presentation; ordinary readable typography and useful documentation.
- Use Justin's actual DCS screenshots. Retain the three-container Grizzly firing hero; do not invent or redesign hardware.
- AN/FPS-132 is a large fixed radar facility.
- Prioritize Grizzly, Akıncı, Shahed-238.
- Quick Look remains in the tab, with background dim/blur, a photo area, quick facts, Download Now and More Info actions, keyboard/backdrop close, and focus returned to its trigger. Photo Coming Soon remains until real images are supplied.
- Each mod uses a repeating quick-fact layout adapted to its type, including best target types for available mods. Use supplied source files and manuals, distinguish declared/configured limits from measured performance, and leave unsupported facts unverified.
- More Info navigates to a real URL such as `/mods/grizzly/`.
- Site traffic comes from Cloudflare Web Analytics; download counts come from GitHub Release assets.
- Only statuses explicitly confirmed by Justin are shown. Release versions come from the supplied ZIP entry.lua files, and download URLs come from GitHub.
- No generated or derived object imagery. Use actual DCS screenshots or a verified free-use photograph of the actual object. If missing, ask for the required photo and leave a Photo Coming Soon placeholder card.
- Under Development entries are website-only: no release upload, download link, or download-stat entry until Justin changes their status.
- Under Development is a section heading above anonymous cards. Supplied preview images can replace placeholders without revealing names; current previews use 50% saturation and the third uses a moderate blur. Do not show development mod names, descriptions, type labels, popup buttons or detail links. Exclude their identities from published JSON and generated routes; source records remain ready for later work.
- Use the supplied package name TPG Containerized SHORAD in public titles. Grizzly is an internal historical identifier, retained only for existing release tags/routes. Show its public version 1.0.23 rather than internal build wording. Do not describe simulated sensors as onboard physical hardware.
- Do not overwrite old release ZIPs. Use exact mod-specific tags/URLs, not the repository-wide latest release.
- Keep supplied ZIP names and original display labels. Do not append versions or replace the mod name in asset filenames. GitHub's own space-to-dot normalization is recorded from its returned asset metadata; internal ZIP folders remain unchanged.
- Kit form 10029231 / UID 19030fcb90 collects an email address for one announcement list. No signup tiers or level choices.
- Subscribe uses SimpliSafe's current yellow #f79e00 with dark text, scoped to the Kit form. Color verified from https://simplisafe.com/assets/styles-CEJifqbz.css (aegis-yellow-500), October 10, 2026.
- Email frequency: at most one announcement per week. Combine new releases, alpha candidates, bug fixes and feature enhancements, leaving at least seven days between sends.

## Available source material

The handoff document was read at `D:/DCS Downloads/CODEX_START_HERE.md`. Its referenced `current_mockup/` and `reference_assets/` directories and full `TPG_MODS_CODEX_HANDOFF.zip` were not found directly alongside it during prep. Import them when available before design work. No replacement imagery or new marketing copy has been generated.

- October 10 photo update: use all ten supplied images across Containerized SHORAD, APKWS, Shahed-238, the cannon and three anonymous development previews. Cannon galleries show cannonball and lava ball; Shahed gallery shows the additional cargo-ship scene. Original files stay intact; preview effects are CSS only.
- APKWS remains Alpha Release Test Candidates; the explicit correction overrides the earlier wording calling it released. Shahed-238 is confirmed Released. The initial package was 1.0.1; the October 16 supplied folder updates it to 1.0.2.

- SAHIN C-UAS uses the supplied front-view DCS screenshot on its card, Quick Look and More Info page; its Alpha status remains unchanged.

- V2 uses the supplied launcher photo as its main image and the two flight screenshots in Quick Look and More Info. SAHIN C-UAS has a secondary combat-scene image. The fourth anonymous development card uses the latest supplied hangar screenshot at 50% saturation, replacing the earlier panel-detail preview. All six available mods and four development cards have real supplied images; development names and actions stay hidden.

- Photo areas follow each image's natural aspect ratio with no coloured letterboxing or forced 16:9 box. Quick Look photos fit within its available width and 340 px height while preserving their proportions. The third development preview blur is 1.75 px, one quarter of the original strength; no image zoom is applied.

- The signup background follows the image selected in Kit. Preserve it when editing signup copy; the website adds a dark overlay and white text without replacing the native image. Retain the yellow Subscribe button.

- The main catalog uses up to 1,800 px on wide screens. The bottom signup box is centered and capped at 576 px (20% narrower than its previous 720 px), with reduced type and spacing. Remove the extra Email updates heading and weekly-frequency paragraph above the box.
- Signup copy: Sign Up For Mod Announcements; New releases, alpha candidates, bug fixes and feature enhancements.; NO sales, once per week at maximum. The scoped module preserves native Kit subscription handling.

- Catalog sections share the same responsive column widths: four on wide screens, then three, two and one as space narrows. A section with fewer items fills columns from the left; two Alpha cards must have the same width as Released cards, without stretching across the whole row. Images retain their natural proportions.

- October 11 signup simplification supersedes the earlier tier design. Remove the signup dropdown, native tier topics and engagement footer. Keep subscriber data and the Unsubscribe link.

- October 11 site copy update: show the approved Released and Alpha bylines once below each catalog heading. Remove configured-versus-tested caveats, technical source-file dropdowns and visible gallery captions across the website. Retain image alt text, model credits, historical research links and practical operating instructions.
- October 11 rocket photo replacement: use the supplied cursor-free M8 flight screenshot at /assets/images/calliope-m8.png in Quick Look and More Info. Preserve the signup image.

- October 16: use a single consolidated Usage notes section, then brief factual history with source links and warhead/ammunition details. Keep Change Log as the last section of applicable More Info pages, dated with the user's local date. Never repeat the old cannon setup requirement outside its dated change entry. V-2 uses launch base, highlights its custom trajectory, and includes the supplied trajectory graph in More Info. The later October 23 correction removes the SHORAD altitude-gate explanation entirely.

- October 23 copy sweep: Justin requested natural wording throughout the website, especially More Info and Quick Look. Use short factual histories, direct setup instructions and plain descriptions of features. Remove development narration, unfinished-site notes and terms such as target-altitude gate, reduced-dispersion test round and burst-tail audio from public prose. Keep useful specifications, source links, credits, historical release dates and the approved catalog bylines. This is an editorial change; mod packages, versions and download records remain unchanged.

- October 23 follow-up: check whether every instruction makes sense for the actual unit. Do not tell a fixed container launcher to stop before firing. Omit obvious explanations such as the 10,000 m targeting-filter discussion, and avoid repeating specifications or explaining basic concepts unnecessarily. Keep deployment/travel instructions specific to the mobile or towed variants they apply to. The Containerized SHORAD history should cover Lockheed Martin’s real GRIZZLY, including its 2026 Hellfire launch tests and JAGM drone interception, with primary-source links.

- October 23 Contact Us: add a simple black strip across the top of every page, with Contact Us opening four choices: Volunteer to be a TPG Mod Tester, Report a Bug, New Mod Request, and Existing Mod Feature Requests. Discord was canceled. Each choice opens short tailored questions, free text, an optional attachment and a required email. Justin selected Thepropergrip@gmail.com for receipt and confirmed pages.dev-only hosting. Keep forms visually simple and use only confirmed public mod names in dropdowns. See CONTACT_SETUP.md for delivery and activation details.

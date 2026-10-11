# Setup status

Prepared locally on October 10, 2026:

- Static build and a plain catalog, with indexing discouraged before launch.
- Only confirmed mod statuses appear on the site; versions come from supplied packages, URLs from GitHub. Unconfirmed original placeholders remain hidden.
- GitHub repository setup command, release ZIP hashing, draft upload and publication commands.
- Download count aggregation and GitHub validation/refresh workflows.
- Cloudflare Git integration settings and retained design decisions.

Verified live:

- GitHub: https://github.com/Thepropergrip/TPG-Mods — public, branch `main`, local `origin` connected and commits pushed.
- GitHub CLI authorized for Thepropergrip; credentials stored in the Windows keyring.
- Cloudflare: https://tpg-mods.pages.dev/ — GitHub integration connected, production branch `main`, automatic deployments enabled.
- Cloudflare build corrected to `npm run build`, output `dist`, Node 24. The initial dashboard defaults published the repository root; the corrected deployment serves the holding page.
- Homepage returns HTTP 200 with a noindex header. Both public JSON data endpoints work. Source/config paths return 404 on fresh requests to the corrected deployment.
- Local checks, nine catalog and counting/configuration tests, static build, and GitHub Actions validation passed.
- Cloudflare CLI authorization stored encrypted, using Windows Credential Manager, with account/user read and Pages write scopes.
- Cloudflare Web Analytics enabled, with its injected beacon verified on the deployed site.
- Download-count workflow successfully ran manually and on published releases.
- Six real ZIPs uploaded and published; GitHub asset checksums verified. Every public download was fetched without authentication and its SHA-256 matched the supplied original ZIP or, for Shahed-238, the ZIP verified against all 58 supplied folder files.
- Kit signup form configured with one required alert-level dropdown and three cumulative preferences. Its public endpoint confirms real tag IDs and no news checkbox. The homepage includes the supplied JavaScript embed and a direct form link when JavaScript is disabled. No announcement sending or automatic frequency enforcement has been configured; the weekly send procedure is in README.md.

Current confirmed inventory:

| Mod | Status | Package version | Download |
| --- | --- | --- | --- |
| TPG Containerized SHORAD | Released | 1.0.23 | GitHub Release |
| Shahed-238 GPS / ASM | Released | 1.0.1 | GitHub Release |
| V2 | Released | 1.0 | GitHub Release |
| 12 Pounder Cannon | Released | 1.2 | GitHub Release |
| APKWS VSHORAD | Alpha release test candidate | 0.1.4 | GitHub prerelease |
| SAHIN 40mm C-UAS | Alpha release test candidate | 1.0.34 | GitHub prerelease |
| Akıncı | Under Development | — | Excluded |
| FP-132 Radar | Under Development | — | Excluded |
| Anduril Rail | Under Development | — | Excluded |
| FP1 Drone | Under Development | — | Excluded |

The inventory above is retained for maintenance. On the website, the Under Development heading appears once above four anonymous cards: three supplied preview images and one Photo Coming Soon placeholder, with no names, descriptions or actions. Development identities are excluded from published JSON and detail pages. The ten-card catalog uses the supplied screenshots for Containerized SHORAD, APKWS, Shahed-238 and the cannon. Cannon and Shahed galleries include the additional supplied screenshots. Development previews use 50% saturation; the third also uses a moderate 7 px CSS blur. Original image files are preserved byte-for-byte; no generated imagery is used. See IMAGE_VERIFICATION.json for source filenames and hashes. The four development packages have not been uploaded to GitHub and are excluded from the download database. See `RELEASE_VERIFICATION.json` for public ZIP hashes and URLs.

Quick Look opens an in-page modal with a dimmed, blurred base page and six type-specific facts for each of the six available mods. Available releases have Download Now and More Info actions on both cards and popups. Their six More Info routes are real `/mods/<id>/` pages with the same facts, usage notes and included documentation where supplied. Close-button and backdrop handling were checked with a DOM harness; native Escape and focus containment still need browser verification. Quick Look falls back to the detail page when JavaScript or native dialog support is unavailable.

The supplied FP-132 source is explicitly a non-functional static structure; no functional detection range is claimed. Drone range/endurance envelopes and declared speed limits are not represented as measured in-game performance. Facts and source filenames are retained in `data/mod-info.json`.

Still to finish:

- Original mockup and screenshot bundle import; visitor design intentionally deferred.
- Photos remain needed for V2, SAHIN and the remaining anonymous development placeholder.
- Final visitor design, expanded documentation, and any future custom domain.

When resuming, use this checkout and repository rather than creating another project. Keep the existing Git integration, exact release tags, and design decisions in DESIGN_NOTES.md.

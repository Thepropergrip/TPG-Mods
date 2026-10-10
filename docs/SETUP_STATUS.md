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
- Local checks, three counting/configuration tests, static build, and GitHub Actions validation passed.
- Cloudflare CLI authorization stored encrypted, using Windows Credential Manager, with account/user read and Pages write scopes.
- Cloudflare Web Analytics enabled, with its injected beacon verified on the deployed site.
- Download-count workflow successfully ran manually and on each of the five published releases.
- Five real ZIPs uploaded and published; GitHub asset checksums verified. Every public download was fetched without authentication and its SHA-256 matched the supplied original ZIP.

Current confirmed inventory:

| Mod | Status | Package version | Download |
| --- | --- | --- | --- |
| Grizzly / Containerized SHORAD | Released | 1.0.23-ready-cell-state | GitHub Release |
| V2 | Released | 1.0 | GitHub Release |
| 12 Pounder Cannon | Released | 1.2 | GitHub Release |
| APKWS VSHORAD | Alpha release test candidate | 0.1.4 | GitHub prerelease |
| SAHIN 40mm C-UAS | Alpha release test candidate | 1.0.34 | GitHub prerelease |
| Akıncı | Under Development | — | Excluded |
| FP-132 Radar | Under Development | — | Excluded |
| Anduril Rail | Under Development | — | Excluded |
| FP1 Drone | Under Development | — | Excluded |

The Under Development heading appears once for its section; individual cards have no status badge. All nine confirmed cards use Photo Coming Soon placeholders. No generated or derived imagery is used. The four development packages have not been uploaded to GitHub and are excluded from the download database. See `RELEASE_VERIFICATION.json` for public ZIP hashes and URLs.

Still to finish:

- Original mockup and screenshot bundle import; visitor design intentionally deferred.
- Actual DCS screenshots or verified free-use photographs of the actual objects, to replace Photo Coming Soon cards.
- Detailed mod pages, final visitor design, and any future custom domain.

When resuming, use this checkout and repository rather than creating another project. Keep the existing Git integration, exact release tags, and design decisions in DESIGN_NOTES.md.

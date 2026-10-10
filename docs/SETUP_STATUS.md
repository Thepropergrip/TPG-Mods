# Setup status

Prepared locally on October 10, 2026:

- Static build and holding page, with indexing discouraged before launch.
- Mod records with unconfirmed statuses; no invented versions or URLs.
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

Still to finish:

- Cloudflare Web Analytics activation is pending; its beacon must be verified after activation and redeployment.
- First real mod ZIP upload/download test; current release ZIP not yet selected. Upload/publication commands are prepared, not yet exercised with a real mod.
- Original mockup and screenshot bundle import; visitor design intentionally deferred.

When resuming, use this checkout and repository rather than creating another project. Keep the existing Git integration, exact release tags, and design decisions in DESIGN_NOTES.md.

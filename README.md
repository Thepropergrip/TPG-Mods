# TPG Mods — infrastructure prepared

This checkout prepares the GitHub Releases and Cloudflare Pages pipeline. The visitor design remains open. `site/` contains only a holding page; replace it when design work begins. `launchReady` is false, so the build discourages search indexing. This is not access control: a deployed holding page is publicly reachable.

## Routine commands

Node.js 22+ and Git are required. The static build has no npm dependencies.

```powershell
npm run check
npm test
npm run build
```

The build publishes only `dist/`: site files plus generated public mod/download data. It never publishes scripts, notes, local release plans, credentials, or mod ZIPs.

## GitHub setup

Configured owner: `Thepropergrip`. Repository: `TPG-Mods`, public, branch `main`. The owner was verified using the connected GitHub profile. The connector alone does not authenticate Git or the GitHub CLI.

If `gh` is missing, install a checkout-local copy from the official GitHub CLI release, with checksum verification:

```powershell
pwsh -File scripts/install-gh.ps1
& ./.tools/gh/bin/gh.exe auth login --hostname github.com --git-protocol https --web
npm run github:setup
```

`github:setup` creates the public repository if absent and pushes `main`. It refuses a different authenticated user, a different origin, or an existing private repository. It does not force-push or change another repository's visibility. Run it from this initialized Git checkout after committing any intentional changes.

## Cloudflare Pages setup

Use **Git integration** with this repository, not a new Direct Upload project. Git integration preserves automatic deployment on pushes without storing a Cloudflare API token in GitHub.

| Setting | Prepared value |
| --- | --- |
| Project name | `tpg-mods` (subject to availability) |
| Repository | `Thepropergrip/TPG-Mods` |
| Production branch | `main` |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root |
| Node version | `24` |

Account sign-in and GitHub App authorization happen in Cloudflare. Enable the project's Web Analytics after creating it; Cloudflare adds the beacon on a subsequent deployment. A custom domain can wait. No R2 is configured and there is no Google Drive download integration.

## Prepare and upload an actual release

Use the actual version and your existing release notes. The following values are illustrative and do not claim that this build exists:

```powershell
npm run release:prepare -- --mod grizzly --version 1.0.17 --status released --zip 'D:/path/to/actual.zip' --notes 'D:/path/to/actual-release-notes.md'
npm run release:upload
```

`prepare` checks ZIP signature/size, hashes the file, and saves a local plan under ignored `.local/`. `upload` checks the hash again and creates a **draft** with a predictable asset filename, e.g. `TPG_grizzly_1.0.17.zip`. It refuses any existing release with the same tag. Alpha status produces a prerelease. Source ZIPs remain untouched and are never committed.

Review the draft and ZIP. When ready:

```powershell
npm run release:publish
git add data/mods.json
git commit -m 'Update Grizzly release link'
git push
```

Publishing checks the uploaded size and GitHub checksum when available, publishes the draft, and updates the local mod record with GitHub's actual URL. The commit/push updates the Pages build. Do not use `/releases/latest/` across multiple mods: the repository has releases for several independent projects. Each download is linked to its exact mod tag and asset.

Every new version gets a new tag, such as `grizzly-v1.0.17`. Existing releases and assets are retained. The final visitor design can consume `/data/mods.json` and `/data/downloads.json` without rebuilding this infrastructure.

## Statistics

Builds fetch all release pages, aggregate ZIP download counts by mod-specific tags, exclude drafts, and track the exact configured current asset. API failures produce unknown counts or a marked stale snapshot, never fake zeroes. These are file download counts, not installations or unique people.

The `Refresh download counts` GitHub workflow runs on a published release or when manually started. A recurring schedule has not been enabled. Counts are snapshots; they refresh at build time, on release publication, or on a manual refresh. Cloudflare traffic analytics stays in Cloudflare's dashboard for now.

## Design work later

Continue from `docs/DESIGN_NOTES.md`. Replace the holding page, add the actual screenshots, per-mod documentation URLs, and Quick View behavior, then set `launchReady` to true and remove the holding page's HTML `noindex` meta tag. Versions and download links can remain in the existing data files.

## Official references

- [GitHub CLI repository creation](https://cli.github.com/manual/gh_repo_create)
- [GitHub CLI release creation](https://cli.github.com/manual/gh_release_create)
- [Release asset fields and download counts](https://docs.github.com/en/rest/releases/assets)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare Pages build settings](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages Web Analytics](https://developers.cloudflare.com/pages/how-to/web-analytics/)

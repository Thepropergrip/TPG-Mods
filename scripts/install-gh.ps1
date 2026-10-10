$ErrorActionPreference = 'Stop'
$taskProjectRoot = Split-Path -Parent $PSScriptRoot
$taskToolRoot = Join-Path $taskProjectRoot '.tools'
New-Item -ItemType Directory -Path $taskToolRoot -Force | Out-Null
$taskRelease = Invoke-RestMethod -Uri 'https://api.github.com/repos/cli/cli/releases/latest'
$taskAsset = $taskRelease.assets | Where-Object { $_.name -match '^gh_.*_windows_amd64.zip$' } | Select-Object -First 1
$taskChecksums = $taskRelease.assets | Where-Object { $_.name -match 'checksums.txt$' } | Select-Object -First 1
if (-not $taskAsset -or -not $taskChecksums) { throw 'Official GitHub CLI download metadata missing.' }
$taskArchivePath = Join-Path $taskToolRoot 'gh.zip'
$taskChecksumPath = Join-Path $taskToolRoot 'checksums.txt'
Invoke-WebRequest -Uri $taskAsset.browser_download_url -OutFile $taskArchivePath
Invoke-WebRequest -Uri $taskChecksums.browser_download_url -OutFile $taskChecksumPath
$taskLine = Get-Content -LiteralPath $taskChecksumPath | Where-Object { $_ -match [regex]::Escape($taskAsset.name) } | Select-Object -First 1
if (-not $taskLine) { throw 'Official checksum missing.' }
$taskExpected = ($taskLine.Trim() -split '\s+')[0]
$taskActual = (Get-FileHash -LiteralPath $taskArchivePath -Algorithm SHA256).Hash
if ($taskActual -ne $taskExpected) { throw 'Checksum mismatch; tool was not installed.' }
Expand-Archive -LiteralPath $taskArchivePath -DestinationPath (Join-Path $taskToolRoot 'gh') -Force
Write-Output ('Installed verified GitHub CLI ' + $taskRelease.tag_name + ' into ignored .tools/.')

param([string]$AccountId)
$ErrorActionPreference = 'Stop'
$taskProjectRoot = Split-Path -Parent $PSScriptRoot
$taskConfig = Get-Content -LiteralPath (Join-Path $taskProjectRoot 'config/project.json') -Raw | ConvertFrom-Json
$taskGh = if ($env:GH_BIN) { $env:GH_BIN } elseif (Test-Path -LiteralPath (Join-Path $taskProjectRoot '.tools/gh/bin/gh.exe')) { Join-Path $taskProjectRoot '.tools/gh/bin/gh.exe' } else { 'gh' }
$taskRepoName = $taskConfig.github.owner + '/' + $taskConfig.github.repo
$taskRepository = & $taskGh api ('repos/' + $taskRepoName) | ConvertFrom-Json
if ($LASTEXITCODE -ne 0) { throw 'Unable to inspect the GitHub repository.' }
# Credential output is captured in memory, never printed or written to project files.
$taskCredentials = npm exec --yes --package wrangler@4 -- wrangler auth token --json | ConvertFrom-Json
if ($LASTEXITCODE -ne 0 -or -not $taskCredentials.token) { throw 'Sign into Cloudflare with Wrangler first.' }
$taskHeaders = @{ Authorization = 'Bearer ' + $taskCredentials.token }
if (-not $AccountId) {
    $taskAccounts = Invoke-RestMethod -Headers $taskHeaders -Uri 'https://api.cloudflare.com/client/v4/accounts'
    if ($taskAccounts.result.Count -ne 1) { throw 'Specify -AccountId to select the intended Cloudflare account.' }
    $AccountId = $taskAccounts.result[0].id
}
if ($AccountId -notmatch '^[a-f0-9]{32}$') { throw 'Invalid Cloudflare account ID.' }
$taskBaseUri = 'https://api.cloudflare.com/client/v4/accounts/' + $AccountId + '/pages/projects'
$taskName = $taskConfig.cloudflare.projectName
$taskExistingResponse = Invoke-WebRequest -Headers $taskHeaders -Uri ($taskBaseUri + '/' + $taskName) -SkipHttpErrorCheck
if ($taskExistingResponse.StatusCode -eq 200) {
    $taskExisting = ($taskExistingResponse.Content | ConvertFrom-Json).result
    if ($taskExisting.source.type -ne 'github' -or $taskExisting.source.config.repo_id -ne [string]$taskRepository.id) { throw 'Existing Pages project points to another source. No changes made.' }
    Write-Output ('Pages project already connected: https://' + $taskExisting.subdomain)
    return
}
if ($taskExistingResponse.StatusCode -ne 404) { throw ('Unable to check Pages project: HTTP ' + $taskExistingResponse.StatusCode) }
$taskEnvironment = @{ env_vars = @{ NODE_VERSION = @{ type = 'plain_text'; value = '24' } } }
$taskBody = @{
    name = $taskName
    production_branch = $taskConfig.cloudflare.productionBranch
    build_config = @{ build_command = $taskConfig.cloudflare.buildCommand; destination_dir = $taskConfig.cloudflare.outputDirectory; root_dir = ''; build_caching = $true }
    deployment_configs = @{ production = $taskEnvironment; preview = $taskEnvironment }
    source = @{ type = 'github'; config = @{
        owner = $taskRepository.owner.login
        owner_id = [string]$taskRepository.owner.id
        repo_name = $taskRepository.name
        repo_id = [string]$taskRepository.id
        production_branch = $taskConfig.cloudflare.productionBranch
        production_deployments_enabled = $true
        preview_deployment_setting = 'all'
        pr_comments_enabled = $true
    } }
} | ConvertTo-Json -Depth 12
$taskResponse = Invoke-WebRequest -Uri $taskBaseUri -Method Post -Headers $taskHeaders -ContentType 'application/json' -Body $taskBody -SkipHttpErrorCheck
$taskResult = $taskResponse.Content | ConvertFrom-Json
if (-not $taskResult.success) {
    throw (($taskResult.errors | ForEach-Object { $_.message }) -join '; ')
}
Write-Output ('Created Git-connected Pages project: https://' + $taskResult.result.subdomain)

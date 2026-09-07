# Push security fixes to GitHub fork using Git Data API
# Creates blobs -> tree -> commit -> updates ref (single atomic commit)

$env:GITHUB_TOKEN = ""
$owner = "Sunil56224972"
$repo = "corsair"
$branch = "security/audit-fixes-v2"
$basePath = "c:\Users\sunil\Downloads\corsair-main\corsair-main"

# Files to push (path relative to repo root)
$files = @(
    "packages/corsair/workflows/execute.ts",
    "packages/corsair/hub/signing/envelope.ts",
    "packages/corsair/core/management/handler.ts",
    "packages/corsair/hub/delivery.ts",
    "packages/corsair/core/auth/state.ts",
    "packages/corsair/tests/security-audit-poc.test.ts"
)

# Step 1: Get the current commit SHA and tree SHA for the branch
Write-Host "Getting branch info..."
$refInfo = gh api "repos/$owner/$repo/git/refs/heads/$branch" | ConvertFrom-Json
$commitSha = $refInfo.object.sha
Write-Host "Current commit: $commitSha"

$commitInfo = gh api "repos/$owner/$repo/git/commits/$commitSha" | ConvertFrom-Json
$baseTreeSha = $commitInfo.tree.sha
Write-Host "Base tree: $baseTreeSha"

# Step 2: Create blobs for each file
$treeItems = @()
foreach ($filePath in $files) {
    $fullPath = Join-Path $basePath $filePath
    Write-Host "Creating blob for $filePath..."
    
    $contentBytes = [System.IO.File]::ReadAllBytes($fullPath)
    $b64Content = [Convert]::ToBase64String($contentBytes)
    
    $blobJson = @{
        content = $b64Content
        encoding = "base64"
    } | ConvertTo-Json
    
    $blobResult = $blobJson | gh api "repos/$owner/$repo/git/blobs" --input - | ConvertFrom-Json
    Write-Host "  Blob SHA: $($blobResult.sha)"
    
    $treeItems += @{
        path = $filePath
        mode = "100644"
        type = "blob"
        sha = $blobResult.sha
    }
}

# Step 3: Create a new tree
Write-Host "Creating tree..."
$treeJson = @{
    base_tree = $baseTreeSha
    tree = $treeItems
} | ConvertTo-Json -Depth 5

$treeResult = $treeJson | gh api "repos/$owner/$repo/git/trees" --input - | ConvertFrom-Json
Write-Host "New tree: $($treeResult.sha)"

# Step 4: Create the commit
Write-Host "Creating commit..."
$commitMsg = "security: fix 7 vulnerabilities found in deep manual audit`n`nCritical:`n- VM sandbox escape via unblocked well-known Symbols in harden() membrane`n`nHigh:`n- HMAC signature does not bind timestamp header`n- Management API leaks internal error details to clients`n`nMedium:`n- Open redirect via unvalidated hubSuccessUrl`n- OAuth state has no default max-age`n`nIncludes PoC tests proving each vulnerability."

$commitJson = @{
    message = $commitMsg
    tree = $treeResult.sha
    parents = @($commitSha)
} | ConvertTo-Json -Depth 3

$newCommit = $commitJson | gh api "repos/$owner/$repo/git/commits" --input - | ConvertFrom-Json
Write-Host "New commit: $($newCommit.sha)"

# Step 5: Update the branch ref
Write-Host "Updating branch ref..."
$refJson = @{
    sha = $newCommit.sha
    force = $false
} | ConvertTo-Json

gh api "repos/$owner/$repo/git/refs/heads/$branch" -X PATCH --input - $refJson | Out-Null
Write-Host "Branch updated successfully!"
Write-Host "Done! Branch $branch is ready for PR."

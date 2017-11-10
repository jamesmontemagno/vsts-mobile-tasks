Param(
  [string]$plist_path,
  [string]$offset,
  [string]$versionNumber,
  [string]$shortCode
)

# requies parameters
if(!$plist_path)
{
    write-host " [!] Missing required input: plist_path"
    exit 1
} 

if(!(Test-Path $plist_path))
{
    Write-Host " [!] File doesn't exist at specified Info.plist path: $plist_path"
    exit 1
}

if(!$versionNumber)
{
    Write-Host " [!] No versionNumber specified!"
    exit 1
}

# ---------------------
# --- Configs:
Write-Host " (i) Provided Info.plist path: $plist_path"

if(!$shortCode)
{
    Write-Host " (i) Version numer: $shortCode"
}

if(!$offset)
{
    Write-Host " (i) Build number offset: $offset"

    $versionNumber = $versionNumber + $offset
}

Write-Host " (i) Build number: $versionNumber"    

# ---------------------
# --- Main:

# ---- Current Bundle Version:
& /usr/libexec/PlistBuddy -c "Print CFBundleVersion" $plist_path

# ---- Set Bundle Version:
& /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $versionNumber" $plist_path

if(!$shortCode)
{
    # ---- Current Bundle Short Version String:
   & /usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" $plist_path

  # ---- Set Bundle Short Version String:
  & /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $shortCode" $plist_path   
}
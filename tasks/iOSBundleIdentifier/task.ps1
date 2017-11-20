Param(
  [string]$sourcePath,
  [string]$bundleIdentifier,
  [string]$bundleName,
  [bool]$printFile
)

# requies parameters
if(!$sourcePath)
{
    write-host " [!] Missing required input: sourcePath"
    exit 1
} 

if(!(Test-Path $sourcePath))
{
    Write-Host " [!] File doesn't exist at specified Info.plist path: $sourcePath"
    exit 1
}

if(!$bundleIdentifier)
{
    Write-Host " [!] No bundleIdentifier specified!"
    exit 1
}

# ---------------------
# --- Configs:
Write-Host " (i) Provided Info.plist path: $sourcePath"


Write-Host " (i) Bundle Identifier: $bundleIdentifier"    

# ---------------------
# --- Main:

if($printFile)
{
    Write-Host "Original info.Plist:"
    Get-Content $sourcePath | Write-Host
}

# ---- Current Bundle Version:
& /usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" $sourcePath

# ---- Set Bundle Version:
& /usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier $bundleIdentifier" $sourcePath

# ---- New Bundle Version:
& /usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" $sourcePath

if($bundleName)
{
    # ---- Current Bundle Short Version String:
   & /usr/libexec/PlistBuddy -c "Print CFBundleName" $sourcePath

  # ---- Set Bundle Short Version String:
  & /usr/libexec/PlistBuddy -c "Set :CFBundleName $bundleName" $sourcePath   

  & /usr/libexec/PlistBuddy -c "Print CFBundleName" $sourcePath
}

if($printFile)
{
    Write-Host "Final info.Plist:"
    Get-Content $sourcePath | Write-Host
}
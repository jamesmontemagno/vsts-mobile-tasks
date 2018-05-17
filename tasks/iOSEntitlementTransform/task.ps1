Param(
  [string]$sourcePath,
  [string]$versionCodeOffset,
  [string]$versionCode,
  [string]$versionName,
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

if(!$versionCode)
{
    Write-Host " [!] No versionCode specified!"
    exit 1
}

# ---------------------
# --- Configs:
Write-Host " (i) Provided Info.plist path: $sourcePath"

if($versionName)
{
    Write-Host " (i) Version name (shortcode): $versionName"
}

if($versionCodeOffset)
{
    Write-Host " (i) Build number versionCodeOffset: $versionCodeOffset"

    $versionCode = $versionCode/1 + $versionCodeOffset/1
}

Write-Host " (i) Build number: $versionCode"    

# ---------------------
# --- Main:

# ---- Current Bundle Version:

if($printFile)
{
    Write-Host "Original info.Plist:"
    Get-Content $sourcePath | Write-Host
}

& /usr/libexec/PlistBuddy -c "Print CFBundleVersion" $sourcePath

# ---- Set Bundle Version:
& /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $versionCode" $sourcePath

if($versionName)
{
    # ---- Current Bundle Short Version String:
   & /usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" $sourcePath

  # ---- Set Bundle Short Version String:
  & /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $versionName" $sourcePath   
}

if($printFile)
{
    Write-Host "Final info.Plist:"
    Get-Content $sourcePath | Write-Host
}
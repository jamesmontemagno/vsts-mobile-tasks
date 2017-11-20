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
    Write-Host " [!] File doesn't exist at specified Android Manifest path: $sourcePath"
    exit 1
}

if(!$versionCodeOffset)
{
    Write-Host " [!] No versionCodeOffset specified!"
    exit 1
}

if(!$versionCode)
{
    Write-Host " [!] No versionCode specified!"
    exit 1
}

if(!$versionName)
{
    Write-Host " [!] No versionName specified!"
    exit 1
}

# ---------------------
# --- Configs:
Write-Host " (i) Provided Android Manifest path: $sourcePath"


Write-Host " (i) New versionCodeOffset: $versionCodeOffset"    

Write-Host " (i) New versionCode: $versionCode"  

Write-Host " (i) New versionName: $versionName"  

$final_code = $versionCodeOffset/1 + $versionCode/1


 # Load the bootstrap file
 [xml] $xam = Get-Content -Path $sourcePath
 
 # Get the version from Android Manifest
 $CODE = Select-Xml -xml $xam  -Xpath "/manifest/@android:versionCode" -namespace @{android="http://schemas.android.com/apk/res/android"}

 $NAME = Select-Xml -xml $xam  -Xpath "/manifest/@android:versionName" -namespace @{android="http://schemas.android.com/apk/res/android"}

 $old_code = $CODE.Node.Value;

 $old_name = $NAME.Node.Value;

 Write-Host " (i) Old version code: $old_code"  

 Write-Host " (i) Old version name: $old_name"  

# ---------------------
# --- Main:

if($printFile)
{
    Write-Host "Original Manifest:"
    Get-Content $sourcePath | Write-Host
}

$NAME.Node.Value = $final_code

$NAME.Node.Value = $versionName

$xam.Save($sourcePath)

if($printFile)
{
    Write-Host "Final Manifest:"
    Get-Content $sourcePath | Write-Host
}
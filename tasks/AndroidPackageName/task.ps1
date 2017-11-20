Param(
  [string]$sourcePath,
  [string]$packageName,
  [string]$appLabel,
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

if(!$packageName)
{
    Write-Host " [!] No packageName specified!"
    exit 1
}

# ---------------------
# --- Configs:
Write-Host " (i) Provided Android Manifest path: $sourcePath"


Write-Host " (i) New Package Name: $packageName"    


 # Load the bootstrap file
 [xml] $xam = Get-Content -Path $sourcePath
 
 # Get the version from Android Manifest
 $NAME = Select-Xml -xml $xam  -Xpath "/manifest/@package" -namespace @{android="http://schemas.android.com/apk/res/android"}

 $old_name = $NAME.Node.Value;

 Write-Host " (i) Original Package Name: $old_name"  

# ---------------------
# --- Main:

if($printFile)
{
    Write-Host "Original Manifest:"
    Get-Content $sourcePath | Write-Host
}

$NAME.Node.Value = $packageName

if($appLabel)
{
    Write-Host " (i) New App Label: $appLabel"  

    # Get the version from Android Manifest
    $LABEL = Select-Xml -xml $xam  -Xpath "/manifest/application/@android:label" -namespace @{android="http://schemas.android.com/apk/res/android"}
    
    $old_label = $LABEL.Node.Value;

    $LABEL.Node.Value = $appLabel
    
    Write-Host " (i) Old App Label: $old_label"  
}



$xam.Save($sourcePath)

if($printFile)
{
    Write-Host "Final Manifest:"
    Get-Content $sourcePath | Write-Host
}
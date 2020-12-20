

param (
    [Parameter(Mandatory)]
    [string]
    $ManifestPath,

    # manual, long-term adjustment to build id or whatever
    [Parameter(Mandatory)]
    [int]
    $VersionCodeBase,

    # the value that increases each time
    [Parameter(Mandatory)]
    [int]
    $VersionCodeOffset,

    [Parameter(Mandatory)]
    [string]
    $VersionName,

    [bool]
    $PrintFile = $false
)

[int] $versionCode = $VersionCodeBase + $VersionCodeOffset

Write-Output "ENVIRONMENT VARIABLES ----------"
Write-Output "Build_BuildId:      $env:Build_BuildId"
Write-Output "Build_BuildNumber:  $env:Build_BuildNumber"
Write-Output "SCRIPT VARIABLES ---------------"
Write-Output "ManifestPath:       $ManifestPath"
Write-Output "VersionCodeBase:    $VersionCodeBase"
Write-Output "VersionCodeOffset:  $VersionCodeOffset"
Write-Output "calced versionCode: $versionCode"
Write-Output "VersionName:        $VersionName"

[xml] $manifest = Get-Content -Path $ManifestPath

function Select-ManifestAttribute {
    param
        ( [Parameter(Mandatory)] [xml] $manifestDoc
        , [Parameter(Mandatory)] [string] $attributeName
        )
    $namespaces = @{android="http://schemas.android.com/apk/res/android"}
    $commonXpath = "/manifest/@android:"
    return Select-Xml -xml $manifestDoc -Xpath "$commonXpath$attributeName" -namespace $namespaces
}

$manifestVersionCode = Select-ManifestAttribute $manifest "versionCode"
$manifestVersionName = Select-ManifestAttribute $manifest "versionName"

Write-Output "OLD MANIFEST VALUES ------------"
Write-Output "Old version code: $($manifestVersionCode.Node.Value)"
Write-Output "Old version name: $($manifestVersionName.Node.Value)"

if($PrintFile)
{
    Write-Output "ORIGINAL MANIFEST --------------"
    Get-Content $ManifestPath | Write-Output
}

$manifestVersionCode.Node.Value = $versionCode
$manifestVersionName.Node.Value = $VersionName
$manifest.Save($ManifestPath)

if($PrintFile)
{
    Write-Output "FINAL MANIFEST -----------------"
    Get-Content $ManifestPath | Write-Output
}

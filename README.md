## Mobile App (iOS and Android) Tasks for VSTS

These tasks help automate bumping version numbers and changing package names at build time.

You will find each script is written as a bash script, powershell core script, and a typescript script for you to use in your own project. The typescript version is used in VSTS as it is supported cross-platform.

## Android
Multiple tasks to update the AndroidManifest.xml file

### Bump Version
Change app's version name and code at build time.

Inputs:

* sourcePath: Path to android manifest
* versionCode: code number that must be an integer
* versionCodeOffset: a specific number to increment the version code
* versionName: user visible name
* printFile: output the file before and after changing variables

### Package Identifiers
Change app's package name.

Inputs:

* sourcePath: Path to android manifest
* packageName: name to replace (com.company.app)
* appLabel: application name to replace (App Name)
* printFile: output the file before and after changing variables

## iOS
Multiple tasks to update the info.plist file, must be run on macOS

### Bump Version
Change app's version name and code at build time.

Inputs:

* sourcePath: Path to info.plist
* versionCode: code number that must be an integer
* versionCodeOffset: a specific number to increment the version code
* versionName: user visible name (short code)
* printFile: output the file before and after changing variables

### Bundle Identifiers
Change app's bundle name and identifier

Inputs:

* sourcePath: Path to android manifest
* bundleIdenifier: identiier to replace (com.company.app)
* bundleName: name to replace (App Name)
* printFile: output the file before and after changing variables
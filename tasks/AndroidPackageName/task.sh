#!/bin/bash

# 1 = manifest_path
# 2 = package_name

# exit if a command fails
set -e

#
# Required parameters
if [ -z "${1}" ] ; then
  echo " [!] Missing required input: manifest_file"
  exit 1
fi
if [ ! -f "${1}" ] ; then
  echo " [!] File doesn't exist at specified AndroidManifest.xml path: ${1}"
  exit 1
fi




# ---------------------
# --- Configs:

echo " (i) Provided Android Manifest path: ${1}"
echo " (i) Package Name: ${2}"


PACKAGENAME=`grep package ${1} | sed 's/.*package\s*=\s*\"\([^\"]*\)\".*/\1/g'`

if [ -z "${PACKAGENAME}" ] ; then
  echo " [!] Could not find package name!"
  exit 1
fi
echo "Package name detected: ${PACKAGENAME}"



# ---------------------
# --- Main:

# verbose / debug print commands

set -v

sed -i.bak "s/package="\"${PACKAGENAME}\""/package="\"${2}\""/" ${1}

# ---- Remove backup:

rm -f ${1}.bak

# ==> Build Package changed
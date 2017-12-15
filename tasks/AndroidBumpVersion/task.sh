#!/bin/bash

# 1 = manifest_path
# 2 = offset
# 3 = version_code
# 4 = version_name

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

if [ -z "${3}" ] ; then
  echo " [!] No version_code specified!"
  exit 1
fi


# ---------------------
# --- Configs:

echo " (i) Provided Android Manifest path: ${1}"
echo " (i) Version Code: ${3}"
if ! [ -z "${4}" ] ; then
  echo " (i) Version Name: ${4}"
fi

VERSIONCODE=`grep versionCode ${1} | sed 's/.*versionCode="//;s/".*//'`
VERSIONNAME=`grep versionName ${1} | sed 's/.*versionName\s*=\s*\"\([^\"]*\)\".*/\1/g'`

if [ -z "${VERSIONCODE}" ] ; then
  echo " [!] Could not find current Version Code!"
  exit 1
fi

echo "Version code detected: ${VERSIONCODE}"
if [ ! -z "${2}" ] ; then
  echo " (i) Version code offset: ${2}"

  CONFIG_new_version_code=$((${2} + ${3}))
else
  CONFIG_new_version_code=${3}
fi

echo " (i) Version code: ${CONFIG_new_version_code}"


if [ -z "${VERSIONNAME}" ] ; then
  echo " [!] Could not find current Version Name!"
  exit 1
fi
echo "Version name detected: ${VERSIONNAME}"


# ---------------------
# --- Main:

# verbose / debug print commands

set -v
# ---- Set Build Version Code:

sed -i.bak "s/android:versionCode="\"${VERSIONCODE}\""/android:versionCode="\"${CONFIG_new_version_code}\""/" ${1}

# ---- Set Build Version Code if it was specified:
if ! [ -z "${4}" ] ; then
  sed -i.bak "s/android:versionName="\"${VERSIONNAME}\""/android:versionName="\"${4}\""/" ${1}
fi

# ---- Remove backup:

rm -f ${1}.bak

# ==> Build Version changed
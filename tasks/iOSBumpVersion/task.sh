#!/bin/bash

# 1 = plist_path
# 2 = offset 0
# 3 = version number 1
# 4 = short code 1.1.1

# exit if a command fails
set -e

#
# Required parameters
if [ -z "${1}" ] ; then
  echo " [!] Missing required input: plist_path"
  exit 1
fi
if [ ! -f "${1}" ] ; then
  echo " [!] File doesn't exist at specified Info.plist path: ${plist_path}"
  exit 1
fi

if [ -z "${3}" ] ; then
  echo " [!] No build_version specified!"
  exit 1
fi

# ---------------------
# --- Configs:

CONFIG_project_info_plist_path="${1}"
CONFIG_new_build_short_version_string="${4}"
CONFIG_new_bundle_version="${3}"

echo " (i) Provided Info.plist path: ${CONFIG_project_info_plist_path}"

if [ ! -z "${CONFIG_new_build_short_version_string}" ] ; then
  echo " (i) Version number: ${CONFIG_new_build_short_version_string}"
fi

if [ ! -z "${2}" ] ; then
  echo " (i) Build number offset: ${2}"

  CONFIG_new_bundle_version=$((${3} + ${2}))

  echo " (i) Build number: ${CONFIG_new_bundle_version}"
else
  echo " (i) Build number: ${CONFIG_new_bundle_version}"
fi


# ---------------------
# --- Main:

# verbose / debug print commands
set -v

# ---- Current Bundle Version:
/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "${CONFIG_project_info_plist_path}"

# ---- Set Bundle Version:
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion ${CONFIG_new_bundle_version}" "${CONFIG_project_info_plist_path}"


 if [ ! -z "${CONFIG_new_build_short_version_string}" ] ; then
   # ---- Current Bundle Short Version String:
   /usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "${CONFIG_project_info_plist_path}"

  # ---- Set Bundle Short Version String:
  /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${CONFIG_new_build_short_version_string}" "${CONFIG_project_info_plist_path}"
fi

# ==> Bundle Version and Short Version changed
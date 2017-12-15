#!/bin/bash

# exit if a command fails
set -e

#
# Required parameters
if [ -z "${1}" ] ; then
  echo " [!] Missing required input: info_plist_file"
  exit 1
fi
if [ ! -f "${1}" ] ; then
  echo " [!] File Info.plist doesn't exist at specified path: ${1}"
  exit 1
fi

if [ -z "${2}" ] ; then
  echo " [!] No Bundle Identifier (bundle_identifier) specified!"
  exit 1
fi

# ---------------------
# --- Configs:

echo " (i) Provided Info.plist file path: ${1}"
echo " (i) Provided Bundle Identifier: ${2}"

# ---------------------
# --- Main:

# verbose / debug print commands
set -v

# ---- Set Info.plist Bundle Identifier:
echo ""
echo ""
echo " (i) Replacing Bundle Identifier..."

ORIGINAL_BUNDLE_IDENTIFIER="$(/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "${1}")"
echo " (i) Original Bundle Identifier: $ORIGINAL_BUNDLE_IDENTIFIER"

/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier ${2}" "${1}"

REPLACED_BUNDLE_IDENTIFIER="$(/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "${1}")"
echo " (i) Replaced Bundle Identifier: $REPLACED_BUNDLE_IDENTIFIER"

# ==> Bundler Identifier patched in Info.plist file for iOS project
import tl = require('vsts-task-lib/task');

export function plistBuddy(path) {
    let plistBuddyPath = tl.which('/usr/libexec/PlistBuddy');
    return tl.tool(plistBuddyPath).arg("-c \"Print CFBundleVersion\"" + path);
}
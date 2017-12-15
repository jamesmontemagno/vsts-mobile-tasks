import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import fs = require('fs');
import { isNullOrUndefined } from 'util';

async function run() {
    try {
        let tool: trm.ToolRunner;
        if (process.platform == "win32") {
            tl.setResult(tl.TaskResult.Failed, "Task not supported");
            return;
        }

        let sourcePath: string = tl.getInput("sourcePath");
        let bundleIdentifier: String = tl.getInput("bundleIdentifier");
        let bundleName: String = tl.getInput("bundleName");
        let printFile: Boolean = new Boolean(tl.getInput("printFile")).valueOf();
        
        // requires parameters
        if(!isNullOrUndefined(sourcePath))
        {
            throw new Error(" [!] Missing required input: sourcePath");
        }

        if(!isNullOrUndefined(bundleIdentifier))
        {
            throw new Error(" [!] No bundleIdentifier specified!");
        }

        // Configs:
        console.log(" (i) Provided Info.plist path: " + sourcePath);
        console.log(" (i) Bundle Identifier: " + bundleIdentifier);

        // Main:
        if(printFile)
        {
            console.log("Original info.Plist:");
            console.log(fs.readFileSync(sourcePath));
        }

        // Current Bundle Version:
        tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleIdentifier\" " + sourcePath);

        // Set Bundle Version:
        tl.execSync("/usr/libexec/PlistBuddy", "-c \"Set :CFBundleIdentifier " + bundleIdentifier + "\" " + sourcePath);

        // New Bundle Version
        tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleName\" " + sourcePath);

        if(bundleName)
        {
            // Current Bundle Short Version String:
            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleName\" " + sourcePath);
            
            // Set Bundle Short Version String
            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Set :CFBundleName " + bundleName + "\" " + sourcePath);

            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleName\" " + sourcePath);
        }

        if(printFile)
        {
            console.log("Final info.Plist:");
            console.log(fs.readFileSync(sourcePath));
        }
        
        console.log('Task done!');
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
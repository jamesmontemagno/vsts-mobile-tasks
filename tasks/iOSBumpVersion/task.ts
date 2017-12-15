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
        let versionCodeOffset: String = tl.getInput("versionCodeOffset");
        let versionCode: String = tl.getInput("versionCode");
        let versionName: String = tl.getInput("versionName");
        let printFile: Boolean = new Boolean(tl.getInput("printFile")).valueOf();
        
        console.log(' (i) Provided Info.plist path:' + sourcePath);

         // requires parameters
         if(isNullOrUndefined(sourcePath))
         {
             throw new Error("[!] Missing required input: sourcePath");
         }

        if(printFile)
        {
            console.log('Original info.Plist:' + fs.readFileSync(sourcePath, 'utf8'));
        }

        if(!isNullOrUndefined(versionName))
        {
            console.log(' (i) Version Name (shortcode): ' + versionName);
        }

        if(!isNullOrUndefined(versionCodeOffset))
        {
            console.log(' (i) Build number versionCodeOffset: ' + versionCodeOffset);
            versionCode = String(Number(versionCode)/1 + Number(versionCodeOffset)/1);
        }       

        console.log(' (i) Build number: ' + versionCode);

        if(!isNullOrUndefined(printFile)){
            console.log('Original info.Plist:' + fs.readFileSync(sourcePath, 'utf8'));
        }

        // print bundle version
        tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleVersion\" " + sourcePath);

        // update bundle version
        tl.execSync("/usr/libexec/PlistBuddy", "-c \"Set :CFBundleVersion " + versionCode + "\" " + sourcePath);

        if(!isNullOrUndefined(versionName))
        {
            // ---- Current Bundle Short Version String:
            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleShortVersionString\" " + sourcePath);

            // ---- Set Bundle Short Version String:
            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Set :CFBundleShortVersionString " + versionName + "\" " + sourcePath);
        }

        if(printFile)
        {
            // todo - load plist data
            console.log('Final info.Plist: ' + fs.readFileSync(sourcePath, 'utf8'));
        }
    
        console.log('Task done!');
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
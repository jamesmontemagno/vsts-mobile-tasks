import tl = require('azure-pipelines-task-lib/task');
import trm = require('azure-pipelines-task-lib/toolrunner');
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
        let versionCodeOffset: string = tl.getInput("versionCodeOffset");
        let versionCodeOption: string = tl.getInput("versionCodeOption");
        let versionCode: string = tl.getInput("versionCode");
        let versionName: string = tl.getInput("versionName");
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
            
        if(versionCodeOption == "buildid")
        {
            console.log(' (i) Using Custom Defined Version Code and adjusting for offset if needed.');

            if(!isNullOrUndefined(versionCodeOffset))
            {
                console.log(' (i) Build number versionCodeOffset: ' + versionCodeOffset);
                let codeNum = Number(versionCode);
                let offsetNum = Number(versionCodeOffset);

                if(!isNaN(codeNum) && !isNaN(offsetNum))
                    versionCode = String(codeNum/1 + offsetNum/1);
                else
                    console.log(' WARNING: versioncode or offset is not a number, not using offset');
            }    
        }   
        else
        {
            console.log(' (i) Using timestamp for the version code. ');
            var time = new Date().getTime();
            var seconds = time / 1000 | 0;
            console.log(' (i) Current time: ' + time + ' | Timestamp: ' + seconds);            

            versionCode = String(seconds);
        }

        console.log(' (i) Build number: ' + versionCode);

        // print bundle version
        tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleVersion\" " +  "\"" + sourcePath + "\"");

        // update bundle version
        tl.execSync("/usr/libexec/PlistBuddy", "-c \"Set :CFBundleVersion " + versionCode + "\" " + "\"" + sourcePath + "\"");

        if(!isNullOrUndefined(versionName))
        {
            // ---- Current Bundle Short Version String:
            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleShortVersionString\" " + "\"" + sourcePath + "\"");

            // ---- Set Bundle Short Version String:
            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Set :CFBundleShortVersionString " + versionName + "\" " + "\"" + sourcePath + "\"");
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

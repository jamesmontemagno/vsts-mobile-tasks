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
        let property: String = tl.getInput("property");
        let value: String = tl.getInput("value");
        let printFile: Boolean = new Boolean(tl.getInput("printFile")).valueOf();
        
        console.log(' (i) Provided Info.plist path:' + sourcePath);

        // requires parameters
        if(isNullOrUndefined(sourcePath))
        {
            throw new Error("[!] Missing required input: sourcePath");
        }
        
        if(isNullOrUndefined(property))
        {
            throw new Error("[!] Missing required input: property");    
        }

        if(isNullOrUndefined(value))
        {
            throw new Error("[!] Missing required input: value");
        }

        if(printFile)
        {
            console.log('Original Plist:' + fs.readFileSync(sourcePath, 'utf8'));
        }

        // print bundle version
        tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print " + property + "\" " +  "\"" + sourcePath + "\"");

        // update bundle version
        tl.execSync("/usr/libexec/PlistBuddy", "-c \"Set :" + property + " " + value + "\" " + "\"" + sourcePath + "\"");

        if(printFile)
        {
            // todo - load plist data
            console.log('Final Plist: ' + fs.readFileSync(sourcePath, 'utf8'));
        }
    
        console.log('Task done!');
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();

import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import fs = require('fs');
import sam = require('samchon-framework');
import { isNullOrUndefined } from 'util';

async function run() {
    try {
        let tool: trm.ToolRunner;

        let sourcePath: string = tl.getInput("sourcePath");
        let packageName: string = tl.getInput("packageName");
        let appLabel: string = tl.getInput("appLabel");
        let printFile: Boolean = new Boolean(tl.getInput("printFile")).valueOf();
        
        // requires parameters
        if(isNullOrUndefined(sourcePath))
        {
            throw new Error("[!] Missing required input: sourcePath");
        }

        let xmlString: string = fs.readFileSync(sourcePath, 'utf8');
        
        let xml: sam.library.XML = new sam.library.XML(xmlString);


        if(printFile)
        {
            console.log('Original manifest:' + fs.readFileSync(sourcePath, 'utf8'));
        }

        //Update package name here
        console.log( xml.hasProperty("package") ); // true
        console.log("Old package: " + xml.getProperty("package") );

        xml.setProperty("package", packageName);

        console.log("New package: " + xml.getProperty("package") );
        

        
        //Update applabel is specified
        if(!isNullOrUndefined(appLabel))
        {
            console.log( xml.has("application") ); // true
            let applicationNode: sam.library.XMLList = xml.get("application");
            console.log("Old appLabel: " + applicationNode.at(0).getProperty("android:label") );

            applicationNode.at(0).setProperty("android:label", appLabel);

            console.log("New appLabel: " + applicationNode.at(0).getProperty("android:label") );
        }

        fs.writeFileSync(sourcePath, "<?xml version=\"1.0\" encoding=\"utf-8\"?>" + "\n" + xml.toString(), 'utf8');
        

        if(printFile)
        {
            // todo - load plist data
            console.log('Final manifest: ' + fs.readFileSync(sourcePath, 'utf8'));
        }
        
        console.log('Task done!');
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
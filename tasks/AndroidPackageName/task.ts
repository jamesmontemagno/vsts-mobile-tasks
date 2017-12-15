import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import fs = require('fs');
import library = require('samchon-framework').library;
import { isNullOrUndefined } from 'util';

async function run() {
    try {
        let tool: trm.ToolRunner;

        let sourcePath: string = tl.getInput("sourcePath");
        let packageName: String = tl.getInput("packageName");
        let appLabel: String = tl.getInput("appLabel");
        let printFile: Boolean = new Boolean(tl.getInput("printFile")).valueOf();
        
        // requires parameters
        if(!isNullOrUndefined(sourcePath))
        {
            throw new Error("[!] Missing required input: sourcePath");
        }

        let xmlString: String = fs.readFileSync(sourcePath, 'utf8');
        let xml: library.XML = new library.XML(xmlString);


        if(!isNullOrUndefined(printFile))
        {
            console.log('Original info.Plist:' + xmlString);
        }

        //Update package name here
        console.log( xml.has("manifest") ); // true
        let manifestNode: library.XMLList = xml.get("manifest");
        console.log("Old package: " + manifestNode.at(0).getProperty("package") );

        manifestNode.at(0).setProperty("package", packageName);

        console.log("New package: " + manifestNode.at(0).getProperty("package") );
        

        
        //Update applabel is specified
        if(!isNullOrUndefined(appLabel))
        {
            console.log( xml.has("application") ); // true
            let applicationNode: library.XMLList = xml.get("application");
            console.log("Old appLabel: " + applicationNode.at(0).getProperty("android:label") );

            applicationNode.at(0).setProperty("android:label", appLabel);

            console.log("New appLabel: " + applicationNode.at(0).getProperty("android:label") );
        }

        fs.writeFileSync(sourcePath, xml.toString(), 'utf8');
        

        if(!isNullOrUndefined(printFile))
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
import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import fs = require('fs');
import library = require('samchon-framework').library;
import { isNullOrUndefined } from 'util';

async function run() {
    try {
        let tool: trm.ToolRunner;

        let sourcePath: string = tl.getInput("sourcePath");
        let versionCodeOffset: String = tl.getInput("versionCodeOffset");
        let versionCode: String = tl.getInput("versionCode");
        let versionName: String = tl.getInput("versionName");
        let printFile: Boolean = new Boolean(tl.getInput("printFile")).valueOf();
        
        console.log(' (i) Provided Info.plist path:' + sourcePath);

        if(!isNullOrUndefined(versionName))
        {
            console.log(' (i) Version Name (shortcode): ' + versionName);
        }

        if(!isNullOrUndefined(versionCodeOffset))
        {
            console.log(' (i) versionCodeOffset: ' + versionCodeOffset);
            versionCode = String(Number(versionCode)/1 + Number(versionCodeOffset)/1);
        } 

        console.log(' (i) versionCode: ' + versionCode);

        let xmlString: String = fs.readFileSync(sourcePath, 'utf8');
        let xml: library.XML = new library.XML(xmlString);

        if(!isNullOrUndefined(printFile))
        {
            console.log('Original info.Plist:' + xmlString);
        }

        

        //Update package name here
        console.log( xml.has("manifest") ); // true
        let manifestNode: library.XMLList = xml.get("manifest");
        console.log("Old versionCode: " + manifestNode.at(0).getProperty("android:versionCode") );

        manifestNode.at(0).setProperty("android:versionCode", versionCode);

        console.log("New versionCode: " + manifestNode.at(0).getProperty("android:versionCode") );
        

        if(!isNullOrUndefined(versionName))
        {
            console.log("Old versionName: " + manifestNode.at(0).getProperty("android:versionName") );

            manifestNode.at(0).setProperty("android:versionName", versionName);

            console.log("New versionName: " + manifestNode.at(0).getProperty("android:versionName") );
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
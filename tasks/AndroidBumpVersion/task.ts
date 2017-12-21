import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import fs = require('fs');
import sam = require('samchon-framework');
import { isNullOrUndefined } from 'util';

async function run() {
    try {
        let tool: trm.ToolRunner;

        let sourcePath: string = tl.getInput("sourcePath");
        let versionCodeOffset: string = tl.getInput("versionCodeOffset");
        let versionCode: string = tl.getInput("versionCode");
        let versionName: string = tl.getInput("versionName");
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

        let xmlString: string = fs.readFileSync(sourcePath, 'utf8');
        let xml: sam.library.XML = new sam.library.XML(xmlString);

        if(printFile)
        {
            console.log('Original manifest:' + fs.readFileSync(sourcePath, 'utf8'));
        }

        //Update package name here
        console.log( xml.hasProperty("android:versionCode") ); // true
        console.log("Old versionCode: " +  xml.getProperty("android:versionCode") );

        xml.setProperty("android:versionCode", versionCode);

        console.log("New versionCode: " + xml.getProperty("android:versionCode") );
        

        if(!isNullOrUndefined(versionName))
        {
            console.log( xml.hasProperty("android:versionName") ); // true
            console.log("Old versionName: " + xml.getProperty("android:versionName") );

            xml.setProperty("android:versionName", versionName);

            console.log("New versionName: " +xml.getProperty("android:versionName") );
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
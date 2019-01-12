import tl = require('azure-pipelines-task-lib/task');
import trm = require('azure-pipelines-task-lib/toolrunner');
import fs = require('fs');
import sam = require('samchon-framework');
import { isNullOrUndefined } from 'util';

async function run() {
    try {
        let tool: trm.ToolRunner;

        let sourcePath: string = tl.getInput("sourcePath");
        let versionCodeOffset: string = tl.getInput("versionCodeOffset");
        let versionCodeOption: string = tl.getInput("versionCodeOption");
        let versionCode: string = tl.getInput("versionCode");
        let versionName: string = tl.getInput("versionName");
        let printFile: Boolean = new Boolean(tl.getInput("printFile")).valueOf();
        
        console.log(" (i) Provided manifest path:" + sourcePath);

        // requires parameters
        if(isNullOrUndefined(sourcePath))
        {
            throw new Error("[!] Missing required input: sourcePath");
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
                console.log(' (i) versionCodeOffset: ' + versionCodeOffset);
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


        console.log(' (i) versionCode: ' + versionCode);

        let xmlString: string = fs.readFileSync(sourcePath, 'utf8');

        if(printFile)
        {
            console.log('Original manifest:' + xmlString);
        }

        let start: number;
        let end: number;
        while ((start = xmlString.indexOf("<!--")) != -1) 
        {
            end = xmlString.indexOf("-->", start);
            if (end == -1)
                break;

            console.log('Removed comments');

            xmlString = xmlString.substr(0, start) + xmlString.substr(end + 3);

            if(printFile)
            {
                console.log('Modified Original manifest:' + xmlString);
            }
        }

        let xml: sam.library.XML = new sam.library.XML(xmlString);


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
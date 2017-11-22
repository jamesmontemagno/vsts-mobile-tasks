import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import mod = require('./taskmod');

async function run() {
    try {
        //console.log(process.env["INPUT_SAMPLESTRING"]);
        let tool: trm.ToolRunner;
        if (process.platform == "win32") {
            tl.setResult(tl.TaskResult.Failed, "Task not supported");
            return;
        }
        else {
            let echoPath = tl.which('echo');
            tool = mod.plistBuddy("plist.info");
        }

        let rc1: number = await tool.exec();        
        console.log('Task done! ' + rc1);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();

import tl = require('azure-pipelines-task-lib/task');
import trm = require('azure-pipelines-task-lib/toolrunner');
import fs = require('fs');
import { isNullOrUndefined } from 'util';


async function run() {
    try {
        let tool: trm.ToolRunner;

        let message: string = tl.getInput("key_from_task");

        if(isNullOrUndefined(message))
        {
            message = "No message defined";
        }

        
        console.log(message);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
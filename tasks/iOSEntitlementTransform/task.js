"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const fs = require("fs");
const util_1 = require("util");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tool;
            if (process.platform == "win32") {
                tl.setResult(tl.TaskResult.Failed, "Task not supported");
                return;
            }
            let sourcePath = tl.getInput("sourcePath");
            let property = tl.getInput("property");
            let value = tl.getInput("value");
            let printFile = new Boolean(tl.getInput("printFile")).valueOf();
            console.log(' (i) Provided Info.plist path:' + sourcePath);
            // requires parameters
            if (util_1.isNullOrUndefined(sourcePath)) {
                throw new Error("[!] Missing required input: sourcePath");
            }
            if (util_1.isNullOrUndefined(property)) {
                throw new Error("[!] Missing required input: property");
            }
            if (util_1.isNullOrUndefined(value)) {
                throw new Error("[!] Missing required input: value");
            }
            if (printFile) {
                console.log('Original info.Plist:' + fs.readFileSync(sourcePath, 'utf8'));
            }
            if (!util_1.isNullOrUndefined(printFile)) {
                console.log('Original entitlements.Plist:' + fs.readFileSync(sourcePath, 'utf8'));
            }
            // print bundle version
            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print " + property + "\" " + "\"" + sourcePath + "\"");
            // update bundle version
            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Set :" + property + " " + value + "\" " + "\"" + sourcePath + "\"");
            if (printFile) {
                // todo - load plist data
                console.log('Final entitlements.Plist: ' + fs.readFileSync(sourcePath, 'utf8'));
            }
            console.log('Task done!');
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
//# sourceMappingURL=task.js.map
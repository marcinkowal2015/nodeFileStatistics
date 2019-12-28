import {countFiles} from "./src/utils";
import {getPathsWithAppNames} from "./src/config";

function countFilesInPath(path: string, appName: string) {
    return {
        appName,
        date: new Date(),
        ...countFiles(path)
    }
}

const appsStats = getPathsWithAppNames().map(x =>countFilesInPath(x.path, x.appName));

console.log(appsStats);

const globalStats = {
    js: appsStats.map(x => x.js).reduce((a,b) => a + b, 0),
    ts: appsStats.map(x => x.ts).reduce((a,b) => a + b, 0),
    react: appsStats.map(x => x.react).reduce((a,b) => a + b, 0)
}

console.log(globalStats);

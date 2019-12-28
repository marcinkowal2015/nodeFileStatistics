import {readdirSync, lstatSync} from "fs";

function getDirectories(path: string) {
    return getDirectoryContent(path)
        .filter(e => lstatSync(e).isDirectory());
}

function getDirectoryContent(path: string) {
    return readdirSync(path)
        .map(e => `${path}/${e}`)
}

function recoursiveCounter(path: string, countFunction: (path: string) => number): number {
    return getDirectories(path)
        .map(d => recoursiveCounter(d, countFunction))
        .reduce((prev, next) => prev + next, countFunction(path));
}

function countFilesInDirectory(path: string, filterFunction: (name: string) => boolean) {
    return getDirectoryContent(path)
        .filter(x => lstatSync(x).isFile())
        .filter(filterFunction)
        .length;
}


export function countTypeScriptFiles(path: string) {
    return countFilesInDirectory(path, 
        x => x.endsWith(".ts") && !x.endsWith(".d.ts") && !x.endsWith(".spec.ts")
    );
}

export function countReactTypeScriptFiles(path: string) {
    return countFilesInDirectory(path, x => x.endsWith(".tsx") && !x.endsWith(".spec.tsx"));
}

export function countJavaScriptFiles(path: string) {
    const filesInDir = getDirectoryContent(path)
        .filter(x => lstatSync(x).isFile());

    return filesInDir
        .filter(f => f.endsWith(".js") && !f.endsWith(".spec.js") && !filesInDir.includes(f.replace(".js", ".ts"))&& !filesInDir.includes(f.replace(".js", ".tsx")))
        .length;

}

export function countFiles(path: string) {
    return {
        js: recoursiveCounter(path, countJavaScriptFiles),
        ts: recoursiveCounter(path, countTypeScriptFiles),
        react: recoursiveCounter(path, countReactTypeScriptFiles)
    }
}
import * as fs from 'fs';

export function isPathExists(path:string): boolean {
    try {
        fs.accessSync(path);
    } catch(error) {
        console.log(error);
        return false;
    }
    return true;
}
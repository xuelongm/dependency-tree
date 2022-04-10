import { visit } from 'recast';
import * as Path from 'path';
import * as babelParser from "recast/parsers/babel";
import Resolve from 'enhanced-resolve';
const babelOption = {};
export const paser = function (dependencyNode, absolutePath, codeString, paser) {
    let dependencies = [];
    // 获取当前文件夹路径
    const dirName = Path.dirname(absolutePath);
    let ast = null;
    try {
        ast = babelParser.parse(codeString, babelOption);
    }
    catch (e) {
        console.error(`get AST error: ${absolutePath}`);
    }
    if (!ast) {
        console.error(`get AST error: ${absolutePath}`);
        return dependencies;
    }
    visit(ast, {
        visitImportDeclaration(path) {
            const pathValue = path.node.source.value;
            if (typeof pathValue !== 'string')
                return false;
            let dependencyPath = null;
            try {
                const resolve = Resolve.create.sync();
                dependencyPath = resolve(dirName, pathValue);
            }
            catch (e) {
                console.log('error');
            }
            if (typeof dependencyPath === 'string') {
                if (dependencyPath.includes('node_modules'))
                    return false;
                dependencies.push(dependencyPath);
            }
            return false;
        },
        visitExportAllDeclaration(path) {
            console.log(path);
        }
    });
    return dependencies;
};
//# sourceMappingURL=generalJsParser.js.map
import { DependencyNode, Parser, Parsers } from '../index.d';
import { visit } from 'recast';
import * as Path from 'path';
import * as babelParser from "recast/parsers/babel";
import * as Resolve from 'enhanced-resolve';

const babelOption = {};
export const paser: Parser = function(
    dependencyNode: DependencyNode,
    absolutePath: string,
    codeString: string,
    paser: Parsers
) {
    let dependencies = [] as string[];
    // 获取当前文件夹路径
    const dirName = Path.dirname(absolutePath);
    let ast =  void 0;
    
    try {
        ast = babelParser.parse(codeString, babelOption);
    } catch(e) {
        console.error(`get AST error: ${absolutePath}`);
    }

    if (!ast) {
        console.error(`get AST error: ${absolutePath}`);
        return dependencies;
    }

    visit(ast, {
        visitImportDeclaration(path): any {
            const pathValue = path.node.source.value;
            if (typeof pathValue !== 'string') return false;
            let dependencyPath = void 0;
            try {
                const resolve = Resolve.create.sync();
                dependencyPath = resolve(dirName, pathValue);
            } catch(e) {
                console.log('error');
            }
            if (typeof dependencyPath === 'string') {
                if (dependencyPath.includes('node_modules')) return false;
                dependencies.push(dependencyPath);
            }
        }
    })

    return dependencies;
}
import * as path from 'path';
import * as fs from 'fs';
import Resolve from 'enhanced-resolve';
import { DefaultOption } from './default.option';
export class DependencyTree {
    constructor(option) {
        this.option = Object.assign(Object.assign({}, DefaultOption), option);
        this.addParsers(this.option.rules);
        this.dependencyNode = {};
    }
    startParse() {
        const { file } = this.option;
        if (!file) {
            console.error('this file is not config');
            return;
        }
        this.parse(file);
        console.log(path.dirname(file));
    }
    parse(file) {
        this.dependencyNode = {
            relativePath: file,
            children: []
        };
        const dependencyList = [this.dependencyNode];
        while (dependencyList.length) {
            const dependencyNode = dependencyList.pop();
            this.setDataToDependencyNode(dependencyNode);
            const { extension, absolutePath } = dependencyNode;
            const codeString = fs.readFileSync(absolutePath).toString();
            const parse = this.parsers[extension];
            const children = parse(dependencyNode, absolutePath, codeString, this.parsers);
            console.log(codeString);
        }
    }
    addParsers(parsers) {
        if (this.parsers == null) {
            this.parsers = {};
        }
        this.parsers = Object.assign(Object.assign({}, parsers), this.parsers);
    }
    setDataToDependencyNode(dependencyNode) {
        var _a;
        const { extensions } = this.option;
        const { relativePath } = dependencyNode;
        const extname = (_a = path.extname(relativePath)) === null || _a === void 0 ? void 0 : _a.slice(1);
        const basename = path.basename(relativePath);
        const resolve = Resolve.create.sync({
            extensions
        });
        const __dirname = path.resolve();
        const absolutePath = resolve(__dirname, relativePath);
        dependencyNode.extension = extname;
        dependencyNode.name = basename;
        dependencyNode.absolutePath = absolutePath;
        dependencyNode.children = [];
    }
}
//# sourceMappingURL=dependency-tree.js.map
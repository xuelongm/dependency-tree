import * as path from 'path';
import * as fs from 'fs';
import Resolve from 'enhanced-resolve';
import { DependencyTreeOption, Parsers, DependencyNode } from '../index.d';
import { DefaultOption } from './default.option';
import { isPathExists } from '../utils/utils';

export class DependencyTree {
    private option: DependencyTreeOption;
    private parsers!: Parsers;
    private dependencyNode: DependencyNode
    private dependencyHash: Map<string, DependencyNode>;
    constructor(option: DependencyTreeOption) {
        this.option = {...DefaultOption, ...option};
        this.addParsers(this.option.rules);
        this.dependencyNode = {} as DependencyNode;
        this.dependencyHash = new Map<string, DependencyNode>();
    }

    public startParse() {
        const { file } = this.option;
        if (!file) {
            console.error('this file is not config');
            return;
        }
        const { extensions } = this.option;
        const resolve = Resolve.create.sync({
            extensions
        });

        const __dirname = path.resolve();

        const absolutePath = resolve(__dirname, file) as string;

        this.parse(absolutePath);
        

        console.log(path.dirname(file));

    }

    public parse(file: string) {
        this.dependencyNode = {
            absolutePath: file,
            children: [] as DependencyNode[]
        } as DependencyNode;

        const dependencyList = [this.dependencyNode];
        while(dependencyList.length) {
            const dependencyNode = dependencyList.pop() as DependencyNode;
            this.setDataToDependencyNode(dependencyNode);
            const { extension, absolutePath } = dependencyNode;
            const codeString = fs.readFileSync(absolutePath).toString();
            const parse = this.parsers[extension];
            const children = parse(dependencyNode, absolutePath, codeString, this.parsers);
            dependencyList.push(...this.transfrom2TreeNode(absolutePath, children));
        }
    }

    private transfrom2TreeNode(parentPath: string, nodeList: string[]): DependencyNode[] {
        let dependencyNodeList = [] as DependencyNode[];
        const { extensions } = this.option;
        for(let absolutePath of nodeList) {
            if (!isPathExists(absolutePath)) {
                console.error(`this fils is not exist: ${absolutePath}`);
                continue;
            }
            Resolve.create.sync({
                extensions
            });
        }

        return dependencyNodeList;
    }

    private getDependencyTreeNode(absolutePath: string): DependencyNode {
        return {
            absolutePath,
            children: [] as DependencyNode[]
        } as DependencyNode;
    }

    private addParsers(parsers: Parsers) {
        if (this.parsers == null) {
            this.parsers = {};
        }
        this.parsers = {...parsers, ...this.parsers};
    }

    private setDataToDependencyNode(dependencyNode: DependencyNode) {
        const { relativePath } = dependencyNode;
        const extname = path.extname(relativePath)?.slice(1);
        const basename = path.basename(relativePath);
        dependencyNode.extension = extname;
        dependencyNode.name = basename;
        dependencyNode.children = [];
        
    }   


}   
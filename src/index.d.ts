
export interface DependencyTreeOption {
    file: string;
    extensions: string[];
    alias: Alias;
    rules: Parsers;
}

export interface Alias {
    [key : string] : string | string[]
}

export interface Parsers {
    [key: string]: Parser;
  }

export interface Parser {
    (
        dependencyNode: DependencyNode,
        absolutePath: string,
        codeString: string,
        paser: Parsers
    ): string[]
}


export interface DependencyNode {
    fileId: string;
    name: string;
    extension: string;
    absolutePath: string;
    relativePath: string;
    isCircular: boolean;
    children: Array<DependencyNode>;
}
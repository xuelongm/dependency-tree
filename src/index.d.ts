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
    absolutePath: string;
    relativePath: string;
    isCircular: boolean;
    children: Array<DependencyNode>;
}
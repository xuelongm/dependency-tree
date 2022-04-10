import { DependencyTree }  from '../dist/index';
console.log(DependencyTree);

new DependencyTree({
    file: './test/src/index.js',
    
}).startParse()
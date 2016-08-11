import { SyntaxKind, createProgram, forEachChild } from 'typescript';
import { serializeFunctions } from './serialization';
import { isNodeExported } from './property-check';
const visit = (result, checker, node) => {
    if (!isNodeExported(node)) {
        return;
    }
    if (node.kind === SyntaxKind.FunctionDeclaration) {
        let symbol = checker.getSymbolAtLocation(node.name);
        let bound = serializeFunctions.bind(undefined, checker);
        result.push(bound(symbol));
    }
};
export function parse(fileNames, options) {
    let program = createProgram(fileNames, options.compilerOptions);
    let checker = program.getTypeChecker();
    let result = [];
    let bound = visit.bind(undefined, result, checker);
    var sourceFiles = program.getSourceFiles().filter((f) => !f.fileName.includes('node_modules'));
    for (const sourceFile of sourceFiles) {
        forEachChild(sourceFile, bound);
    }
    return result;
}

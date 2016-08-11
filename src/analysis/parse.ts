/**
 * Created by alexander on 09.08.16.
 */
import {
  CompilerOptions,
  FunctionDeclaration,
  Node,
  SyntaxKind,
  TypeChecker,
  createProgram,
  forEachChild
} from 'typescript';
import { serializeFunctions } from './serialization';
import { isNodeExported } from './property-check';
import { DocJson } from '../interfaces/DocJson';

export type ParseOptions = {
  compilerOptions: CompilerOptions
}

const visit = (result: any[], checker: TypeChecker, node: Node) => {
  if (!isNodeExported(node)) {
    return;
  }

  if (node.kind === SyntaxKind.FunctionDeclaration) {
    let symbol = checker.getSymbolAtLocation((<FunctionDeclaration>node).name);
    let bound = serializeFunctions.bind(undefined, checker);
    result.push(bound(symbol));
  }
};

export function parse(fileNames: string[], options: ParseOptions): DocJson[] {

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

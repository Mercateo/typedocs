/**
 * Created by alexander on 09.08.16.
 */
import {
  ClassDeclaration,
  CompilerOptions,
  EnumDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  Node,
  SyntaxKind,
  TypeChecker,
  VariableStatement,
  createProgram,
  forEachChild
} from 'typescript';
import {serializeFunctions, serializeEnum, serializeClass, serializeConstant, serializeInterface} from './serialization';
import { isNodeExported } from './property-check';
import { DocJson } from '../interfaces/DocJson';

export type ParseOptions = {
  compilerOptions: CompilerOptions
}

const visit = (checker: TypeChecker, result: any[], node: Node) => {
  if (!node || !isNodeExported(node)) {
    return;
  }

  if (node.kind === SyntaxKind.FunctionDeclaration) {
    let symbol = checker.getSymbolAtLocation((<FunctionDeclaration>node).name);
    let bound = serializeFunctions.bind(undefined, checker);
    result.push(bound(symbol));
  }
  if (node.kind === SyntaxKind.ClassDeclaration) {
    let symbol = checker.getSymbolAtLocation((<ClassDeclaration>node).name);
    let bound = serializeClass.bind(undefined, checker);
    result.push(bound(symbol));
  }
  if (node.kind === SyntaxKind.InterfaceDeclaration) {
    let symbol = checker.getSymbolAtLocation((<InterfaceDeclaration>node).name);
    let bound = serializeInterface.bind(undefined, checker);
    result.push(bound(symbol));
  }
  if (node.kind === SyntaxKind.VariableStatement) {
    let bound = serializeConstant.bind(undefined, checker);
    result.push(bound(<VariableStatement>node));
  }
  if (node.kind === SyntaxKind.EnumDeclaration) {
    let symbol = checker.getSymbolAtLocation((<EnumDeclaration>node).name);
    let bound = serializeEnum.bind(undefined, checker);
    result.push(bound(symbol));
  }
};

function filter(result: DocJson[]): DocJson {
  result.map((obj) => {
    // TODO
  });


  return null;
}

export function parse(fileNames: string[], options: ParseOptions): DocJson[] {
  let program = createProgram(fileNames, options.compilerOptions);
  let checker = program.getTypeChecker();
  let result = [];
  let boundChecker = visit.bind(undefined, checker);

  let sourceFiles = program.getSourceFiles().filter((f) => !f.fileName.includes('node_modules'));
  for (const sourceFile of sourceFiles) {
    let tmpResult = [];
    forEachChild(sourceFile, boundChecker.bind(undefined, tmpResult));
    result.push(filter(tmpResult))
  }

  return result;
}

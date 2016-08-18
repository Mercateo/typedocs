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
  Path,
  Program,
  SourceFile,
  SyntaxKind,
  TypeChecker,
  VariableStatement,
  createProgram,
  forEachChild
} from 'typescript';
import {serializeFunctions, serializeEnum, serializeClass, serializeConstant, serializeInterface} from './serialization';
import { isNodeExported, isExportedConstant } from './property-check';
import { DocJson } from '../interfaces/DocJson';
import { BaseDoc } from "../interfaces/DocEntries";

export type ParseOptions = {
  compilerOptions: CompilerOptions
}

const visit = (checker: TypeChecker, result: DocJson, node: Node) => {
  if (!node || !isNodeExported(node)) {
    return;
  }

  if (node.kind === SyntaxKind.FunctionDeclaration) {
    let symbol = checker.getSymbolAtLocation((<FunctionDeclaration>node).name);
    let bound = serializeFunctions.bind(undefined, checker);
    result.functions = pushed(result.functions, bound(symbol));
  }
  if (node.kind === SyntaxKind.ClassDeclaration) {
    let symbol = checker.getSymbolAtLocation((<ClassDeclaration>node).name);
    let bound = serializeClass.bind(undefined, checker);
    result.classes = pushed(result.classes, bound(symbol));
  }
  if (node.kind === SyntaxKind.InterfaceDeclaration) {
    let symbol = checker.getSymbolAtLocation((<InterfaceDeclaration>node).name);
    let bound = serializeInterface.bind(undefined, checker);
    result.interfaces = pushed(result.interfaces, bound(symbol));
  }
  if (node.kind === SyntaxKind.VariableStatement) {
    let bound = serializeConstant.bind(undefined, checker);
    result.constants = pushed(result.constants, bound(<VariableStatement>node));
  }
  if (node.kind === SyntaxKind.EnumDeclaration) {
    let symbol = checker.getSymbolAtLocation((<EnumDeclaration>node).name);
    let bound = serializeEnum.bind(undefined, checker);
    result.enums = pushed(result.enums, bound(symbol));
  }
};

function pushed<T extends BaseDoc>(array: T[], value): T[] {
  if (!array)
    array = [];
  array.push(value);
  return array;
}

function filterSourceFiles(program: Program, fileNames: string[]) {
  let sourceFiles: SourceFile[] = [];
  fileNames.forEach((f) =>
    sourceFiles.push(program.getSourceFileByPath(<Path>f)));
  return sourceFiles;
}

export function parse(fileNames: string[], options: ParseOptions): DocJson {
  let program = createProgram(fileNames, options.compilerOptions);
  let checker = program.getTypeChecker();

  let result: DocJson = JSON;
  let bound = visit.bind(undefined, checker, result);

  for (const sourceFile of filterSourceFiles(program, fileNames)) {
    forEachChild(sourceFile, bound);
  }

  return result;
}

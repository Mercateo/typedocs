import {
  ClassDeclaration,
  CompilerOptions,
  EnumDeclaration,
  ExportDeclaration,
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
import { serializeFunctions, serializeEnum, serializeClass, serializeConstant, serializeInterface} from './serialization';
import { DocJson, EMPTY_DOC } from '../interfaces/DocJson';
import { BaseDoc } from '../interfaces/DocEntries';
import { isNodeExported } from './property-check';

export type ParseOptions = {
  compilerOptions: CompilerOptions
}

const getNodesFromAnotherSourceFile = (program: Program, node: ExportDeclaration): Node[] => {
  let exports = node.exportClause.elements
    .map((e) => e.name.text);
  let imports = (<SourceFile> node.parent)['resolvedModules'];
  let candidates = Object.keys(imports)
    .map((key) => {
      let i = imports[key];
      if (!i.isExternalLibraryImport) {
        return program.getSourceFileByPath(<Path> i.resolvedFileName);
      }
    })
    .reduce((locals, sourceFile) => Object.assign(locals, sourceFile['locals']), {});
  return Object.keys(candidates)
    .filter((key) => exports.indexOf(key) > -1)
    .map((key) => candidates[key].exportSymbol.valueDeclaration
                    || candidates[key].exportSymbol.getDeclarations()[0] );
};

const visit = (program: Program, checker: TypeChecker, result: DocJson, node: Node) => {
  if (!node || !isNodeExported(node)) {
    return;
  }

  if (node.kind === SyntaxKind.ExportDeclaration) {
    let nodes = getNodesFromAnotherSourceFile(program, <ExportDeclaration> node);
    nodes.forEach((n) => visit(program, checker, result, n));
  }

  if (node.kind === SyntaxKind.FunctionDeclaration) {
    let symbol = checker.getSymbolAtLocation((<FunctionDeclaration> node).name);
    let bound = serializeFunctions.bind(undefined, checker);
    result.functions = pushed(result.functions, bound(symbol));
  }
  if (node.kind === SyntaxKind.ClassDeclaration) {
    let symbol = checker.getSymbolAtLocation((<ClassDeclaration> node).name);
    let bound = serializeClass.bind(undefined, checker);
    result.classes = pushed(result.classes, bound(symbol));
  }
  if (node.kind === SyntaxKind.InterfaceDeclaration) {
    let symbol = checker.getSymbolAtLocation((<InterfaceDeclaration> node).name);
    let bound = serializeInterface.bind(undefined, checker);
    result.interfaces = pushed(result.interfaces, bound(symbol));
  }
  if (node.kind === SyntaxKind.VariableStatement) {
    let bound = serializeConstant.bind(undefined, checker);
    result.constants = pushed(result.constants, bound(<VariableStatement> node));
  }
  if (node.kind === SyntaxKind.EnumDeclaration) {
    let symbol = checker.getSymbolAtLocation((<EnumDeclaration> node).name);
    let bound = serializeEnum.bind(undefined, checker);
    result.enums = pushed(result.enums, bound(symbol));
  }
};

function pushed<T extends BaseDoc>(array: T[], value): T[] {
  if (!array) {
    array = [];
  }
  if (value) {
    array.push(value);
  }
  return array;
}

function filterSourceFiles(program: Program, fileNames: string[]) {
  let sourceFiles: SourceFile[] = [];
  fileNames.forEach((f) =>
    sourceFiles.push(program.getSourceFileByPath(<Path> f)));
  return sourceFiles;
}

function clean(result: DocJson): DocJson {
  Object.keys(result)
    .forEach((key) => {
      if (result[key].length === 0) {
        delete result[key];
      }
    });
  return result;
}

export function parse(fileNames: string[], options: ParseOptions): DocJson {
  let program = createProgram(fileNames, options.compilerOptions);
  let checker = program.getTypeChecker();

  let result = EMPTY_DOC;
  let bound = visit.bind(undefined, program, checker, result);

  for (const sourceFile of filterSourceFiles(program, fileNames)) {
    forEachChild(sourceFile, bound);
  }

  clean(result);
  return result;
}

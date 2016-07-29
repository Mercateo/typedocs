import {
  Node,
  NodeFlags,
  SyntaxKind,
  Symbol,
  Signature,
  FunctionDeclaration,
  TypeChecker,
  CompilerOptions,
  createProgram,
  displayPartsToString,
  forEachChild
} from 'typescript';
import {
  writeFileSync
} from 'fs';

// possible API:
// parse(fileNames, options) → return JSON about docs
// toMarkdown(JSON about docs) → return markdown
// toMarkdownFile(fileName, JSON about docs) → writes markdown
// generate(fileNames, options) → alias "toMarkdown(parse(fileNames, options))"
// generateFile(fileNames, options, markdownfileName) → alias "toMarkdownFile(markdownfileName, parse(fileNames, options))"

interface DocEntry {
  name?: string,
  fileName?: string,
  documentation?: string,
  type?: string,
  constructors?: DocEntry[],
  parameters?: DocEntry[],
  returnType?: string
}

export type ParseOptions = {
  compilerOptions: CompilerOptions
}

function isNodeExported(node: Node): boolean {
  return (node.flags & NodeFlags.Export) !== 0 || (node.parent && node.parent.kind === SyntaxKind.SourceFile);
}

function serializeSymbol(checker: TypeChecker, symbol: Symbol): DocEntry {
  return {
    name: symbol.getName(),
    documentation: displayPartsToString(symbol.getDocumentationComment()),
    type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
  };
}

function serializeSignature(checker: TypeChecker, signature: Signature) {
  return {
    parameters: signature.parameters.map(serializeSymbol.bind(undefined, checker)),
    returnType: checker.typeToString(signature.getReturnType()),
    documentation: displayPartsToString(signature.getDocumentationComment())
  };
}

function serializeFunctions(checker: TypeChecker, symbol: Symbol): DocEntry {
  let details = serializeSymbol.bind(undefined, checker)(symbol);

  let signatureType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
  let callSignature = signatureType.getCallSignatures();
  details.signature = callSignature.map(serializeSignature.bind(undefined, checker));

  return details;
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

export function parse(fileNames: string[], options: ParseOptions): JSON[] {

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

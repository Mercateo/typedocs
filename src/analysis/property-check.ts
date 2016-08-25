import {
  Node,
  NodeFlags,
  SyntaxKind
} from 'typescript';

export function isNodeExported(node: Node): boolean {
  return (node.flags & NodeFlags.Export) !== 0
    || (node.parent && (node.parent.kind === SyntaxKind.SourceFile ||
                        node.parent.kind === SyntaxKind.ExportDeclaration));
}

export function isExportedConstant(node: Node): boolean {
  let hasExportKeyword = isNodeExported(node.parent.parent);
  let hasConstKeyword = (node.parent.flags & NodeFlags.Const) !== 0;
  return hasConstKeyword && hasExportKeyword;
}

export function isPublicFunction(node: Node): boolean {
  return (node.flags & NodeFlags.Public) !== 0 && (node.kind === SyntaxKind.MethodDeclaration);
}

export function isPublicMember(node: Node): boolean {
  return (node.flags & NodeFlags.Public) !== 0 && (node.kind === SyntaxKind.PropertyDeclaration);
}

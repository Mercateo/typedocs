/**
 * Created by alexander on 09.08.16.
 */
import {
  Node,
  NodeFlags,
  SyntaxKind,
} from 'typescript';

export function isNodeExported(node: Node): boolean {
  return (node.flags & NodeFlags.Export) !== 0 || (node.parent && node.parent.kind === SyntaxKind.SourceFile);
}

export function isExportedConstant(node: Node): boolean {
  // TODO
  return (node.flags & (NodeFlags.Const | NodeFlags.Export)) !== 0 && (node.kind === SyntaxKind.ConstKeyword);
}

export function isPublicFunction(node: Node): boolean {
  return (node.flags & NodeFlags.Public) !== 0 && (node.kind === SyntaxKind.MethodDeclaration);
}

export function isPublicMember(node: Node): boolean {
  return (node.flags & NodeFlags.Public) !== 0 && (node.kind === SyntaxKind.PropertyDeclaration);
}

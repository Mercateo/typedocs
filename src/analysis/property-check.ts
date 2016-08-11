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

import { NodeFlags, SyntaxKind } from 'typescript';
export function isNodeExported(node) {
    return (node.flags & NodeFlags.Export) !== 0 || (node.parent && node.parent.kind === SyntaxKind.SourceFile);
}

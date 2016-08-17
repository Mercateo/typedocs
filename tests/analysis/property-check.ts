/**
 * Created by alexander on 11.08.16.
 */
import { isNodeExported } from '../../src/analysis/property-check';
import expect from "expect";
import {
  NodeFlags,
  SyntaxKind,
} from 'typescript';

describe('test property-check', () => {
  it('isNodeExported', () => {
    expect(isNodeExported({
      flags: NodeFlags.Export,
      parent: {
        kind: SyntaxKind.SourceFile
      }
    } as any)).toBeTruthy();
  });
});

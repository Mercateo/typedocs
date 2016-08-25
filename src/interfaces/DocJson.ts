import { ConstantDoc, EnumDoc, FunctionDoc, ClassDoc, InterfaceDoc } from './DocEntries';

export interface DocJson extends JSON {
  constants?: ConstantDoc[];
  enums?: EnumDoc[];
  functions?: FunctionDoc[];
  classes?: ClassDoc[];
  interfaces?: InterfaceDoc[];
}

export const EMPTY_DOC: DocJson = Object.assign(JSON, {
  constants: [],
  enums: [],
  functions: [],
  classes: [],
  interfaces: []
});

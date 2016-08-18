/**
 * Created by alexander on 09.08.16.
 */
import {
  Signature,
  Symbol
} from 'typescript';

export interface BaseDoc {
  name?: string,
  documentation?: string,
  type?: string
}

export interface SignatureDoc {
  parameters?: BaseDoc[],
  returns?: BaseDoc
}

export interface FunctionDoc extends BaseDoc {
  type: 'function',
  signatures? : SignatureDoc[]
}

export interface ClassDoc extends BaseDoc {
  type: 'class',
  superclass?: string,
  interfaces?: string[],
  constructors?: SignatureDoc[],
  fields?: BaseDoc[],
  methods?: FunctionDoc[]
}

export interface InterfaceDoc extends BaseDoc {
  type: 'interface',
  extending?: string,
  members?: BaseDoc[]
}

export interface ConstantDoc extends BaseDoc {
  value: any
}

export interface EnumDoc extends BaseDoc {
  type: 'enum',
  keys: string[]
}

export interface Documentable extends Signature, Symbol {
  getDocumentationComment
}

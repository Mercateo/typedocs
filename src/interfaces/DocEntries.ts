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
  fileName?: string,
  constructors?: SignatureDoc[]
}

export interface Documentable extends Signature, Symbol {
  getDocumentationComment
}

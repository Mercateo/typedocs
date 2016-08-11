/**
 * Created by alexander on 09.08.16.
 */
import {
  Symbol,
  Signature,
  TypeChecker,
  displayPartsToString
} from 'typescript';
import { BaseDoc, SignatureDoc, FunctionDoc, Documentable } from '../interfaces/DocEntries';

function generalDoc(documentable: Documentable) : string {
  let generalDoc = documentable.getDocumentationComment().filter((t) => !t.text.startsWith('@returns'));
  return displayPartsToString(generalDoc);
}

function returnDoc(documentable: Documentable) : string {
  let returnString = '@returns ';
  let returnDoc = documentable.getDocumentationComment()
    .filter((t) => t.text.startsWith(returnString))
    .map((t) => t.text.substring(returnString.length));
  return returnDoc.reduce((a, b) => a + b, '');
}

function serializeSymbol(checker: TypeChecker, symbol: Symbol): BaseDoc {
  return {
    name: symbol.getName(),
    documentation: generalDoc(symbol as Documentable),
    type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
  };
}

function serializeSignature(checker: TypeChecker, signature: Signature) : SignatureDoc {
  return {
    parameters: signature.parameters.map(serializeSymbol.bind(undefined, checker)),
    returns: {
      documentation: returnDoc(signature as Documentable),
      type: checker.typeToString(signature.getReturnType())
    }
  };
}

export function serializeFunctions(checker: TypeChecker, symbol: Symbol): FunctionDoc {
  let base = serializeSymbol(checker, symbol);

  let signatureType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
  let callSignature = signatureType.getCallSignatures();
  let signatures = callSignature.map(serializeSignature.bind(undefined, checker));

  return {
    name: base.name,
    documentation: base.documentation,
    type: 'function',
    signatures: signatures
  };
}

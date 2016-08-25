import {
  ClassDeclaration,
  HeritageClause,
  InterfaceDeclaration,
  NodeArray,
  Signature,
  Symbol,
  SyntaxKind,
  TypeChecker,
  VariableDeclaration,
  VariableStatement,
  displayPartsToString
} from 'typescript';
import {
  BaseDoc,
  SignatureDoc,
  InterfaceDoc,
  EnumDoc,
  FunctionDoc,
  Documentable,
  ClassDoc,
  ConstantDoc
} from '../interfaces/DocEntries';
import { isExportedConstant, isPublicFunction, isPublicMember } from './property-check';

function generalDoc(documentable: Documentable) : string {
  let generalDoc = documentable.getDocumentationComment().filter((t) => !t.text.startsWith('@'));
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
    type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration || symbol.getDeclarations()[0]))
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

function serializeHeritageSymbol(symbol: Symbol) {
  let heritageClauses = <NodeArray<HeritageClause>> symbol.valueDeclaration['heritageClauses'];
  return serializeHeritage(heritageClauses);
}

function serializeHeritage(heritageClauses: NodeArray<HeritageClause>) {
  let superclass: string = '';
  let interfaces: string[] = [];

  if (heritageClauses) {
    heritageClauses
      .forEach((clause) => {
        let text = clause.getText();
        if (clause.token === SyntaxKind.ExtendsKeyword) {
          let extendsString = 'extends ';
          superclass = text.includes(extendsString) ? text.substring(extendsString.length) : text;
        } else if (clause.token === SyntaxKind.ImplementsKeyword) {
          let implementsString = 'implements ';
          interfaces.push(text.includes(implementsString) ? text.substring(implementsString.length) : text);
        }
      });
  }

  return { superclass: superclass, interfaces: interfaces };
}

export function serializeConstant(checker: TypeChecker, variable: VariableStatement): ConstantDoc {
  let declaration = variable.declarationList.declarations[0];
  if (!isExportedConstant(declaration)) {
    return;
  }
  let symbol = checker.getSymbolAtLocation(declaration.name);
  let base = serializeSymbol(checker, symbol);

  return {
    name: base.name,
    documentation: base.documentation,
    type: base.type,
    value: (<VariableDeclaration> symbol.valueDeclaration).initializer.getText()
  };
}

export function serializeEnum(checker: TypeChecker, symbol: Symbol): EnumDoc {
  let base = serializeSymbol(checker, symbol);

  let keys = Object.keys(symbol.exports);

  return {
    name: base.name,
    documentation: base.documentation,
    type: 'enum',
    keys: keys
  };
}

export function serializeFunctions(checker: TypeChecker, symbol: Symbol): FunctionDoc {
  let base = serializeSymbol(checker, symbol);

  // TODO: eval 'checker.isOverloadImplementation'
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

export function serializeInterface(checker: TypeChecker, symbol: Symbol): InterfaceDoc {
  let declaration = <InterfaceDeclaration> symbol.declarations[0];
  let extending = serializeHeritage(declaration.heritageClauses).superclass;

  let members: BaseDoc[] = [];
  let keys = Object.keys(symbol.members);
  if (keys.length !== 0) {
    keys.forEach((key) => members.push(serializeSymbol(checker, symbol.members[key])));
  }

  return {
    name: symbol.getName(),
    documentation: generalDoc(symbol as Documentable),
    type: 'interface',
    extending: extending,
    members: members
  };
}

export function serializeClass(checker: TypeChecker, symbol: Symbol): ClassDoc {
  let base = serializeSymbol(checker, symbol);

  let constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
  let constructors = constructorType.getConstructSignatures().map(serializeSignature.bind(undefined, checker));

  let heritage = serializeHeritageSymbol(symbol);
  let superclass: string = heritage.superclass;
  let interfaces: string[] = heritage.interfaces;

  let members = symbol.members;
  let methods: FunctionDoc[] = [];
  let fields: BaseDoc[] = [];
  Object.keys(members).forEach((key) => {
    let member = members[key];
    let node = member.valueDeclaration;

    if (node && isPublicFunction(node)) {
      methods.push(serializeFunctions(checker, member));
    }
    if (node && isPublicMember(node)) {
      fields.push(serializeSymbol(checker, member));
    }
  });

  const doc: ClassDoc = {
    name: base.name,
    documentation: base.documentation,
    type: 'class',
    constructors: constructors
  };

  if (superclass) {
    doc.superclass = superclass;
  };
  if (interfaces.length !== 0) {
    doc.interfaces = interfaces;
  }
  if (methods.length !== 0) {
    doc.methods = methods;
  }
  if (methods.length !== 0) {
    doc.fields = fields;
  }

  return doc;
}

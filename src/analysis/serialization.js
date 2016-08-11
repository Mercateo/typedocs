import { displayPartsToString } from 'typescript';
function generalDoc(documentable) {
    let generalDoc = documentable.getDocumentationComment().filter((t) => !t.text.startsWith('@returns'));
    return displayPartsToString(generalDoc);
}
function returnDoc(documentable) {
    let returnString = '@returns ';
    let returnDoc = documentable.getDocumentationComment()
        .filter((t) => t.text.startsWith(returnString))
        .map((t) => t.text.substring(returnString.length));
    return returnDoc.reduce((a, b) => a + b, '');
}
function serializeSymbol(checker, symbol) {
    return {
        name: symbol.getName(),
        documentation: generalDoc(symbol),
        type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
    };
}
function serializeSignature(checker, signature) {
    return {
        parameters: signature.parameters.map(serializeSymbol.bind(undefined, checker)),
        returns: {
            documentation: returnDoc(signature),
            type: checker.typeToString(signature.getReturnType())
        }
    };
}
export function serializeFunctions(checker, symbol) {
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

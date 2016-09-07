import {SignatureObject, ParameterObject, TypeObject} from "../../interfaces/objects";
import {n} from "./util";
import {relationMd} from "./general-md-gen";

export function signatureMd(signatures: SignatureObject[]): string {
  if (signatures) {
    return signatures.reduce((s, signature) => {
      let typeParam = typeParamMd(signature.typeParameter);
      let params = paramMd(signature.parameters);
      let returnType = returnMd(signature.type);
      if ('__call' === signature.name) {
        return `${s}${typeParam}(${params}) => ${returnType}${n}`;
      } else {
        return `${s}function ${signature.name}${typeParam}(${params}): ${returnType}${n}`;
      }
    }, '').slice(0, -1);
  } else {
    return '';
  }
}

export function typeParamMd(typeParameters: ParameterObject[]): string {
  if (typeParameters) {
    return typeParameters.reduce((s, param) => {
      let extension = param.type ? ` extends ${param.type.name}` : '';
      return `${s}${param.name}${extension}, `;
    }, '<').slice(0, -2).concat('>');
  } else {
    return '';
  }
}

export function typeArgMd(type: TypeObject, recursiveCb: (TypeObject) => string = returnMd) {
  if (type) {
    let name = type.name;
    if (type.typeArguments) {
      name = type.typeArguments.reduce((s, arg) => {
        return s + recursiveCb(arg) + ', ';
      }, `${name}<`).slice(0, -2).concat('>');
    }
    return name;
  } else {
    return '';
  }
}

export function paramMd(params: ParameterObject[], separator: string = ', '): string {
  if (params) {
    return params.reduce((s, param) => {
      let relation = relationMd(param) ? ' // ' + relationMd(param) : '';
      let extension = param.type ? ': ' + returnMd(param.type) : '';
      return `${s}${param.name}${extension}${relation}${separator}`;
    }, '').slice(0, -(separator.length));
  } else {
    return '';
  }
}

export function returnMd(type: TypeObject): string {
  if (type) {
    if ('reflection' === type.type) {
      return signatureMd(type.declaration.signatures);
    } else if (type.name) {
      return typeArgMd(type);
    } else {
      return 'any';
    }
  } else {
    return '';
  }
}

import {
  MethodObject, ConstantObject, ParameterObject, BaseObject, ConstructorObject,
  ClassObject
} from "../../interfaces/objects";
import {isAccessible, tab, n, nn, codeStart, codeEnd} from "./util";
import {nameMd, heritageMd, modifierMd, relationMd} from "./general-md-gen";
import {docMd, docHeritage, docTableMd} from "./documentation";
import {paramMd, typeParamMd, returnMd} from "./signature-gen";

export function classMd(classes: BaseObject[]): string {
  let classString: string = '';

  classes.forEach((c) => {
    let converted = <ClassObject> c;
    let constructor = constructorMd(converted.constructors);
    let properties = propertyMd(converted.properties);
    let methods = methodMd(converted.methods);

    classString = classString
      .concat(`${nameMd(converted)}`)
      .concat(n)
      .concat(codeStart)
      .concat(`class ${converted.name} `)
      .concat(heritageMd(converted))
      .concat(`{`)
      .concat(constructor ? `${n}${tab}${constructor}${n}` : '')
      .concat(properties ? `${n}${tab}${properties}${n}` : '')
      .concat(methods ? `${n}${tab}${methods}${n}` : '')
      .concat(`}`)
      .concat(codeEnd)
      .concat(nn)
      .concat(docMd(converted.comment))
      .concat(nn)
      .concat(docHeritage(converted))
      .concat(nn)
      .concat(docTableMd(converted.children.filter(isAccessible)))
      .concat(nn)
      .concat(`---${n}`);
  });

  return classString;
}

function constructorMd(constructor: ConstructorObject): string {
  if (constructor) {
    let modifier = modifierMd(constructor.flags);
    let constructorSignatures = constructor.signatures;
    if (constructorSignatures) {
      let separator = `${n}${tab}`;
      return constructorSignatures.reduce((s, constructor) => {
        let params = paramMd(constructor.parameters);
        return `${s}${modifier}constructor(${params});${separator}`;
      }, '');
    } else {
      return '';
    }
  } else {
    return '';
  }
}

function propertyMd(properties: BaseObject[]): string {
  if (properties) {
    let separator = `${n}${tab}`;
    return properties.reduce((s, property) => {
      if (!isAccessible(property))
        return s;

      let modifier = modifierMd(property.flags);
      let p = paramMd([<ParameterObject> property]);
      let defaultValue = (<ConstantObject> property).defaultValue ? ` = ${(<ConstantObject> property).defaultValue}` : '';
      return `${s}${modifier}${p}${defaultValue};${separator}`;
    }, '').slice(0, -(separator.length));
  } else {
    return '';
  }
}

function methodMd(methods: MethodObject[]): string {
  if (methods) {
    let separator = `${n}${tab}`;
    return methods.reduce((t, method) => {
      if (!isAccessible(method))
        return t;

      let modifier = modifierMd(method.flags);
      let relation = relationMd(method) ? ' // ' + relationMd(method) : '';
      let md = method.signatures.reduce((s, signature) => {
        let typeParam = typeParamMd(signature.typeParameter);
        let params = paramMd(signature.parameters);
        let returnType = returnMd(signature.type);
        return `${s}${modifier}${signature.name}${typeParam}(${params}): ${returnType};${relation}${n}`;
      }, '').slice(0, -1);

      return `${t}${md}${separator}`
    }, '').slice(0, -(separator.length));
  } else {
    return '';
  }
}

import {
  Result, Title, BaseObject, ConstantObject, CommentObject, FunctionObject,
  EnumObject, ClassObject, InterfaceObject, EnumMemberObject, SignatureObject, ParameterObject,
  RelationObject, ConstructorObject, MethodObject, TypeObject
} from '../interfaces/objects';
import {SectionOrString, Section} from './Markdown';
import {ReflectionKind} from "../interfaces/ReflectionKind";

const bold = (s: string): string => `**${s}**`;
const italic = (s: string): string => `*${s}*`;
const underlined = (s: string): string => `_${s}_`;

const h4 = (s: string) => `#### ${s}`;
const link = (name: string, url: string = createMdUrl(name)) => `[${name}](${url})`;
const tableRow = (type: string, name: string, description: string): string => `${type} | ${name} | ${description}`;

const n = '\n';
const nn = n + n;
const tab = '    ';
const codeStart = '\`\`\`typescript' + n;
const codeEnd = n + '\`\`\`';
const tableHead = `Type | Name | Description${n}:--- | :--- | :----------`;

export function generateMarkdown(result: Result): Section {
  if (result.children.length !== 0) {
    return {
      header: `## ${Title[result.title]}`,
      markdown: groupMd(result)
    };
  }
}

function groupMd(result: Result): SectionOrString {
  let objects = result.children;
  switch (result.title) {
    case Title.Constants:
      return constantMd(objects);
    case Title.Enumerations:
      return enumMd(objects);
    case Title.Functions:
      return functionMd(objects);
    case Title.Classes:
      return classMd(objects);
    case Title.Interfaces:
      return interfaceMd(objects);
    default:
      return '';
  }
}

function constantMd(constants: BaseObject[]): string {
  let constantString: string = '';

  constants.forEach((constant) => {
    let converted = <ConstantObject> constant;
    constantString = constantString
      .concat(nameMd(converted))
      .concat(n)
      .concat(codeStart)
      .concat(`${converted.type.name} ${converted.name} = ${converted.defaultValue}`)
      .concat(codeEnd)
      .concat(nn)
      .concat(docMd(converted.comment))
      .concat(nn)
      .concat(`---${n}`);
  });

  return constantString;
}

function enumMd(enums: BaseObject[]): string {
  let enumString: string = '';

  enums.forEach((e) => {
    let converted = <EnumObject> e;
    let childrenMd = enumMemberMd(converted.children);
    enumString = enumString
      .concat(nameMd(converted))
      .concat(codeStart)
      .concat(`enum ${converted.name} {${n}`)
      .concat(childrenMd)
      .concat(`${n}}`)
      .concat(codeEnd)
      .concat(nn)
      .concat(docMd(converted.comment))
      .concat(nn)
      .concat(docTableMd(converted.children))
      .concat(nn)
      .concat(`---${n}`);
  });

  return enumString;
}

function enumMemberMd(enumMember: EnumMemberObject[]): string {
  return enumMember.reduce((s, child) => {
    let member = <EnumMemberObject> child;
    return `${s}${tab}${member.name} = ${member.defaultValue},${n}`;
  }, '').slice(0, -2);
}

function functionMd(functions: BaseObject[]): string {
  let functionString: string = '';

  functions.forEach((fct) => {
    let converted = <FunctionObject> fct;
    functionString = functionString
      .concat(nameMd(converted))
      .concat(codeStart)
      .concat(signatureMd(converted.signatures))
      .concat(codeEnd)
      .concat(nn)
      .concat(docMd(converted.comment))
      .concat(nn)
      .concat(docTableMd(distinctParams(converted.signatures)))
      .concat(nn)
      .concat(`---${n}`);
  });

  return functionString;
}

function signatureMd(signatures: SignatureObject[]): string {
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

function typeParamMd(typeParameters: ParameterObject[]): string {
  if (typeParameters) {
    return typeParameters.reduce((s, param) => {
      let extension = param.type ? ` extends ${param.type.name}` : '';
      return `${s}${param.name}${extension}, `;
    }, '<').slice(0, -2).concat('>');
  } else {
    return '';
  }
}

function paramMd(params: ParameterObject[], separator: string = ', '): string {
  if (params) {
    return params.reduce((s, param) => {
      let relation = ' // ' + relationMd(param);
      let extension = param.type ? ': ' + returnMd(param.type) : '';
      return `${s}${param.name}${extension}${relation}${separator}`;
    }, '').slice(0, -(separator.length));
  } else {
    return '';
  }
}

function returnMd(type: TypeObject): string {
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

function classMd(classes: BaseObject[]): string {
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
      let relation = ' // ' + relationMd(method);
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

function interfaceMd(interfaces: BaseObject[]): string {
  let interfaceString: string = '';

  interfaces.forEach((i) => {
    let converted = <InterfaceObject> i;
    let members = paramMd(converted.children, `,${n}${tab}`);
    interfaceString = interfaceString
      .concat(`${nameMd(converted)}`)
      .concat(n)
      .concat(codeStart)
      .concat(`interface ${converted.name} `)
      .concat(heritageMd(converted))
      .concat(`{`)
      .concat(members ? `${n}${tab}${members}${n}` : '')
      .concat(`}`)
      .concat(codeEnd)
      .concat(nn)
      .concat(docMd(converted.comment))
      .concat(nn)
      .concat(docHeritage(converted))
      .concat(nn)
      .concat(docTableMd(converted.children))
      .concat(nn)
      .concat(`---${n}`);
  });

  return interfaceString;
}

function heritageMd(converted: InterfaceObject | ClassObject): string {
  let reducedExtension = reduceHeritage('extends', converted.extendedTypes);
  let reducedImplementation = reduceHeritage('implements', (<ClassObject> converted).implementedTypes)
  return reducedExtension + (reducedExtension ? ' ' : '') + reducedImplementation + ' ';
}

function relationMd(obj: BaseObject, linked = (s) => s): string {
  const inheritedFrom = 'inheritedFrom';
  const implementationOf = 'implementationOf';
  const fOnlyType = (s: string) => s.substring(0, -1 !== s.indexOf('.') ? s.indexOf('.') : s.length);

  // TODO link inheritance
  if (obj) {
    if (obj[inheritedFrom]) {
      let name = linked(fOnlyType(obj[inheritedFrom].name));
      return `{ inherited from ${name} }`
    } else if (obj[implementationOf]) {
      let name = linked(fOnlyType(obj[implementationOf].name));
      return `{ implements function of ${name} }`
    }
  }
  return '';
}

function modifierMd(flags: any): string {
  if (flags.isProtected) {
    return 'protected ';
  } else if (flags.isPrivate) {
    return 'private ';
  } else {
    return 'public ';
  }
}

function nameMd(baseObj: BaseObject): string {
  return `${h4(baseObj.name)}${n}`;
}

function docMd(comment: CommentObject): string {
  if (comment) {
    let doc = comment.shortText;

    if (comment.tags) {
      comment.tags
      // the 'return' tag is used in the context of classes, therefore unnecessary
        .filter((tag) => tag.tag !== 'returns')
        .forEach((tag) => {
          doc.concat(nn)
            .concat(`${italic(tag.tag)}`)
            .concat(n)
            .concat(tag.text);
        });
    }
    if (comment.returns) {
      doc.concat(nn)
        .concat(`${italic('Returns')}${n}`)
        .concat(comment.returns);
    }

    return doc;
  } else {
    return '';
  }
}

function createLinkToType(type: TypeObject): string {
  if (type) {
    if ('reflection' === type.type) {
      return 'function';
    } else if (type.name) {
      switch (type.type) {
        case 'reference':
          let name = typeArgMd(type, createLinkToType);
          if (!(<RelationObject> type).id) {
            return name;
          } else {
            let plainName = createMdUrl(name);
            return link(name, `#${plainName}`);
          }
        case 'typeParameter':
        case 'instrinct': // ATTENTION: this is a typo in typedoc generated JSON!
        default:
          return returnMd(type);
      }
    }
  }
  return '-';
}

function docHeritage(type: ClassObject | InterfaceObject): string {
  if (type) {
    const linkCondition = (obj) => obj.id ? link(obj.name) : obj.name;
    let result = '';

    let heritageSuperclass = reduceHeritage('', type.extendedTypes,linkCondition);
    let superclass = heritageSuperclass ? bold('Inheritance:') + heritageSuperclass + n : '';

    let heritageSubclasses = reduceHeritage('', type.extendedBy, linkCondition);
    let subclasses  = heritageSubclasses ? bold('Known subclasses:') + heritageSubclasses + n : '';

    if (type as ClassObject) {
      const heritageInterfaces = reduceHeritage('', (type as ClassObject).implementedTypes, linkCondition);
      let implemented = heritageInterfaces ? bold('Implemented interfaces:') + heritageInterfaces + n : '';
      result = result + implemented;
    } else {
      const heritageImplementedBy = reduceHeritage('', (type as InterfaceObject).implementedBy, linkCondition);
      let implementedBy = heritageImplementedBy ? bold('Known implementations:') + heritageImplementedBy + n : '';
      result = result + implementedBy;
    }

    return superclass + subclasses + result;
  } else {
    return '';
  }
}

function docTableMd(children: BaseObject[]): string {
  if (children && 0 !== children.length) {
    return children.reduce((s, child) => {
      let comment = child.comment;
      let doc = comment ? (comment.shortText ? comment.shortText : comment.text)
        .replace(/\n/g, ';') : '-';
      let subDoc = relationMd(child, link);
      let type = `[${child.kindString}]`;

      if (0 !== (child.kind & (ReflectionKind.Parameter | ReflectionKind.Property | ReflectionKind.TypeParameter))) {
        type = createLinkToType((<ParameterObject> child).type);
      }

      return s + tableRow(type, child.name, subDoc ? subDoc : doc) + n;
    }, `${tableHead}${n}`).slice(0, -1);
  } else {
    return '';
  }
}

function distinctParams(signatures: SignatureObject[]): ParameterObject[] {
  let params = [];
  signatures.forEach((signature) => {
    if (signature.parameters) {
      let filtered = signature.parameters.filter((param) => {
        if (0 === params.length) {
          return true;
        } else {
          let namesAndTypes = params.map((p) => {
            return {name: p.name, type: p.type.name};
          });
          let thisNameAndType = {name: param.name, type: param.type.name};
          // is this parameter already considered?
          return namesAndTypes.find((nt) => nt === thisNameAndType);
        }
      });
      params = params.concat(filtered);
    }
  });
  return params;
}

function reduceHeritage(keyword: string, relations: RelationObject[], linkCondition = (obj) => obj.name): string {
  if (relations && 0 !== relations.length) {
    return relations.reduce((s, type) => {
      let typeName = linkCondition(type);
      return `${s}${typeName}, `;
    }, `${keyword} `).slice(0, -2);
  } else {
    return '';
  }
}

function typeArgMd(type: TypeObject, recursiveCb: (TypeObject) => string = returnMd) {
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

function isAccessible(obj: BaseObject): boolean {
  return obj.flags && obj.flags.isExported && !obj.flags.isPrivate;
}

function createMdUrl(name: string): string {
  return '#' + name
    .replace(/\s/g, '-')
    .replace(/[^a-zA-Z0-9\-]/g, '')
    .toLowerCase();
}

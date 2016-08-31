import {
  Result, Title, BaseObject, ConstantObject, CommentObject, FunctionObject,
  EnumObject, ClassObject, InterfaceObject, EnumMemberObject, SignatureObject, ParameterObject,
  RelationObject
} from '../interfaces/objects';
import {SectionOrString, Section} from './Markdown';

const bold = (s: string): string => `**${s}**`;
const italic = (s: string): string => `*${s}*`;
const underlined = (s: string): string => `_${s}_`;
const tableRow = (name: string, description: string): string => `${name} | ${description}`;

const n = '\n';
const nn = n + n;
const tab = '    ';
const codeStart = '\`\`\`typescript' + n;
const codeEnd = n + '\`\`\`';
const tableHead = `Name | Description${n}:--- | :----------`;

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
  return signatures.reduce((s, signature) => {
    let typeParam = typeParamMd(signature.typeParameter);
    let params = paramMd(signature.parameters);
    let returnType = returnMd(signature);
    if ('__call' === signature.name) {
      return `${s}(${params}) => ${returnType}${n}`;
    } else {
      return `${s}function ${signature.name}${typeParam}(${params}): ${returnType}${n}`;
    }
  }, '').slice(0, -1);
}

function typeParamMd(typeParameters: ParameterObject[]): string {
  if (typeParameters) {
    return typeParameters.reduce((s, param) => {
      let extension =  param.type ? ` extends ${param.type.name}` : '';
      return `${s}${param.name}${extension}, `;
    }, '<').slice(0, -2).concat('>');
  } else {
    return '';
  }
}

function paramMd(params: ParameterObject[], separator: string = ', '): string {
  if (params) {
    return params.reduce((s, param) => {
      let extension = param.type ? `: ${param.type.name}` : '';
      return `${s}${param.name}${extension}${separator}`;
    }, '').slice(0, -(separator.length));
  } else {
    return '';
  }
}

function returnMd(signature: SignatureObject): string {
  if (signature.type.name) {
    return signature.type.name;
  } else if ('reflection' === signature.type.type) {
    return signatureMd(signature.type.declaration.signatures);
  }
}

function classMd(classes: BaseObject[]): string {
  let classString: string = '';

  classes.forEach((c) => {
    let converted = <ClassObject> c;
    let separator = `,${n}${tab}`;
    let children = '';
    if (converted.children) {
      children = converted.children.reduce((s, child) => {
        return `${s}${child.name}: ${child.kindString}${separator}`;
      }, '').slice(0, separator.length);
    }
    classString = classString
      .concat(`${nameMd(converted)}`)
      .concat(n)
      .concat(codeStart)
      .concat(`class ${converted.name} `)
      .concat(heritageMd(converted))
      .concat(`{`)
      .concat(children ? `${n}${tab}${children}${n}` : '')
      .concat(`}`)
      .concat(codeEnd)
      .concat(nn)
      .concat(`${docMd(converted.comment)}`)
      .concat(nn)
      .concat(`---${n}`);
  });

  return classString;
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
      .concat(`${docMd(converted.comment)}`)
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

function nameMd(baseObj: BaseObject): string {
  return `${bold(baseObj.name)}${n}`;
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

function docTableMd(children: BaseObject[]): string {
  if (0 !== children.length) {
    return children.reduce((s, child) => {
      let comment = child.comment;
      let doc = comment ? (comment.shortText ? comment.shortText : comment.text) : '-';
      return s + tableRow(child.name, doc) + n;
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

function reduceHeritage(keyword: string, relations: RelationObject[]): string {
  if (relations && 0 !== relations.length) {
    return relations.reduce((s, type) => {
      return `${s}${type.name}, `;
    }, `${keyword} `).slice(0, -2);
  } else {
    return '';
  }
}

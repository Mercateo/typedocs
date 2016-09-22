import {
  CommentObject, ClassObject, InterfaceObject, BaseObject, ParameterObject, SignatureObject
} from "../../interfaces/objects";
import {nn, italic, n, link, reduceHeritage, bold, createLinkToType, tableRow, tableHead, h5} from "./util";
import {ReflectionKind} from "../../interfaces/ReflectionKind";
import {relationMd} from "./general-md-gen";

export function docMd(comment: CommentObject): string {
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

export function docHeritage(type: ClassObject | InterfaceObject): string {
  if (type) {
    const linkCondition = (obj) => obj.id ? link(obj.name) : obj.name;
    let result = '';

    let heritageSuperclass = reduceHeritage('', type.extendedTypes, linkCondition);
    let superclass = heritageSuperclass ? bold('Inheritance:') + heritageSuperclass + n : '';

    let heritageSubclasses = reduceHeritage('', type.extendedBy, linkCondition);
    let subclasses = heritageSubclasses ? bold('Known subclasses:') + heritageSubclasses + n : '';

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

export function docTableMd(children: BaseObject[]): string {
  if (children && 0 !== children.length) {
    let subDocTables = '';
    return children.reduce((s, child) => {
      let name = child.name;
      let comment = child.comment;
      let doc = comment ? (comment.shortText ? comment.shortText : comment.text)
        .replace(/\n/g, ' ') : '-';
      let subDoc = relationMd(child, link);
      let type = `[${child.kindString}]`;

      if (0 !== (child.kind & (ReflectionKind.Parameter | ReflectionKind.VariableOrProperty | ReflectionKind.TypeParameter))) {
        [type, name, subDocTables] = [...docForFields(<ParameterObject> child, name, subDocTables)];
      }

      if (0 !== (child.kind & (ReflectionKind.CallSignature | ReflectionKind.IndexSignature))) {
        name = docForSignatures(<SignatureObject> child, name);
      }

      return s + tableRow(type, name, subDoc ? subDoc : doc) + n;
    }, `${tableHead}${n}`).slice(0, -1).concat(subDocTables);
  } else {
    return '';
  }
}

function* docForFields(child: ParameterObject, name: string, subDocTables: string) {
  if (child) {
    let paramType = child.type;
    yield createLinkToType(paramType);
    if (paramType.declaration && paramType.declaration.children) {
      yield link(name);
      yield subDocTables.concat(nn)
        .concat(h5(child.name))
        .concat(nn)
        .concat(docTableMd(paramType.declaration.children));
    } else {
      yield name;
      yield subDocTables;
    }
  }
}

function docForSignatures(child: SignatureObject, name: string) {
  if (child) {
    let paramTypes = child.parameters.reduce((i, p) => {
      let paramType = createLinkToType(p.type)
      return `${i}${paramType}, `;
    }, '').slice(0, -2);
    let typedParamTypes = child.typeParameter.reduce((i, p) => {
      let paramType = createLinkToType(p.type);
      if ('-' === paramType) {
        paramType = p.name;
      }
      return `${i}${paramType}, `;
    }, '<').slice(0, -2).concat('>');
    let returnType = createLinkToType(child.type);
    let brackets = child.kind === ReflectionKind.IndexSignature ? ['[', ']'] : ['(', ')'];
    name = `${typedParamTypes}${brackets[0]}${paramTypes}${brackets[1]}: ${returnType}`;
    return name;
  }
}

import {CommentObject, ClassObject, InterfaceObject, BaseObject, ParameterObject} from "../../interfaces/objects";
import {nn, italic, n, link, reduceHeritage, bold, createLinkToType, tableRow, tableHead} from "./util";
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

export function docTableMd(children: BaseObject[]): string {
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

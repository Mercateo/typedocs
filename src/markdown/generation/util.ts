import {BaseObject, TypeObject, RelationObject, SignatureObject, ParameterObject} from "../../interfaces/objects";
import {typeArgMd, returnMd} from "./signature-gen";

export const bold = (s: string): string => `**${s}**`;
export const italic = (s: string): string => `*${s}*`;
export const underlined = (s: string): string => `_${s}_`;

export const h4 = (s: string) => `#### ${s}`;
export const h5 = (s: string) => `##### ${s}`;
export const link = (name: string, url: string = createMdUrl(name)) => `[${name}](${url})`;
export const tableRow = (type: string, name: string, description: string): string => `${type} | ${name} | ${description}`;

export const n = '\n';
export const nn = n + n;
export const tab = '    ';
export const codeStart = '\`\`\`typescript' + n;
export const codeEnd = n + '\`\`\`';
export const tableHead = `Type | Name | Description${n}:--- | :--- | :----------`;

export function isAccessible(obj: BaseObject): boolean {
  return obj.flags && obj.flags.isExported && !obj.flags.isPrivate;
}

export function createMdUrl(name: string): string {
  return '#' + name
      .replace(/\s/g, '-')
      .replace(/[^a-zA-Z0-9\-]/g, '')
      .toLowerCase();
}

export function createLinkToType(type: TypeObject): string {
  if (type) {
    if ('reflection' === type.type) {
      if(type.declaration.children) {
        return 'Object';
      } else if (type.declaration.indexSignature) {
        return 'IndexSignature';
      } else {
        return 'function';
      }
    } else if('union' === type.type) {
      return type.types.reduce((s, union) => {
        return `${s}'${union.value}' OR `;
      }, '').slice(0, -4);
    } else if (type.name) {
      switch (type.type) {
        case 'reference':
          let name = typeArgMd(type, createLinkToType);
          if (!(<RelationObject> type).id) {
            return name;
          } else {
            let plainName = createMdUrl(name);
            return link(name, plainName);
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

export function reduceHeritage(keyword: string, relations: RelationObject[], linkCondition = (obj) => obj.name): string {
  if (relations && 0 !== relations.length) {
    return relations.reduce((s, type) => {
      let typeName = linkCondition(type);
      return `${s}${typeName}, `;
    }, `${keyword} `).slice(0, -2);
  } else {
    return '';
  }
}

export function distinctParams(signatures: SignatureObject[]): ParameterObject[] {
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

import {BaseObject, EnumObject, EnumMemberObject} from "../../interfaces/objects";
import {nameMd} from "./general-md-gen";
import {codeStart, n, codeEnd, nn, tab} from "./util";
import {docMd, docTableMd} from "./documentation";

export function enumMd(enums: BaseObject[]): string {
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

import {BaseObject, InterfaceObject} from "../../interfaces/objects";
import {n, tab, codeStart, codeEnd, nn} from "./util";
import {paramMd} from "./signature-gen";
import {nameMd, heritageMd} from "./general-md-gen";
import {docMd, docHeritage, docTableMd} from "./documentation";

export function interfaceMd(interfaces: BaseObject[]): string {
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

import {BaseObject, InterfaceObject} from "../../interfaces/objects";
import {n, tab, codeStart, codeEnd, nn} from "./util";
import {paramMd, signatureMd} from "./signature-gen";
import {nameMd, heritageMd} from "./general-md-gen";
import {docMd, docHeritage, docTableMd} from "./documentation";

export function interfaceMd(interfaces: BaseObject[]): string {
  let interfaceString: string = '';

  interfaces.forEach((i) => {
    let converted = <InterfaceObject> i;
    let members = paramMd(converted.children, `,${n}${tab}`);
    let signatures = signatureMd(converted.signatures, `,${n}${tab}`);
    let tableParams = converted.signatures
      ? converted.children.concat(converted.signatures) : converted.children;
    interfaceString = interfaceString
      .concat(`${nameMd(converted)}`)
      .concat(n)
      .concat(codeStart)
      .concat(`interface ${converted.name} `)
      .concat(heritageMd(converted))
      .concat(`{`)
      .concat(members ? `${n}${tab}${members}${n}` : '')
      .concat(signatures ? `${n}${tab}${signatures}${n}` : '')
      .concat(`}`)
      .concat(codeEnd)
      .concat(nn)
      .concat(docMd(converted.comment))
      .concat(nn)
      .concat(docHeritage(converted))
      .concat(nn)
      .concat(docTableMd(tableParams))
      .concat(nn)
      .concat(`---${n}`);
  });

  return interfaceString;
}

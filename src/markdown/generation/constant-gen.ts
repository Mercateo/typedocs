import {BaseObject, ConstantObject, ParameterObject} from "../../interfaces/objects";
import {nameMd} from "./general-md-gen";
import {n, codeStart, codeEnd, nn, tab} from "./util";
import {docMd} from "./documentation";
import {paramMd} from "./signature-gen";

function defaultObject(children: ParameterObject[]): string {
  if (children) {
    let params = paramMd(children, `,${n}${tab}`);
    return `{${n}${tab}${params}${n}}`
  } else {
    return '';
  }
}

export function constantMd(constants: BaseObject[]): string {
  let constantString: string = '';

  constants.forEach((constant) => {
    let converted = <ConstantObject> constant;
    let defaultValue = converted.defaultValue || defaultObject(converted.children as ParameterObject[]);
    constantString = constantString
      .concat(nameMd(converted))
      .concat(n)
      .concat(codeStart)
      .concat(`${converted.type.name} ${converted.name} = ${defaultValue}`)
      .concat(codeEnd)
      .concat(nn)
      .concat(docMd(converted.comment))
      .concat(nn)
      .concat(`---${n}`);
  });

  return constantString;
}

import {BaseObject, ConstantObject} from "../../interfaces/objects";
import {nameMd} from "./general-md-gen";
import {n, codeStart, codeEnd, nn} from "./util";
import {docMd} from "./documentation";

export function constantMd(constants: BaseObject[]): string {
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

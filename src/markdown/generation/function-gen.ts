import {BaseObject, FunctionObject} from "../../interfaces/objects";
import {nameMd} from "./general-md-gen";
import {codeStart, codeEnd, nn, distinctParams, n} from "./util";
import {signatureMd} from "./signature-gen";
import {docMd, docTableMd} from "./documentation";

export function functionMd(functions: BaseObject[]): string {
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

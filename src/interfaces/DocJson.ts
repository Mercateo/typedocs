/**
 * Created by alexander on 09.08.16.
 */
import {ConstantDoc, EnumDoc, FunctionDoc, ClassDoc, InterfaceDoc} from "./DocEntries";

export interface DocJson extends JSON {
  constants?: ConstantDoc[],
  enums?: EnumDoc[],
  functions?: FunctionDoc[],
  classes?: ClassDoc[],
  interfaces?: InterfaceDoc[]
}

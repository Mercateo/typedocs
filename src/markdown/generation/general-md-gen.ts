import {BaseObject, InterfaceObject, ClassObject} from "../../interfaces/objects";
import {h4, n, reduceHeritage} from "./util";

export function nameMd(baseObj: BaseObject): string {
  return `${h4(baseObj.name)}${n}`;
}

export function modifierMd(flags: any): string {
  if (flags.isProtected) {
    return 'protected ';
  } else if (flags.isPrivate) {
    return 'private ';
  } else {
    return 'public ';
  }
}

export function heritageMd(converted: InterfaceObject | ClassObject): string {
  let reducedExtension = reduceHeritage('extends', converted.extendedTypes);
  let reducedImplementation = reduceHeritage('implements', (<ClassObject> converted).implementedTypes)
  return reducedExtension + (reducedExtension ? ' ' : '') + reducedImplementation + ' ';
}

export function relationMd(obj: BaseObject, linked = (s) => s): string {
  const inheritedFrom = 'inheritedFrom';
  const implementationOf = 'implementationOf';
  const fOnlyType = (s: string) => s.substring(0, -1 !== s.indexOf('.') ? s.indexOf('.') : s.length);

  if (obj) {
    if (obj[inheritedFrom]) {
      let name = linked(fOnlyType(obj[inheritedFrom].name));
      return `{ inherited from ${name} }`
    } else if (obj[implementationOf]) {
      let name = linked(fOnlyType(obj[implementationOf].name));
      return `{ implements function of ${name} }`
    }
  }
  return '';
}

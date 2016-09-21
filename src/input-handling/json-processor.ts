import {
  BaseObject, ID, Result, Title, ClassObject,
  ConstructorObject, MethodObject
} from '../interfaces/objects';
import {
  ReflectionKind
} from '../interfaces/ReflectionKind';
import {matchGroups} from "./group-transforming";
import {addApiExportedFlag} from "./find-real-api";
import {ObjectIterator} from "./ObjectIterator";

function processModules<T extends BaseObject>(it: ObjectIterator): Result[] {
  return matchGroups(it.modules)
    .map<Result>((group) => {
      let children = it.findChildrenById(group.children, (child) => child.flags.isApiExported);
      return {
        title: group.title === 'Variables' ? Title.Constants : Title[group.title],
        children: children
      } as Result;
    });
}

function processClasses(classes: Result, it: ObjectIterator): void {
  if (classes) {
    classes.children.forEach((child) => {
      let clazz = <ClassObject> child;
      clazz.groups.forEach((group) => {
        switch (group.kind) {
          case ReflectionKind.Constructor:
            // there will only be one constructor with different signatures
            clazz.constructors = it.findChildById<ConstructorObject>(group.children[0]);
            break;
          case ReflectionKind.Property:
            if (!clazz.properties) {
              clazz.properties = [];
            }
            let properties = it.findChildrenById(group.children);
            clazz.properties = clazz.properties.concat(properties);
            break;
          case ReflectionKind.Method:
            if (!clazz.methods) {
              clazz.methods = [];
            }
            let methods = it.findChildrenById<MethodObject>(group.children);
            clazz.methods = clazz.methods.concat(methods);
            break;
          default:
            break;
        }
      })
    });
  }
}
export function process(typeDocJson: BaseObject): Result[] {
  let it = new ObjectIterator(typeDocJson);

  addApiExportedFlag(it);

  let results = processModules(it);

  let classes = results.find((r) => Title.Classes === r.title);
  processClasses(classes, it);

  return results;
}


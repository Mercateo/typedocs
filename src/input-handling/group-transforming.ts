import {Title, BaseObject, GroupObject, TEMPLATE} from "../interfaces/objects";
import {ReflectionKind} from "../interfaces/ReflectionKind";

function reduceToKnownGroups(moduleGroup: GroupObject): GroupObject {
  let knownKinds = TEMPLATE.map((g) => g.kind);
  if (!knownKinds.find((k) => k === moduleGroup.kind)) {
    moduleGroup.kind = ReflectionKind.Variable;
    moduleGroup.title = Title[Title.Constants];
  }
  return moduleGroup;
}

export function matchGroups(modules: BaseObject[]): GroupObject[] {
  return modules.reduce<GroupObject[]>((groups, module) => {
    if (module.groups) {
      module.groups.forEach((moduleGroup) => {

        let knownGroup = reduceToKnownGroups(moduleGroup);
        let match = groups.find((g) => g.kind === knownGroup.kind);
        match.children = match.children.concat(knownGroup.children);
      });
    }
    return groups;
  }, TEMPLATE);
}

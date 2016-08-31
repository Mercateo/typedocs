import {BaseObject, GroupObject, TEMPLATE, ID, Result, Title, ConstantObject} from '../interfaces/objects';
import {
  ReflectionKind
} from './ReflectionKind';
const traverse = require('traverse');

type Condition = (obj: BaseObject) => boolean;

class ObjectIterator {

  private typeDocJson: BaseObject;
  private flatObjectList: Array<BaseObject>;

  constructor(typeDocJson: BaseObject) {
    this.typeDocJson = typeDocJson;
    this.flatObjectList = this.getFlatObjectList();
  }

  private getFlatObjectList(): Array<BaseObject> {
    if(!this.flatObjectList) {
      this.flatObjectList = [];
      traverse(this.typeDocJson.children)
        .forEach((obj) => {
          if (obj.id && !(obj.type === 'reference')) {
            this.flatObjectList.push(obj)
          }
        });
    }
    return this.flatObjectList;
  }

  findChildById<T extends BaseObject>(childId: ID): T {
    return <T> this.getFlatObjectList().find((obj) => obj.id === childId);
  }

  findChildrenById<T extends BaseObject>(childrenIds: ID[], condition?: Condition) : T[] {
    let children = [];
    childrenIds.forEach((id) => {
      let child = this.findChildById(id);
      if (condition && condition(child)) {
        children.push(child)
      }
    });
    return children;
  }
}

function reduceToKnownGroups(moduleGroup: GroupObject): GroupObject {
  let knownKinds = TEMPLATE.map((g) => g.kind);
  if (!knownKinds.find((k) => k === moduleGroup.kind)) {
    moduleGroup.kind = ReflectionKind.Variable;
    moduleGroup.title = Title[Title.Constants];
  }
  return moduleGroup;
}

function matchGroups(modules: BaseObject[]): GroupObject[] {
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

function processModules<T extends BaseObject>(it: ObjectIterator, modules: BaseObject[]): Result[] {
  return matchGroups(modules)
    .map<Result>((group) => {
      let children = it.findChildrenById(group.children, (child) => child.flags.isExported);
      return {
        title: group.title === 'Variables' ? Title.Constants : Title[group.title],
        children: children
      } as Result
    })
}

export function process(typeDocJson: BaseObject): Result[] {
  let it = new ObjectIterator(typeDocJson);

  let externalModules = [] as BaseObject[];
  typeDocJson.groups.forEach((groupMember) => {
    if (ReflectionKind.ExternalModule === groupMember.kind) {
      groupMember.children.forEach((id) => {
        let child = it.findChildById(id);
        if (child.flags.isExported) {
          externalModules.push(child);
        }
      });
    }
  });

  /* TODO how can I find out which functions, interfaces, etc
   are in another module but exported from the target module?
   The problem is that the typedoc json output makes no difference
   between those two types of exporting...
   ... "flags": {
      "isExported": true,
      "isExternal": true
   }...
   is the same for exported functions of other modules and
   EXPLICITLY re-exported function from the target module.*/

  let results = processModules(it, externalModules);

  return results;
}


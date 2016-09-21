import {BaseObject, ID} from "../interfaces/objects";
import {ReflectionKind} from "../interfaces/ReflectionKind";
const traverse = require('traverse');

export type Condition = (obj: BaseObject) => boolean;
export interface Flags {
  [flag: string]: boolean
}

export class ObjectIterator {

  private typeDocJson: BaseObject;
  private flatObjectList: Array<BaseObject>;
  private externalModules: BaseObject[];

  constructor(typeDocJson: BaseObject) {
    this.typeDocJson = typeDocJson;
    this.flatObjectList = this.objects;
  }

  private get objects(): Array<BaseObject> {
    if (!this.flatObjectList) {
      this.flatObjectList = [];
      traverse(this.typeDocJson.children)
        .forEach((obj) => {
          if (obj.id && !(obj.type === 'reference')) {
            this.flatObjectList.push(obj);
          }
        });
    }
    return this.flatObjectList;
  }

  get modules(): BaseObject[] {
    if (!this.externalModules) {
      this.externalModules = [];
      this.typeDocJson.groups.forEach((groupMember) => {
        if (ReflectionKind.ExternalModule === groupMember.kind) {
          groupMember.children.forEach((id) => {
            let child = this.findChildById(id);
            if (child.flags.isExported) {
              this.externalModules.push(child);
            }
          });
        }
      });
    }
    return this.externalModules;
  }

  get lastId(): ID {
    return this.objects.reduceRight((prev, obj) => obj.id > prev ? obj.id : prev, 0 as ID);
  }

  addFlags(flags: Flags, condition?: Condition): void {
    this.objects.forEach((obj) => {
      if (!condition || condition(obj)) {
        obj.flags = Object.assign({}, obj.flags, flags);
      }
    });
  }

  findChildById<T extends BaseObject>(childId: ID): T {
    return <T> this.objects.find((obj) => obj.id === childId);
  }

  findChildrenById<T extends BaseObject>(childrenIds: ID[], condition?: Condition) : T[] {
    let children = [];
    childrenIds.forEach((id) => {
      let child = this.findChildById(id);
      if (!condition || condition(child)) {
        children.push(child);
      }
    });
    return children;
  }
}

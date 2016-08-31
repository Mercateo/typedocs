import {
  ReflectionKind
} from './ReflectionKind';

export type ID = number;

export enum Title {
  Constants, Enumerations, Functions, Classes, Interfaces
}

export interface BaseObject {
  id: ID,
  name: string,
  kind: ReflectionKind,
  kindString?: string,
  flags: any,
  comment?: CommentObject,
  children?: BaseObject[]
  groups?: GroupObject[]
}

/*
  ---------- TYPE OBJECTS ----------
 */

export interface EnumObject extends BaseObject {
  children: EnumMemberObject[]
}

export interface EnumMemberObject extends BaseObject {
  defaultValue: any
}

export interface ClassObject extends BaseObject {
  extendedBy?: RelationObject[],
  extendedTypes?:  RelationObject[],
  implementedTypes?: RelationObject[]
}

export interface InterfaceObject extends BaseObject {
  children: ParameterObject[],
  extendedBy?: RelationObject[],
  implementedBy?: RelationObject[],
  extendedTypes?:  RelationObject[]
}

export interface ConstantObject extends BaseObject {
  type: TypeObject,
  defaultValue: string
}

export interface FunctionObject extends BaseObject {
  signatures: SignatureObject[]
}

export interface SignatureObject extends BaseObject {
  typeParameter?: ParameterObject[],
  parameters?: ParameterObject[],
  type: TypeObject
}

export interface ParameterObject extends BaseObject {
  type: TypeObject
}

/*
  ---------- TYPEDOC-JSON OBJECTS ----------
 */

export const TEMPLATE: GroupObject[] = [
  // Title[Title.*] for string conversion
  { title: Title[Title.Constants], kind: 32, children: [] },
  { title: Title[Title.Enumerations], kind: 4, children: [] },
  { title: Title[Title.Functions], kind: 64, children: [] },
  { title: Title[Title.Classes], kind: 128, children: [] },
  { title: Title[Title.Interfaces], kind: 256, children: [] }
];

export interface GroupObject {
  title: string,
  kind: ReflectionKind,
  children: number[]
}

export interface Result {
  title: Title,
  children: BaseObject[]
}

export interface RelationObject {
  type: string,
  name: string,
  id: ID
}

export interface TypeObject {
  type: string,
  name?: string,
  declaration?: FunctionObject
}

// BADLY designed by typedoc, no field to focus on -.-
export interface CommentObject {
  shortText?: string,
  text?: string,
  returns?: string,
  tags?: { tag: string, text: string }[]
}

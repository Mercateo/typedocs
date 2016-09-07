import {
  Result, Title
} from '../../interfaces/objects';
import {SectionOrString, Section} from '../Markdown';
import {constantMd} from "./constant-gen";
import {enumMd} from "./enum-gen";
import {functionMd} from "./function-gen";
import {classMd} from "./class-gen";
import {interfaceMd} from "./interface-gen";

export function generateMarkdown(result: Result): Section {
  if (result.children.length !== 0) {
    return {
      header: `## ${Title[result.title]}`,
      markdown: groupMd(result)
    };
  }
}

function groupMd(result: Result): SectionOrString {
  let objects = result.children;
  switch (result.title) {
    case Title.Constants:
      return constantMd(objects);
    case Title.Enumerations:
      return enumMd(objects);
    case Title.Functions:
      return functionMd(objects);
    case Title.Classes:
      return classMd(objects);
    case Title.Interfaces:
      return interfaceMd(objects);
    default:
      return '';
  }
}

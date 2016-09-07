import {generateMarkdown} from './generation/component-gen';
import {process} from '../input-handling/json-processor';
const toc = require('markdown-toc');

function isString(s: SectionOrString): s is string {
  return typeof s === 'string';
}

export type SectionOrString = Section | string;

export interface Section {
  header: string,
  markdown: SectionOrString
}

interface TopLevelSection {
  header: string,
  paragraphs: Section[]
}

const createTopLevelSection = (name: string): TopLevelSection => {
  return {header: `# ${name}`, paragraphs: []} as TopLevelSection;
};

const printable = (section: SectionOrString): string => {
  if (section) {
    if (isString(section)) {
      return section;
    } else {
      let text = printable(section.markdown);
      return `${section.header}\n\n${text}`;
    }
  } else {
    return '';
  }
};

function appendTableOfContent(text: string): string {
  let tableOfContent = toc(text).content;
  return `${tableOfContent}\n${text}`;
}

function printParagraphs(paragraphs: Section[]): string {
  let text = '';
  paragraphs.forEach((p) => {
      text = text
        .concat('\n\n')
        .concat(printable(p));
    });
  return text;
}
export class Markdown {
  private markdown: TopLevelSection;

  constructor(typeDocJson: any) {
    this.markdown = createTopLevelSection(typeDocJson.name);

    const results = process(typeDocJson);

    results.map((result) => {
      this.markdown.paragraphs.push(generateMarkdown(result));
    });
  }

  getText(): string {
    let header = this.markdown.header;
    let contents = appendTableOfContent(printParagraphs(this.markdown.paragraphs));
    return `${header}\n${contents}`
  }

}

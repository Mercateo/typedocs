import {generateMarkdown} from './generation/component-gen';
import {process} from '../input-handling/json-processor';

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
    let text = this.markdown.header;
    this.markdown.paragraphs
      .forEach((p) => {
        text = text
          .concat('\n\n')
          .concat(printable(p));
      });
    return text;
  }

}

import { DocJson } from '../interfaces/DocJson';
import {  functionsMd } from './component-gen';

export default class Markdown {
  private markdownText: string;

  constructor(docAsJson: DocJson) {
    //this.markdownText = functionsMd(docAsJson);
  }

  getMarkdown(): string {
    return this.markdownText;
  }
}

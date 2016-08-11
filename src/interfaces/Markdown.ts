/**
 * Created by alexander on 09.08.16.
 */
import { DocJson, Foo } from "./DocJson";

export default class Markdown {
  private docAsJson: DocJson[];
  private markdownText: string;

  constructor(docAsJson: DocJson[]) {
    this.docAsJson = docAsJson;
    this.markdownText = this.generateMarkdown();
  }

  getMarkdown(): string {
    return this.markdownText;
  }

  // TODO: make it final when called in constructor
  private generateMarkdown(): string {
    let functionsString = this.createFunctionsMd();

    return `# Functions

${functionsString}`;
  }

  private createFunctionsMd(): string {
    let functionString: string = '';

    this.docAsJson
      .filter((o) => o['type'] === 'function')
      .forEach((o) => {
        let argString = this.createParametersMd(o['signatures'][0]['parameters']);
        functionString = `${functionString}## \`${o['name']}\`

${o['documentation']}
### Arguments

${argString}
### Returns

\`${o['signatures'][0]['returns']['type']}\`

${o['signatures'][0]['returns']['documentation']}

`
      });

    return functionString;
  }

  private createParametersMd(params: JSON[]): string {
    let paramString: string = '';

    params.forEach((p) => {
      paramString = `${paramString}- \`${p['name']}\`: \`${p['type']}\` - ${p['documentation']}
`
    });

    return paramString;
  }
}

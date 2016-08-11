export default class Markdown {
    constructor(docAsJson) {
        this.docAsJson = docAsJson;
        this.markdownText = this.generateMarkdown();
    }
    getMarkdown() {
        return this.markdownText;
    }
    // TODO: make it final when called in constructor
    generateMarkdown() {
        let functionsString = this.createFunctionsMd();
        return `# Functions

${functionsString}`;
    }
    createFunctionsMd() {
        let functionString = '';
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

`;
        });
        return functionString;
    }
    createParametersMd(params) {
        let paramString = '';
        params.forEach((p) => {
            paramString = `${paramString}- \`${p['name']}\`: \`${p['type']}\` - ${p['documentation']}
`;
        });
        return paramString;
    }
}

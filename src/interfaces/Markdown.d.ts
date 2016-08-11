/**
 * Created by alexander on 09.08.16.
 */
import DocJson from "./DocJson";
export default class Markdown {
    private docAsJson;
    private markdownText;
    constructor(docAsJson: DocJson[]);
    getMarkdown(): string;
    private generateMarkdown();
    private createFunctionsMd();
    private createParametersMd(params);
}

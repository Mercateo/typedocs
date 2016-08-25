import {baseMd, parametersMd, returnMd, functionsMd} from '../../src/markdown/component-gen';
import expect from "expect";
import {DocJson} from "../../src/interfaces/DocJson";

describe('test component markdown generation', () => {
  it('creates base markdown', () => {
    const base = JSON.parse('{ \"name\": \"foo\", \"documentation\": \"bar\" }');
    const expected = '## \`foo\`\n\nbar';

    const actual = baseMd(base);

    expect(actual).toEqual(expected);
  });

  it('creates parameters markdown', () => {
    const params = JSON.parse('[{ \"name\": \"foo\", \"type\":\"baz\", \"documentation\": \"bar\" }]');
    const expected = '### Arguments\n\n- \`foo\`: \`baz\` - bar';

    const actual = parametersMd(params);

    expect(actual).toEqual(expected);
  });

  it('creates return markdown', () => {
    const returns = JSON.parse('{\"type\":\"baz\", \"documentation\": \"bar\" }');
    const expected = '### Returns\n\n\`baz\`\n\nbar';

    const actual = returnMd(returns);

    expect(actual).toEqual(expected);
  });

  it('creates function markdown', () => {
    // const fct: DocJson[] = JSON.parse(JSON.stringify([{ name: 'add', documentation: 'This function adds two summands.\n', type: 'function',
    //   signatures: [
    //         {
    //           parameters: [
    //             {
    //               name: 'a',
    //               documentation: 'The first summand.',
    //               type: 'number'
    //             }
    //           ],
    //           returns : {
    //             type: 'number',
    //             documentation: 'The sum.'
    //           }
    //         }]}, { name: 'dummy', type: 'no function'}]));
    // const expected = '# Functions\n\n## \`add\`\n\nThis function adds two summands.\n\n### Arguments\n\n- `a`: `number` - The first summand.\n\n### Returns\n\n\`number\`\n\nThe sum.'
    //
    // const actual = functionsMd(fct);
    //
    // expect(actual).toEqual(expected);
  });

});

const join = require('path').join;
const extractMarkdownFile = require('../../dist').extractMarkdownFile;

// fileNames: string[], parseOptions: ParseOptions = { compilerOptions: require('../tsconfig.json') }, targetName: string
extractMarkdownFile([
  join(process.cwd(), 'src/index.ts')
], require('./tsconfig.json'), 'docs/api.md');

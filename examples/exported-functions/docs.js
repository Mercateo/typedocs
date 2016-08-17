const join = require('path').join;
const extractJson = require('../../dist').extractJson;

const json = extractJson([
  join(process.cwd(), 'src/index.ts')
]);
console.log(JSON.stringify(json))

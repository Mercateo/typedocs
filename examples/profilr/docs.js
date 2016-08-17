const join = require('path').join;
const extractJson = require('../../dist').extractJson;

const json = extractJson([
  join(process.cwd(), 'src/api.ts')
]);
console.log(JSON.stringify(json))

// call it as `$ node scripts/update-examples.js` from root
const join = require('path').join;
const existsSync = require('fs').existsSync;
const execSync = require('child_process').execSync;
const rimrafSync = require('rimraf').sync;

const examples = [
  'browser-less',
  'browser-ts',
  'browser-ts-react',
  'browser-ts-react-i18n',
  'spa-ts',
  'spa-ts-i18n',
  'node-ts'
];

const stdio = 'inherit';

examples.forEach(example => {
  console.log(`Update "${example}":`);
  try {
    const cwd = join(process.cwd(), 'examples', example);
    rimrafSync(join(cwd, 'node_modules'));
    rimrafSync(join(cwd, 'dist'));
    rimrafSync(join(cwd, 'dist-tests'));
    rimrafSync(join(cwd, 'dist-release'));
    execSync('npm install', { cwd, stdio });
    if (example.includes('i18n')) {
      execSync('npm run -s ws -- i18n:c', { cwd, stdio });
    }
    execSync('npm run -s ws -- build', { cwd, stdio });
    if (example.includes('spa')) {
      execSync('npm run -s ws -- build --production', { cwd, stdio });
    }
    execSync('npm run -s ws -- lint', { cwd, stdio });
    if (
      existsSync(join(cwd, 'tests', 'unit.ts')) ||
      existsSync(join(cwd, 'tests', 'unit.js')) ||
      existsSync(join(cwd, 'tests', 'unit.tsx'))
    ) {
      execSync('npm run -s ws -- unit', { cwd, stdio });
    }
  } catch (err) {
     throw `[ERROR] Couldn't update "${example}"!`;
  }
  console.log(`Finished updating "${example}".`);
});

console.log('Updated all examples ♥');

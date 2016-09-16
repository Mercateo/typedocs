import { join } from 'path';
import { DefinePlugin, optimize } from 'webpack';
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';
import WebpackNodeExternals from 'webpack-node-externals';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import { resolve as resolveFile } from '../resolve';
import { project } from '../../project';

export const entry = [
  `./${project.ws.srcDir}/index.${project.ws.entryExtension}`
];

export const entryUnit = [
  `./${project.ws.testsDir}/unit.${project.ws.entryExtension}`
];

export const entryNode = [
  'source-map-support/register',
  `./${project.ws.srcDir}/index.${project.ws.entryExtension}`
];

export const entryNodeUnit = [
  'source-map-support/register',
  `./${project.ws.testsDir}/unit.${project.ws.entryExtension}`
];

export const output = {
  filename: 'index.js',
  // must be absolute
  path: join(process.cwd(), project.ws.distDir),
  // don't use webpack:/// protocol for source maps
  devtoolModuleFilenameTemplate: './[resource-path]',
  // removes tabs before multiline strings
  sourcePrefix: ''
};

export const outputTest = Object.assign({}, output, {
  // must be absolute
  path: join(process.cwd(), project.ws.distTestsDir)
});

export const outputCommon2 = Object.assign({}, output, {
  libraryTarget: 'commonjs2'
});

export const outputUmd = Object.assign({}, output, {
  libraryTarget: 'umd',
  library: project.name
});

export const outputUmdMin = Object.assign({}, outputUmd, {
  filename: 'index.min.js'
});

export const outputSpaRelease = Object.assign({}, output, {
  // must be absolute
  path: join(process.cwd(), project.ws.distReleaseDir),
  filename: 'index-[hash].js'
});

const babelNode = JSON.stringify({
  presets: [
    resolveFile('@niftyco/babel-node'),
    resolveFile('babel-preset-stage-0')
  ],
  plugins: [
    resolveFile('babel-plugin-transform-decorators-legacy')
  ]
});

const babelBrowser = JSON.stringify({
  presets: [
    [ resolveFile('babel-preset-es2015') , { modules: false } ],
    resolveFile('babel-preset-react'),
    resolveFile('babel-preset-stage-0')
  ],
  plugins: [
    resolveFile('babel-plugin-transform-decorators-legacy')
  ]
});

export const tsLoader = {
  test: /\.ts(x?)$/,
  loader:
    `babel-loader?` +
    (project.ws.type === 'node' ? babelNode : babelBrowser) +
    `!ts-loader?silent=true`
};

export const jsonLoader = {
  test: /\.json$/,
  loader: 'json-loader'
};

export const cssLoader = {
  test: /\.css$/,
  loader: ExtractTextWebpackPlugin.extract('css-loader?sourceMap')
};

export const lessLoader = {
  test: /\.less/,
  loader: ExtractTextWebpackPlugin.extract('css-loader?sourceMap!postcss-loader?sourceMap!less-loader?sourceMap')
};

export const imageLoader = {
  test: /\.(png|jpg|gif|svg)$/,
  loader: 'url-loader',
  query: {
    limit: 10000,
    name: '[name]-[hash].[ext]'
  }
};

export const eotLoader = {
  test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'file-loader'
};

export const woffLoader = {
  test: /\.(woff|woff2)$/,
  loader: 'url-loader?prefix=font/&limit=5000'
};

export const ttfLoader = {
  test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
};

export const extractCssPlugin = new ExtractTextWebpackPlugin('style.css');

export const extractCssMinPlugin = new ExtractTextWebpackPlugin('style.min.css');

export const extractCssHashPlugin = new ExtractTextWebpackPlugin('style-[contenthash].css');

export const postcss = () => [
  autoprefixer({
    browsers: project.ws.browsers
  })
];

export const defineProductionPlugin = new DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
});

export const minifyJsPlugin = new optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  }
});

export const indexHtmlPlugin = new HtmlWebpackPlugin({
  template: './src/index.html'
});

export const resolveLoader = {
  // if you symlink the ws tool (e.g. while development), you want to resolve loaders
  // relative to the ws tool first (just like a normale `require()` would work)
  modules: [
    // relative to `dist/index.js`
    join(__dirname, '..', 'node_modules'),
    join(process.cwd(), 'node_modules'),
    'node_modules'
  ]
};

// defaults
// see https://github.com/webpack/webpack/blob/dc50c0360e87204ea77172910e877f8c510f3bfb/lib/WebpackOptionsDefaulter.js#L75
const defaultExtensions = [
  '.js'
  // '.json' // supported by us?
];

const tsExtensions = [
  '.ts',
  '.tsx'
].concat(defaultExtensions);

const mainFieldsNode = [
  'webpack',
  // defaults
  // see https://github.com/webpack/webpack/blob/dc50c0360e87204ea77172910e877f8c510f3bfb/lib/WebpackOptionsDefaulter.js#L86
  'module',
  'main'
];

const mainFieldsBrowser = [
  'webpack',
  // defaults
  // see https://github.com/webpack/webpack/blob/dc50c0360e87204ea77172910e877f8c510f3bfb/lib/WebpackOptionsDefaulter.js#L84
  'browser',
  'module',
  'main'
];

export const resolve = {
  extensions: project.ws.entryExtension === 'js' ? defaultExtensions : tsExtensions,
  mainFields: project.ws.type === 'node' ? mainFieldsNode : mainFieldsBrowser
};

export const devtool = 'cheap-module-inline-source-map';

export const devtoolProduction = 'source-map';

export const devtoolTest = 'inline-source-map';

export const externalsNode = [
  // require json files with nodes built-in require logic
  function(context, request, callback) {
    if (/\.json$/.test(request)) {
      callback(null, 'commonjs ' + request);
    } else {
      callback();
    }
  },
  // in order to ignore all modules in node_modules folder
  WebpackNodeExternals()
];

export const externalsBrowser = [
  // by default we mark every `dependency` as external by setting `{ 'external-module': true }`
  // see https://webpack.github.io/docs/configuration.html#externals
  // after that we add custom externals defined in `project.ws.externals`
  Object.assign(Object.keys(project.dependencies || {}).reduce((target, key) => {
    target[key] = true;
    return target;
  }, {}), project.ws.externals)
];

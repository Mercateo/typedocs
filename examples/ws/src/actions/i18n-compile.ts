import { debug } from 'loglevel';
import { parse } from 'properties';
import { join } from 'path';
import { camelCase } from 'lodash';
import { readFileAsync, outputFileAsync, removeAsync } from 'fs-extra-promise';
import { concatLanguages, isMatchingLocaleOrLanguage } from '../lib/i18n';
import { project } from '../project';

const parser = require('intl-messageformat-parser');

const GENERATED_WARNING = '// this file was generated - do not modify it manually';

interface TranslationMap {
  [key: string]: string;
}

interface AstMap {
  [key: string]: any;
}

interface Translation {
  locale: string;
  data: TranslationMap;
}

interface GroupedTranslation {
  locale: string;
  translations: Translation[];
}

interface ParsedTranslation {
  locale: string;
  data: TranslationMap;
  asts: AstMap;
}

function camelCaseKeys(data) {
  return Object.keys(data).reduce((acc, key) => {
    acc[camelCase(key)] = data[key];
    return acc;
  }, {});
}

async function readTranslation(locale: string, feature: string): Promise<Translation> {
  const readPath = join(process.cwd(), project.ws.i18n.dir, feature, `${locale}.properties`);

  debug(`Read from ${readPath}.`);

  const translation: Translation = await readFileAsync(readPath, 'utf8')
    .then(parse)
    .catch(err => {
      if (err.code === 'ENOENT') {
        // translations can be "empty"
        return {};
      } else {
        throw err;
      }
    })
    .then(camelCaseKeys)
    .then(data => ({ data, locale }));

  return translation;
}

function writeTranslation(translation: ParsedTranslation) {
  const filename = join(project.ws.srcDir, project.ws.i18n.dir, `${translation.locale}.js`);
  const data = `${GENERATED_WARNING}
module.exports.asts = ${JSON.stringify(translation.asts, null, '  ')};`;

  return outputFileAsync(filename, data);
}

function hasArguments(ast) {
 return ast.elements && ast.elements.length && ast.elements.filter(element => element.type === 'argumentElement').length;
}

function getArguments(ast) {
  const keyTypePairs = ast.elements
    .filter(element => element.type === 'argumentElement')
    .map(element => ({
      key: element.id,
      type:
        (element.format && element.format.type === 'pluralFormat')
          ? 'number'
        : (element.format && element.format.type === 'selectFormat')
          ? element.format.options.map(({ selector }) => selector === 'other' ? 'string' : `'${selector}'`).join(' | ')
          : 'string'
    }));
  if (keyTypePairs.length) {
    return `{ ${keyTypePairs.map(({ key, type }) => `${key}: ${type}`).join(', ')} }`;
  } else {
    return '';
  }
}

function getDocumentation(translations: ParsedTranslation[], key: string) {
  return `
/**${translations.map(translation => `
 * \`${translation.locale}\`: ${translation.data[key]}` ).join('')}
 */`;
}

function writeIndexTranslation(translations: ParsedTranslation[]) {
  const filename = join(project.ws.srcDir, project.ws.i18n.dir, `index.${project.ws.entryExtension}`);
  const hasTypes = project.ws.entryExtension !== 'js';

  const data =
`${GENERATED_WARNING}
const INTL_LOCALE = process.env.LOCALE.replace('_', '-');
const asts = require(\`./\${process.env.LOCALE}\`).asts;
const IntlMessageFormat = require('intl-messageformat');

const lazyMessages = {};${Object.keys(translations[0].data).map(key => `
${getDocumentation(translations, key)}
export const ${key} = (${hasArguments(translations[0].asts[key]) ? `data${hasTypes ? `: ${getArguments(translations[0].asts[key])}` : ''}` : ''})${hasTypes ? ': string' : ''} => {
  if (!lazyMessages['${key}']) {
    lazyMessages['${key}'] = new IntlMessageFormat(asts['${key}'], INTL_LOCALE);
  }
  return lazyMessages['${key}'].format(${hasArguments(translations[0].asts[key]) ? 'data' : ''});
};`
).join('')}
`;

  return outputFileAsync(filename, data);
}

export default async function i18nCompile() {
  const features = project.ws.i18n.features || [ '' ];
  const locales = project.ws.i18n.locales;
  const localesAndLanguages = concatLanguages(locales);

  const readPromises: Promise<Translation>[] = [];
  features.forEach(feature => localesAndLanguages.forEach(localeOrLanguage => {
    readPromises.push(readTranslation(localeOrLanguage, feature));
  }));
  const translations: Translation[] = await Promise.all(readPromises);

  const groupedTranslations: GroupedTranslation[] = locales.map(locale => ({
    locale,
    translations: translations.filter(translation => isMatchingLocaleOrLanguage(translation.locale, locale))
  }));

  const mergedTranslations: Translation[] = groupedTranslations.map(({ locale, translations }) => ({
    locale,
    data: translations.reverse().reduce((acc, translation) => Object.assign(acc, translation.data), {} as TranslationMap)
  }));

  const parsedTranslations: ParsedTranslation[] = mergedTranslations.map(translation => {
    const asts = {};
    Object.keys(translation.data).forEach(key => {
      const ast = parser.parse(translation.data[key]);
      asts[key] = ast;
    });
    return Object.assign({ asts }, translation);
  });

  await removeAsync(join(project.ws.srcDir, project.ws.i18n.dir));
  await Promise.all(parsedTranslations.map(writeTranslation));
  await writeIndexTranslation(parsedTranslations);
};

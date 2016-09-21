import {BaseObject} from "../interfaces/objects";
import {readFileSync} from "fs-extra-promise";
import {ObjectIterator} from "./ObjectIterator";

export function addApiExportedFlag(iterator: ObjectIterator) {
  const baseModule = findBaseModule(iterator.modules);

  let tsFile = readFileSync(baseModule.originalName, "utf-8");
  let exportedFromAnotherModule = parseExportClause(tsFile);
  let exportedInBaseModule = (id) => id > baseModule.id && id < iterator.lastId;

  iterator.addFlags({ isApiExported: true }, (obj) => {
    return obj.flags.isExported &&
      (exportedFromAnotherModule.indexOf(obj.name) > -1 ||
        exportedInBaseModule(obj.id))
  });
}

/**
 * Finds the module specified as entry point when api.json was created.
 * Uses the hack, that this module does not have 'isExternal'-flag.
 * @param modules
 * @returns {BaseObject} the entry point module
 */
function findBaseModule(modules: BaseObject[]): BaseObject {
  let baseModule = modules.filter((module) => !module.flags.isExternal);
  if (1 !== baseModule.length) {
    console.error('Please specify your entry .ts-file explicitly, when generating typedoc-json output.');
    process.exit(1);
  } else {
    return baseModule[0];
  }
}

function parseExportClause(tsFile: string): string[] {
  let splitted = tsFile.split(/export {/gm) // splits on export clause
    .filter((s) => s.match(/^[\s\n].*[\n\s\w]}.*;/gm)) // filters substrings ending with ` } from ''; `
    .reduce((i, s) => i + s.substring(0, s.indexOf('}')), ''); // reduces splitted groups to words separated by ','

  return findWords(splitted);
}

function findWords(s: string): string[] {
  const regExp = /\w+/g;
  let words = [];

  let arr;
  while ((arr = regExp.exec(s)) !== null) {
    words.push(arr[0]);
  }

  return words;
}

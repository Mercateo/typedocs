import {DocJson} from "../interfaces/DocJson";

export function functionsMd(docJson: DocJson): string {
  let functionString: string = '# Functions\n\n';

  // docJson
  //   .filter((o) => o['type'] === 'function')
  //   .forEach((o) => {
  //     let baseString = baseMd(o);
  //     let argString = parametersMd(o['signatures'][0]['parameters']);
  //     let retString = returnMd(o['signatures'][0]['returns']);
  //     functionString += `${baseString}\n${argString}\n\n${retString}`;
  //   });

  return functionString;
}

export function baseMd(baseObj: JSON): string {
  let baseString = `## \`${baseObj['name']}\`\n\n${baseObj['documentation']}`;
  return baseString;
}

export function parametersMd(params: JSON[]): string {
  let paramString: string = '### Arguments\n\n';

  params.forEach((p) => {
    paramString = `${paramString}- \`${p['name']}\`: \`${p['type']}\` - ${p['documentation']}`
  });

  return paramString;
}

export function returnMd(returnObj: JSON): string {
  let returnString: string = '### Returns\n\n';

  returnString = `${returnString}\`${returnObj['type']}\`\n\n${returnObj['documentation']}`;

  return returnString;
}

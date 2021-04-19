import {
  resolve, join, dirname, extname,
} from 'path';
import { readFileSync } from 'fs';

import loaderUtils from 'loader-utils';

export default function jsonImportLoader(content) {
  const defaultOpts = {
    prefix: 'json-import-list',
  };

  let options = loaderUtils.getOptions(this);
  options = {
    ...defaultOpts,
    ...options,
  };

  const {
    prefix,
  } = options;

  const importMatcher = new RegExp(`^\\s*@${prefix} ["'](.*?)["'];(.*)`);

  const contents = content.split('\n');
  const lessPath = this.resourcePath;
  const fileDir = dirname(lessPath);
  const newContent = [];
  for (let i = 0; i < contents.length; i += 1) {
    const match = importMatcher.exec(contents[i]);
    if (match) {
      let jsonPath = resolve(join(fileDir, match[1]));
      if (extname(jsonPath) !== '.json') {
        jsonPath += '.json';
      }

      let jsonContent = [];
      try {
        jsonContent = JSON.parse(readFileSync(jsonPath, { encoding: 'utf-8', flat: 'rs' }));
      } catch (e) {
        throw new Error(`less-json-import-list loader: can't load "${jsonPath}"`);
      }

      if (!Array.isArray(jsonContent) || !jsonContent.length) {
        throw new Error(`less-json-import-list loader: not an valid array json "${jsonPath}"`);
      }

      const lessContent = [];

      const childType = typeof jsonContent[0];

      if (childType === 'number' || childType === 'string' || childType === 'boolean') {
        lessContent.push('@list: ');
        lessContent.push(jsonContent.join(','));
        lessContent.push(';\n');
      } else if (childType === 'object' && !Array.isArray(jsonContent[0])) {
        Object.keys(jsonContent[0]).forEach((key) => {
          lessContent.push(`@list-${key}: `);
          lessContent.push(jsonContent.map((item) => item[key]).join(','));
          lessContent.push(';\n');
        });
      } else {
        throw new Error(`less-json-import-list loader: bad format "${jsonPath}"`);
      }

      if (match[2]) {
        lessContent.push(match[2]);
      }

      newContent[i] = lessContent.join('');
    } else {
      newContent[i] = contents[i];
    }
  }

  return newContent.join('\n');
}

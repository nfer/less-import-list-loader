import test from 'ava';

import { join } from 'path';

import jsonImportLoader from '../index';

const fixturesPath = join(__dirname, 'fixtures');

const run = function run(resourcePath, prefix, content) {
  const queryString = ['?'];
  if (prefix) {
    queryString.push(`prefix=${prefix}`);
  }

  const context = {
    query: queryString.join(','),
    resourcePath,
  };

  return jsonImportLoader.call(context, content);
};

test('not array json file', (t) => {
  const resourcePath = join(fixturesPath, 'test.less');
  const content = '@json-import-list "bad.json";background:#fff;';
  const error = t.throws(() => {
    run(resourcePath, false, content);
  });
  t.is(error.message, `less-json-import-list loader: not an valid array json "${join(fixturesPath, 'bad.json')}"`);
});

test('empty array json file', (t) => {
  const resourcePath = join(fixturesPath, 'test.less');
  const content = '@json-import-list "empty_array.json";background:#fff;';
  const error = t.throws(() => {
    run(resourcePath, false, content);
  });
  t.is(error.message, `less-json-import-list loader: not an valid array json "${join(fixturesPath, 'empty_array.json')}"`);
});

test('bad child array json file', (t) => {
  const resourcePath = join(fixturesPath, 'test.less');
  const content = '@json-import-list "bad_child_array.json";background:#fff;';
  const error = t.throws(() => {
    run(resourcePath, false, content);
  });
  t.is(error.message, `less-json-import-list loader: bad format "${join(fixturesPath, 'bad_child_array.json')}"`);
});

test('string array json file', (t) => {
  const resourcePath = join(fixturesPath, 'test.less');
  const content = '@json-import-list "string_array.json";background:#fff;';
  const result = run(resourcePath, false, content);
  const expect = '@list: a1,b1,c1;\nbackground:#fff;';
  t.deepEqual(result, expect);
});

test('object array json file', (t) => {
  const resourcePath = join(fixturesPath, 'test.less');
  const content = '@json-import-list "object_array.json";background:#fff;';
  const result = run(resourcePath, false, content);
  const expect = '@list-a: a1,a2;\n@list-b: b1,b2;\n@list-c: c1,c2;\nbackground:#fff;';
  t.deepEqual(result, expect);
});

test('run with options prefix is customPrefix', (t) => {
  const resourcePath = join(fixturesPath, 'test.less');
  const content = '@customPrefix "string_array";background:#fff;';
  const result = run(resourcePath, 'customPrefix', content);
  const expect = '@list: a1,b1,c1;\nbackground:#fff;';
  t.deepEqual(result, expect);
});

test('miss extension', (t) => {
  const resourcePath = join(fixturesPath, 'test.less');
  const content = '@json-import-list "string_array";background:#fff;';
  const result = run(resourcePath, false, content);
  const expect = '@list: a1,b1,c1;\nbackground:#fff;';
  t.deepEqual(result, expect);
});

test('not existed json file', (t) => {
  const resourcePath = join(fixturesPath, 'test.less');
  const content = '@json-import-list "notExistedFile.json";background:#fff;';
  const error = t.throws(() => {
    run(resourcePath, false, content);
  });
  t.is(error.message, `less-json-import-list loader: can't load "${join(fixturesPath, 'notExistedFile.json')}"`);
});

test('without json-import-list', (t) => {
  const resourcePath = join(fixturesPath, 'test.less');
  const content = 'background:#fff;';
  const result = run(resourcePath, false, content);
  const expect = 'background:#fff;';
  t.deepEqual(result, expect);
});

test('without data', (t) => {
  const resourcePath = join(fixturesPath, 'test.less');
  const content = '@json-import-list "string_array.json";';
  const result = run(resourcePath, false, content);
  const expect = '@list: a1,b1,c1;\n';
  t.deepEqual(result, expect);
});

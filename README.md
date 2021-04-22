# less import list loader

load list from json to Less

## Install

```bash
npm install --save-dev less-import-list-loader
```

add it in vue2.x vue.config.js:

```js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('less-import-list-loader')
      .test(/\.less/)
      .use('less-import-list-loader')
      .loader('less-import-list-loader');
  },
};
```

## Usage1

load list from a string array.

before:

```less
@json-import-list './data.json';

each(@list, {
  .sel-@{value} {
    a: b;
  }
});
```

```json
["hello", "world"]
```

after

```less
@list: hello, world;

each(@list, {
  .sel-@{value} {
    a: b;
  }
});
```

## Usage2

load list from a object array.

before:

```less
@json-import-list './data.json';

each(@list-name, {
  .sel-@{value} {
    a: b;
  }
});
```

```json
[{
    "name": "hello1",
    "value": "world1"
}, {
    "name": "hello2",
    "value": "world2"
}]
```

after

```less
@list-name: hello1, hello2;
@list-value: world1, world2;

each(@list-name, {
  .sel-@{value} {
    a: b;
  }
});
```

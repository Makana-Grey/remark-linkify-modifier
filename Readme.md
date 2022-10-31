# remark-linkify-modifier

## Contents

- [What is this?](#what-is-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [Types](#types)
- [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin to transform text to a link by regular expression with modifying. If you need linkify some text in your markdown by regular expression and do matches text some changes it's you choice. This package based on code of [remark-linkify-regex][] but add modifying functionality.

## Install

[npm][]:

```sh
npm install remark-linkify-modifier
```

[yarn][]:

```sh
yarn add remark-linkify-modifier
```

## Use

```js
import { unified } from "unified";
import remarkLinkifyModifier from "remark-linkify-modifier";

const file = await unified().use(
  remarkLinkifyModifier({
    regex: /github\.com\/?[^\s]*/,
    modifier: {
      modifyLink: (link) => "https://" + link,
    },
  })
);

console.log(String(file));
```

## API

##### `options`

Configuration object or just a RegExp.

###### `options.regex`

RegExp for matches

> 👉 **Note**: you should define regex anyway.

###### `options.modifier`

Object for modify matches text (optional).

###### `options.modifier.modifyText` / `options.modifier.modifyLink`

Functions that modify matches text for link or text as you define

## Types

This package is have declaration file for [typescript].

<!-- Definitions -->

[npm]: https://docs.npmjs.com/cli/install
[yarn]: https://yarnpkg.com/
[typescript]: https://www.typescriptlang.org
[unified]: https://github.com/unifiedjs/unified
[remark]: https://github.com/remarkjs/remark
[remark-linkify-regex]: https://gitlab.com/staltz/remark-linkify-regex

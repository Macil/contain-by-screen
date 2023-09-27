## 2.0.0 (2022-08-29)

### Breaking Changes

- The `containByScreen` function is now a named export of the module rather than the default export. Code importing the function must be updated from `import containByScreen from "contain-by-screen";` to `import { containByScreen } from "contain-by-screen";`, or from `const containByScreen = require("contain-by-screen");` to `const { containByScreen } = require("contain-by-screen");`.

### Other Changes

- Added `getContainByScreenResults` function that works like the default `containByScreen` function but returns its suggested modification instead of doing it.

## 1.3.0 (2018-09-24)

- Added TypeScript type definitions.

## 1.2.1 (2018-06-11)

- Fixed mistake in [Flow](https://flow.org/) type definitions.

## 1.2.0 (2017-08-08)

- Support arrays for vAlign and hAlign options.

## 1.1.1 (2017-07-28)

- Updated envify dependency version.

## 1.1.0 (2016-09-13)

- Added cover position value.

## 1.0.4 (2016-03-10)

- Depend on specific submodules of Lodash to save space in browser bundles.
- Use envify with Browserify so usage check can be disabled in production.

## 1.0.2 (2016-01-19)

- Fixed bugs with buffers option.

## 1.0.0 (2016-01-19)

Initial stable release.

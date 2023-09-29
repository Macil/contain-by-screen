# contain-by-screen

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Macil/contain-by-screen/blob/master/LICENSE.txt)
[![npm version](https://img.shields.io/npm/v/contain-by-screen.svg?style=flat)](https://www.npmjs.com/package/contain-by-screen)

This function is for positioning an element next to another in a way that fits
on the screen. This can be used to position a dropdown menu next to a button.
You can pass an argument to make containByScreen prefer to put the dropdown menu
below the button, and if there isn't enough room below the button, then the menu
will be positioned next to or above the button automatically instead.

This module can be used in Browsers via a bundler such as Webpack or Browserify.

## API

### containByScreen(target, anchor, options): Choice

```js
import { containByScreen } from "contain-by-screen";
```

Moves the `target` element to be positioned next to the `anchor` element based
on the given `options`. Returns a "Choice" object that may be used as the
`options` parameter to other calls to containByScreen to position another
element consistently with a previous call.

`target` is the element to position, such as a dropdown menu. The element must
have its CSS position property set to "fixed".

`anchor` is the element to position the target relative to. This would usually
be the button that triggered a dropdown menu to appear.

`options` is an object that may have the following optional properties:

- `position` sets the prioritized position for the target relative to its
  anchor. It may be set to null, "top", "bottom", "left", "right", "cover", or
  an array of some of those string values. The element will attempt to use this
  position (or each value in the array in order) unless it is not possible to do
  so while fitting the element on-screen.

- `forcePosition` is a boolean which controls whether the configured position
  value will be used even if it results in the element going off of the screen.

- `hAlign` sets the prioritized horizontal alignment mode for the element
  relative to its anchor. The horizontal alignment mode is used if the element
  is positioned in the top, bottom, or cover positions relative to the anchor,
  and causes the element to be moved horizontally in order to make a specific
  edge align. It may be set to null, "center", "left", "right", "unaligned", or
  an array of some of those string values. The element will attempt to use this
  alignment (or each value in the array in order) unless it is not possible to
  do so while fitting the element on-screen.

- `forceHAlign` is a boolean which controls whether the configured hAlign value
  will be used even if it results in the element going off of the screen.

- `vAlign` sets the prioritized vertical alignment mode for the element relative
  to its anchor. The vertical alignment mode is used if the element is
  positioned in the left, right, or cover positions relative to the anchor, and
  causes the element to be moved vertically in order to make a specific edge
  align. It may be set to null, "center", "top", "bottom", "unaligned", or an
  array of some of those string values. The element will attempt to use this
  alignment (or each value in the array in order) unless it is not possible to
  do so while fitting the element on-screen.

- `forceVAlign` is a boolean which controls whether the configured vAlign value
  will be used even if it results in the element going off of the screen.

- `buffer` specifies a number of pixels to be used as a buffer zone around the
  target. For screen-fitting purposes, the target will be treated as if it was
  this much larger in all directions, requiring it to be placed with the given
  amount of space away from the anchor element (when position is not "cover")
  and the edges of the screen. The buffer option is useful if the element has
  children which are positioned such that they escape the boundaries of the
  element. Buffers do not affect alignment with the anchor element.

- `topBuffer`, `bottomBuffer`, `leftBuffer`, and `rightBuffer` specify an
  additional buffer space for a specific edge.

### getContainByScreenResults(target, anchor, options): ChoiceAndCoordinates

```js
import { getContainByScreenResults } from "contain-by-screen";
```

Works like `containByScreen`, but instead of positioning the element and
returning a Choice object, this function does not mutate the element at all, and
instead returns a `{choice, coordinates}` object where the `coordinates`
property is an object with `left` and `right` properties specifying where to
position the target element.

## Related

The project [react-float-anchor](https://github.com/StreakYC/react-float-anchor)
is a React wrapper around this function, and
[react-menu-list](https://github.com/StreakYC/react-menu-list) is a library that
uses it for building interactive menus.

## Types

[TypeScript](https://www.typescriptlang.org/) type definitions for this module
are included! The type definitions won't require any configuration to use.

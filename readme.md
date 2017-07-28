# contain-by-screen

[![Circle CI](https://circleci.com/gh/AgentME/contain-by-screen.svg?style=shield)](https://circleci.com/gh/AgentME/contain-by-screen)
[![npm version](https://badge.fury.io/js/contain-by-screen.svg)](https://badge.fury.io/js/contain-by-screen)

This function is for positioning an element next to another in a way that fits
on the screen. This can be used to position a dropdown menu next to a button.
You can pass an argument to make containByScreen prefer to put the dropdown
menu below the button, and if there isn't enough room below the button, then
the menu will be positioned next to or above the button automatically instead.

This module can be used in Browsers via a CommonJS bundler such as Browserify.

## containByScreen(target, anchor, options)

`target` is the element to position, such as a dropdown menu. The element
must have its CSS position property set to "fixed".

`anchor` is the element to position the target relative to. This would usually
be the button that triggered a dropdown menu to appear.

`options` is an object that may have the following optional properties:

`position` sets the prioritized position for the target relative to its anchor.
It may be set to null, "top", "bottom", "left", "right", or "cover". The
element will use this position unless it is not possible to do so while fitting
the element on-screen.

`forcePosition` is a boolean which controls whether the configured position
value will be used even if it results in the element going off of the screen.

`hAlign` sets the prioritized horizontal alignment mode for the element
relative to its anchor. The horizontal alignment mode is used if the element is
positioned in the top, bottom, or cover positions relative to the anchor, and
causes the element to be moved horizontally in order to make a specific edge
align. It may be set to null, "center", "left", or "right". The element will
use this alignment unless it is not possible to do so while fitting the element
on-screen.

`forceHAlign` is a boolean which controls whether the configured hAlign value
will be used even if it results in the element going off of the screen.

`vAlign` sets the prioritized vertical alignment mode for the element relative
to its anchor. The vertical alignment mode is used if the element is positioned
in the left, right, or cover positions relative to the anchor, and causes the
element to be moved vertically in order to make a specific edge align. It may
be set to null, "center", "top", or "bottom". The element will use this
alignment unless it is not possible to do so while fitting the element
on-screen.

`forceVAlign` is a boolean which controls whether the configured vAlign value
will be used even if it results in the element going off of the screen.

`buffer` specifies a number of pixels to be used as a buffer zone around the
target. For screen-fitting purposes, the target will be treated as if it was
this much larger in all directions, requiring it to be placed with the given
amount of space between it, the anchor element when position is not "cover",
and the edges of the screen. The buffer option is useful if the element has
children which are positioned such that they escape the boundaries of the
element. Buffers do not affect alignment with the anchor element.

`topBuffer` specifies an additional buffer space only for the top edge.

`bottomBuffer` specifies an additional buffer space only for the bottom edge.

`leftBuffer` specifies an additional buffer space only for the left edge.

`rightBuffer` specifies an additional buffer space only for the right edge.

## Related

The project [react-float-anchor](https://github.com/StreakYC/react-float-anchor)
is a React wrapper around this function, and
[react-menu-list](https://github.com/StreakYC/react-menu-list) is a library for
building interactive menus that uses it.

## Types

Full [Flow](https://flowtype.org/) type declarations for this module are
included!

/* @flow */

import _ from 'lodash';

export type Position = 'top'|'bottom'|'left'|'right';
export type HAlign = 'center'|'left'|'right';
export type VAlign = 'center'|'top'|'bottom';

export type Options = {
  position?: ?Position;
  forcePosition?: ?boolean;
  hAlign?: ?HAlign;
  forceHAlign?: ?boolean;
  vAlign?: ?VAlign;
  forceVAlign?: ?boolean;
  buffer?: ?number;
  topBuffer?: ?number;
  bottomBuffer?: ?number;
  leftBuffer?: ?number;
  rightBuffer?: ?number;
};

type Rect = { // Similar to ClientRect, but not a class
  top: number;
  bottom: number;
  height: number;
  left: number;
  right: number;
  width: number;
};

export default function containByScreen(element: HTMLElement, anchorPoint: HTMLElement, options: Options):
{position: Position, hAlign: HAlign, vAlign: VAlign} {
  if (process.env.NODE_ENV !== 'production' && window.getComputedStyle) {
    const style = window.getComputedStyle(element);
    if (style.position !== 'fixed') {
      console.error('containByScreen only works on fixed position elements', element);
    }
  }

  const elRect: Rect = getBoundingClientRect(element);
  const anchorRect: Rect = getBoundingClientRect(anchorPoint);

  const buffers = {
    all: options.buffer || 0,
    top: options.topBuffer || 0,
    bottom: options.bottomBuffer || 0,
    left: options.leftBuffer || 0,
    right: options.rightBuffer || 0
  };

  const positions: Position[] = options.position && options.forcePosition ?
    [options.position] :
    _.uniq([options.position].concat(['top','bottom','left','right']).filter(Boolean));
  const hAligns: HAlign[] = options.hAlign && options.forceHAlign ?
    [options.hAlign] :
    _.uniq([options.hAlign].concat(['center','left','right']).filter(Boolean));
  const vAligns: VAlign[] = options.vAlign && options.forceVAlign ?
    [options.vAlign] :
    _.uniq([options.vAlign].concat(['center','top','bottom']).filter(Boolean));

  let choiceAndCoord = _.chain(positions)
    .map(position =>
      position === 'top' || position === 'bottom' ?
        hAligns.map(hAlign => ({position, hAlign})) :
        [{position, hAlign: 'center'}]
    )
    .flatten()
    .map(({position, hAlign}) =>
      position === 'top' || position === 'bottom' ?
        [{position, hAlign, vAlign: 'center'}] :
        vAligns.map(vAlign => ({position, hAlign, vAlign}))
    )
    .flatten()
    // We've got an array of all sensible {position, hAlign, vAlign} combinations
    .map(({position, hAlign, vAlign}) => ({
      choice: {position, hAlign, vAlign},
      coord: positionAndAlign(elRect, anchorRect, position, hAlign, vAlign, buffers)
    }))
    .filter(({choice, coord: {top, left}}) =>
      top-buffers.all-buffers.top >= 0 &&
      left-buffers.all-buffers.left >= 0 &&
      top+elRect.height+buffers.all+buffers.bottom <= window.innerHeight &&
      left+elRect.width+buffers.all+buffers.right <= window.innerWidth
    )
    .first()
    .value();

  // Fallback if we failed to find a position that fit on the screen.
  if (!choiceAndCoord) {
    const choice = {
      position: options.position||'top',
      hAlign: options.hAlign||'center',
      vAlign: options.vAlign||'center'
    };
    choiceAndCoord = {
      choice,
      coord: positionAndAlign(elRect, anchorRect,
        choice.position, choice.hAlign, choice.vAlign, buffers)
    };
  }

  element.style.top = `${choiceAndCoord.coord.top}px`;
  element.style.left = `${choiceAndCoord.coord.left}px`;

  return choiceAndCoord.choice;
}

function getBoundingClientRect(el: Element): Rect {
  let rect = el.getBoundingClientRect();
  if (!('width' in rect)) {
    // IE <9 support
    rect = Object.assign(({
      width: rect.right-rect.left,
      height: rect.bottom-rect.top
    }: Object), rect);
  }
  return rect;
}

function positionAndAlign(elRect: Rect, anchorRect: Rect, position: Position, hAlign: HAlign, vAlign: VAlign, buffers): {top: number, left: number} {
  let top=0, left=0;
  if (position === 'top' || position === 'bottom') {
    switch (position) {
      case 'top':
        top = Math.floor(anchorRect.top - elRect.height - buffers.all - buffers.bottom);
        break;
      case 'bottom':
        top = Math.ceil(anchorRect.bottom + buffers.all + buffers.top);
        break;
      default: throw new Error("Should not happen");
    }
    switch (hAlign) {
      case 'center':
        left = Math.round((anchorRect.left + anchorRect.right - elRect.width)/2);
        break;
      case 'left':
        left = Math.round(anchorRect.left);
        break;
      case 'right':
        left = Math.round(anchorRect.right - elRect.width);
        break;
      default: throw new Error("Should not happen");
    }
  } else {
    switch (position) {
      case 'left':
        left = Math.floor(anchorRect.left - elRect.width - buffers.all - buffers.right);
        break;
      case 'right':
        left = Math.ceil(anchorRect.right + buffers.all + buffers.left);
        break;
      default: throw new Error("Should not happen");
    }
    switch (vAlign) {
      case 'center':
        top = Math.round((anchorRect.top + anchorRect.bottom - elRect.height)/2);
        break;
      case 'top':
        top = Math.round(anchorRect.top);
        break;
      case 'bottom':
        top = Math.round(anchorRect.bottom - elRect.height);
        break;
      default: throw new Error("Should not happen");
    }
  }
  return {top, left};
}

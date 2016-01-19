/* @flow */

import _ from 'lodash';
import type {Position, HAlign, VAlign, Options} from './index.js.flow';

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
  let anchorRect: Rect = getBoundingClientRect(anchorPoint);

  const buffer = options.buffer || 0;
  const topBuffer = options.topBuffer || 0;
  const bottomBuffer = options.bottomBuffer || 0;
  const leftBuffer = options.leftBuffer || 0;
  const rightBuffer = options.rightBuffer || 0;

  anchorRect = {
    top: anchorRect.top-buffer-topBuffer,
    bottom: anchorRect.bottom+buffer+bottomBuffer,
    height: anchorRect.height+2*buffer+topBuffer+bottomBuffer,
    left: anchorRect.left-buffer-leftBuffer,
    right: anchorRect.right+buffer+rightBuffer,
    width: anchorRect.width+2*buffer+leftBuffer+rightBuffer
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
      coord: positionAndAlign(elRect, anchorRect, position, hAlign, vAlign)
    }))
    .filter(({choice, coord: {top, left}}) =>
      top >= 0 && left >= 0 &&
      top+elRect.height <= window.innerHeight &&
      left+elRect.width <= window.innerWidth
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
      coord: positionAndAlign(elRect, anchorRect, choice.position, choice.hAlign, choice.vAlign)
    };
  }

  element.style.top = `${choiceAndCoord.coord.top + buffer + topBuffer}px`;
  element.style.left = `${choiceAndCoord.coord.left + buffer + leftBuffer}px`;

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

function positionAndAlign(elRect: Rect, anchorRect: Rect, position: Position, hAlign: HAlign, vAlign: VAlign): {top: number, left: number} {
  let top=0, left=0;
  if (position === 'top' || position === 'bottom') {
    switch (position) {
      case 'top':
        top = Math.floor(anchorRect.top - elRect.height);
        break;
      case 'bottom':
        top = Math.ceil(anchorRect.bottom);
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
        left = Math.floor(anchorRect.left - elRect.width);
        break;
      case 'right':
        left = Math.ceil(anchorRect.right);
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

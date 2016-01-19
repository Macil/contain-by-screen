/* @flow */

import assert from 'assert';
import containByScreen from '../src';

global.window = null;

class MockElement {
  _rect: {top: number, bottom: number, left: number, right: number};
  style: Object;

  constructor(rect: {top: number, bottom: number, left: number, right: number}) {
    this._rect = rect;
    this.style = {};
  }

  getBoundingClientRect() {
    // Missing height and width to simulate IE8
    return this._rect;
  }
}

describe("containByScreen", function() {
  before(function() {
    global.window = {innerWidth: 800, innerHeight: 600};
  });

  after(function() {
    delete global.window;
  });

  it("works", function() {
    const button = new MockElement({top: 10, bottom: 20, left: 30, right: 50});
    const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});

    containByScreen((dropdown: any), (button: any), {position: 'left', hAlign: 'center', vAlign: 'center'});

    // button is unmoved
    assert.deepEqual(button.style, {});

    // dropdown is moved
    assert.deepEqual(dropdown.style, {top: '20px', left: '30px'});
  });

  it("right works", function() {
    const button = new MockElement({top: 10, bottom: 20, left: 30, right: 50});
    const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});

    containByScreen((dropdown: any), (button: any), {position: 'right'});

    assert.deepEqual(dropdown.style, {top: '10px', left: '50px'});
  });
});

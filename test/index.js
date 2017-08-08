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

describe('containByScreen', function() {
  before(function() {
    global.window = {innerWidth: 800, innerHeight: 600};
  });

  after(function() {
    delete global.window;
  });

  it('fallback', function() {
    const button = new MockElement({top: 10, bottom: 20, left: 30, right: 50});
    const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});

    containByScreen((dropdown: any), (button: any), {position: 'left', hAlign: 'center', vAlign: 'center'});

    // button is unmoved
    assert.deepEqual(button.style, {});

    // dropdown is moved
    assert.deepEqual(dropdown.style, {top: '20px', left: '30px'});
  });

  describe('buffers', function() {

    describe('distance from anchor', function() {

      it('right, vAlign=top with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: 'right', vAlign: 'top',
          buffer: 1, leftBuffer: 2,
          topBuffer: 4, bottomBuffer: 8, rightBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '300px', left: '353px'});
      });

      it('left, vAlign=top with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: 'left', vAlign: 'top',
          buffer: 1, rightBuffer: 2,
          topBuffer: 4, bottomBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '300px', left: '197px'});
      });

      it('left, vAlign=bottom with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: 'left', vAlign: 'bottom',
          buffer: 1, rightBuffer: 2,
          topBuffer: 4, bottomBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '120px', left: '197px'});
      });

      it('left, vAlign=center with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: 'left', vAlign: 'center',
          buffer: 1, rightBuffer: 2,
          topBuffer: 4, bottomBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '210px', left: '197px'});
      });

      it('top, hAlign=left with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: 'top', hAlign: 'left',
          buffer: 1, bottomBuffer: 2,
          topBuffer: 4, rightBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '97px', left: '300px'});
      });

      it('bottom, hAlign=left with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: 'bottom', hAlign: 'left',
          buffer: 1, topBuffer: 2,
          bottomBuffer: 4, rightBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '323px', left: '300px'});
      });

      it('bottom, hAlign=right with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: 'bottom', hAlign: 'right',
          buffer: 1, topBuffer: 2,
          bottomBuffer: 4, rightBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '323px', left: '250px'});
      });

      it('bottom, hAlign=center with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: 'bottom', hAlign: 'center',
          buffer: 1, topBuffer: 2,
          bottomBuffer: 4, rightBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '323px', left: '275px'});
      });

    });

    describe('distance from screen edge', function() {

      it('top', function() {
        const button = new MockElement({top: 200, bottom: 400, left: 300, right: 400});
        const dropdown = new MockElement({top: 0, bottom: 190, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: 'top', hAlign: 'left', topBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '205px', left: '200px'});
      });

      it('bottom', function() {
        const button = new MockElement({top: 200, bottom: 400, left: 300, right: 400});
        const dropdown = new MockElement({top: 0, bottom: 190, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: 'bottom', hAlign: 'left', bottomBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '205px', left: '200px'});
      });

      it('left', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 500});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 290});
        containByScreen((dropdown: any), (button: any), {
          position: 'left', vAlign: 'top', leftBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '100px', left: '255px'});
      });

      it('right', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 500});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 290});
        containByScreen((dropdown: any), (button: any), {
          position: 'right', vAlign: 'top', rightBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '100px', left: '255px'});
      });

    });

    describe('can handle arrays', function() {
      it('position', function() {
        const button = new MockElement({top: 200, bottom: 400, left: 300, right: 400});
        const dropdown = new MockElement({top: 0, bottom: 190, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: ['top', 'bottom'], hAlign: 'left', topBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '205px', left: '200px'});
      });

      it('vAlgin', function(){
        const button = new MockElement({top: 200, bottom: 400, left: 300, right: 400});
        const dropdown = new MockElement({top: 0, bottom: 190, left: 0, right: 100});
        containByScreen((dropdown: any), (button: any), {
          position: ['top'], hAlign: ['left'], topBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '205px', left: '200px'});
      });

      it('hAlign', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 500});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 290});
        containByScreen((dropdown: any), (button: any), {
          position: 'right', vAlign: ['top'], rightBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '100px', left: '255px'});
      });

    });

  });
});

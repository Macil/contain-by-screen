import assert from 'assert';
import { containByScreen } from '../src';

(globalThis as any).window = null;

class MockElement {
  _rect: {top: number, bottom: number, left: number, right: number};
  style: unknown;

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
    (globalThis as any).window = {innerWidth: 800, innerHeight: 600};
  });

  after(function() {
    delete (globalThis as any).window;
  });

  it('fallback', function() {
    const button = new MockElement({top: 10, bottom: 20, left: 30, right: 50});
    const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});

    containByScreen(dropdown as any, button as any, {position: 'left', hAlign: 'center', vAlign: 'center'});

    // button is unmoved
    assert.deepEqual(button.style, {});

    // dropdown is moved
    assert.deepEqual(dropdown.style, {top: '20px', left: '30px'});
  });

  describe('buffers', function() {

    describe('target is placed buffer distance away', function() {

      it('right, vAlign=top with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: 'right', vAlign: 'top',
          buffer: 1, leftBuffer: 2,
          topBuffer: 4, bottomBuffer: 8, rightBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '300px', left: '353px'});
      });

      it('left, vAlign=top with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: 'left', vAlign: 'top',
          buffer: 1, rightBuffer: 2,
          topBuffer: 4, bottomBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '300px', left: '197px'});
      });

      it('left, vAlign=bottom with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: 'left', vAlign: 'bottom',
          buffer: 1, rightBuffer: 2,
          topBuffer: 4, bottomBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '120px', left: '197px'});
      });

      it('left, vAlign=center with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: 'left', vAlign: 'center',
          buffer: 1, rightBuffer: 2,
          topBuffer: 4, bottomBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '210px', left: '197px'});
      });

      it('top, hAlign=left with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: 'top', hAlign: 'left',
          buffer: 1, bottomBuffer: 2,
          topBuffer: 4, rightBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '97px', left: '300px'});
      });

      it('bottom, hAlign=left with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: 'bottom', hAlign: 'left',
          buffer: 1, topBuffer: 2,
          bottomBuffer: 4, rightBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '323px', left: '300px'});
      });

      it('bottom, hAlign=right with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: 'bottom', hAlign: 'right',
          buffer: 1, topBuffer: 2,
          bottomBuffer: 4, rightBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '323px', left: '250px'});
      });

      it('bottom, hAlign=center with buffers', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: 'bottom', hAlign: 'center',
          buffer: 1, topBuffer: 2,
          bottomBuffer: 4, rightBuffer: 8, leftBuffer: 16 // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, {top: '323px', left: '275px'});
      });

      describe('only used to guarantee space from screen edge in position:cover', function() {
        it('vAlign=top hAlign=left with buffers', function() {
          const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
          const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
          containByScreen(dropdown as any, button as any, {
            position: 'cover', vAlign: 'top', hAlign: 'left',
            buffer: 1, leftBuffer: 2, topBuffer: 4,
            bottomBuffer: 8, rightBuffer: 16
          });
          assert.deepEqual(dropdown.style, {top: '300px', left: '300px'});
        });

        it('vAlign=bottom hAlign=right with buffers', function() {
          const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
          const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
          containByScreen(dropdown as any, button as any, {
            position: 'cover', vAlign: 'bottom', hAlign: 'right',
            buffer: 1, leftBuffer: 2, topBuffer: 4,
            bottomBuffer: 8, rightBuffer: 16
          });
          assert.deepEqual(dropdown.style, {top: '120px', left: '250px'});
        });

        it('vAlign=center hAlign=center with buffers', function() {
          const button = new MockElement({top: 300, bottom: 320, left: 300, right: 350});
          const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 100});
          containByScreen(dropdown as any, button as any, {
            position: 'cover', vAlign: 'center', hAlign: 'center',
            buffer: 1, leftBuffer: 2, topBuffer: 4,
            bottomBuffer: 8, rightBuffer: 16
          });
          assert.deepEqual(dropdown.style, {top: '210px', left: '275px'});
        });
      });
    });

    describe('forces reposition if necessary', function() {

      it('top', function() {
        const button = new MockElement({top: 200, bottom: 400, left: 300, right: 400});
        const dropdown = new MockElement({top: 0, bottom: 190, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: 'top', hAlign: 'left', topBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '205px', left: '200px'});
      });

      it('bottom', function() {
        const button = new MockElement({top: 200, bottom: 400, left: 300, right: 400});
        const dropdown = new MockElement({top: 0, bottom: 190, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: 'bottom', hAlign: 'left', bottomBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '205px', left: '200px'});
      });

      it('left', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 500});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 290});
        containByScreen(dropdown as any, button as any, {
          position: 'left', vAlign: 'top', leftBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '100px', left: '255px'});
      });

      it('right', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 500});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 290});
        containByScreen(dropdown as any, button as any, {
          position: 'right', vAlign: 'top', rightBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '100px', left: '255px'});
      });

    });

    describe('can handle arrays', function() {
      it('position', function() {
        const button = new MockElement({top: 200, bottom: 400, left: 300, right: 400});
        const dropdown = new MockElement({top: 0, bottom: 190, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: ['top', 'bottom'], hAlign: 'left', topBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '205px', left: '200px'});
      });

      it('vAlign', function() {
        const button = new MockElement({top: 200, bottom: 400, left: 300, right: 400});
        const dropdown = new MockElement({top: 0, bottom: 190, left: 0, right: 100});
        containByScreen(dropdown as any, button as any, {
          position: ['top'], hAlign: ['left'], topBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '205px', left: '200px'});
      });

      it('hAlign', function() {
        const button = new MockElement({top: 300, bottom: 320, left: 300, right: 500});
        const dropdown = new MockElement({top: 0, bottom: 200, left: 0, right: 290});
        containByScreen(dropdown as any, button as any, {
          position: 'right', vAlign: ['top'], rightBuffer: 11
        });
        assert.deepEqual(dropdown.style, {top: '100px', left: '255px'});
      });
    });

    describe('cover', function() {
      it('cover, vAlign=top hAlign=left', function() {
        const button = new MockElement({top: 100, bottom: 130, left: 100, right: 200});
        const dropdown = new MockElement({top: 0, bottom: 100, left: 0, right: 100});

        containByScreen(dropdown as any, button as any, {
          position: 'cover',
          hAlign: 'left',
          vAlign: 'top'
        });
        assert.deepEqual(dropdown.style, {top: '100px', left: '100px'});
      });

      it('cover, vAlign=top hAlign=right', function() {
        const button = new MockElement({top: 100, bottom: 130, left: 200, right: 300});
        const dropdown = new MockElement({top: 0, bottom: 100, left: 0, right: 130});

        containByScreen(dropdown as any, button as any, {
          position: 'cover',
          hAlign: 'right',
          vAlign: 'top'
        });
        assert.deepEqual(dropdown.style, {top: '100px', left: '170px'});
      });

      it('cover, vAlign=bottom hAlign=left', function() {
        const button = new MockElement({top: 400, bottom: 430, left: 100, right: 200});
        const dropdown = new MockElement({top: 0, bottom: 100, left: 0, right: 100});

        containByScreen(dropdown as any, button as any, {
          position: 'cover',
          hAlign: 'left',
          vAlign: 'bottom'
        });
        assert.deepEqual(dropdown.style, {top: '330px', left: '100px'});
      });

      it('cover, vAlign=bottom hAlign=right', function() {
        const button = new MockElement({top: 400, bottom: 430, left: 100, right: 200});
        const dropdown = new MockElement({top: 0, bottom: 100, left: 0, right: 130});

        containByScreen(dropdown as any, button as any, {
          position: 'cover',
          hAlign: 'right',
          vAlign: 'bottom'
        });
        assert.deepEqual(dropdown.style, {top: '330px', left: '70px'});
      });

      it('cover, vAlign=center hAlign=right', function() {
        const button = new MockElement({top: 400, bottom: 430, left: 100, right: 200});
        const dropdown = new MockElement({top: 0, bottom: 100, left: 0, right: 130});

        containByScreen(dropdown as any, button as any, {
          position: 'cover',
          hAlign: 'right',
          vAlign: 'center'
        });
        assert.deepEqual(dropdown.style, {top: '365px', left: '70px'});
      });

      it('cover, vAlign=center hAlign=center', function() {
        const button = new MockElement({top: 400, bottom: 430, left: 100, right: 200});
        const dropdown = new MockElement({top: 0, bottom: 100, left: 0, right: 130});

        containByScreen(dropdown as any, button as any, {
          position: 'cover',
          hAlign: 'center',
          vAlign: 'center'
        });
        assert.deepEqual(dropdown.style, {top: '365px', left: '85px'});
      });
    });
  });
});

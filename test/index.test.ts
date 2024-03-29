import assert from "assert";
import { containByScreen } from "../src";

(globalThis as any).window = null;

class MockElement {
  #rect: { top: number; bottom: number; left: number; right: number };
  style: unknown;

  constructor(rect: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }) {
    this.#rect = rect;
    this.style = {};
  }

  getBoundingClientRect() {
    // Missing height and width to simulate IE8
    return this.#rect;
  }
}

describe("containByScreen", () => {
  before(() => {
    (globalThis as any).window = { innerWidth: 800, innerHeight: 600 };
  });

  after(() => {
    delete (globalThis as any).window;
  });

  it("reposition to bottom", () => {
    const button = new MockElement({
      top: 10,
      bottom: 20,
      left: 30,
      right: 50,
    });
    const dropdown = new MockElement({
      top: 0,
      bottom: 200,
      left: 0,
      right: 100,
    });

    const choice = containByScreen(dropdown as any, button as any, {
      position: "left",
      hAlign: "center",
      vAlign: "center",
    });
    assert.deepEqual(choice, {
      position: "bottom",
      hAlign: "left",
      vAlign: "center",
    });

    // button is unmoved
    assert.deepEqual(button.style, {});

    // dropdown is moved
    assert.deepEqual(dropdown.style, { top: "20px", left: "30px" });
  });

  describe("fallback to unaligned", () => {
    it("fallback to vAlign:unaligned clipped at top", () => {
      const button = new MockElement({
        top: 200,
        bottom: 220,
        left: 30,
        right: 50,
      });
      const dropdown = new MockElement({
        top: 0,
        bottom: 550,
        left: 0,
        right: 100,
      });

      const choice = containByScreen(dropdown as any, button as any, {
        position: "left",
        hAlign: "center",
        vAlign: "center",
        buffer: 1,
        topBuffer: 2,
        bottomBuffer: 3,
        leftBuffer: 4,
        rightBuffer: 5,
      });
      assert.deepEqual(choice, {
        position: "right",
        hAlign: "center",
        vAlign: "unaligned",
      });

      // dropdown is moved
      assert.deepEqual(dropdown.style, { top: "3px", left: "55px" });
    });

    it("fallback to vAlign:unaligned clipped at bottom", () => {
      const button = new MockElement({
        top: 400,
        bottom: 420,
        left: 30,
        right: 50,
      });
      const dropdown = new MockElement({
        top: 0,
        bottom: 550,
        left: 0,
        right: 100,
      });

      const choice = containByScreen(dropdown as any, button as any, {
        position: "left",
        hAlign: "center",
        vAlign: "center",
        buffer: 1,
        topBuffer: 2,
        bottomBuffer: 3,
        leftBuffer: 4,
        rightBuffer: 5,
      });
      assert.deepEqual(choice, {
        position: "right",
        hAlign: "center",
        vAlign: "unaligned",
      });

      // dropdown is moved
      assert.deepEqual(dropdown.style, { top: "46px", left: "55px" });
    });

    it("fallback to hAlign:unaligned clipped at left", () => {
      const button = new MockElement({
        top: 200,
        bottom: 220,
        left: 230,
        right: 250,
      });
      const dropdown = new MockElement({
        top: 0,
        bottom: 50,
        left: 0,
        right: 760,
      });

      const choice = containByScreen(dropdown as any, button as any, {
        position: "left",
        hAlign: "center",
        vAlign: "center",
        buffer: 1,
        topBuffer: 2,
        bottomBuffer: 3,
        leftBuffer: 4,
        rightBuffer: 5,
      });
      assert.deepEqual(choice, {
        position: "top",
        hAlign: "unaligned",
        vAlign: "center",
      });

      // dropdown is moved
      assert.deepEqual(dropdown.style, { top: "146px", left: "5px" });
    });

    it("fallback to hAlign:unaligned clipped at right", () => {
      const button = new MockElement({
        top: 200,
        bottom: 220,
        left: 630,
        right: 650,
      });
      const dropdown = new MockElement({
        top: 0,
        bottom: 50,
        left: 0,
        right: 760,
      });

      const choice = containByScreen(dropdown as any, button as any, {
        position: "left",
        hAlign: "center",
        vAlign: "center",
        buffer: 1,
        topBuffer: 2,
        bottomBuffer: 3,
        leftBuffer: 4,
        rightBuffer: 5,
      });
      assert.deepEqual(choice, {
        position: "top",
        hAlign: "unaligned",
        vAlign: "center",
      });

      // dropdown is moved
      assert.deepEqual(dropdown.style, { top: "146px", left: "34px" });
    });

    it("fallback after all positioning attempts fail", () => {
      const button = new MockElement({
        top: 200,
        bottom: 220,
        left: 630,
        right: 650,
      });
      const dropdown = new MockElement({
        top: 0,
        bottom: 560,
        left: 0,
        right: 760,
      });

      const choice = containByScreen(dropdown as any, button as any, {
        position: "left",
        hAlign: "center",
        vAlign: "center",
        buffer: 1,
        topBuffer: 2,
        bottomBuffer: 3,
        leftBuffer: 4,
        rightBuffer: 5,
      });
      assert.deepEqual(choice, {
        position: "cover",
        hAlign: "unaligned",
        vAlign: "unaligned",
      });

      // dropdown is moved
      assert.deepEqual(dropdown.style, { top: "3px", left: "34px" });
    });
  });

  describe("buffers", () => {
    describe("target is placed buffer distance away", () => {
      it("right, vAlign=top with buffers", () => {
        const button = new MockElement({
          top: 300,
          bottom: 320,
          left: 300,
          right: 350,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 200,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: "right",
          vAlign: "top",
          buffer: 1,
          leftBuffer: 2,
          topBuffer: 4,
          bottomBuffer: 8,
          rightBuffer: 16, // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, { top: "300px", left: "353px" });
      });

      it("left, vAlign=top with buffers", () => {
        const button = new MockElement({
          top: 300,
          bottom: 320,
          left: 300,
          right: 350,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 200,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: "left",
          vAlign: "top",
          buffer: 1,
          rightBuffer: 2,
          topBuffer: 4,
          bottomBuffer: 8,
          leftBuffer: 16, // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, { top: "300px", left: "197px" });
      });

      it("left, vAlign=bottom with buffers", () => {
        const button = new MockElement({
          top: 300,
          bottom: 320,
          left: 300,
          right: 350,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 200,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: "left",
          vAlign: "bottom",
          buffer: 1,
          rightBuffer: 2,
          topBuffer: 4,
          bottomBuffer: 8,
          leftBuffer: 16, // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, { top: "120px", left: "197px" });
      });

      it("left, vAlign=center with buffers", () => {
        const button = new MockElement({
          top: 300,
          bottom: 320,
          left: 300,
          right: 350,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 200,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: "left",
          vAlign: "center",
          buffer: 1,
          rightBuffer: 2,
          topBuffer: 4,
          bottomBuffer: 8,
          leftBuffer: 16, // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, { top: "210px", left: "197px" });
      });

      it("top, hAlign=left with buffers", () => {
        const button = new MockElement({
          top: 300,
          bottom: 320,
          left: 300,
          right: 350,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 200,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: "top",
          hAlign: "left",
          buffer: 1,
          bottomBuffer: 2,
          topBuffer: 4,
          rightBuffer: 8,
          leftBuffer: 16, // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, { top: "97px", left: "300px" });
      });

      it("bottom, hAlign=left with buffers", () => {
        const button = new MockElement({
          top: 300,
          bottom: 320,
          left: 300,
          right: 350,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 200,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: "bottom",
          hAlign: "left",
          buffer: 1,
          topBuffer: 2,
          bottomBuffer: 4,
          rightBuffer: 8,
          leftBuffer: 16, // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, { top: "323px", left: "300px" });
      });

      it("bottom, hAlign=right with buffers", () => {
        const button = new MockElement({
          top: 300,
          bottom: 320,
          left: 300,
          right: 350,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 200,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: "bottom",
          hAlign: "right",
          buffer: 1,
          topBuffer: 2,
          bottomBuffer: 4,
          rightBuffer: 8,
          leftBuffer: 16, // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, { top: "323px", left: "250px" });
      });

      it("bottom, hAlign=center with buffers", () => {
        const button = new MockElement({
          top: 300,
          bottom: 320,
          left: 300,
          right: 350,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 200,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: "bottom",
          hAlign: "center",
          buffer: 1,
          topBuffer: 2,
          bottomBuffer: 4,
          rightBuffer: 8,
          leftBuffer: 16, // shouldn't change anything
        });
        assert.deepEqual(dropdown.style, { top: "323px", left: "275px" });
      });

      describe("only used to guarantee space from screen edge in position:cover", () => {
        it("vAlign=top hAlign=left with buffers", () => {
          const button = new MockElement({
            top: 300,
            bottom: 320,
            left: 300,
            right: 350,
          });
          const dropdown = new MockElement({
            top: 0,
            bottom: 200,
            left: 0,
            right: 100,
          });
          containByScreen(dropdown as any, button as any, {
            position: "cover",
            vAlign: "top",
            hAlign: "left",
            buffer: 1,
            leftBuffer: 2,
            topBuffer: 4,
            bottomBuffer: 8,
            rightBuffer: 16,
          });
          assert.deepEqual(dropdown.style, { top: "300px", left: "300px" });
        });

        it("vAlign=bottom hAlign=right with buffers", () => {
          const button = new MockElement({
            top: 300,
            bottom: 320,
            left: 300,
            right: 350,
          });
          const dropdown = new MockElement({
            top: 0,
            bottom: 200,
            left: 0,
            right: 100,
          });
          containByScreen(dropdown as any, button as any, {
            position: "cover",
            vAlign: "bottom",
            hAlign: "right",
            buffer: 1,
            leftBuffer: 2,
            topBuffer: 4,
            bottomBuffer: 8,
            rightBuffer: 16,
          });
          assert.deepEqual(dropdown.style, { top: "120px", left: "250px" });
        });

        it("vAlign=center hAlign=center with buffers", () => {
          const button = new MockElement({
            top: 300,
            bottom: 320,
            left: 300,
            right: 350,
          });
          const dropdown = new MockElement({
            top: 0,
            bottom: 200,
            left: 0,
            right: 100,
          });
          containByScreen(dropdown as any, button as any, {
            position: "cover",
            vAlign: "center",
            hAlign: "center",
            buffer: 1,
            leftBuffer: 2,
            topBuffer: 4,
            bottomBuffer: 8,
            rightBuffer: 16,
          });
          assert.deepEqual(dropdown.style, { top: "210px", left: "275px" });
        });
      });
    });

    describe("forces reposition if necessary", () => {
      it("top", () => {
        const button = new MockElement({
          top: 200,
          bottom: 400,
          left: 300,
          right: 400,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 190,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: "top",
          hAlign: "left",
          topBuffer: 11,
        });
        assert.deepEqual(dropdown.style, { top: "205px", left: "200px" });
      });

      it("bottom", () => {
        const button = new MockElement({
          top: 200,
          bottom: 400,
          left: 300,
          right: 400,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 190,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: "bottom",
          hAlign: "left",
          bottomBuffer: 11,
        });
        assert.deepEqual(dropdown.style, { top: "205px", left: "200px" });
      });

      it("left", () => {
        const button = new MockElement({
          top: 300,
          bottom: 320,
          left: 300,
          right: 500,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 200,
          left: 0,
          right: 290,
        });
        containByScreen(dropdown as any, button as any, {
          position: "left",
          vAlign: "top",
          leftBuffer: 11,
        });
        assert.deepEqual(dropdown.style, { top: "100px", left: "255px" });
      });

      it("right", () => {
        const button = new MockElement({
          top: 300,
          bottom: 320,
          left: 300,
          right: 500,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 200,
          left: 0,
          right: 290,
        });
        containByScreen(dropdown as any, button as any, {
          position: "right",
          vAlign: "top",
          rightBuffer: 11,
        });
        assert.deepEqual(dropdown.style, { top: "100px", left: "255px" });
      });
    });

    describe("can handle arrays", () => {
      it("position", () => {
        const button = new MockElement({
          top: 200,
          bottom: 400,
          left: 300,
          right: 400,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 190,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: ["top", "bottom"],
          hAlign: "left",
          topBuffer: 11,
        });
        assert.deepEqual(dropdown.style, { top: "205px", left: "200px" });
      });

      it("vAlign", () => {
        const button = new MockElement({
          top: 200,
          bottom: 400,
          left: 300,
          right: 400,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 190,
          left: 0,
          right: 100,
        });
        containByScreen(dropdown as any, button as any, {
          position: ["top"],
          hAlign: ["left"],
          topBuffer: 11,
        });
        assert.deepEqual(dropdown.style, { top: "205px", left: "200px" });
      });

      it("hAlign", () => {
        const button = new MockElement({
          top: 300,
          bottom: 320,
          left: 300,
          right: 500,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 200,
          left: 0,
          right: 290,
        });
        containByScreen(dropdown as any, button as any, {
          position: "right",
          vAlign: ["top"],
          rightBuffer: 11,
        });
        assert.deepEqual(dropdown.style, { top: "100px", left: "255px" });
      });
    });

    describe("cover", () => {
      it("cover, vAlign=top hAlign=left", () => {
        const button = new MockElement({
          top: 100,
          bottom: 130,
          left: 100,
          right: 200,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 100,
          left: 0,
          right: 100,
        });

        containByScreen(dropdown as any, button as any, {
          position: "cover",
          hAlign: "left",
          vAlign: "top",
        });
        assert.deepEqual(dropdown.style, { top: "100px", left: "100px" });
      });

      it("cover, vAlign=top hAlign=right", () => {
        const button = new MockElement({
          top: 100,
          bottom: 130,
          left: 200,
          right: 300,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 100,
          left: 0,
          right: 130,
        });

        containByScreen(dropdown as any, button as any, {
          position: "cover",
          hAlign: "right",
          vAlign: "top",
        });
        assert.deepEqual(dropdown.style, { top: "100px", left: "170px" });
      });

      it("cover, vAlign=bottom hAlign=left", () => {
        const button = new MockElement({
          top: 400,
          bottom: 430,
          left: 100,
          right: 200,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 100,
          left: 0,
          right: 100,
        });

        containByScreen(dropdown as any, button as any, {
          position: "cover",
          hAlign: "left",
          vAlign: "bottom",
        });
        assert.deepEqual(dropdown.style, { top: "330px", left: "100px" });
      });

      it("cover, vAlign=bottom hAlign=right", () => {
        const button = new MockElement({
          top: 400,
          bottom: 430,
          left: 100,
          right: 200,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 100,
          left: 0,
          right: 130,
        });

        containByScreen(dropdown as any, button as any, {
          position: "cover",
          hAlign: "right",
          vAlign: "bottom",
        });
        assert.deepEqual(dropdown.style, { top: "330px", left: "70px" });
      });

      it("cover, vAlign=center hAlign=right", () => {
        const button = new MockElement({
          top: 400,
          bottom: 430,
          left: 100,
          right: 200,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 100,
          left: 0,
          right: 130,
        });

        containByScreen(dropdown as any, button as any, {
          position: "cover",
          hAlign: "right",
          vAlign: "center",
        });
        assert.deepEqual(dropdown.style, { top: "365px", left: "70px" });
      });

      it("cover, vAlign=center hAlign=center", () => {
        const button = new MockElement({
          top: 400,
          bottom: 430,
          left: 100,
          right: 200,
        });
        const dropdown = new MockElement({
          top: 0,
          bottom: 100,
          left: 0,
          right: 130,
        });

        containByScreen(dropdown as any, button as any, {
          position: "cover",
          hAlign: "center",
          vAlign: "center",
        });
        assert.deepEqual(dropdown.style, { top: "365px", left: "85px" });
      });
    });
  });
});

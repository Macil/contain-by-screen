import flatten from "lodash/flatten";
import uniq from "lodash/uniq";
import { isNotNil } from "./isNotNil";

export type PositionOption = "top" | "bottom" | "left" | "right" | "cover";
/**
 * This option is used when position is "cover", "top", or "bottom".
 * It controls the horizontal alignment of the element relative to the anchor.
 * "center" means the element's center is aligned with the anchor's center.
 * "left" and "right" means that edge of the element is aligned with the same edge of the anchor.
 * "unaligned" means the element may not be aligned with the anchor at all. Currently
 * this works by doing the same thing as "center" and then adjusting the result to fit on screen.
 */
export type HAlignOption = "center" | "left" | "right" | "unaligned";
/**
 * Similar to {@link HAlignOption}, except this controls the vertical alignment of the element
 * relative to the anchor when the position is "cover", "left", or "right".
 */
export type VAlignOption = "center" | "top" | "bottom" | "unaligned";

export type Position = PositionOption | PositionOption[];
export type HAlign = HAlignOption | HAlignOption[];
export type VAlign = VAlignOption | VAlignOption[];
export interface Choice {
  position: PositionOption;
  hAlign: HAlignOption;
  vAlign: VAlignOption;
}

export interface Coordinates {
  top: number;
  left: number;
}

export interface ChoiceAndCoordinates {
  choice: Choice;
  coordinates: Coordinates;
}

export interface Options {
  position?: Position | null;
  forcePosition?: boolean | null;
  hAlign?: HAlign | null;
  forceHAlign?: boolean | null;
  vAlign?: VAlign | null;
  forceVAlign?: boolean | null;
  buffer?: number | null;
  topBuffer?: number | null;
  bottomBuffer?: number | null;
  leftBuffer?: number | null;
  rightBuffer?: number | null;
}

interface Rect {
  top: number;
  bottom: number;
  height: number;
  left: number;
  right: number;
  width: number;
}

export function containByScreen(
  element: HTMLElement,
  anchorPoint: HTMLElement,
  options: Options,
): Choice {
  const choiceAndCoord = getContainByScreenResults(
    element,
    anchorPoint,
    options,
  );

  element.style.top = `${choiceAndCoord.coordinates.top}px`;
  element.style.left = `${choiceAndCoord.coordinates.left}px`;

  return choiceAndCoord.choice;
}

export function getContainByScreenResults(
  element: HTMLElement,
  anchorPoint: HTMLElement,
  options: Options,
): ChoiceAndCoordinates {
  if (process.env.NODE_ENV !== "production" && window.getComputedStyle) {
    const style = window.getComputedStyle(element);
    if (style.position !== "fixed") {
      // eslint-disable-next-line no-console
      console.error(
        "containByScreen only works on fixed position elements",
        element,
      );
    }
  }

  const elRect: Rect = getBoundingClientRect(element);
  const anchorRect: Rect = getBoundingClientRect(anchorPoint);

  const buffers = {
    all: options.buffer || 0,
    top: options.topBuffer || 0,
    bottom: options.bottomBuffer || 0,
    left: options.leftBuffer || 0,
    right: options.rightBuffer || 0,
  };

  const optionPositions = Array.isArray(options.position)
    ? options.position
    : [options.position].filter(isNotNil);
  const optionHAligns = Array.isArray(options.hAlign)
    ? options.hAlign
    : [options.hAlign].filter(isNotNil);
  const optionVAligns = Array.isArray(options.vAlign)
    ? options.vAlign
    : [options.vAlign].filter(isNotNil);

  const positions: PositionOption[] =
    optionPositions.length > 0 && options.forcePosition
      ? optionPositions
      : uniq(optionPositions.concat(["top", "bottom", "left", "right"]));
  const hAligns: HAlignOption[] =
    optionHAligns.length > 0 && options.forceHAlign
      ? optionHAligns
      : uniq(optionHAligns.concat(["center", "left", "right"]));
  const vAligns: VAlignOption[] =
    optionVAligns.length > 0 && options.forceVAlign
      ? optionVAligns
      : uniq(optionVAligns.concat(["center", "top", "bottom"]));

  const allPossibleChoices: Choice[] = flatten(
    positions.map((position) =>
      position === "cover"
        ? flatten(
            hAligns.map((hAlign) =>
              vAligns.map((vAlign) => ({ position, hAlign, vAlign }) as Choice),
            ),
          )
        : position === "top" || position === "bottom"
        ? hAligns.map((hAlign) => ({ position, hAlign, vAlign: "center" }))
        : vAligns.map((vAlign) => ({ position, hAlign: "center", vAlign })),
    ),
  );

  // Try unaligned versions at the end
  if (!hAligns.includes("unaligned")) {
    allPossibleChoices.push(
      ...flatten(
        positions.map((position) =>
          !["cover", "top", "bottom"].includes(position)
            ? []
            : vAligns.map((vAlign) => ({
                position,
                hAlign: "unaligned" as const,
                vAlign,
              })),
        ),
      ),
    );
  }
  if (!vAligns.includes("unaligned")) {
    allPossibleChoices.push(
      ...flatten(
        positions.map((position) =>
          !["cover", "left", "right"].includes(position)
            ? []
            : hAligns.map((hAlign) => ({
                position,
                hAlign,
                vAlign: "unaligned" as const,
              })),
        ),
      ),
    );
  }

  let choiceAndCoord: ChoiceAndCoordinates | null = null;
  for (let i = 0; i < allPossibleChoices.length; i++) {
    const choice = allPossibleChoices[i];
    const coordinates = positionAndAlign(elRect, anchorRect, choice, buffers);
    const { top, left } = coordinates;

    const ignoreHorizontalConstraints =
      choice.hAlign === "unaligned" &&
      ["cover", "top", "bottom"].includes(choice.position);
    const ignoreVerticalConstraints =
      choice.vAlign === "unaligned" &&
      ["cover", "left", "right"].includes(choice.position);

    const hasHorizontalFit =
      ignoreHorizontalConstraints ||
      (left - buffers.all - buffers.left >= 0 &&
        left + elRect.width + buffers.all + buffers.right <= window.innerWidth);
    const hasVerticalFit =
      ignoreVerticalConstraints ||
      (top - buffers.all - buffers.top >= 0 &&
        top + elRect.height + buffers.all + buffers.bottom <=
          window.innerHeight);

    if (hasHorizontalFit && hasVerticalFit) {
      choiceAndCoord = { choice, coordinates };
      break;
    }
  }

  // Fallback if we failed to find a choice that fit on the screen.
  if (!choiceAndCoord) {
    const choice: Choice = {
      position: "cover",
      hAlign: "unaligned",
      vAlign: "unaligned",
    };
    choiceAndCoord = {
      choice,
      coordinates: positionAndAlign(elRect, anchorRect, choice, buffers),
    };
  }

  return choiceAndCoord;
}

function getBoundingClientRect(el: Element): Rect {
  let rect = el.getBoundingClientRect();
  if (!("width" in rect)) {
    // IE <9 support
    rect = {
      width: (rect as any).right - (rect as any).left,
      height: (rect as any).bottom - (rect as any).top,
      ...(rect as any),
    };
  }
  return rect;
}

interface Buffers {
  all: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

function positionAndAlign(
  elRect: Rect,
  anchorRect: Rect,
  { position, hAlign, vAlign }: Choice,
  buffers: Buffers,
): Coordinates {
  let top = 0,
    left = 0;
  if (position === "cover") {
    switch (hAlign) {
      case "center":
        left = Math.round(
          (anchorRect.left + anchorRect.right - elRect.width) / 2,
        );
        break;
      case "left":
        left = Math.floor(anchorRect.left);
        break;
      case "right":
        left = Math.ceil(anchorRect.right - elRect.width);
        break;
      case "unaligned": {
        left = Math.round(
          (anchorRect.left + anchorRect.right - elRect.width) / 2,
        );
        const overhang = Math.ceil(
          left + elRect.width + buffers.all + buffers.right - window.innerWidth,
        );
        if (overhang > 0) {
          left -= overhang;
        }
        left = Math.max(buffers.all + buffers.left, left);
        break;
      }
      default:
        hAlign satisfies never;
        throw new Error("Should not happen");
    }
    switch (vAlign) {
      case "center":
        top = Math.round(
          (anchorRect.top + anchorRect.bottom - elRect.height) / 2,
        );
        break;
      case "top":
        top = Math.floor(anchorRect.top);
        break;
      case "bottom":
        top = Math.ceil(anchorRect.bottom - elRect.height);
        break;
      case "unaligned": {
        top = Math.round(
          (anchorRect.top + anchorRect.bottom - elRect.height) / 2,
        );
        const overhang = Math.ceil(
          top +
            elRect.height +
            buffers.all +
            buffers.bottom -
            window.innerHeight,
        );
        if (overhang > 0) {
          top -= overhang;
        }
        top = Math.max(buffers.all + buffers.top, top);
        break;
      }
      default:
        vAlign satisfies never;
        throw new Error("Should not happen");
    }
  } else if (position === "top" || position === "bottom") {
    switch (position) {
      case "top":
        top = Math.floor(
          anchorRect.top - elRect.height - buffers.all - buffers.bottom,
        );
        break;
      case "bottom":
        top = Math.ceil(anchorRect.bottom + buffers.all + buffers.top);
        break;
      default:
        position satisfies never;
        throw new Error("Should not happen");
    }
    switch (hAlign) {
      case "center":
        left = Math.round(
          (anchorRect.left + anchorRect.right - elRect.width) / 2,
        );
        break;
      case "left":
        left = Math.round(anchorRect.left);
        break;
      case "right":
        left = Math.round(anchorRect.right - elRect.width);
        break;
      case "unaligned": {
        left = Math.round(
          (anchorRect.left + anchorRect.right - elRect.width) / 2,
        );
        const overhang = Math.ceil(
          left + elRect.width + buffers.all + buffers.right - window.innerWidth,
        );
        if (overhang > 0) {
          left -= overhang;
        }
        left = Math.max(buffers.all + buffers.left, left);
        break;
      }
      default:
        hAlign satisfies never;
        throw new Error("Should not happen");
    }
  } else {
    switch (position) {
      case "left":
        left = Math.floor(
          anchorRect.left - elRect.width - buffers.all - buffers.right,
        );
        break;
      case "right":
        left = Math.ceil(anchorRect.right + buffers.all + buffers.left);
        break;
      default:
        position satisfies never;
        throw new Error("Should not happen");
    }
    switch (vAlign) {
      case "center":
        top = Math.round(
          (anchorRect.top + anchorRect.bottom - elRect.height) / 2,
        );
        break;
      case "top":
        top = Math.round(anchorRect.top);
        break;
      case "bottom":
        top = Math.round(anchorRect.bottom - elRect.height);
        break;
      case "unaligned": {
        top = Math.round(
          (anchorRect.top + anchorRect.bottom - elRect.height) / 2,
        );
        const overhang = Math.ceil(
          top +
            elRect.height +
            buffers.all +
            buffers.bottom -
            window.innerHeight,
        );
        if (overhang > 0) {
          top -= overhang;
        }
        top = Math.max(buffers.all + buffers.top, top);
        break;
      }
      default:
        vAlign satisfies never;
        throw new Error("Should not happen");
    }
  }
  return { top, left };
}

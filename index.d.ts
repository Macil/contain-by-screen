export type PositionOption = 'top'|'bottom'|'left'|'right'|'cover';
export type HAlignOption = 'center'|'left'|'right';
export type VAlignOption = 'center'|'top'|'bottom';

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
  position?: Position | null | undefined;
  forcePosition?: boolean | null | undefined;
  hAlign?: HAlign | null | undefined;
  forceHAlign?: boolean | null | undefined;
  vAlign?: VAlign | null | undefined;
  forceVAlign?: boolean | null | undefined;
  buffer?: number | null | undefined;
  topBuffer?: number | null | undefined;
  bottomBuffer?: number | null | undefined;
  leftBuffer?: number | null | undefined;
  rightBuffer?: number | null | undefined;
}

export function containByScreen(
  element: HTMLElement,
  anchorPoint: HTMLElement,
  options: Options
): Choice;

export function getContainByScreenResults(
  element: HTMLElement,
  anchorPoint: HTMLElement,
  options: Options
): ChoiceAndCoordinates;

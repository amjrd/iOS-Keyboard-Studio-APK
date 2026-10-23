/**
 * Types adhering to Cem Olcay's KeyboardLayoutEngine Swift framework:
 * https://github.com/cemolcay/KeyboardLayoutEngine
 */

export type KeyboardButtonType = 
  | { kind: 'key'; char: string }
  | { kind: 'text'; text: string; actionId?: string }
  | { kind: 'image'; iconName: string; actionId: string; label?: string };

export type KeyboardButtonWidth =
  | { type: 'dynamic' }
  | { type: 'static'; points: number }
  | { type: 'relative'; percent: number }; // [0, 1] relative to row width

export interface KeyboardButtonStyle {
  backgroundColor?: string;
  highlightedBackgroundColor?: string;
  textColor?: string;
  highlightedTextColor?: string;
  cornerRadius?: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  isModifier?: boolean;
  isAction?: boolean; // e.g. blue return button
}

export interface KeyboardButtonData {
  id: string;
  type: KeyboardButtonType;
  width: KeyboardButtonWidth;
  style?: KeyboardButtonStyle;
  alternateCharacters?: string[];
  subLabel?: string;
}

export interface KeyboardRowStyle {
  rowHeight: number;
  buttonPadding: number; // horizontal gap between buttons
}

export interface KeyboardRowData {
  id: string;
  items: KeyboardButtonData[];
  style: KeyboardRowStyle;
}

export interface KeyboardLayoutStyle {
  backgroundColor: string;
  topPadding: number;
  bottomPadding: number;
  leftPadding: number;
  rightPadding: number;
  theme: 'light' | 'dark';
}

export interface KeyboardLayoutData {
  id: string;
  name: string;
  style: KeyboardLayoutStyle;
  rows: KeyboardRowData[];
}

export type KeyboardMode = 'letters' | 'numbers' | 'symbols' | 'emoji';
export type ShiftState = 'normal' | 'shift' | 'capslock';

/**
 * ReactorKit Unidirectional State Machine for iOS Keyboard
 * Based on Suyeol Jeon's ReactorKit: https://github.com/ReactorKit/ReactorKit
 * Cycle: Action -> mutate() -> Mutation -> reduce() -> State -> View
 */

import { KeyboardMode, ShiftState, KeyboardLayoutData } from '../types/keyboard';
import { 
  createEnglishLayout, 
  createArabicLayout, 
  createNumbersLayout, 
  createSymbolsLayout 
} from '../layouts/presets';
import { soundEngine } from '../audio/iosSoundEngine';

export type KeyboardAction =
  | { type: 'insertText'; text: string }
  | { type: 'deleteBackward' }
  | { type: 'toggleShift' }
  | { type: 'switchMode'; mode: KeyboardMode }
  | { type: 'switchLanguage' }
  | { type: 'moveCursor'; delta: number }
  | { type: 'clearText' }
  | { type: 'toggleTheme' }
  | { type: 'toggleSound' }
  | { type: 'setVolume'; volume: number }
  | { type: 'loadSampleText'; text: string }
  | { type: 'setCustomLayout'; layout: KeyboardLayoutData | null };

export type KeyboardMutation =
  | { type: 'setTextAndCursor'; text: string; cursor: number }
  | { type: 'setShiftState'; shiftState: ShiftState }
  | { type: 'setMode'; mode: KeyboardMode }
  | { type: 'setLanguage'; language: 'en' | 'ar' }
  | { type: 'setTheme'; isDark: boolean }
  | { type: 'setSound'; enabled: boolean }
  | { type: 'setVolume'; volume: number }
  | { type: 'setLayout'; customLayout: KeyboardLayoutData | null };

export interface ReactorLogEntry {
  id: string;
  action: string;
  mutation: string;
  timestamp: string;
}

export interface KeyboardState {
  text: string;
  cursorPosition: number;
  mode: KeyboardMode;
  shiftState: ShiftState;
  language: 'en' | 'ar';
  isDark: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  customLayout: KeyboardLayoutData | null;
  history: ReactorLogEntry[];
}

export class KeyboardViewReactor {
  private state: KeyboardState;
  private listeners: ((state: KeyboardState) => void)[] = [];
  private lastShiftTapTime: number = 0;

  constructor(initialState?: Partial<KeyboardState>) {
    this.state = {
      text: initialState?.text ?? 'Welcome to iOS Keyboard powered by ReactorKit & KeyboardLayoutEngine.',
      cursorPosition: initialState?.text ? initialState.text.length : 68,
      mode: 'letters',
      shiftState: 'normal',
      language: 'en',
      isDark: false,
      soundEnabled: true,
      soundVolume: 0.65,
      customLayout: null,
      history: [
        {
          id: 'init_1',
          action: 'Init',
          mutation: 'SetInitialState',
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
      ...initialState,
    };
  }

  public getState(): KeyboardState {
    return this.state;
  }

  public subscribe(listener: (state: KeyboardState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Action dispatch contract conforming to ReactorKit
   */
  public action(action: KeyboardAction): void {
    // 1. Mutate: transform action into mutations
    const mutations = this.mutate(action);

    // 2. Reduce: generate new immutable state
    mutations.forEach((mutation) => {
      const prevState = this.state;
      this.state = this.reduce(prevState, mutation);

      // Log reactive stream
      const logEntry: ReactorLogEntry = {
        id: `rx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        action: action.type,
        mutation: mutation.type,
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      this.state.history = [logEntry, ...this.state.history.slice(0, 19)];
    });

    // 3. Notify View subscribers
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * ReactorKit: mutate(action:) -> [Mutation]
   */
  private mutate(action: KeyboardAction): KeyboardMutation[] {
    switch (action.type) {
      case 'insertText': {
        const { text, cursorPosition, shiftState } = this.state;
        const nextText = text.slice(0, cursorPosition) + action.text + text.slice(cursorPosition);
        const nextCursor = cursorPosition + action.text.length;
        const mutations: KeyboardMutation[] = [
          { type: 'setTextAndCursor', text: nextText, cursor: nextCursor },
        ];
        if (shiftState === 'shift') {
          mutations.push({ type: 'setShiftState', shiftState: 'normal' });
        }
        return mutations;
      }

      case 'deleteBackward': {
        const { text, cursorPosition } = this.state;
        if (cursorPosition === 0) return [];
        const nextText = text.slice(0, cursorPosition - 1) + text.slice(cursorPosition);
        return [{ type: 'setTextAndCursor', text: nextText, cursor: cursorPosition - 1 }];
      }

      case 'toggleShift': {
        const now = Date.now();
        let nextShift: ShiftState = 'normal';
        if (now - this.lastShiftTapTime < 300) {
          nextShift = 'capslock';
        } else {
          nextShift = this.state.shiftState === 'normal' ? 'shift' : 'normal';
        }
        this.lastShiftTapTime = now;
        return [{ type: 'setShiftState', shiftState: nextShift }];
      }

      case 'switchMode':
        return [{ type: 'setMode', mode: action.mode }];

      case 'switchLanguage': {
        const nextLang = this.state.language === 'en' ? 'ar' : 'en';
        return [
          { type: 'setLanguage', language: nextLang },
          { type: 'setMode', mode: 'letters' },
        ];
      }

      case 'moveCursor': {
        const nextPos = Math.max(0, Math.min(this.state.text.length, this.state.cursorPosition + action.delta));
        return [{ type: 'setTextAndCursor', text: this.state.text, cursor: nextPos }];
      }

      case 'clearText':
        return [{ type: 'setTextAndCursor', text: '', cursor: 0 }];

      case 'toggleTheme':
        return [{ type: 'setTheme', isDark: !this.state.isDark }];

      case 'toggleSound': {
        const next = !this.state.soundEnabled;
        soundEngine.enabled = next;
        return [{ type: 'setSound', enabled: next }];
      }

      case 'setVolume':
        soundEngine.volume = action.volume;
        return [{ type: 'setVolume', volume: action.volume }];

      case 'loadSampleText':
        return [{ type: 'setTextAndCursor', text: action.text, cursor: action.text.length }];

      case 'setCustomLayout':
        return [{ type: 'setLayout', customLayout: action.layout }];

      default:
        return [];
    }
  }

  /**
   * ReactorKit: reduce(state:mutation:) -> State
   */
  private reduce(state: KeyboardState, mutation: KeyboardMutation): KeyboardState {
    switch (mutation.type) {
      case 'setTextAndCursor':
        return {
          ...state,
          text: mutation.text,
          cursorPosition: mutation.cursor,
        };

      case 'setShiftState':
        return {
          ...state,
          shiftState: mutation.shiftState,
        };

      case 'setMode':
        return {
          ...state,
          mode: mutation.mode,
        };

      case 'setLanguage':
        return {
          ...state,
          language: mutation.language,
        };

      case 'setTheme':
        return {
          ...state,
          isDark: mutation.isDark,
        };

      case 'setSound':
        return {
          ...state,
          soundEnabled: mutation.enabled,
        };

      case 'setVolume':
        return {
          ...state,
          soundVolume: mutation.volume,
        };

      case 'setLayout':
        return {
          ...state,
          customLayout: mutation.customLayout,
        };

      default:
        return state;
    }
  }

  /**
   * Resolves active KeyboardLayoutData based on Reactor State
   */
  public getActiveLayout(): KeyboardLayoutData {
    if (this.state.customLayout) {
      return this.state.customLayout;
    }
    const theme = this.state.isDark ? 'dark' : 'light';
    if (this.state.mode === 'numbers') {
      return createNumbersLayout(theme);
    }
    if (this.state.mode === 'symbols') {
      return createSymbolsLayout(theme);
    }
    if (this.state.language === 'ar') {
      return createArabicLayout(theme);
    }
    return createEnglishLayout(theme, this.state.shiftState);
  }
}

export const keyboardReactor = new KeyboardViewReactor();

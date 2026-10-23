import React, { useState, useRef } from 'react';
import { 
  KeyboardLayoutData, 
  KeyboardButtonData, 
  KeyboardMode, 
  ShiftState 
} from '../types/keyboard';
import { KeyboardRowView } from './KeyboardRowView';
import { EmojiKeyboardView } from './EmojiKeyboardView';
import { soundEngine } from '../audio/iosSoundEngine';
import { 
  createEnglishLayout, 
  createArabicLayout, 
  createNumbersLayout, 
  createSymbolsLayout 
} from '../layouts/presets';
import { Mic, Volume2, VolumeX } from 'lucide-react';

interface KeyboardLayoutViewProps {
  currentText: string;
  cursorPosition: number;
  onInsertText: (text: string) => void;
  onBackspace: () => void;
  onReturn: () => void;
  onMoveCursor: (delta: number) => void;
  isDark: boolean;
  onToggleTheme?: () => void;
  customLayout?: KeyboardLayoutData | null;
}

export const KeyboardLayoutView: React.FC<KeyboardLayoutViewProps> = ({
  currentText,
  cursorPosition,
  onInsertText,
  onBackspace,
  onReturn,
  onMoveCursor,
  isDark,
  customLayout,
}) => {
  const [mode, setMode] = useState<KeyboardMode>('letters');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [shiftState, setShiftState] = useState<ShiftState>('normal');
  const [isTashkeel, setIsTashkeel] = useState(false);
  const [isSpaceTrackpadActive, setIsSpaceTrackpadActive] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundEngine.enabled);

  const trackpadStartX = useRef<number | null>(null);
  const lastShiftTapRef = useRef<number>(0);

  // Derive active layout data
  const getActiveLayout = (): KeyboardLayoutData => {
    if (customLayout) {
      return customLayout;
    }

    if (mode === 'numbers') {
      return createNumbersLayout(isDark ? 'dark' : 'light');
    }
    if (mode === 'symbols') {
      return createSymbolsLayout(isDark ? 'dark' : 'light');
    }
    if (language === 'ar') {
      return createArabicLayout(isDark ? 'dark' : 'light', isTashkeel);
    }
    return createEnglishLayout(isDark ? 'dark' : 'light', shiftState);
  };

  const activeLayout = getActiveLayout();

  // Dynamic predictive QuickType words based on typed content
  const getPredictiveSuggestions = () => {
    const words = currentText.trim().split(/\s+/);
    const lastWord = words[words.length - 1] || '';

    if (language === 'ar') {
      if (!lastWord) return ['السلام', 'شكراً', 'أهلاً'];
      if (lastWord.startsWith('ال')) return ['اليوم', 'العمل', 'الحمد'];
      if (lastWord.startsWith('م')) return ['مرحباً', 'معاً', 'ممكن'];
      return ['إن شاء الله', 'تمام', 'ممتاز'];
    }

    if (!lastWord) return ["I'm", 'The', 'Hello'];
    if (lastWord.toLowerCase().startsWith('th')) return ['the', 'this', 'that'];
    if (lastWord.toLowerCase().startsWith('wh')) return ['what', 'where', 'when'];
    if (lastWord.toLowerCase().startsWith('ho')) return ['how', 'hope', 'home'];
    if (lastWord.toLowerCase().startsWith('yo')) return ['you', 'your', 'young'];
    return [lastWord + 's', lastWord + 'ing', lastWord + 'ed'];
  };

  const suggestions = getPredictiveSuggestions();

  // Button press handler
  const handleButtonPress = (button: KeyboardButtonData, customChar?: string) => {
    // 1. Direct character insertion from accent flyout
    if (customChar) {
      onInsertText(customChar);
      if (shiftState === 'shift') setShiftState('normal');
      return;
    }

    // 2. Standard character key
    if (button.type.kind === 'key') {
      onInsertText(button.type.char);
      if (shiftState === 'shift') {
        setShiftState('normal');
      }
      return;
    }

    // 3. Functional text actions
    if (button.type.kind === 'text') {
      const action = button.type.actionId || button.type.text;
      switch (action) {
        case 'space':
          onInsertText(' ');
          break;
        case 'return':
          onReturn();
          break;
        case 'mode_numbers':
          setMode('numbers');
          break;
        case 'mode_symbols':
          setMode('symbols');
          break;
        case 'mode_letters':
          setMode('letters');
          break;
        case 'toggle_tashkeel':
          setIsTashkeel(!isTashkeel);
          break;
        default:
          if (button.type.text) {
            onInsertText(button.type.text);
          }
          break;
      }
      return;
    }

    // 4. Image / Icon actions
    if (button.type.kind === 'image') {
      const action = button.type.actionId;
      switch (action) {
        case 'toggle_shift': {
          const now = Date.now();
          if (now - lastShiftTapRef.current < 300) {
            // Double tap = Caps Lock
            setShiftState('capslock');
          } else {
            // Single tap = toggle Shift / Normal
            if (shiftState === 'normal') {
              setShiftState('shift');
            } else {
              setShiftState('normal');
            }
          }
          lastShiftTapRef.current = now;
          break;
        }
        case 'backspace':
          onBackspace();
          break;
        case 'toggle_lang':
          if (mode !== 'letters') {
            setMode('letters');
          } else {
            setLanguage(language === 'en' ? 'ar' : 'en');
          }
          break;
        case 'dictation':
          setIsDictating(!isDictating);
          if (!isDictating) {
            // Simulate voice dictation after 1.5s
            setTimeout(() => {
              onInsertText(language === 'ar' ? ' السلام عليكم ورحمة الله' : ' Hello, typing with iOS voice dictation');
              setIsDictating(false);
            }, 1800);
          }
          break;
        default:
          break;
      }
    }
  };

  // Trackpad cursor dragging on spacebar hold
  const handleTrackpadPointerDown = (e: React.PointerEvent) => {
    trackpadStartX.current = e.clientX;
  };

  const handleTrackpadPointerMove = (e: React.PointerEvent) => {
    if (!isSpaceTrackpadActive || trackpadStartX.current === null) return;
    const diff = e.clientX - trackpadStartX.current;
    if (Math.abs(diff) > 12) {
      onMoveCursor(diff > 0 ? 1 : -1);
      trackpadStartX.current = e.clientX;
      soundEngine.playKeyClick();
    }
  };

  const handleTrackpadPointerUp = () => {
    setIsSpaceTrackpadActive(false);
    trackpadStartX.current = null;
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    soundEngine.enabled = next;
    setSoundEnabled(next);
  };

  return (
    <div 
      className="relative w-full select-none transition-colors duration-150"
      style={{
        backgroundColor: activeLayout.style.backgroundColor,
      }}
      onPointerMove={isSpaceTrackpadActive ? handleTrackpadPointerMove : undefined}
      onPointerUp={isSpaceTrackpadActive ? handleTrackpadPointerUp : undefined}
    >
      {/* iOS Predictive Bar / QuickType Bar */}
      <div 
        className="flex items-center justify-between border-b px-2 h-10 backdrop-blur-md"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          backgroundColor: isDark ? 'rgba(30,30,32,0.85)' : 'rgba(235,238,242,0.85)',
          color: isDark ? '#FFFFFF' : '#1C1C1E',
        }}
      >
        {mode === 'emoji' ? (
          <div className="flex-1 text-center text-xs text-slate-500 font-medium">
            iOS Emoji Engine
          </div>
        ) : (
          <div className="flex items-center w-full justify-around divide-x divide-slate-300 dark:divide-slate-700">
            {suggestions.map((word, idx) => (
              <button
                key={`${word}-${idx}`}
                type="button"
                onClick={() => {
                  soundEngine.playKeyClick();
                  onInsertText(word + ' ');
                }}
                className="flex-1 text-center text-sm font-medium py-1 px-2 truncate active:opacity-60 transition-opacity"
              >
                {word}
              </button>
            ))}
          </div>
        )}

        {/* Quick Toolbar for Mode, Emoji & Sound */}
        <div className="flex items-center gap-1 pl-2">
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Key Clicks' : 'Enable Key Clicks'}
            className="p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === 'emoji' ? 'letters' : 'emoji')}
            title="Emoji Keyboard"
            className={`p-1 text-sm rounded transition-all ${mode === 'emoji' ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
          >
            😊
          </button>
        </div>
      </div>

      {/* Dictation Banner Simulation */}
      {isDictating && (
        <div className="absolute top-10 left-0 right-0 z-30 flex items-center justify-center gap-3 py-2 bg-blue-600/95 text-white backdrop-blur-md animate-in fade-in duration-150">
          <Mic className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-medium">
            {language === 'ar' ? 'جاري الاستماع...' : 'Listening... Speak now'}
          </span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-3 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-4 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}

      {/* Spacebar Trackpad Drag Overlay Banner */}
      {isSpaceTrackpadActive && (
        <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center pointer-events-none">
          <div className="bg-slate-900/90 text-white px-4 py-2 rounded-xl text-xs font-medium shadow-2xl flex items-center gap-2">
            <span>⇄ Slide finger left or right to move cursor</span>
          </div>
        </div>
      )}

      {/* Main Keyboard Rows or Emoji Keyboard */}
      {mode === 'emoji' ? (
        <EmojiKeyboardView
          isDark={isDark}
          onSelectEmoji={(emoji) => onInsertText(emoji)}
          onBackToAlphabet={() => setMode('letters')}
          onBackspace={onBackspace}
        />
      ) : (
        <div 
          className="flex flex-col select-none"
          style={{
            paddingTop: `${activeLayout.style.topPadding}px`,
            paddingBottom: `${activeLayout.style.bottomPadding}px`,
            paddingLeft: `${activeLayout.style.leftPadding}px`,
            paddingRight: `${activeLayout.style.rightPadding}px`,
            gap: '8px',
          }}
          onPointerDown={isSpaceTrackpadActive ? handleTrackpadPointerDown : undefined}
        >
          {activeLayout.rows.map((row) => (
            <KeyboardRowView
              key={row.id}
              row={row}
              isDark={isDark}
              onButtonPress={handleButtonPress}
              onSpaceHoldStart={() => setIsSpaceTrackpadActive(true)}
              onSpaceHoldEnd={() => setIsSpaceTrackpadActive(false)}
              isSpaceTrackpadActive={isSpaceTrackpadActive}
            />
          ))}
        </div>
      )}
    </div>
  );
};

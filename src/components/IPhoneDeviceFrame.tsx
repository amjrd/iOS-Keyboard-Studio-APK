import React, { useRef, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Trash2, Copy, Check } from 'lucide-react';
import { KeyboardLayoutView } from './KeyboardLayoutView';
import { KeyboardLayoutData } from '../types/keyboard';

interface IPhoneDeviceFrameProps {
  text: string;
  cursorPosition: number;
  onInsertText: (txt: string) => void;
  onBackspace: () => void;
  onReturn: () => void;
  onMoveCursor: (delta: number) => void;
  onClearText: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  customLayout?: KeyboardLayoutData | null;
  isArabicUI?: boolean;
}

export const IPhoneDeviceFrame: React.FC<IPhoneDeviceFrameProps> = ({
  text,
  cursorPosition,
  onInsertText,
  onBackspace,
  onReturn,
  onMoveCursor,
  onClearText,
  isDark,
  onToggleTheme,
  customLayout,
  isArabicUI = false,
}) => {
  const [copied, setCopied] = React.useState(false);
  const textContainerRef = useRef<HTMLDivElement | null>(null);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      //
    }
  };

  // Scroll to bottom when text changes
  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight;
    }
  }, [text]);

  const beforeCursor = text.slice(0, cursorPosition);
  const afterCursor = text.slice(cursorPosition);

  return (
    <div className="relative mx-auto w-full max-w-[400px] h-[780px] bg-slate-900 rounded-[52px] p-3 shadow-2xl ring-1 ring-slate-800 shadow-slate-950/60 flex flex-col justify-between select-none">
      {/* Outer Titanium Bezel Accent */}
      <div 
        className="w-full h-full rounded-[44px] overflow-hidden flex flex-col justify-between border relative"
        style={{
          backgroundColor: isDark ? '#000000' : '#F2F2F7',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        }}
      >
        {/* iOS Dynamic Island & Status Bar */}
        <div className="pt-3 px-7 pb-2 flex items-center justify-between z-20 shrink-0">
          {/* Time */}
          <span 
            className="text-xs font-semibold tracking-tight"
            style={{ color: isDark ? '#FFFFFF' : '#000000' }}
          >
            9:41
          </span>

          {/* Dynamic Island */}
          <div className="w-24 h-6 bg-black rounded-full flex items-center justify-between px-2.5 mx-auto -mt-1 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-900/40" />
          </div>

          {/* Right Status Icons */}
          <div 
            className="flex items-center gap-1.5"
            style={{ color: isDark ? '#FFFFFF' : '#000000' }}
          >
            <Signal className="w-3.5 h-3.5 stroke-[2]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2]" />
            <div className="w-5 h-2.5 rounded-[4px] border border-current p-0.5 flex items-center">
              <div className="w-3.5 h-full bg-current rounded-[2px]" />
            </div>
          </div>
        </div>

        {/* Notes / Message Document App View */}
        <div className="flex-1 flex flex-col overflow-hidden px-4 pt-2 pb-1">
          {/* Document Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/80">
            <div>
              <h2 className="text-sm font-semibold" style={{ color: isDark ? '#FFFFFF' : '#1C1C1E' }}>
                {isArabicUI ? 'ملاحظات iOS' : 'Notes'}
              </h2>
              <span className="text-[11px] text-slate-400">
                {new Date().toLocaleDateString(isArabicUI ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                title="Copy note"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClearText}
                title="Clear text"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Document Body with Live Cursor */}
          <div 
            ref={textContainerRef}
            className="flex-1 overflow-y-auto py-3 text-base leading-relaxed break-words whitespace-pre-wrap select-text cursor-text"
            style={{ 
              color: isDark ? '#FFFFFF' : '#1C1C1E',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", sans-serif',
              direction: /[\u0600-\u06FF]/.test(text) ? 'rtl' : 'ltr',
            }}
          >
            {text.length === 0 ? (
              <span className="text-slate-400 select-none italic text-sm">
                {isArabicUI ? 'ابدأ بالكتابة عبر لوحة مفاتيح iOS أدناه...' : 'Start typing with the iOS keyboard below...'}
              </span>
            ) : (
              <>
                <span>{beforeCursor}</span>
                {/* Authentic iOS Blinking Cursor */}
                <span className="inline-block w-[2px] h-[1.15em] bg-blue-500 align-middle animate-pulse mx-[0.5px]" />
                <span>{afterCursor}</span>
              </>
            )}
          </div>
        </div>

        {/* Docked iOS Keyboard */}
        <div className="shrink-0 w-full shadow-lg border-t border-slate-200/50 dark:border-slate-800/80">
          <KeyboardLayoutView
            currentText={text}
            cursorPosition={cursorPosition}
            onInsertText={onInsertText}
            onBackspace={onBackspace}
            onReturn={onReturn}
            onMoveCursor={onMoveCursor}
            isDark={isDark}
            onToggleTheme={onToggleTheme}
            customLayout={customLayout}
          />
        </div>

        {/* iOS Home Indicator Bar */}
        <div 
          className="w-full py-1.5 flex items-center justify-center shrink-0"
          style={{
            backgroundColor: isDark ? '#1C1C1E' : '#D1D5DB',
          }}
        >
          <div 
            className="w-32 h-1 rounded-full transition-colors"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

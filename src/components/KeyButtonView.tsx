import React, { useState, useRef, useEffect } from 'react';
import { KeyboardButtonData } from '../types/keyboard';
import { soundEngine } from '../audio/iosSoundEngine';
import { 
  ArrowBigUp, 
  Delete, 
  Globe, 
  Mic, 
  CornerDownLeft, 
  Lock
} from 'lucide-react';

interface KeyButtonViewProps {
  button: KeyboardButtonData;
  isDark: boolean;
  onPress: (button: KeyboardButtonData, customChar?: string) => void;
  onSpaceHoldStart?: () => void;
  onSpaceHoldEnd?: () => void;
  isSpaceTrackpadActive?: boolean;
}

export const KeyButtonView: React.FC<KeyButtonViewProps> = ({
  button,
  isDark,
  onPress,
  onSpaceHoldStart,
  onSpaceHoldEnd,
  isSpaceTrackpadActive = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showAlternates, setShowAlternates] = useState(false);
  const [selectedAlternateIndex, setSelectedAlternateIndex] = useState<number | null>(null);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const alternatesRef = useRef<HTMLDivElement | null>(null);

  // If this button is a transparent spacer
  if (button.style?.backgroundColor === 'transparent' && button.type.kind === 'text' && !button.type.text) {
    return <div className="h-full pointer-events-none select-none" />;
  }

  const isKey = button.type.kind === 'key';
  const isModifier = button.style?.isModifier;
  const isAction = button.style?.isAction;
  const isSpace = button.id.includes('space') || (button.type.kind === 'text' && button.type.text === 'space');
  const hasAlternates = (button.alternateCharacters && button.alternateCharacters.length > 0) || false;

  // Keycap base styling
  const getKeycapBackground = () => {
    if (isAction) {
      return isPressed ? '#0062cc' : '#007AFF';
    }
    if (isModifier) {
      if (isDark) {
        return isPressed ? '#545458' : '#3A3A3C';
      }
      return isPressed ? '#FFFFFF' : '#A6AFB8';
    }
    // Normal character key
    if (isDark) {
      return isPressed ? '#2C2C2E' : '#505054';
    }
    return isPressed ? '#E2E5E9' : '#FFFFFF';
  };

  const getTextColor = () => {
    if (isAction) return '#FFFFFF';
    if (isDark) return '#FFFFFF';
    return '#000000';
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsPressed(true);

    // Audio feedback
    if (button.id.includes('backspace')) {
      soundEngine.playDeleteClick();
    } else if (isModifier || isAction) {
      soundEngine.playModifierClick();
    } else {
      soundEngine.playKeyClick();
    }

    // Spacebar trackpad mode
    if (isSpace && onSpaceHoldStart) {
      longPressTimerRef.current = setTimeout(() => {
        onSpaceHoldStart();
      }, 350);
      return;
    }

    // Long press for alternate accented characters
    if (hasAlternates) {
      longPressTimerRef.current = setTimeout(() => {
        setShowAlternates(true);
        setSelectedAlternateIndex(0);
      }, 380);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (isSpace && onSpaceHoldEnd) {
      onSpaceHoldEnd();
    }

    if (showAlternates) {
      if (selectedAlternateIndex !== null && button.alternateCharacters && button.alternateCharacters[selectedAlternateIndex]) {
        onPress(button, button.alternateCharacters[selectedAlternateIndex]);
      }
      setShowAlternates(false);
      setSelectedAlternateIndex(null);
    } else if (isPressed) {
      onPress(button);
    }

    setIsPressed(false);
  };

  const handlePointerLeave = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (isSpace && onSpaceHoldEnd) {
      onSpaceHoldEnd();
    }
    setIsPressed(false);
    setShowAlternates(false);
    setSelectedAlternateIndex(null);
  };

  // Render label or icon
  const renderContent = () => {
    if (button.type.kind === 'key') {
      return (
        <span 
          className="font-medium tracking-tight select-none transition-opacity"
          style={{ 
            fontSize: button.style?.fontSize ? `${button.style.fontSize}px` : '22px',
            opacity: isSpaceTrackpadActive ? 0.2 : 1,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", sans-serif'
          }}
        >
          {button.type.char}
        </span>
      );
    }

    if (button.type.kind === 'text') {
      const isSpaceBtn = button.type.text === 'space' || button.id.includes('space');
      return (
        <span 
          className={`select-none transition-opacity ${isSpaceBtn ? 'text-xs text-slate-400 font-normal' : 'font-medium'}`}
          style={{ 
            fontSize: button.style?.fontSize ? `${button.style.fontSize}px` : isSpaceBtn ? '13px' : '15px',
            opacity: isSpaceTrackpadActive && !isSpaceBtn ? 0.2 : 1,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", sans-serif'
          }}
        >
          {isSpaceTrackpadActive && isSpaceBtn ? '' : button.type.text}
        </span>
      );
    }

    // Kind: image / icon
    const iconName = button.type.iconName;
    if (iconName === 'shift') {
      return <ArrowBigUp className="w-5 h-5 text-current stroke-[2]" />;
    }
    if (iconName === 'shift_active') {
      return <ArrowBigUp className="w-5 h-5 text-current fill-current stroke-[2]" />;
    }
    if (iconName === 'capslock') {
      return (
        <div className="flex flex-col items-center">
          <ArrowBigUp className="w-5 h-5 text-current fill-current stroke-[2]" />
          <div className="w-2.5 h-0.5 bg-current mt-0.5 rounded-full" />
        </div>
      );
    }
    if (iconName === 'backspace') {
      return <Delete className="w-5 h-5 text-current stroke-[1.8]" />;
    }
    if (iconName === 'globe') {
      return <Globe className="w-5 h-5 text-current stroke-[1.8]" />;
    }
    if (iconName === 'mic') {
      return <Mic className="w-5 h-5 text-current stroke-[1.8]" />;
    }
    if (iconName === 'return') {
      return <CornerDownLeft className="w-5 h-5 text-current stroke-[2]" />;
    }
    if (iconName === 'lock') {
      return <Lock className="w-4 h-4 text-current stroke-[2]" />;
    }

    return <span>{button.type.label || ''}</span>;
  };

  const showMagnifier = isPressed && isKey && !showAlternates && !isSpaceTrackpadActive;

  return (
    <div 
      className="relative flex-1 h-full select-none touch-manipulation"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      {/* iOS Key Magnifier Bubble / Popover on Press */}
      {showMagnifier && (
        <div 
          className="absolute -top-14 left-1/2 -translate-x-1/2 pointer-events-none z-50 flex flex-col items-center animate-in fade-in zoom-in-95 duration-75"
        >
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border"
            style={{
              backgroundColor: isDark ? '#636366' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              boxShadow: '0 8px 24px -2px rgba(0, 0, 0, 0.35)',
              color: isDark ? '#FFFFFF' : '#000000',
            }}
          >
            <span className="text-3xl font-normal leading-none" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
              {button.type.kind === 'key' ? button.type.char : ''}
            </span>
          </div>
          {/* Subtle pointer tail */}
          <div 
            className="w-4 h-3 -mt-1.5 rotate-45 rounded-sm"
            style={{
              backgroundColor: isDark ? '#636366' : '#FFFFFF',
            }}
          />
        </div>
      )}

      {/* iOS Alternate Accents / Characters Flyout Strip on Long Press */}
      {showAlternates && button.alternateCharacters && (
        <div 
          ref={alternatesRef}
          className="absolute -top-14 left-1/2 -translate-x-1/2 pointer-events-auto z-50 flex items-center gap-1.5 px-2 py-1.5 rounded-xl shadow-2xl border backdrop-blur-md"
          style={{
            backgroundColor: isDark ? 'rgba(44, 44, 46, 0.96)' : 'rgba(255, 255, 255, 0.96)',
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
          }}
        >
          {button.alternateCharacters.map((altChar, idx) => {
            const isSelected = selectedAlternateIndex === idx;
            return (
              <button
                key={altChar}
                type="button"
                onPointerEnter={() => setSelectedAlternateIndex(idx)}
                onClick={(e) => {
                  e.stopPropagation();
                  onPress(button, altChar);
                  setShowAlternates(false);
                }}
                className={`w-9 h-11 flex items-center justify-center text-xl font-medium rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-blue-500 text-white shadow-sm scale-105' 
                    : isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'
                }`}
              >
                {altChar}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Keycap Surface */}
      <button
        type="button"
        tabIndex={-1}
        className="w-full h-full rounded-[5px] flex items-center justify-center outline-none transition-transform duration-75 active:scale-[0.98] select-none"
        style={{
          backgroundColor: getKeycapBackground(),
          color: getTextColor(),
          boxShadow: isAction 
            ? '0 1px 0 rgba(0, 0, 0, 0.25)' 
            : isDark 
              ? '0 1px 0 rgba(0, 0, 0, 0.45)' 
              : '0 1px 0 rgba(0, 0, 0, 0.35)',
        }}
      >
        {renderContent()}
      </button>
    </div>
  );
};

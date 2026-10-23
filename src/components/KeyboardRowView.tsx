import React from 'react';
import { KeyboardRowData, KeyboardButtonData } from '../types/keyboard';
import { KeyButtonView } from './KeyButtonView';

interface KeyboardRowViewProps {
  row: KeyboardRowData;
  isDark: boolean;
  onButtonPress: (button: KeyboardButtonData, customChar?: string) => void;
  onSpaceHoldStart?: () => void;
  onSpaceHoldEnd?: () => void;
  isSpaceTrackpadActive?: boolean;
}

export const KeyboardRowView: React.FC<KeyboardRowViewProps> = ({
  row,
  isDark,
  onButtonPress,
  onSpaceHoldStart,
  onSpaceHoldEnd,
  isSpaceTrackpadActive = false,
}) => {
  return (
    <div 
      className="flex items-center w-full"
      style={{
        height: `${row.style.rowHeight}px`,
        gap: `${row.style.buttonPadding}px`,
      }}
    >
      {row.items.map((button) => {
        // Compute style based on Cem Olcay's KeyboardButtonWidth:
        // .dynamic, .static, .relative
        let flexStyle: React.CSSProperties = { flex: '1 1 0%', minWidth: 0 };

        if (button.width.type === 'static') {
          flexStyle = {
            flex: `0 0 ${button.width.points}px`,
            width: `${button.width.points}px`,
          };
        } else if (button.width.type === 'relative') {
          flexStyle = {
            flex: `0 0 ${button.width.percent * 100}%`,
            width: `${button.width.percent * 100}%`,
          };
        }

        return (
          <div 
            key={button.id}
            className="h-full flex items-center justify-center"
            style={flexStyle}
          >
            <KeyButtonView
              button={button}
              isDark={isDark}
              onPress={onButtonPress}
              onSpaceHoldStart={onSpaceHoldStart}
              onSpaceHoldEnd={onSpaceHoldEnd}
              isSpaceTrackpadActive={isSpaceTrackpadActive}
            />
          </div>
        );
      })}
    </div>
  );
};

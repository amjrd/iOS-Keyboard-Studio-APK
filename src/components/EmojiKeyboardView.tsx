import React, { useState } from 'react';
import { EMOJI_CATEGORIES } from '../layouts/presets';
import { soundEngine } from '../audio/iosSoundEngine';
import { Search, Delete, Smile, Clock, Heart, Coffee, PawPrint, Sparkles } from 'lucide-react';

interface EmojiKeyboardViewProps {
  isDark: boolean;
  onSelectEmoji: (emoji: string) => void;
  onBackToAlphabet: () => void;
  onBackspace: () => void;
}

export const EmojiKeyboardView: React.FC<EmojiKeyboardViewProps> = ({
  isDark,
  onSelectEmoji,
  onBackToAlphabet,
  onBackspace,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState('smileys');
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory = EMOJI_CATEGORIES.find((c) => c.id === activeCategoryId) || EMOJI_CATEGORIES[1];

  const filteredEmojis = searchQuery.trim()
    ? EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter((e, idx, self) => self.indexOf(e) === idx)
    : currentCategory.emojis;

  const handleEmojiClick = (emoji: string) => {
    soundEngine.playKeyClick();
    onSelectEmoji(emoji);
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'frequent': return <Clock className="w-4 h-4" />;
      case 'smileys': return <Smile className="w-4 h-4" />;
      case 'gestures': return <Sparkles className="w-4 h-4" />;
      case 'nature': return <PawPrint className="w-4 h-4" />;
      case 'food': return <Coffee className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className="flex flex-col h-[260px] select-none rounded-b-2xl overflow-hidden"
      style={{
        backgroundColor: isDark ? '#1c1c1e' : '#d1d5db',
        color: isDark ? '#FFFFFF' : '#000000',
      }}
    >
      {/* Search Input Bar */}
      <div className="px-3 pt-2 pb-1.5 flex items-center gap-2">
        <div 
          className="flex-1 flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs"
          style={{
            backgroundColor: isDark ? '#2c2c2e' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          }}
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Emoji / بحث عن رمز..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-xs placeholder:text-slate-400"
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Emoji Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin">
        <div className="text-[11px] font-medium text-slate-500 mb-1 px-1">
          {searchQuery ? `Matching emojis (${filteredEmojis.length})` : currentCategory.name}
        </div>
        <div className="grid grid-cols-7 sm:grid-cols-8 gap-1.5 items-center justify-items-center">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              type="button"
              onClick={() => handleEmojiClick(emoji)}
              className="w-9 h-9 flex items-center justify-center text-2xl rounded-lg active:scale-125 transition-transform hover:bg-black/5 dark:hover:bg-white/10"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Category Dock & Controls */}
      <div 
        className="flex items-center justify-between px-2 py-1.5 border-t"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          backgroundColor: isDark ? '#2c2c2e' : '#e5e7eb',
        }}
      >
        {/* ABC Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playModifierClick();
            onBackToAlphabet();
          }}
          className="px-3 py-1 text-xs font-semibold rounded-md shadow-sm active:scale-95 transition-all"
          style={{
            backgroundColor: isDark ? '#505054' : '#FFFFFF',
            color: isDark ? '#FFFFFF' : '#000000',
          }}
        >
          ABC
        </button>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto px-1">
          {EMOJI_CATEGORIES.map((cat) => {
            const isActive = activeCategoryId === cat.id && !searchQuery;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundEngine.playModifierClick();
                  setActiveCategoryId(cat.id);
                  setSearchQuery('');
                }}
                title={cat.name}
                className={`p-1.5 rounded-full transition-all ${
                  isActive 
                    ? isDark ? 'bg-white/20 text-white' : 'bg-black/15 text-slate-900' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {getCategoryIcon(cat.id)}
              </button>
            );
          })}
        </div>

        {/* Backspace Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playDeleteClick();
            onBackspace();
          }}
          className="p-1.5 rounded-md active:scale-95 transition-all"
          style={{
            backgroundColor: isDark ? '#3a3a3c' : '#a6afb8',
            color: isDark ? '#FFFFFF' : '#000000',
          }}
        >
          <Delete className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};

import { KeyboardLayoutData, KeyboardButtonData } from '../types/keyboard';

// Alternate characters for accent popovers
export const LATIN_ALTERNATES: Record<string, string[]> = {
  e: ['é', 'è', 'ê', 'ë', 'ē', 'ė', 'ę'],
  E: ['É', 'È', 'Ê', 'Ë', 'Ē', 'Ė', 'Ę'],
  a: ['à', 'á', 'â', 'ä', 'æ', 'ã', 'å', 'ā'],
  A: ['À', 'Á', 'Â', 'Ä', 'Æ', 'Ã', 'Å', 'Ā'],
  i: ['î', 'ï', 'í', 'ī', 'į', 'ì'],
  I: ['Î', 'Ï', 'Í', 'Ī', 'Į', 'Ì'],
  o: ['ô', 'ö', 'ò', 'ó', 'œ', 'ø', 'ō', 'õ'],
  O: ['Ô', 'Ö', 'Ò', 'Ó', 'Œ', 'Ø', 'Ō', 'Õ'],
  u: ['û', 'ü', 'ù', 'ú', 'ū'],
  U: ['Û', 'Ü', 'Ù', 'Ú', 'Ū'],
  s: ['ß', 'ś', 'š'],
  S: ['Ś', 'Š', 'ẞ'],
  c: ['ç', 'ć', 'č'],
  C: ['Ç', 'Ć', 'Č'],
  n: ['ñ', 'ń'],
  N: ['Ñ', 'Ń'],
  y: ['ÿ'],
  Y: ['Ÿ'],
  $: ['€', '£', '¥', '₩', '₽', '¢'],
  '?': ['¿'],
  '!': ['¡'],
  '-': ['—', '–', '·'],
  '/': ['\\'],
  '%': ['‰'],
};

export const ARABIC_ALTERNATES: Record<string, string[]> = {
  ا: ['أ', 'إ', 'آ', 'ٱ', 'ء'],
  و: ['ؤ'],
  ي: ['ى', 'ئ', 'ي'],
  ه: ['ة', 'ه'],
  ت: ['ة'],
  '١': ['1'],
  '٢': ['2'],
  '٣': ['3'],
  '٤': ['4'],
  '٥': ['5'],
};

const makeKeyBtn = (char: string, altChars: string[] = []): KeyboardButtonData => ({
  id: `k_${char}`,
  type: { kind: 'key', char },
  width: { type: 'dynamic' },
  alternateCharacters: altChars,
});

export const createEnglishLayout = (theme: 'light' | 'dark' = 'light', shiftState: 'normal' | 'shift' | 'capslock' = 'normal'): KeyboardLayoutData => {
  const isShift = shiftState === 'shift' || shiftState === 'capslock';

  const row1Keys = isShift 
    ? ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
    : ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];

  const row2Keys = isShift
    ? ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
    : ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];

  const row3Keys = isShift
    ? ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    : ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  return {
    id: 'en_us_qwerty',
    name: 'English (US) QWERTY',
    style: {
      backgroundColor: theme === 'dark' ? '#1c1c1e' : '#d1d5db',
      topPadding: 8,
      bottomPadding: 8,
      leftPadding: 4,
      rightPadding: 4,
      theme,
    },
    rows: [
      {
        id: 'r1',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: row1Keys.map((c) => makeKeyBtn(c, LATIN_ALTERNATES[c] || [])),
      },
      {
        id: 'r2',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: [
          // Spacer for realistic iOS QWERTY row 2 indentation
          {
            id: 'spacer_left',
            type: { kind: 'text', text: '' },
            width: { type: 'relative', percent: 0.05 },
            style: { backgroundColor: 'transparent' },
          },
          ...row2Keys.map((c) => makeKeyBtn(c, LATIN_ALTERNATES[c] || [])),
          {
            id: 'spacer_right',
            type: { kind: 'text', text: '' },
            width: { type: 'relative', percent: 0.05 },
            style: { backgroundColor: 'transparent' },
          },
        ],
      },
      {
        id: 'r3',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: [
          {
            id: 'btn_shift',
            type: {
              kind: 'image',
              iconName: shiftState === 'capslock' ? 'capslock' : shiftState === 'shift' ? 'shift_active' : 'shift',
              actionId: 'toggle_shift',
              label: 'Shift',
            },
            width: { type: 'static', points: 42 },
            style: { isModifier: true },
          },
          ...row3Keys.map((c) => makeKeyBtn(c, LATIN_ALTERNATES[c] || [])),
          {
            id: 'btn_backspace',
            type: {
              kind: 'image',
              iconName: 'backspace',
              actionId: 'backspace',
              label: 'Delete',
            },
            width: { type: 'static', points: 42 },
            style: { isModifier: true },
          },
        ],
      },
      {
        id: 'r4',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: [
          {
            id: 'btn_123',
            type: { kind: 'text', text: '123', actionId: 'mode_numbers' },
            width: { type: 'static', points: 44 },
            style: { isModifier: true, fontSize: 15 },
          },
          {
            id: 'btn_globe',
            type: { kind: 'image', iconName: 'globe', actionId: 'toggle_lang', label: 'Language' },
            width: { type: 'static', points: 38 },
            style: { isModifier: true },
          },
          {
            id: 'btn_mic',
            type: { kind: 'image', iconName: 'mic', actionId: 'dictation', label: 'Dictation' },
            width: { type: 'static', points: 38 },
            style: { isModifier: true },
          },
          {
            id: 'btn_space',
            type: { kind: 'text', text: 'space', actionId: 'space' },
            width: { type: 'dynamic' },
            style: { fontSize: 15 },
          },
          {
            id: 'btn_return',
            type: { kind: 'text', text: 'return', actionId: 'return' },
            width: { type: 'static', points: 76 },
            style: { isAction: true, fontSize: 15 },
          },
        ],
      },
    ],
  };
};

export const createArabicLayout = (theme: 'light' | 'dark' = 'light', isTashkeel: boolean = false): KeyboardLayoutData => {
  const row1 = ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج'];
  const row2 = ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'];
  const row3 = isTashkeel 
    ? ['َ', 'ً', 'ُ', 'ٌ', 'ِ', 'ٍ', 'ْ', 'ّ', 'ـ']
    : ['ئ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ'];

  return {
    id: 'ar_standard',
    name: 'Arabic (العربية)',
    style: {
      backgroundColor: theme === 'dark' ? '#1c1c1e' : '#d1d5db',
      topPadding: 8,
      bottomPadding: 8,
      leftPadding: 4,
      rightPadding: 4,
      theme,
    },
    rows: [
      {
        id: 'r1_ar',
        style: { rowHeight: 44, buttonPadding: 5 },
        items: row1.map((c) => makeKeyBtn(c, ARABIC_ALTERNATES[c] || [])),
      },
      {
        id: 'r2_ar',
        style: { rowHeight: 44, buttonPadding: 5 },
        items: row2.map((c) => makeKeyBtn(c, ARABIC_ALTERNATES[c] || [])),
      },
      {
        id: 'r3_ar',
        style: { rowHeight: 44, buttonPadding: 5 },
        items: [
          {
            id: 'btn_ar_diacritics',
            type: {
              kind: 'text',
              text: isTashkeel ? 'أ ب' : 'ً ُ ِ',
              actionId: 'toggle_tashkeel',
            },
            width: { type: 'static', points: 42 },
            style: { isModifier: true, fontSize: 13 },
          },
          ...row3.map((c) => makeKeyBtn(c, ARABIC_ALTERNATES[c] || [])),
          {
            id: 'btn_backspace_ar',
            type: {
              kind: 'image',
              iconName: 'backspace',
              actionId: 'backspace',
              label: 'حذف',
            },
            width: { type: 'static', points: 42 },
            style: { isModifier: true },
          },
        ],
      },
      {
        id: 'r4_ar',
        style: { rowHeight: 44, buttonPadding: 5 },
        items: [
          {
            id: 'btn_123_ar',
            type: { kind: 'text', text: '١٢٣', actionId: 'mode_numbers' },
            width: { type: 'static', points: 44 },
            style: { isModifier: true, fontSize: 15 },
          },
          {
            id: 'btn_globe_ar',
            type: { kind: 'image', iconName: 'globe', actionId: 'toggle_lang', label: 'اللغة' },
            width: { type: 'static', points: 38 },
            style: { isModifier: true },
          },
          {
            id: 'btn_mic_ar',
            type: { kind: 'image', iconName: 'mic', actionId: 'dictation', label: 'الإملاء' },
            width: { type: 'static', points: 38 },
            style: { isModifier: true },
          },
          {
            id: 'btn_space_ar',
            type: { kind: 'text', text: 'مسافة', actionId: 'space' },
            width: { type: 'dynamic' },
            style: { fontSize: 15 },
          },
          {
            id: 'btn_return_ar',
            type: { kind: 'text', text: 'ذهاب', actionId: 'return' },
            width: { type: 'static', points: 76 },
            style: { isAction: true, fontSize: 15 },
          },
        ],
      },
    ],
  };
};

export const createNumbersLayout = (theme: 'light' | 'dark' = 'light'): KeyboardLayoutData => {
  const row1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const row2 = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'];
  const row3 = ['.', ',', '?', '!', "'"];

  return {
    id: 'num_symbols',
    name: 'Numbers (123)',
    style: {
      backgroundColor: theme === 'dark' ? '#1c1c1e' : '#d1d5db',
      topPadding: 8,
      bottomPadding: 8,
      leftPadding: 4,
      rightPadding: 4,
      theme,
    },
    rows: [
      {
        id: 'r1_num',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: row1.map((c) => makeKeyBtn(c, c === '0' ? ['°'] : c === '1' ? ['¹', '½', '⅓', '¼'] : [])),
      },
      {
        id: 'r2_num',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: row2.map((c) => makeKeyBtn(c, LATIN_ALTERNATES[c] || [])),
      },
      {
        id: 'r3_num',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: [
          {
            id: 'btn_symbols_toggle',
            type: { kind: 'text', text: '#+=', actionId: 'mode_symbols' },
            width: { type: 'static', points: 46 },
            style: { isModifier: true, fontSize: 14 },
          },
          ...row3.map((c) => makeKeyBtn(c, LATIN_ALTERNATES[c] || [])),
          {
            id: 'btn_backspace_num',
            type: { kind: 'image', iconName: 'backspace', actionId: 'backspace', label: 'Delete' },
            width: { type: 'static', points: 46 },
            style: { isModifier: true },
          },
        ],
      },
      {
        id: 'r4_num',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: [
          {
            id: 'btn_abc_return',
            type: { kind: 'text', text: 'ABC', actionId: 'mode_letters' },
            width: { type: 'static', points: 52 },
            style: { isModifier: true, fontSize: 15 },
          },
          {
            id: 'btn_space_num',
            type: { kind: 'text', text: 'space', actionId: 'space' },
            width: { type: 'dynamic' },
            style: { fontSize: 15 },
          },
          {
            id: 'btn_return_num',
            type: { kind: 'text', text: 'return', actionId: 'return' },
            width: { type: 'static', points: 76 },
            style: { isAction: true, fontSize: 15 },
          },
        ],
      },
    ],
  };
};

export const createSymbolsLayout = (theme: 'light' | 'dark' = 'light'): KeyboardLayoutData => {
  const row1 = ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='];
  const row2 = ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'];
  const row3 = ['.', ',', '?', '!', "'"];

  return {
    id: 'special_symbols',
    name: 'Special Symbols (#+=)',
    style: {
      backgroundColor: theme === 'dark' ? '#1c1c1e' : '#d1d5db',
      topPadding: 8,
      bottomPadding: 8,
      leftPadding: 4,
      rightPadding: 4,
      theme,
    },
    rows: [
      {
        id: 'r1_sym',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: row1.map((c) => makeKeyBtn(c)),
      },
      {
        id: 'r2_sym',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: row2.map((c) => makeKeyBtn(c)),
      },
      {
        id: 'r3_sym',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: [
          {
            id: 'btn_123_back',
            type: { kind: 'text', text: '123', actionId: 'mode_numbers' },
            width: { type: 'static', points: 46 },
            style: { isModifier: true, fontSize: 14 },
          },
          ...row3.map((c) => makeKeyBtn(c)),
          {
            id: 'btn_backspace_sym',
            type: { kind: 'image', iconName: 'backspace', actionId: 'backspace', label: 'Delete' },
            width: { type: 'static', points: 46 },
            style: { isModifier: true },
          },
        ],
      },
      {
        id: 'r4_sym',
        style: { rowHeight: 44, buttonPadding: 6 },
        items: [
          {
            id: 'btn_abc_from_sym',
            type: { kind: 'text', text: 'ABC', actionId: 'mode_letters' },
            width: { type: 'static', points: 52 },
            style: { isModifier: true, fontSize: 15 },
          },
          {
            id: 'btn_space_sym',
            type: { kind: 'text', text: 'space', actionId: 'space' },
            width: { type: 'dynamic' },
            style: { fontSize: 15 },
          },
          {
            id: 'btn_return_sym',
            type: { kind: 'text', text: 'return', actionId: 'return' },
            width: { type: 'static', points: 76 },
            style: { isAction: true, fontSize: 15 },
          },
        ],
      },
    ],
  };
};

export const EMOJI_CATEGORIES = [
  {
    id: 'frequent',
    name: 'Frequently Used',
    nameAr: 'المستخدمة حديثاً',
    emojis: ['😂', '❤️', '🔥', '👍', '🙏', '✨', '😊', '😍', '🎉', '👏', '🚀', '💯'],
  },
  {
    id: 'smileys',
    name: 'Smileys & People',
    nameAr: 'الوجوه والأشخاص',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊',
      '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
      '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏',
      '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
    ],
  },
  {
    id: 'gestures',
    name: 'Hands & Gestures',
    nameAr: 'الأيدي والإيماءات',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟',
      '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊',
      '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪',
    ],
  },
  {
    id: 'nature',
    name: 'Animals & Nature',
    nameAr: 'الحيوانات والطبيعة',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
      '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴',
      '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🌸', '🌹', '🌺', '🌻', '🌴',
    ],
  },
  {
    id: 'food',
    name: 'Food & Drink',
    nameAr: 'الطعام والشراب',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒',
      '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍔', '🍟', '🍕', '🌭', '🥪',
      '🌮', '🌯', '☕', '🍵', '🧃', '🥤', '🍺', '🍻', '🥂', '🍷', '🍰', '🍩',
    ],
  },
  {
    id: 'objects',
    name: 'Objects & Symbols',
    nameAr: 'الأشياء والرموز',
    emojis: [
      '📱', '💻', '⌨️', '🖥️', '⌚', '📷', '💡', '🔦', '📖', '📚', '💰', '💳',
      '💎', '🔧', '🔨', '✉️', '📦', '🎁', '🎈', '🏆', '⚽', '🏀', '🎮', '🎧',
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕',
    ],
  },
];

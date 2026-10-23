/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { IPhoneDeviceFrame } from './components/IPhoneDeviceFrame';
import { SwiftCodeModal } from './components/SwiftCodeModal';
import { LayoutEditorModal } from './components/LayoutEditorModal';
import { BuildApkModal } from './components/BuildApkModal';
import { KeyboardLayoutData } from './types/keyboard';
import { 
  createEnglishLayout, 
  createArabicLayout, 
  createNumbersLayout, 
  createSymbolsLayout 
} from './layouts/presets';
import { soundEngine } from './audio/iosSoundEngine';
import { 
  Sliders, 
  Code2, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  Languages, 
  Layers,
  Smartphone,
  Tablet,
  ExternalLink,
  Keyboard
} from 'lucide-react';

export default function App() {
  const [text, setText] = useState('Welcome to iOS Keyboard Layout Engine. اضغط على أي زر لتجربة لوحة المفاتيح.');
  const [cursorPosition, setCursorPosition] = useState(text.length);
  const [isDark, setIsDark] = useState(false);
  const [isArabicUI, setIsArabicUI] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<'en' | 'ar' | 'numbers' | 'symbols' | 'custom'>('en');
  const [customLayout, setCustomLayout] = useState<KeyboardLayoutData | null>(null);
  const [viewMode, setViewMode] = useState<'iphone' | 'workbench'>('iphone');

  // Modals
  const [isSwiftModalOpen, setIsSwiftModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.65);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Manage text editing
  const handleInsertText = (inserted: string) => {
    const next = text.slice(0, cursorPosition) + inserted + text.slice(cursorPosition);
    setText(next);
    setCursorPosition(cursorPosition + inserted.length);
  };

  const handleBackspace = () => {
    if (cursorPosition === 0) return;
    const next = text.slice(0, cursorPosition - 1) + text.slice(cursorPosition);
    setText(next);
    setCursorPosition(cursorPosition - 1);
  };

  const handleReturn = () => {
    handleInsertText('\n');
  };

  const handleMoveCursor = (delta: number) => {
    setCursorPosition((prev) => Math.max(0, Math.min(text.length, prev + delta)));
  };

  const handleClearText = () => {
    setText('');
    setCursorPosition(0);
  };

  const handleInsertSampleText = () => {
    const sample = isArabicUI 
      ? 'لوحة مفاتيح iOS احترافية تدعم الكتابة باللغة العربية والإنجليزية، وتخطيط الصفوف الديناميكي حسب مكتبة KeyboardLayoutEngine.'
      : 'Experience high-fidelity iOS keyboard physics, haptic clicks, accent popovers, and Swift code generation based on cemolcay/KeyboardLayoutEngine.';
    setText(sample);
    setCursorPosition(sample.length);
  };

  // Get current active layout data for inspector & Swift export
  const getCurrentLayoutData = (): KeyboardLayoutData => {
    if (customLayout) return customLayout;
    if (selectedPreset === 'ar') return createArabicLayout(isDark ? 'dark' : 'light');
    if (selectedPreset === 'numbers') return createNumbersLayout(isDark ? 'dark' : 'light');
    if (selectedPreset === 'symbols') return createSymbolsLayout(isDark ? 'dark' : 'light');
    return createEnglishLayout(isDark ? 'dark' : 'light');
  };

  const activeLayoutData = getCurrentLayoutData();

  const handleVolumeChange = (vol: number) => {
    setSoundVolume(vol);
    soundEngine.volume = vol;
    if (vol > 0 && !soundEnabled) {
      setSoundEnabled(true);
      soundEngine.enabled = true;
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const totalKeys = activeLayoutData.rows.reduce((acc, row) => acc + row.items.length, 0);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex flex-col font-sans transition-colors duration-200`}>
      {/* Top Bar following Top Bar Contract: 3 zones, 1 row */}
      <header className={`h-16 px-6 border-b flex items-center justify-between gap-8 shrink-0 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md sticky top-0 z-40`}>
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Keyboard className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight whitespace-nowrap">
            {isArabicUI ? 'محرك لوحة مفاتيح iOS' : 'iOS Keyboard Layout Studio'}
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap">
            {isArabicUI ? 'المحاكي المباشر' : 'Live Simulator'}
          </span>
          <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap">
            {isArabicUI ? 'بنية KeyboardLayoutEngine' : 'Layout Engine Architecture'}
          </span>
          <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap">
            {isArabicUI ? 'دعم العربية والإنجليزية' : 'Bilingual Keycaps'}
          </span>
          <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap">
            {isArabicUI ? 'تصدير Swift' : 'Swift Export'}
          </span>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Toggle (EN / عربي) */}
          <button
            type="button"
            onClick={() => setIsArabicUI(!isArabicUI)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              isDark ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
            title="تبديل لغة الواجهة"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isArabicUI ? 'English' : 'عربي'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg border transition-colors ${
              isDark ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-amber-300' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Build APK GitHub Button */}
          <button
            type="button"
            onClick={() => setIsApkModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isArabicUI ? 'بناء APK (GitHub)' : 'Build APK (GitHub)'}</span>
          </button>

          {/* Primary CTA: Export Swift */}
          <button
            type="button"
            onClick={() => setIsSwiftModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{isArabicUI ? 'تصدير كود Swift' : 'Export Swift'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Device Simulator & Live Keyboard Interaction */}
        <div className="flex-1 w-full flex flex-col items-center">
          {/* Viewport switch toolbar */}
          <div className="w-full max-w-[400px] mb-3 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {isArabicUI ? 'محاكي آيفون 16 برو' : 'iPhone 16 Pro Simulator'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">
                iOS 18
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleInsertSampleText}
                className="hover:text-blue-500 flex items-center gap-1 transition-colors"
                title="Fill with sample text"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isArabicUI ? 'نص تجريبي' : 'Sample'}</span>
              </button>
              <button
                type="button"
                onClick={handleClearText}
                className="hover:text-red-500 flex items-center gap-1 transition-colors"
                title="Clear text"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isArabicUI ? 'مسح' : 'Clear'}</span>
              </button>
            </div>
          </div>

          {/* iPhone Mockup Frame */}
          <IPhoneDeviceFrame
            text={text}
            cursorPosition={cursorPosition}
            onInsertText={handleInsertText}
            onBackspace={handleBackspace}
            onReturn={handleReturn}
            onMoveCursor={handleMoveCursor}
            onClearText={handleClearText}
            isDark={isDark}
            onToggleTheme={() => setIsDark(!isDark)}
            customLayout={customLayout}
            isArabicUI={isArabicUI}
          />

          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 text-center max-w-sm">
            {isArabicUI
              ? '💡 جرب الضغط المطول على مفتاح المسافة لتحريك المؤشر، أو الضغط المطول على الحروف لإظهار التشكيل والحركات والهمزات.'
              : '💡 Tip: Long-press Spacebar to drag the cursor. Long-press characters (e, a, $, etc.) for accented alternates.'}
          </p>
        </div>

        {/* Right Column: Layout Engine Inspector & Control Deck */}
        <div className="w-full lg:w-96 flex flex-col gap-5">
          {/* Layout Presets Card */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold">
                  {isArabicUI ? 'تخطيطات لوحة المفاتيح' : 'Layout Presets'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorModalOpen(true)}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                <Sliders className="w-3 h-3" />
                <span>{isArabicUI ? 'تعديل التخطيط' : 'Architect'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPreset('en');
                  setCustomLayout(null);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                  selectedPreset === 'en' && !customLayout
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                    : isDark ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>🇺🇸 English (US)</span>
                <span className="text-[10px] opacity-60">QWERTY</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPreset('ar');
                  setCustomLayout(null);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                  selectedPreset === 'ar' && !customLayout
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                    : isDark ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>🇸🇦 العربية</span>
                <span className="text-[10px] opacity-60">Standard</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPreset('numbers');
                  setCustomLayout(null);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                  selectedPreset === 'numbers' && !customLayout
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                    : isDark ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>🔢 Numbers</span>
                <span className="text-[10px] opacity-60">123</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPreset('symbols');
                  setCustomLayout(null);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                  selectedPreset === 'symbols' && !customLayout
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                    : isDark ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>🔣 Symbols</span>
                <span className="text-[10px] opacity-60">#+=</span>
              </button>
            </div>

            {customLayout && (
              <div className="mt-2.5 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs flex items-center justify-between">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  {isArabicUI ? 'تخطيط مخصص نشط' : 'Active Custom Layout'}
                </span>
                <button
                  type="button"
                  onClick={() => setCustomLayout(null)}
                  className="text-red-500 hover:underline text-[11px]"
                >
                  {isArabicUI ? 'استعادة الافتراضي' : 'Reset'}
                </button>
              </div>
            )}
          </div>

          {/* Sound & Haptic Synthesizer Controls */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <h3 className="text-sm font-semibold">
                  {isArabicUI ? 'أصوات النقر واللمس (Web Audio)' : 'iOS Audio Clicks & Haptics'}
                </h3>
              </div>
              <button
                type="button"
                onClick={toggleSound}
                className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                  soundEnabled 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                }`}
              >
                {soundEnabled ? (isArabicUI ? 'مفعّل' : 'Enabled') : (isArabicUI ? 'مكتوم' : 'Muted')}
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              {isArabicUI
                ? 'توليد أصوات نقرات iOS الأصلية ديناميكياً باستخدام Web Audio API بدون ملفات خارجية.'
                : 'Synthesizes realistic iOS mechanical key clicks, modifier drops, and deletion clicks via Web Audio API.'}
            </p>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="flex-1 accent-blue-600 cursor-pointer"
              />
              <span className="text-xs font-mono tabular-nums text-slate-400 w-8 text-right">
                {Math.round(soundVolume * 100)}%
              </span>
            </div>
          </div>

          {/* Engine Architecture & Metrics Card */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col gap-3.5`}>
            <div className="flex items-center justify-between border-b pb-2.5 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {isArabicUI ? 'مواصفات التخطيط' : 'KeyboardLayout Engine Specs'}
              </span>
              <a
                href="https://github.com/cemolcay/KeyboardLayoutEngine"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500 hover:underline flex items-center gap-1"
              >
                cemolcay Repo <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-medium">Rows</span>
                <span className="text-base font-bold tabular-nums text-slate-800 dark:text-slate-200">
                  {activeLayoutData.rows.length}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-medium">Active Keys</span>
                <span className="text-base font-bold tabular-nums text-slate-800 dark:text-slate-200">
                  {totalKeys}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-medium">Typed Characters</span>
                <span className="text-base font-bold tabular-nums text-slate-800 dark:text-slate-200">
                  {text.length}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-medium">Word Count</span>
                <span className="text-base font-bold tabular-nums text-slate-800 dark:text-slate-200">
                  {wordCount}
                </span>
              </div>
            </div>

            {/* Architecture breakdown */}
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span>Layout Model:</span>
                <code className="text-[11px] font-mono text-blue-500">KeyboardLayout</code>
              </div>
              <div className="flex items-center justify-between">
                <span>Row Container:</span>
                <code className="text-[11px] font-mono text-blue-500">KeyboardRow</code>
              </div>
              <div className="flex items-center justify-between">
                <span>Key Views:</span>
                <code className="text-[11px] font-mono text-blue-500">KeyboardButton</code>
              </div>
              <div className="flex items-center justify-between">
                <span>Width Strategy:</span>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  .Dynamic · .Static · .Relative
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsApkModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isArabicUI ? 'بناء وتصدير APK عبر GitHub' : 'Build & Export APK (GitHub Actions)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditorModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isArabicUI ? 'تخصيص وتعديل الصفوف' : 'Customize Layout Rows'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSwiftModalOpen(true)}
                className="w-full py-2.5 rounded-xl border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{isArabicUI ? 'عرض كود Swift المولد' : 'View Generated Swift Code'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SwiftCodeModal
        layout={activeLayoutData}
        isOpen={isSwiftModalOpen}
        onClose={() => setIsSwiftModalOpen(false)}
        isArabicUI={isArabicUI}
      />

      <LayoutEditorModal
        initialLayout={activeLayoutData}
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        onSave={(newLayout) => setCustomLayout(newLayout)}
        isArabicUI={isArabicUI}
      />

      <BuildApkModal
        layout={activeLayoutData}
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        isArabicUI={isArabicUI}
      />
    </div>
  );
}

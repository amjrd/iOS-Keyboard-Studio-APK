import React, { useState } from 'react';
import { KeyboardLayoutData } from '../types/keyboard';
import { generateSwiftCode } from '../utils/swiftExporter';
import { Copy, Check, X, Code2, ExternalLink } from 'lucide-react';

interface SwiftCodeModalProps {
  layout: KeyboardLayoutData;
  isOpen: boolean;
  onClose: () => void;
  isArabicUI?: boolean;
}

export const SwiftCodeModal: React.FC<SwiftCodeModalProps> = ({
  layout,
  isOpen,
  onClose,
  isArabicUI = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const swiftCode = generateSwiftCode(layout);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(swiftCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {isArabicUI ? 'تصدير كود Swift (KeyboardLayoutEngine)' : 'Swift Code Export (KeyboardLayoutEngine)'}
              </h3>
              <p className="text-xs text-slate-400">
                {isArabicUI 
                  ? 'متوافق 100% مع مكتبة cemolcay/KeyboardLayoutEngine لتطبيقات iOS'
                  : '100% compatible with cemolcay/KeyboardLayoutEngine for Xcode & iOS'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar info */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <span>Framework: <strong className="text-slate-200">KeyboardLayoutEngine</strong></span>
            <span>·</span>
            <a 
              href="https://github.com/cemolcay/KeyboardLayoutEngine" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 text-blue-400 hover:underline"
            >
              GitHub Repo <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>{isArabicUI ? 'تم النسخ!' : 'Copied to Clipboard!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isArabicUI ? 'نسخ كود Swift' : 'Copy Swift Code'}</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs leading-relaxed text-slate-300 select-text">
          <pre className="whitespace-pre">{swiftCode}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Target: iOS Custom Keyboard Extension (UIInputViewController)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            {isArabicUI ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

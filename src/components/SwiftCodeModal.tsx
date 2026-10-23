import React, { useState } from 'react';
import { KeyboardLayoutData } from '../types/keyboard';
import { generateSwiftCode } from '../utils/swiftExporter';
import { generateReactorKitSwiftCode } from '../utils/swiftReactorExporter';
import { Copy, Check, X, Code2, ExternalLink, Zap, Layers } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'reactorkit' | 'layout-engine'>('reactorkit');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reactorCode = generateReactorKitSwiftCode(layout);
  const layoutCode = generateSwiftCode(layout);

  const currentCode = activeTab === 'reactorkit' ? reactorCode : layoutCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[88vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {isArabicUI ? 'تصدير كود Swift (ReactorKit + KeyboardLayoutEngine)' : 'Swift Code Export (ReactorKit + KeyboardLayoutEngine)'}
              </h3>
              <p className="text-xs text-slate-400">
                {isArabicUI 
                  ? 'هيكلية تفاعلية متكاملة لتطبيقات iOS Custom Keyboard Extensions'
                  : 'Unidirectional Reactive Architecture for iOS Custom Keyboard Extensions'}
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

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-6 bg-slate-950/70 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('reactorkit')}
              className={`py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'reactorkit'
                  ? 'border-purple-500 text-purple-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isArabicUI ? 'بنية ReactorKit (Action/Mutation/State)' : 'KeyboardViewReactor.swift (ReactorKit)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('layout-engine')}
              className={`py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'layout-engine'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isArabicUI ? 'تخطيط الأزرار (KeyboardLayoutEngine)' : 'CustomKeyboardLayout.swift (Cem Olcay)'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>{isArabicUI ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isArabicUI ? 'نسخ الكود' : 'Copy Swift'}</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs leading-relaxed text-slate-300 select-text">
          <pre className="whitespace-pre">{currentCode}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>Dependencies:</span>
            <span className="font-mono text-purple-400">ReactorKit (v3.2+)</span>
            <span>·</span>
            <span className="font-mono text-blue-400">KeyboardLayoutEngine</span>
            <span>·</span>
            <span className="font-mono text-emerald-400">RxSwift</span>
          </div>
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

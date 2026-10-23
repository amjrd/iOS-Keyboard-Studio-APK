import React, { useState } from 'react';
import { ReactorLogEntry } from '../reactor/keyboardReactor';
import { Activity, ArrowRight, Zap, RefreshCw, Layers, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface ReactorKitInspectorProps {
  history: ReactorLogEntry[];
  currentMode: string;
  shiftState: string;
  language: string;
  onOpenSwiftModal: () => void;
  isArabicUI?: boolean;
}

export const ReactorKitInspector: React.FC<ReactorKitInspectorProps> = ({
  history,
  currentMode,
  shiftState,
  language,
  onOpenSwiftModal,
  isArabicUI = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden text-xs">
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>{isArabicUI ? 'محرك بنية ReactorKit الأحادي' : 'ReactorKit Unidirectional Stream'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-mono">
                RxFlow
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSwiftModal();
            }}
            className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline font-medium"
          >
            {isArabicUI ? 'كود ReactorKit Swift' : 'Reactor Swift Code'}
          </button>
          <button type="button" className="text-slate-400">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 flex flex-col gap-3">
          {/* ReactorKit Flow Diagram */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-center font-mono text-[10px]">
            <div className="flex-1">
              <span className="text-blue-500 block font-bold">View</span>
              <span className="text-slate-400 text-[9px]">UIInputView</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <div className="flex-1">
              <span className="text-amber-500 block font-bold">Action</span>
              <span className="text-slate-400 text-[9px]">onNext()</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <div className="flex-1">
              <span className="text-purple-500 block font-bold">mutate()</span>
              <span className="text-slate-400 text-[9px]">Observable</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <div className="flex-1">
              <span className="text-emerald-500 block font-bold">reduce()</span>
              <span className="text-slate-400 text-[9px]">New State</span>
            </div>
          </div>

          {/* Current State Badges */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Mode: <strong className="text-slate-800 dark:text-slate-200 uppercase">{currentMode}</strong></span>
            <span>·</span>
            <span>Shift: <strong className="text-slate-800 dark:text-slate-200">{shiftState}</strong></span>
            <span>·</span>
            <span>Lang: <strong className="text-slate-800 dark:text-slate-200 uppercase">{language}</strong></span>
          </div>

          {/* Live Reactive Events Log */}
          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto font-mono text-[11px] pr-1 scrollbar-thin">
            {history.slice(0, 7).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-950/80 border border-slate-200/50 dark:border-slate-800/60"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="text-amber-600 dark:text-amber-400 font-semibold truncate">
                    {entry.action}
                  </span>
                  <span className="text-slate-400">&rarr;</span>
                  <span className="text-emerald-600 dark:text-emerald-400 truncate">
                    {entry.mutation}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">
                  {entry.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

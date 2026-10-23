import React, { useState } from 'react';
import { KeyboardLayoutData, KeyboardRowData, KeyboardButtonData } from '../types/keyboard';
import { Plus, Trash2, Sliders, X, Check, Undo } from 'lucide-react';

interface LayoutEditorModalProps {
  initialLayout: KeyboardLayoutData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (layout: KeyboardLayoutData) => void;
  isArabicUI?: boolean;
}

export const LayoutEditorModal: React.FC<LayoutEditorModalProps> = ({
  initialLayout,
  isOpen,
  onClose,
  onSave,
  isArabicUI = false,
}) => {
  const [layout, setLayout] = useState<KeyboardLayoutData>(JSON.parse(JSON.stringify(initialLayout)));
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [newChar, setNewChar] = useState('');

  if (!isOpen) return null;

  const currentRow: KeyboardRowData | undefined = layout.rows[selectedRowIndex];

  const handleAddButton = () => {
    if (!currentRow || !newChar.trim()) return;
    const newBtn: KeyboardButtonData = {
      id: `btn_custom_${Date.now()}`,
      type: { kind: 'key', char: newChar.trim() },
      width: { type: 'dynamic' },
    };
    const updatedRows = [...layout.rows];
    updatedRows[selectedRowIndex] = {
      ...currentRow,
      items: [...currentRow.items, newBtn],
    };
    setLayout({ ...layout, rows: updatedRows });
    setNewChar('');
  };

  const handleRemoveButton = (btnId: string) => {
    if (!currentRow) return;
    const updatedRows = [...layout.rows];
    updatedRows[selectedRowIndex] = {
      ...currentRow,
      items: currentRow.items.filter((b) => b.id !== btnId),
    };
    setLayout({ ...layout, rows: updatedRows });
  };

  const handleButtonWidthChange = (btnId: string, widthType: 'dynamic' | 'static' | 'relative', value?: number) => {
    if (!currentRow) return;
    const updatedRows = [...layout.rows];
    updatedRows[selectedRowIndex] = {
      ...currentRow,
      items: currentRow.items.map((b) => {
        if (b.id !== btnId) return b;
        if (widthType === 'dynamic') return { ...b, width: { type: 'dynamic' } };
        if (widthType === 'static') return { ...b, width: { type: 'static', points: value || 42 } };
        return { ...b, width: { type: 'relative', percent: value || 0.2 } };
      }),
    };
    setLayout({ ...layout, rows: updatedRows });
  };

  const handleAddRow = () => {
    const newRow: KeyboardRowData = {
      id: `row_${Date.now()}`,
      style: { rowHeight: 44, buttonPadding: 6 },
      items: [
        { id: `btn_${Date.now()}_1`, type: { kind: 'key', char: 'A' }, width: { type: 'dynamic' } },
        { id: `btn_${Date.now()}_2`, type: { kind: 'key', char: 'B' }, width: { type: 'dynamic' } },
        { id: `btn_${Date.now()}_3`, type: { kind: 'key', char: 'C' }, width: { type: 'dynamic' } },
      ],
    };
    setLayout({ ...layout, rows: [...layout.rows, newRow] });
    setSelectedRowIndex(layout.rows.length);
  };

  const handleRemoveRow = (index: number) => {
    if (layout.rows.length <= 1) return;
    const updated = layout.rows.filter((_, i) => i !== index);
    setLayout({ ...layout, rows: updated });
    setSelectedRowIndex(Math.max(0, index - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {isArabicUI ? 'محرر تخطيط KeyboardLayoutEngine' : 'KeyboardLayoutEngine Architect'}
              </h3>
              <p className="text-xs text-slate-400">
                {isArabicUI 
                  ? 'تعديل الصفوف والأزرار وأحجام .dynamic / .static / .relative مباشرة'
                  : 'Customize KeyboardRows, buttons, and .dynamic / .static / .relative widths'}
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

        {/* Body Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Rows Sidebar */}
          <div className="w-full md:w-64 p-4 bg-slate-950/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {isArabicUI ? 'صفوف لوحة المفاتيح' : 'Keyboard Rows'}
              </span>
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabicUI ? 'إضافة صف' : 'Add Row'}</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5 overflow-y-auto">
              {layout.rows.map((row, idx) => (
                <div
                  key={row.id}
                  onClick={() => setSelectedRowIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs font-medium transition-all ${
                    selectedRowIndex === idx
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{isArabicUI ? `الصف ${idx + 1}` : `Row ${idx + 1}`}</span>
                    <span className="text-[10px] opacity-75">({row.items.length} keys)</span>
                  </div>
                  {layout.rows.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRow(idx);
                      }}
                      className="p-1 text-red-300 hover:text-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Layout Insets */}
            <div className="mt-auto pt-3 border-t border-slate-800 text-xs flex flex-col gap-2">
              <span className="text-slate-400 font-medium">
                {isArabicUI ? 'هوامش التخطيط (Padding)' : 'Layout Padding (pt)'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500">Top</label>
                  <input
                    type="number"
                    value={layout.style.topPadding}
                    onChange={(e) => setLayout({ ...layout, style: { ...layout.style, topPadding: Number(e.target.value) } })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Bottom</label>
                  <input
                    type="number"
                    value={layout.style.bottomPadding}
                    onChange={(e) => setLayout({ ...layout, style: { ...layout.style, bottomPadding: Number(e.target.value) } })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Row Button Inspector */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
            {currentRow && (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-semibold text-white">
                    {isArabicUI ? `تعديل عناصر الصف ${selectedRowIndex + 1}` : `Editing Row ${selectedRowIndex + 1} Keys`}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Row Height:</span>
                    <input
                      type="number"
                      value={currentRow.style.rowHeight}
                      onChange={(e) => {
                        const updated = [...layout.rows];
                        updated[selectedRowIndex].style.rowHeight = Number(e.target.value);
                        setLayout({ ...layout, rows: updated });
                      }}
                      className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                    />
                    <span className="text-xs text-slate-400">Gap:</span>
                    <input
                      type="number"
                      value={currentRow.style.buttonPadding}
                      onChange={(e) => {
                        const updated = [...layout.rows];
                        updated[selectedRowIndex].style.buttonPadding = Number(e.target.value);
                        setLayout({ ...layout, rows: updated });
                      }}
                      className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Add new key bar */}
                <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    placeholder={isArabicUI ? 'حرف جديد (مثال: أ أو Z)...' : 'New character or symbol (e.g. #)...'}
                    value={newChar}
                    onChange={(e) => setNewChar(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-1 text-xs text-white outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddButton();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddButton}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isArabicUI ? 'إضافة زر' : 'Add Key'}</span>
                  </button>
                </div>

                {/* Keys list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentRow.items.map((btn) => (
                    <div
                      key={btn.id}
                      className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-white text-sm">
                            {btn.type.kind === 'key' ? btn.type.char : btn.type.kind === 'text' ? btn.type.text : 'icon'}
                          </span>
                          <span className="text-xs text-slate-300 font-mono truncate max-w-[100px]">
                            {btn.id}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveButton(btn.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Width Type Selector (.Dynamic / .Static / .Relative) */}
                      <div className="flex items-center gap-1.5 text-[11px] pt-1 border-t border-slate-800/60">
                        <span className="text-slate-400">Width:</span>
                        <select
                          value={btn.width.type}
                          onChange={(e) => handleButtonWidthChange(btn.id, e.target.value as 'dynamic' | 'static' | 'relative')}
                          className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-slate-200 text-xs"
                        >
                          <option value="dynamic">Dynamic</option>
                          <option value="static">Static (pt)</option>
                          <option value="relative">Relative (%)</option>
                        </select>

                        {btn.width.type === 'static' && (
                          <input
                            type="number"
                            value={btn.width.points}
                            onChange={(e) => handleButtonWidthChange(btn.id, 'static', Number(e.target.value))}
                            className="w-14 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-white"
                          />
                        )}
                        {btn.width.type === 'relative' && (
                          <input
                            type="number"
                            step="0.05"
                            value={btn.width.percent}
                            onChange={(e) => handleButtonWidthChange(btn.id, 'relative', Number(e.target.value))}
                            className="w-14 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-white"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setLayout(JSON.parse(JSON.stringify(initialLayout)))}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            <Undo className="w-3.5 h-3.5" />
            <span>{isArabicUI ? 'إعادة ضبط' : 'Reset to Default'}</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              {isArabicUI ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(layout);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isArabicUI ? 'تطبيق التخطيط' : 'Apply Layout'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

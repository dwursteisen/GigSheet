import { Printer, FileText, Volume2, Lightbulb } from 'lucide-react';
import { useAppState, useAppDispatch } from '@/store/context';
import type { ExportSubTab } from '@/types';
import { RundownDocument } from '@/components/export/RundownDocument';
import { SoundSheetDocument } from '@/components/export/SoundSheetDocument';
import { LightingSheetDocument } from '@/components/export/LightingSheetDocument';

const subTabs: { id: ExportSubTab; icon: typeof FileText; label: string }[] = [
  { id: 'rundown', icon: FileText, label: 'Conduite' },
  { id: 'sound', icon: Volume2, label: 'Fiche Son' },
  { id: 'lighting', icon: Lightbulb, label: 'Fiche Lumière' },
];

export function Export() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { activeExportSubTab } = state.ui;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 no-print">
        <div className="flex items-center gap-1">
          {subTabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => dispatch({ type: 'ui/setExportSubTab', subTab: id })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] transition-colors ${
                activeExportSubTab === id
                  ? 'bg-console-highlight text-accent'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded text-[11px] font-bold hover:bg-amber-600 transition-colors"
        >
          <Printer size={12} />
          Imprimer / PDF
        </button>
      </div>

      <div className="print-document bg-white text-black p-8 rounded shadow-lg max-w-[210mm] mx-auto">
        {activeExportSubTab === 'rundown' && <RundownDocument />}
        {activeExportSubTab === 'sound' && <SoundSheetDocument />}
        {activeExportSubTab === 'lighting' && <LightingSheetDocument />}
      </div>
    </div>
  );
}

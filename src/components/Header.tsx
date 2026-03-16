import { Save, Download, Upload, FilePlus } from 'lucide-react';
import { useAppState, useAppDispatch } from '@/store/context';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { useMasterClock } from '@/hooks/useMasterClock';
import { useRef } from 'react';
import { demoProject } from '@/data/demoData';

export function Header() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { exportProject, importProject, newProject, quickSave } = useProjectStorage(state.project, dispatch);
  const clock = useMasterClock();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <header className="col-span-2 flex items-center gap-3 px-4 py-2 bg-console-surface border-b border-console-border no-print">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-accent font-bold text-sm tracking-wider">GIGSHEET</span>
        <span className="text-gray-500 text-xs">|</span>
        <span className="text-xs text-gray-700 truncate">{state.project.bandName}</span>
        <span className="text-gray-400 text-xs">—</span>
        <span className="text-xs text-gray-500 truncate">{state.project.name}</span>
      </div>

      <div className="flex items-center gap-1">
        {state.ui.isDirty && (
          <span className="text-[10px] text-vu-yellow px-1.5 py-0.5 rounded bg-yellow-100 mr-1">
            NON SAUVÉ
          </span>
        )}
        {!state.ui.isDirty && state.ui.lastSaved && (
          <span className="text-[10px] text-vu-green px-1.5 py-0.5 rounded bg-green-100 mr-1">
            SAUVÉ
          </span>
        )}

        <button onClick={quickSave} title="Quick Save (Ctrl+S)" className="p-1.5 hover:bg-console-highlight rounded text-gray-500 hover:text-accent transition-colors">
          <Save size={14} />
        </button>
        <button onClick={exportProject} title="Exporter JSON" className="p-1.5 hover:bg-console-highlight rounded text-gray-500 hover:text-accent transition-colors">
          <Upload size={14} />
        </button>
        <button onClick={() => fileRef.current?.click()} title="Importer JSON" className="p-1.5 hover:bg-console-highlight rounded text-gray-500 hover:text-accent transition-colors">
          <Download size={14} />
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importProject(f);
          e.target.value = '';
        }} />
        <button onClick={() => {
          if (confirm('Créer un nouveau projet ? Les données non sauvées seront perdues.')) {
            newProject(demoProject);
          }
        }} title="Nouveau projet" className="p-1.5 hover:bg-console-highlight rounded text-gray-500 hover:text-accent transition-colors">
          <FilePlus size={14} />
        </button>
      </div>

      <div className="text-xs font-mono text-gray-400 tabular-nums ml-2">
        {clock}
      </div>
    </header>
  );
}

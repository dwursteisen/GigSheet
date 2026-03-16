import { Info, ListMusic, Volume2, Lightbulb, FileDown } from 'lucide-react';
import { useAppState, useAppDispatch } from '@/store/context';
import type { TabId } from '@/types';

const tabs: { id: TabId; icon: typeof Info; label: string }[] = [
  { id: 'infos', icon: Info, label: 'Infos' },
  { id: 'setlist', icon: ListMusic, label: 'Setlist' },
  { id: 'son', icon: Volume2, label: 'Son' },
  { id: 'lumiere', icon: Lightbulb, label: 'Lumière' },
  { id: 'export', icon: FileDown, label: 'Export' },
];

export function Sidebar() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return (
    <nav className="row-start-2 bg-console-surface border-r border-console-border flex flex-col items-center py-2 gap-1">
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => dispatch({ type: 'ui/setTab', tab: id })}
          className={`w-11 h-11 flex flex-col items-center justify-center rounded text-[9px] gap-0.5 transition-colors ${
            state.ui.activeTab === id
              ? 'bg-console-highlight text-accent'
              : 'text-gray-400 hover:text-gray-700 hover:bg-console-highlight/50'
          }`}
          title={label}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

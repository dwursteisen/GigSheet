import { useAppState } from '@/store/context';
import { getTotalDuration, formatDurationLong, getComputedEndTime } from '@/store/selectors';

export function Footer() {
  const state = useAppState();
  const total = getTotalDuration(state);
  const endTime = getComputedEndTime(state);

  return (
    <footer className="col-span-2 flex items-center justify-between px-4 py-1.5 bg-console-surface border-t border-console-border text-[11px] no-print">
      <div className="flex items-center gap-4 text-gray-500">
        <span>
          {state.project.setlist.filter(e => e.type === 'song').length} morceaux
        </span>
        <span>
          Durée totale: <span className="text-gray-700">{formatDurationLong(total)}</span>
        </span>
        {endTime && (
          <span>
            Fin estimée: <span className="text-gray-700">{endTime}</span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-gray-500">
        <span>{state.project.patches.length} patchs</span>
        <span>{state.project.lightingEquipment.length} projecteurs</span>
        {state.ui.lastSaved && (
          <span className="text-gray-400">
            Sauvé {new Date(state.ui.lastSaved).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </footer>
  );
}

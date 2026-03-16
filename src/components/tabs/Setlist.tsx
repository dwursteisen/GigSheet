import { Plus, Trash2, ChevronUp, ChevronDown, Music, Coffee, Columns3 } from 'lucide-react';
import { useAppState, useAppDispatch } from '@/store/context';
import { formatDuration, getTotalDuration, formatDurationLong, getSetDurations, getEntryStartTime } from '@/store/selectors';

export function Setlist() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { setlist } = state.project;

  const addSong = () => {
    dispatch({
      type: 'setlist/add',
      entry: {
        id: crypto.randomUUID(),
        type: 'song',
        title: '',
        artist: state.project.bandName,
        key: '',
        bpm: 120,
        durationSeconds: 210,
        notes: '',
      },
    });
  };

  const addPause = () => {
    dispatch({
      type: 'setlist/add',
      entry: {
        id: crypto.randomUUID(),
        type: 'pause',
        title: 'Pause',
        durationSeconds: 900,
      },
    });
  };

  const addSet = () => {
    const setCount = setlist.filter(e => e.type === 'set-header').length;
    dispatch({
      type: 'setlist/add',
      entry: {
        id: crypto.randomUUID(),
        type: 'set-header',
        title: `SET ${setCount + 1}`,
        durationSeconds: 0,
      },
    });
  };

  const total = getTotalDuration(state);
  const setDurations = getSetDurations(state);
  let songIndex = 0;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-accent text-sm font-bold uppercase tracking-wider">Setlist</h2>
        <div className="flex items-center gap-2">
          <button onClick={addSet} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-accent transition-colors px-2 py-1 bg-console-surface rounded border border-console-border">
            <Columns3 size={12} /> Set
          </button>
          <button onClick={addPause} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-accent transition-colors px-2 py-1 bg-console-surface rounded border border-console-border">
            <Coffee size={12} /> Pause
          </button>
          <button onClick={addSong} className="flex items-center gap-1 text-[11px] text-accent hover:text-amber-400 transition-colors px-2 py-1 bg-console-surface rounded border border-console-border">
            <Plus size={12} /> Morceau
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-4 mb-3 text-[11px] text-gray-500">
        <span>Total: <span className="text-gray-300">{formatDurationLong(total)}</span></span>
        {setDurations.map((s) => (
          <span key={s.set}>Set {s.set}: <span className="text-gray-300">{formatDurationLong(s.duration)}</span></span>
        ))}
      </div>

      <table>
        <thead>
          <tr className="text-[10px] uppercase">
            <th className="w-8">#</th>
            <th className="w-12">Heure</th>
            <th>Titre</th>
            <th className="w-24">Artiste</th>
            <th className="w-12">Clé</th>
            <th className="w-14">BPM</th>
            <th className="w-16">Durée</th>
            <th className="w-40">Notes</th>
            <th className="w-20"></th>
          </tr>
        </thead>
        <tbody>
          {setlist.map((entry) => {
            if (entry.type === 'set-header') {
              return (
                <tr key={entry.id} className="bg-console-highlight/40">
                  <td colSpan={7} className="py-2">
                    <div className="flex items-center gap-2">
                      <Columns3 size={12} className="text-accent" />
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(e) => dispatch({ type: 'setlist/update', id: entry.id, changes: { title: e.target.value } })}
                        className="bg-transparent border-none text-accent font-bold text-xs uppercase"
                      />
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => dispatch({ type: 'setlist/move', id: entry.id, direction: 'up' })} className="text-gray-600 hover:text-gray-300"><ChevronUp size={12} /></button>
                      <button onClick={() => dispatch({ type: 'setlist/move', id: entry.id, direction: 'down' })} className="text-gray-600 hover:text-gray-300"><ChevronDown size={12} /></button>
                      <button onClick={() => dispatch({ type: 'setlist/remove', id: entry.id })} className="text-gray-600 hover:text-vu-red"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              );
            }

            if (entry.type === 'pause') {
              return (
                <tr key={entry.id} className="bg-console-surface/30 text-gray-500 italic">
                  <td><Coffee size={12} /></td>
                  <td className="text-[11px]">{getEntryStartTime(state, entry.id)}</td>
                  <td>
                    <input type="text" value={entry.title} onChange={(e) => dispatch({ type: 'setlist/update', id: entry.id, changes: { title: e.target.value } })} className="bg-transparent border-none italic text-gray-500" />
                  </td>
                  <td colSpan={2}></td>
                  <td></td>
                  <td>
                    <DurationInput seconds={entry.durationSeconds} onChange={(s) => dispatch({ type: 'setlist/update', id: entry.id, changes: { durationSeconds: s } })} />
                  </td>
                  <td></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => dispatch({ type: 'setlist/move', id: entry.id, direction: 'up' })} className="text-gray-600 hover:text-gray-300"><ChevronUp size={12} /></button>
                      <button onClick={() => dispatch({ type: 'setlist/move', id: entry.id, direction: 'down' })} className="text-gray-600 hover:text-gray-300"><ChevronDown size={12} /></button>
                      <button onClick={() => dispatch({ type: 'setlist/remove', id: entry.id })} className="text-gray-600 hover:text-vu-red"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              );
            }

            songIndex++;
            return (
              <tr key={entry.id} className="hover:bg-console-highlight/20 transition-colors">
                <td className="text-gray-500 text-center">
                  <div className="flex items-center gap-1">
                    <Music size={10} className="text-gray-600" />
                    <span>{songIndex}</span>
                  </div>
                </td>
                <td className="text-[11px] text-gray-500 tabular-nums">{getEntryStartTime(state, entry.id)}</td>
                <td>
                  <input type="text" value={entry.title} onChange={(e) => dispatch({ type: 'setlist/update', id: entry.id, changes: { title: e.target.value } })} placeholder="Titre" className="w-full bg-transparent border-none" />
                </td>
                <td>
                  <input type="text" value={entry.artist ?? ''} onChange={(e) => dispatch({ type: 'setlist/update', id: entry.id, changes: { artist: e.target.value } })} className="w-full bg-transparent border-none text-gray-400 text-[11px]" />
                </td>
                <td>
                  <input type="text" value={entry.key ?? ''} onChange={(e) => dispatch({ type: 'setlist/update', id: entry.id, changes: { key: e.target.value } })} className="w-full bg-transparent border-none text-center" />
                </td>
                <td>
                  <input type="number" value={entry.bpm ?? ''} onChange={(e) => dispatch({ type: 'setlist/update', id: entry.id, changes: { bpm: Number(e.target.value) || undefined } })} className="w-14 bg-transparent border-none text-center tabular-nums" />
                </td>
                <td>
                  <DurationInput seconds={entry.durationSeconds} onChange={(s) => dispatch({ type: 'setlist/update', id: entry.id, changes: { durationSeconds: s } })} />
                </td>
                <td>
                  <input type="text" value={entry.notes ?? ''} onChange={(e) => dispatch({ type: 'setlist/update', id: entry.id, changes: { notes: e.target.value } })} className="w-full bg-transparent border-none text-gray-500 text-[11px]" />
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => dispatch({ type: 'setlist/move', id: entry.id, direction: 'up' })} className="text-gray-600 hover:text-gray-300"><ChevronUp size={12} /></button>
                    <button onClick={() => dispatch({ type: 'setlist/move', id: entry.id, direction: 'down' })} className="text-gray-600 hover:text-gray-300"><ChevronDown size={12} /></button>
                    <button onClick={() => dispatch({ type: 'setlist/remove', id: entry.id })} className="text-gray-600 hover:text-vu-red"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-console-border">
            <td colSpan={6} className="text-right text-gray-500 text-[11px]">Total</td>
            <td className="text-accent font-bold">{formatDuration(total)}</td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function DurationInput({ seconds, onChange }: { seconds: number; onChange: (s: number) => void }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const display = `${m}:${String(s).padStart(2, '0')}`;

  return (
    <input
      type="text"
      value={display}
      onChange={(e) => {
        const parts = e.target.value.split(':');
        if (parts.length === 2) {
          const mins = parseInt(parts[0]) || 0;
          const secs = parseInt(parts[1]) || 0;
          onChange(mins * 60 + secs);
        }
      }}
      className="w-14 bg-transparent border-none text-center tabular-nums"
      placeholder="0:00"
    />
  );
}

import { Plus, Trash2 } from 'lucide-react';
import { useAppState, useAppDispatch } from '@/store/context';
import { getSongs } from '@/store/selectors';

export function Son() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { patches, musicians, songTrackMatrix, monitorReturns } = state.project;
  const songs = getSongs(state);

  const addPatch = () => {
    const nextChannel = patches.length > 0 ? Math.max(...patches.map(p => p.channel)) + 1 : 1;
    dispatch({
      type: 'patches/add',
      patch: {
        id: crypto.randomUUID(),
        channel: nextChannel,
        instrument: '',
        musicianId: musicians[0]?.id ?? '',
        mic: '',
        stand: false,
        diBox: false,
        notes: '',
      },
    });
  };

  const addMonitor = () => {
    dispatch({
      type: 'monitors/add',
      monitor: {
        id: crypto.randomUUID(),
        name: `Retour ${monitorReturns.length + 1}`,
        musicianId: musicians[0]?.id ?? '',
        patchVolumes: {},
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Patch List */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-accent text-sm font-bold uppercase tracking-wider">Patch List</h2>
          <button onClick={addPatch} className="flex items-center gap-1 text-[11px] text-accent hover:text-amber-600 transition-colors">
            <Plus size={12} /> Ajouter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr className="text-[10px] uppercase">
                <th className="w-10">CH</th>
                <th>Instrument</th>
                <th className="w-32">Musicien</th>
                <th className="w-24">Micro</th>
                <th className="w-12">Pied</th>
                <th className="w-12">DI</th>
                <th className="w-40">Notes</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {patches.map((patch) => (
                <tr key={patch.id} className="hover:bg-console-highlight/20">
                  <td>
                    <input type="number" value={patch.channel} onChange={(e) => dispatch({ type: 'patches/update', id: patch.id, changes: { channel: Number(e.target.value) } })} className="w-10 bg-transparent border-none text-center tabular-nums" />
                  </td>
                  <td>
                    <input type="text" value={patch.instrument} onChange={(e) => dispatch({ type: 'patches/update', id: patch.id, changes: { instrument: e.target.value } })} className="w-full bg-transparent border-none" />
                  </td>
                  <td>
                    <select value={patch.musicianId} onChange={(e) => dispatch({ type: 'patches/update', id: patch.id, changes: { musicianId: e.target.value } })} className="w-full">
                      <option value="">—</option>
                      {musicians.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </td>
                  <td>
                    <input type="text" value={patch.mic ?? ''} onChange={(e) => dispatch({ type: 'patches/update', id: patch.id, changes: { mic: e.target.value } })} className="w-full bg-transparent border-none" />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" checked={patch.stand ?? false} onChange={(e) => dispatch({ type: 'patches/update', id: patch.id, changes: { stand: e.target.checked } })} className="accent-amber-500" />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" checked={patch.diBox ?? false} onChange={(e) => dispatch({ type: 'patches/update', id: patch.id, changes: { diBox: e.target.checked } })} className="accent-amber-500" />
                  </td>
                  <td>
                    <input type="text" value={patch.notes ?? ''} onChange={(e) => dispatch({ type: 'patches/update', id: patch.id, changes: { notes: e.target.value } })} className="w-full bg-transparent border-none text-gray-500 text-[11px]" />
                  </td>
                  <td>
                    <button onClick={() => dispatch({ type: 'patches/remove', id: patch.id })} className="text-gray-400 hover:text-vu-red"><Trash2 size={12} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Song × Track Matrix */}
      {songs.length > 0 && patches.length > 0 && (
        <section>
          <h2 className="text-accent text-sm font-bold mb-3 uppercase tracking-wider">Matrice Morceaux × Patchs</h2>
          <div className="overflow-x-auto">
            <table className="text-[11px]">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-console-bg z-10 min-w-[140px]">Morceau</th>
                  {patches.map(p => (
                    <th key={p.id} className="text-center px-1 min-w-[32px]">
                      <div className="writing-mode-vertical text-[10px] whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                        {p.channel}. {p.instrument}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {songs.map(song => (
                  <tr key={song.id} className="hover:bg-console-highlight/20">
                    <td className="sticky left-0 bg-console-bg z-10 font-medium">{song.title}</td>
                    {patches.map(p => {
                      const active = songTrackMatrix[song.id]?.[p.id] ?? false;
                      return (
                        <td key={p.id} className="text-center">
                          <button
                            onClick={() => dispatch({ type: 'matrix/toggle', songId: song.id, patchId: p.id })}
                            className={`w-5 h-5 rounded text-[10px] transition-colors ${
                              active ? 'bg-vu-green/80 text-white' : 'bg-console-highlight text-gray-400'
                            }`}
                          >
                            {active ? '✓' : '·'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Monitor Returns */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-accent text-sm font-bold uppercase tracking-wider">Retours Monitors</h2>
          <button onClick={addMonitor} className="flex items-center gap-1 text-[11px] text-accent hover:text-amber-600 transition-colors">
            <Plus size={12} /> Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {monitorReturns.map(monitor => {
            const musician = musicians.find(m => m.id === monitor.musicianId);
            return (
              <div key={monitor.id} className="bg-console-surface rounded border border-console-border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={monitor.name}
                    onChange={(e) => dispatch({ type: 'monitors/update', id: monitor.id, changes: { name: e.target.value } })}
                    className="flex-1 text-sm"
                  />
                  <select
                    value={monitor.musicianId}
                    onChange={(e) => dispatch({ type: 'monitors/update', id: monitor.id, changes: { musicianId: e.target.value } })}
                    className="w-32"
                  >
                    {musicians.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  {musician && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: musician.color }} />}
                  <button onClick={() => dispatch({ type: 'monitors/remove', id: monitor.id })} className="text-gray-400 hover:text-vu-red">
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {patches.map(p => (
                    <div key={p.id} className="flex items-center gap-2 text-[11px]">
                      <span className="text-gray-500 w-24 truncate">{p.channel}. {p.instrument}</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={monitor.patchVolumes[p.id] ?? 0}
                        onChange={(e) => dispatch({ type: 'monitors/setVolume', monitorId: monitor.id, patchId: p.id, volume: Number(e.target.value) })}
                        className="flex-1 h-1 accent-amber-500"
                      />
                      <span className="text-gray-500 w-6 text-right tabular-nums">{monitor.patchVolumes[p.id] ?? 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

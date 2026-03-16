import { Plus, Trash2, Lightbulb } from 'lucide-react';
import { useAppState, useAppDispatch } from '@/store/context';
import { getSongs } from '@/store/selectors';
import { RGBSliders } from '@/components/shared/RGBSliders';
import { LightingPlot } from '@/components/shared/LightingPlot';
import type { LightingFixture, LightingCue } from '@/types';

const FIXTURE_TYPES: LightingFixture['type'][] = ['PAR', 'WASH', 'SPOT', 'STROBE', 'BAR', 'OTHER'];
const DMX_CHANNELS_DEFAULT: Record<LightingFixture['type'], number> = {
  PAR: 4, WASH: 7, SPOT: 8, STROBE: 2, BAR: 6, OTHER: 4,
};

/** Build a fixtureId -> CSS color map from a song's cues (last cue wins per fixture). */
function buildColorOverrides(cues: LightingCue[]): Record<string, string> {
  const overrides: Record<string, string> = {};
  for (const cue of cues) {
    const r = Math.min(255, cue.r + cue.w);
    const g = Math.min(255, cue.g + cue.w);
    const b = Math.min(255, cue.b + cue.w);
    overrides[cue.fixtureId] = `rgb(${r},${g},${b})`;
  }
  return overrides;
}

export function Lumiere() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { lightingEquipment, lightingScript } = state.project;
  const songs = getSongs(state);

  const getNextDmx = () => {
    if (lightingEquipment.length === 0) return 1;
    return Math.max(...lightingEquipment.map(f => f.dmxStart + f.dmxChannels));
  };

  const addFixture = () => {
    const type: LightingFixture['type'] = 'PAR';
    dispatch({
      type: 'lighting/addFixture',
      fixture: {
        id: crypto.randomUUID(),
        type,
        name: '',
        dmxStart: getNextDmx(),
        dmxChannels: DMX_CHANNELS_DEFAULT[type],
        position: '',
        stageX: 50,
        stageY: 30,
        notes: '',
      },
    });
  };

  const addCue = (songId: string) => {
    dispatch({
      type: 'lighting/addCue',
      songId,
      cue: {
        id: crypto.randomUUID(),
        moment: '',
        fixtureId: lightingEquipment[0]?.id ?? '',
        r: 255, g: 200, b: 50, w: 0,
        intensity: 80,
        notes: '',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Equipment */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-accent text-sm font-bold uppercase tracking-wider">Équipement Lumière</h2>
          <button onClick={addFixture} className="flex items-center gap-1 text-[11px] text-accent hover:text-amber-400 transition-colors">
            <Plus size={12} /> Ajouter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr className="text-[10px] uppercase">
                <th className="w-20">Type</th>
                <th>Nom</th>
                <th className="w-16">DMX</th>
                <th className="w-12">CH</th>
                <th className="w-32">Position</th>
                <th className="w-40">Notes</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {lightingEquipment.map((fixture) => (
                <tr key={fixture.id} className="hover:bg-console-highlight/20">
                  <td>
                    <select
                      value={fixture.type}
                      onChange={(e) => {
                        const type = e.target.value as LightingFixture['type'];
                        dispatch({ type: 'lighting/updateFixture', id: fixture.id, changes: { type, dmxChannels: DMX_CHANNELS_DEFAULT[type] } });
                      }}
                      className="w-full"
                    >
                      {FIXTURE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td>
                    <input type="text" value={fixture.name} onChange={(e) => dispatch({ type: 'lighting/updateFixture', id: fixture.id, changes: { name: e.target.value } })} className="w-full bg-transparent border-none" />
                  </td>
                  <td>
                    <input type="number" value={fixture.dmxStart} onChange={(e) => dispatch({ type: 'lighting/updateFixture', id: fixture.id, changes: { dmxStart: Number(e.target.value) } })} className="w-16 bg-transparent border-none text-center tabular-nums" />
                  </td>
                  <td className="text-center text-gray-500 tabular-nums">{fixture.dmxChannels}</td>
                  <td>
                    <input type="text" value={fixture.position} onChange={(e) => dispatch({ type: 'lighting/updateFixture', id: fixture.id, changes: { position: e.target.value } })} className="w-full bg-transparent border-none text-gray-400" />
                  </td>
                  <td>
                    <input type="text" value={fixture.notes ?? ''} onChange={(e) => dispatch({ type: 'lighting/updateFixture', id: fixture.id, changes: { notes: e.target.value } })} className="w-full bg-transparent border-none text-gray-500 text-[11px]" />
                  </td>
                  <td>
                    <button onClick={() => dispatch({ type: 'lighting/removeFixture', id: fixture.id })} className="text-gray-600 hover:text-vu-red"><Trash2 size={12} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {lightingEquipment.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-400 text-[11px] uppercase tracking-wider mb-2">Plan d'implantation lumière</h3>
            <p className="text-[10px] text-gray-500 mb-2">Glissez les projecteurs pour les positionner sur la scène.</p>
            <LightingPlot
              fixtures={lightingEquipment}
              interactive
              onMove={(id, x, y) => dispatch({ type: 'lighting/updateFixture', id, changes: { stageX: x, stageY: y } })}
              width={500}
              height={300}
            />
          </div>
        )}
      </section>

      {/* Per-song lighting script */}
      <section>
        <h2 className="text-accent text-sm font-bold mb-3 uppercase tracking-wider">Script Lumière par Morceau</h2>
        <div className="space-y-4">
          {songs.map(song => {
            const script = lightingScript[song.id] ?? { mood: '', cues: [] };
            const songColorOverrides = buildColorOverrides(script.cues);
            return (
              <div key={song.id} className="bg-console-surface rounded border border-console-border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={14} className="text-accent" />
                  <span className="text-sm font-medium">{song.title}</span>
                  <span className="text-gray-500 text-[11px]">—</span>
                  <input
                    type="text"
                    value={script.mood}
                    onChange={(e) => dispatch({ type: 'lighting/setMood', songId: song.id, mood: e.target.value })}
                    placeholder="Ambiance..."
                    className="flex-1 bg-transparent border-none text-gray-400 text-[11px] italic"
                  />
                  <button
                    onClick={() => addCue(song.id)}
                    className="flex items-center gap-1 text-[10px] text-accent hover:text-amber-400 transition-colors"
                    disabled={lightingEquipment.length === 0}
                  >
                    <Plus size={10} /> Cue
                  </button>
                </div>

                {lightingEquipment.length > 0 && (
                  <div className="mb-2">
                    <LightingPlot
                      fixtures={lightingEquipment}
                      colorOverrides={songColorOverrides}
                      width={380}
                      height={200}
                    />
                  </div>
                )}

                {script.cues.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {script.cues.map(cue => {
                      const fixture = lightingEquipment.find(f => f.id === cue.fixtureId);
                      return (
                        <div key={cue.id} className="flex items-start gap-3 bg-console-bg/50 rounded p-2">
                          <div className="flex flex-col gap-1 min-w-[120px] pt-1">
                            <input
                              type="text"
                              value={cue.moment}
                              onChange={(e) => dispatch({ type: 'lighting/updateCue', songId: song.id, cueId: cue.id, changes: { moment: e.target.value } })}
                              placeholder="Moment"
                              className="text-[11px]"
                            />
                            <select
                              value={cue.fixtureId}
                              onChange={(e) => dispatch({ type: 'lighting/updateCue', songId: song.id, cueId: cue.id, changes: { fixtureId: e.target.value } })}
                              className="text-[11px]"
                            >
                              {lightingEquipment.map(f => (
                                <option key={f.id} value={f.id}>{f.name || f.type}</option>
                              ))}
                            </select>
                            {fixture && <span className="text-[10px] text-gray-600">DMX {fixture.dmxStart}-{fixture.dmxStart + fixture.dmxChannels - 1}</span>}
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] text-gray-500">INT</span>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={cue.intensity}
                                onChange={(e) => dispatch({ type: 'lighting/updateCue', songId: song.id, cueId: cue.id, changes: { intensity: Number(e.target.value) } })}
                                className="w-12 text-center text-[11px]"
                              />
                              <span className="text-[10px] text-gray-600">%</span>
                            </div>
                            <button
                              onClick={() => dispatch({ type: 'lighting/removeCue', songId: song.id, cueId: cue.id })}
                              className="text-gray-600 hover:text-vu-red text-[10px] flex items-center gap-1 mt-1"
                            >
                              <Trash2 size={11} /> Supprimer
                            </button>
                          </div>
                          <RGBSliders
                            r={cue.r}
                            g={cue.g}
                            b={cue.b}
                            w={cue.w}
                            onChange={(v) => dispatch({ type: 'lighting/updateCue', songId: song.id, cueId: cue.id, changes: v })}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

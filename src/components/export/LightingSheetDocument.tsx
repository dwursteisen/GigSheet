import { useAppState } from '@/store/context';
import { getSongs } from '@/store/selectors';
import { LightingPlot } from '@/components/shared/LightingPlot';

function FaderBar({ value, color, label }: { value: number; color: string; label: string }) {
  const pct = Math.round((value / 255) * 100);
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: 16 }}>
      <span style={{ fontSize: '6pt', color: '#666' }}>{value}</span>
      <span style={{
        display: 'inline-block',
        width: 10,
        height: 28,
        border: '1px solid #bbb',
        borderRadius: 1,
        position: 'relative',
        backgroundColor: '#f0f0f0',
        verticalAlign: 'middle',
        overflow: 'hidden',
      }}>
        <span style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${pct}%`,
          backgroundColor: color,
          borderRadius: '0 0 1px 1px',
        }} />
      </span>
      <span style={{ fontSize: '5.5pt', fontWeight: 700, color }}>{label}</span>
    </span>
  );
}

function FaderGroup({ r, g, b, w }: { r: number; g: number; b: number; w: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3, justifyContent: 'center' }}>
      <FaderBar value={r} color="#dc2626" label="R" />
      <FaderBar value={g} color="#16a34a" label="G" />
      <FaderBar value={b} color="#2563eb" label="B" />
      <FaderBar value={w} color="#888" label="W" />
    </span>
  );
}


export function LightingSheetDocument() {
  const state = useAppState();
  const { project } = state;
  const { lightingEquipment, lightingScript } = project;
  const songs = getSongs(state);

  return (
    <div className="text-[9pt] leading-relaxed print-landscape" style={{ color: '#111', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-3 border-b-2 border-black pb-2">
        <h1 className="text-lg font-bold" style={{ color: '#111' }}>FICHE LUMIÈRE — {project.bandName}</h1>
        <p className="text-xs" style={{ color: '#666' }}>{project.event.name} — {project.event.date} — {project.event.venue}</p>
      </div>

      {/* Equipment */}
      <h3 className="font-bold text-xs uppercase mb-1" style={{ color: '#111' }}>Équipement</h3>
      <table className="text-[8pt] mb-4" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #111' }}>
            <th style={{ padding: '2px 3px', textAlign: 'left', color: '#111' }}>Type</th>
            <th style={{ padding: '2px 3px', textAlign: 'left', color: '#111' }}>Nom</th>
            <th style={{ padding: '2px 3px', textAlign: 'left', color: '#111' }}>DMX</th>
            <th style={{ padding: '2px 3px', textAlign: 'left', color: '#111' }}>Canaux</th>
            <th style={{ padding: '2px 3px', textAlign: 'left', color: '#111' }}>Position</th>
            <th style={{ padding: '2px 3px', textAlign: 'left', color: '#111' }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {lightingEquipment.map(f => (
            <tr key={f.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '1px 3px', fontWeight: 600, color: '#111' }}>{f.type}</td>
              <td style={{ padding: '1px 3px', color: '#111' }}>{f.name}</td>
              <td style={{ padding: '1px 3px', color: '#444' }}>{f.dmxStart}–{f.dmxStart + f.dmxChannels - 1}</td>
              <td style={{ padding: '1px 3px', color: '#444' }}>{f.dmxChannels}</td>
              <td style={{ padding: '1px 3px', color: '#444' }}>{f.position}</td>
              <td style={{ padding: '1px 3px', color: '#888', fontSize: '7pt' }}>{f.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Lighting plot */}
      {lightingEquipment.length > 0 && (
        <div className="mb-4" style={{ breakInside: 'avoid' }}>
          <h3 className="font-bold text-xs uppercase mb-1" style={{ color: '#111' }}>Plan d'implantation</h3>
          <div className="flex justify-center">
            <LightingPlot fixtures={lightingEquipment} printMode width={350} height={200} />
          </div>
        </div>
      )}

      {/* Per-song cues */}
      <h3 className="font-bold text-xs uppercase mb-2" style={{ color: '#111' }}>Script Lumière</h3>
      {songs.map(song => {
        const script = lightingScript[song.id];
        if (!script || script.cues.length === 0) return null;
        return (
          <div key={song.id} className="mb-3" style={{ breakInside: 'avoid' }}>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontWeight: 700, fontSize: '9pt', color: '#111' }}>{song.title}</span>
              {script.mood && <span style={{ fontSize: '8pt', color: '#666', fontStyle: 'italic' }}>— {script.mood}</span>}
            </div>
            <table className="text-[8pt]" style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #999' }}>
                  <th style={{ padding: '1px 3px', textAlign: 'left', color: '#111' }}>Moment</th>
                  <th style={{ padding: '1px 3px', textAlign: 'left', color: '#111' }}>Projecteur</th>
                  <th style={{ padding: '1px 3px', textAlign: 'center', color: '#111' }}>Mix</th>
                  <th style={{ padding: '1px 3px', textAlign: 'center', color: '#111' }}>Faders RGBW</th>
                  <th style={{ padding: '1px 3px', textAlign: 'center', color: '#111' }}>INT%</th>
                  <th style={{ padding: '1px 3px', textAlign: 'left', color: '#111' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {script.cues.map(cue => {
                  const fixture = lightingEquipment.find(f => f.id === cue.fixtureId);
                  const rr = Math.min(255, cue.r + cue.w);
                  const gg = Math.min(255, cue.g + cue.w);
                  const bb = Math.min(255, cue.b + cue.w);
                  return (
                    <tr key={cue.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1px 3px', color: '#444' }}>{cue.moment}</td>
                      <td style={{ padding: '1px 3px', color: '#444' }}>{fixture?.name ?? '—'}</td>
                      <td style={{ padding: '1px 3px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 14,
                            height: 14,
                            borderRadius: 2,
                            backgroundColor: `rgb(${rr},${gg},${bb})`,
                            border: '1px solid #ccc',
                            verticalAlign: 'middle',
                          }}
                        />
                      </td>
                      <td style={{ padding: '2px 3px', textAlign: 'center' }}>
                        <FaderGroup r={cue.r} g={cue.g} b={cue.b} w={cue.w} />
                      </td>
                      <td style={{ padding: '1px 3px', textAlign: 'center', color: '#444' }}>{cue.intensity}</td>
                      <td style={{ padding: '1px 3px', color: '#888', fontSize: '7pt' }}>{cue.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

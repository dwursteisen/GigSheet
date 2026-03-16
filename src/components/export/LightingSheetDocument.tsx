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

function FaderGroup({ r, g, b }: { r: number; g: number; b: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3, justifyContent: 'center' }}>
      <FaderBar value={r} color="#dc2626" label="R" />
      <FaderBar value={g} color="#16a34a" label="G" />
      <FaderBar value={b} color="#2563eb" label="B" />
    </span>
  );
}


export function LightingSheetDocument() {
  const state = useAppState();
  const { project } = state;
  const { lightingEquipment, lightingScript } = project;
  const songs = getSongs(state);

  return (
    <div className="text-[9pt] leading-relaxed" style={{ color: '#111', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-3 border-b-2 border-black pb-2">
        <h1 className="text-lg font-bold" style={{ color: '#111' }}>FICHE LUMIÈRE — {project.bandName}</h1>
        <p className="text-xs" style={{ color: '#666' }}>{project.event.name} — {project.event.date} — {project.event.venue}</p>
      </div>

      {/* Equipment */}
      <h3 className="font-bold text-xs uppercase mb-1" style={{ color: '#111' }}>Équipement</h3>
      <div
        className="text-[8pt] mb-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '4px',
        }}
      >
        {lightingEquipment.map(f => (
          <div
            key={f.id}
            style={{
              border: '1px solid #ddd',
              padding: '3px 5px',
              borderRadius: 2,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{
                fontWeight: 700,
                fontSize: '7pt',
                color: '#111',
                backgroundColor: '#f0f0f0',
                padding: '0 3px',
                borderRadius: 1,
              }}>
                {f.type}
              </span>
              <span style={{ fontWeight: 600, color: '#111' }}>{f.name}</span>
            </div>
            <div style={{ color: '#444', marginTop: 1 }}>
              DMX {f.dmxStart}–{f.dmxStart + f.dmxChannels - 1}
              <span style={{ color: '#888', marginLeft: 4 }}>({f.dmxChannels}ch)</span>
              <span style={{ marginLeft: 6 }}>{f.position}</span>
            </div>
            {f.notes && (
              <div style={{ color: '#888', fontSize: '7pt', marginTop: 1 }}>{f.notes}</div>
            )}
          </div>
        ))}
      </div>

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
            <div
              className="text-[8pt]"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '4px',
              }}
            >
              {script.cues.map(cue => {
                const fixture = lightingEquipment.find(f => f.id === cue.fixtureId);
                return (
                  <div
                    key={cue.id}
                    style={{
                      border: '1px solid #ddd',
                      padding: '3px 5px',
                      borderRadius: 2,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '7pt',
                        color: '#111',
                        backgroundColor: '#f0f0f0',
                        padding: '0 3px',
                        borderRadius: 1,
                      }}>
                        {cue.moment}
                      </span>
                      <span style={{ fontWeight: 600, color: '#111' }}>{fixture?.name ?? '—'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 14,
                          height: 14,
                          borderRadius: 2,
                          backgroundColor: `rgb(${cue.r},${cue.g},${cue.b})`,
                          border: '1px solid #ccc',
                          flexShrink: 0,
                        }}
                      />
                      <FaderGroup r={cue.r} g={cue.g} b={cue.b} />
                    </div>
                    {cue.notes && (
                      <div style={{ color: '#888', fontSize: '7pt', marginTop: 1 }}>{cue.notes}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

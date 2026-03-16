import { useAppState } from '@/store/context';
import { getSongs } from '@/store/selectors';
import { StagePlot } from '@/components/shared/StagePlot';

export function SoundSheetDocument() {
  const state = useAppState();
  const { project } = state;
  const { patches, musicians, songTrackMatrix, monitorReturns } = project;
  const songs = getSongs(state);

  return (
    <div className="text-[9pt] leading-relaxed print-landscape" style={{ color: '#111', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-3 border-b-2 border-black pb-2">
        <h1 className="text-lg font-bold" style={{ color: '#111' }}>FICHE SON — {project.bandName}</h1>
        <p className="text-xs" style={{ color: '#666' }}>{project.event.name} — {project.event.date} — {project.event.venue}</p>
      </div>

      {/* Patch List */}
      <h3 className="font-bold text-xs uppercase mb-1" style={{ color: '#111' }}>Patch List</h3>
      <table className="text-[8pt] mb-3" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #111' }}>
            <th style={{ padding: '2px 3px', textAlign: 'left', color: '#111' }}>CH</th>
            <th style={{ padding: '2px 3px', textAlign: 'left', color: '#111' }}>Instrument</th>
            <th style={{ padding: '2px 3px', textAlign: 'left', color: '#111' }}>Musicien</th>
            <th style={{ padding: '2px 3px', textAlign: 'left', color: '#111' }}>Micro</th>
            <th style={{ padding: '2px 3px', textAlign: 'center', color: '#111' }}>Pied</th>
            <th style={{ padding: '2px 3px', textAlign: 'center', color: '#111' }}>DI</th>
            <th style={{ padding: '2px 3px', textAlign: 'left', color: '#111' }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {patches.map(p => {
            const musician = musicians.find(m => m.id === p.musicianId);
            return (
              <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '1px 3px', fontWeight: 600, color: '#111' }}>{p.channel}</td>
                <td style={{ padding: '1px 3px', color: '#111' }}>{p.instrument}</td>
                <td style={{ padding: '1px 3px', color: '#444' }}>{musician?.name ?? '—'}</td>
                <td style={{ padding: '1px 3px', color: '#444' }}>{p.mic || '—'}</td>
                <td style={{ padding: '1px 3px', textAlign: 'center', color: '#444' }}>{p.stand ? '✓' : ''}</td>
                <td style={{ padding: '1px 3px', textAlign: 'center', color: '#444' }}>{p.diBox ? '✓' : ''}</td>
                <td style={{ padding: '1px 3px', color: '#888', fontSize: '7pt' }}>{p.notes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Song×Track Matrix */}
      {songs.length > 0 && patches.length > 0 && (
        <>
          <h3 className="font-bold text-xs uppercase mb-1" style={{ color: '#111' }}>Matrice Morceaux × Patchs</h3>
          <table className="text-[7pt] mb-3" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #111' }}>
                <th style={{ padding: '1px 2px', textAlign: 'left', color: '#111' }}>Morceau</th>
                {patches.map(p => (
                  <th key={p.id} style={{ padding: '1px 2px', textAlign: 'center', color: '#111', fontSize: '6pt' }}>
                    {p.channel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {songs.map(song => (
                <tr key={song.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1px 2px', color: '#111' }}>{song.title}</td>
                  {patches.map(p => (
                    <td key={p.id} style={{ padding: '1px 2px', textAlign: 'center' }}>
                      {songTrackMatrix[song.id]?.[p.id] ? '●' : '○'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Monitor Returns */}
      {monitorReturns.length > 0 && (
        <>
          <h3 className="font-bold text-xs uppercase mb-1" style={{ color: '#111' }}>Retours Monitors</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {monitorReturns.map(monitor => {
              const musician = musicians.find(m => m.id === monitor.musicianId);
              const activePatchVolumes = Object.entries(monitor.patchVolumes)
                .filter(([, v]) => v > 0)
                .sort(([, a], [, b]) => b - a);
              return (
                <div key={monitor.id} style={{ border: '1px solid #ddd', padding: '4px 6px', borderRadius: 2 }}>
                  <div style={{ fontWeight: 600, fontSize: '8pt', color: '#111' }}>{monitor.name}</div>
                  <div style={{ fontSize: '7pt', color: '#666' }}>{musician?.name} — {musician?.instrument}</div>
                  <div className="mt-1" style={{ fontSize: '7pt' }}>
                    {activePatchVolumes.map(([pId, vol]) => {
                      const p = patches.find(pp => pp.id === pId);
                      return (
                        <span key={pId} style={{ display: 'inline-block', marginRight: 8, color: '#444' }}>
                          {p ? `${p.channel}.${p.instrument}` : pId}: <strong>{vol}%</strong>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Stage Plot */}
      <h3 className="font-bold text-xs uppercase mb-1" style={{ color: '#111' }}>Plan de Scène</h3>
      <div className="flex justify-center">
        <StagePlot musicians={musicians} width={300} height={180} />
      </div>
    </div>
  );
}

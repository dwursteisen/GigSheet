import { useAppState } from '@/store/context';
import { formatDuration, getTotalDuration, formatDurationLong, getEntryStartTime, getComputedEndTime } from '@/store/selectors';
import { StagePlot } from '@/components/shared/StagePlot';

export function RundownDocument() {
  const state = useAppState();
  const { project } = state;
  const { event, schedule, musicians, setlist } = project;
  const total = getTotalDuration(state);
  const endTime = getComputedEndTime(state);
  let songIndex = 0;

  return (
    <div className="text-[10pt] leading-relaxed" style={{ color: '#111', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-4 border-b-2 border-black pb-3">
        <h1 className="text-xl font-bold" style={{ color: '#111' }}>{project.bandName}</h1>
        <p className="text-sm" style={{ color: '#333' }}>{event.name} — {event.date}</p>
        <p className="text-xs" style={{ color: '#666' }}>{event.venue}, {event.address}</p>
      </div>

      {/* Two-column: schedule + contact */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-bold text-xs uppercase mb-1" style={{ color: '#111' }}>Planning</h3>
          <table className="text-[9pt]" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              {([
                ['Chargement', schedule.loadIn],
                ['Soundcheck', schedule.soundcheck],
                ['Ouverture', schedule.doors],
                ['Concert', schedule.showStart],
                ['Fin estimée', endTime || schedule.showEnd],
                ['Déchargement', schedule.loadOut],
              ] as const).map(([label, time]) => (
                <tr key={label}>
                  <td style={{ padding: '1px 4px', color: '#666' }}>{label}</td>
                  <td style={{ padding: '1px 4px', fontWeight: 600, color: '#111' }}>{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="font-bold text-xs uppercase mb-1" style={{ color: '#111' }}>Contact</h3>
          <p className="text-[9pt]" style={{ color: '#333' }}>{event.contactName}</p>
          <p className="text-[9pt]" style={{ color: '#333' }}>{event.contactPhone}</p>
          <p className="text-[9pt]" style={{ color: '#333' }}>{event.contactEmail}</p>
          {event.notes && <p className="text-[8pt] mt-1" style={{ color: '#666' }}>{event.notes}</p>}
        </div>
      </div>

      {/* Setlist */}
      <h3 className="font-bold text-xs uppercase mb-1" style={{ color: '#111' }}>
        Setlist ({formatDurationLong(total)})
      </h3>
      <table className="text-[9pt] mb-4" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #111' }}>
            <th style={{ padding: '2px 4px', textAlign: 'left', color: '#111' }}>#</th>
            <th style={{ padding: '2px 4px', textAlign: 'left', color: '#111' }}>Heure</th>
            <th style={{ padding: '2px 4px', textAlign: 'left', color: '#111' }}>Titre</th>
            <th style={{ padding: '2px 4px', textAlign: 'left', color: '#111' }}>Clé</th>
            <th style={{ padding: '2px 4px', textAlign: 'left', color: '#111' }}>BPM</th>
            <th style={{ padding: '2px 4px', textAlign: 'left', color: '#111' }}>Durée</th>
            <th style={{ padding: '2px 4px', textAlign: 'left', color: '#111' }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {setlist.map(entry => {
            if (entry.type === 'set-header') {
              return (
                <tr key={entry.id} style={{ backgroundColor: '#eee' }}>
                  <td colSpan={7} style={{ padding: '3px 4px', fontWeight: 700, color: '#111' }}>{entry.title}</td>
                </tr>
              );
            }
            if (entry.type === 'pause') {
              return (
                <tr key={entry.id} style={{ fontStyle: 'italic', color: '#888' }}>
                  <td style={{ padding: '2px 4px' }}>☕</td>
                  <td style={{ padding: '2px 4px' }}>{getEntryStartTime(state, entry.id)}</td>
                  <td colSpan={3} style={{ padding: '2px 4px' }}>{entry.title}</td>
                  <td style={{ padding: '2px 4px' }}>{formatDuration(entry.durationSeconds)}</td>
                  <td></td>
                </tr>
              );
            }
            songIndex++;
            return (
              <tr key={entry.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '2px 4px', color: '#666' }}>{songIndex}</td>
                <td style={{ padding: '2px 4px', color: '#666' }}>{getEntryStartTime(state, entry.id)}</td>
                <td style={{ padding: '2px 4px', fontWeight: 500, color: '#111' }}>{entry.title}</td>
                <td style={{ padding: '2px 4px', color: '#666' }}>{entry.key}</td>
                <td style={{ padding: '2px 4px', color: '#666' }}>{entry.bpm}</td>
                <td style={{ padding: '2px 4px', color: '#666' }}>{formatDuration(entry.durationSeconds)}</td>
                <td style={{ padding: '2px 4px', color: '#888', fontSize: '8pt' }}>{entry.notes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Stage Plot */}
      <h3 className="font-bold text-xs uppercase mb-1" style={{ color: '#111' }}>Plan de Scène</h3>
      <div className="flex justify-center">
        <StagePlot musicians={musicians} width={350} height={200} />
      </div>

      {/* Musicians */}
      <div className="mt-2 flex flex-wrap gap-3 justify-center text-[8pt]">
        {musicians.map(m => (
          <span key={m.id} style={{ color: '#444' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: m.color, marginRight: 3, verticalAlign: 'middle' }} />
            {m.name} — {m.instrument}
          </span>
        ))}
      </div>
    </div>
  );
}

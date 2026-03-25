import { useAppState } from '@/store/context';
import { formatDurationLong } from '@/store/selectors';

export function SetlistDocument() {
  const state = useAppState();
  const { project } = state;
  const { setlist, bandName } = project;

  // Count visible entries (songs, pauses, set-headers) to calculate font size
  const entries = setlist.filter(e => e.type === 'song' || e.type === 'set-header' || e.type === 'pause');
  const songCount = setlist.filter(e => e.type === 'song').length;
  const totalSeconds = setlist.reduce((sum, e) => sum + e.durationSeconds, 0);

  // A4 usable height ~267mm. Header ~18mm, footer ~8mm → ~241mm for entries.
  // Each entry needs lineHeight + gap. We calculate font size to fill the page.
  const availableMm = 241;
  const lineHeightFactor = 1.35; // line-height relative to font size
  const entryCount = entries.length || 1;
  // Convert mm to pt: 1mm ≈ 2.835pt
  const maxFontPt = Math.floor((availableMm / entryCount / lineHeightFactor) * 2.835);
  // Clamp between 10pt and 36pt
  const titleFontPt = Math.max(10, Math.min(36, maxFontPt));
  // Info (key, bpm) is 45% of title size, minimum 8pt
  const infoFontPt = Math.max(8, Math.round(titleFontPt * 0.45));
  // Set header is 60% of title size
  const headerFontPt = Math.max(9, Math.round(titleFontPt * 0.6));

  let songIndex = 0;

  return (
    <div
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#000',
        maxHeight: '267mm',
        overflow: 'hidden',
      }}
    >
      {/* Header — compact, one line */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderBottom: '3px solid #000',
          paddingBottom: '4px',
          marginBottom: '6px',
        }}
      >
        <span style={{ fontSize: '14pt', fontWeight: 800, textTransform: 'uppercase' }}>
          {bandName}
        </span>
        <span style={{ fontSize: '9pt', color: '#555' }}>
          {project.event.name && `${project.event.name} — `}{project.event.date}
          {songCount > 0 && ` — ${songCount} titres — ${formatDurationLong(totalSeconds)}`}
        </span>
      </div>

      {/* Setlist entries */}
      <div>
        {entries.map(entry => {
          if (entry.type === 'set-header') {
            return (
              <div
                key={entry.id}
                style={{
                  fontSize: `${headerFontPt}pt`,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderTop: '2px solid #000',
                  borderBottom: '1px solid #999',
                  padding: '2px 0 1px',
                  marginTop: '4px',
                  color: '#333',
                }}
              >
                {entry.title}
              </div>
            );
          }

          if (entry.type === 'pause') {
            return (
              <div
                key={entry.id}
                style={{
                  fontSize: `${infoFontPt}pt`,
                  fontStyle: 'italic',
                  color: '#888',
                  textAlign: 'center',
                  padding: '2px 0',
                  borderBottom: '1px dashed #ccc',
                }}
              >
                — {entry.title} —
              </div>
            );
          }

          // Song
          songIndex++;
          const hasInfo = entry.key || entry.bpm;

          return (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '6px',
                lineHeight: `${lineHeightFactor}`,
                borderBottom: '1px solid #eee',
              }}
            >
              {/* Song number */}
              <span
                style={{
                  fontSize: `${infoFontPt}pt`,
                  color: '#999',
                  minWidth: `${Math.max(16, titleFontPt)}px`,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {songIndex}.
              </span>

              {/* Song title — big and bold */}
              <span
                style={{
                  fontSize: `${titleFontPt}pt`,
                  fontWeight: 800,
                  color: '#000',
                  flex: 1,
                }}
              >
                {entry.title}
              </span>

              {/* Key and BPM — smaller, right-aligned */}
              {hasInfo && (
                <span
                  style={{
                    fontSize: `${infoFontPt}pt`,
                    color: '#666',
                    flexShrink: 0,
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.key && <span style={{ fontWeight: 600 }}>{entry.key}</span>}
                  {entry.key && entry.bpm && <span style={{ margin: '0 4px', color: '#ccc' }}>|</span>}
                  {entry.bpm && <span>{entry.bpm} bpm</span>}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import type { LightingFixture } from '@/types';
import { useRef, useState, useCallback } from 'react';

const FIXTURE_SHAPES: Record<LightingFixture['type'], (color: string) => React.ReactNode> = {
  PAR: (color) => <rect x="-3.5" y="-3.5" width="7" height="7" rx="1" fill={color} opacity={0.85} />,
  WASH: (color) => <ellipse rx="5" ry="3" fill={color} opacity={0.85} />,
  SPOT: (color) => <polygon points="0,-4 3.5,3 -3.5,3" fill={color} opacity={0.85} />,
  STROBE: (color) => (
    <>
      <rect x="-5" y="-2" width="10" height="4" rx="0.5" fill={color} opacity={0.85} />
      <line x1="-3" y1="-2" x2="-3" y2="2" stroke="rgba(0,0,0,0.3)" strokeWidth="0.4" />
      <line x1="0" y1="-2" x2="0" y2="2" stroke="rgba(0,0,0,0.3)" strokeWidth="0.4" />
      <line x1="3" y1="-2" x2="3" y2="2" stroke="rgba(0,0,0,0.3)" strokeWidth="0.4" />
    </>
  ),
  BAR: (color) => <rect x="-6" y="-1.5" width="12" height="3" rx="0.5" fill={color} opacity={0.85} />,
  OTHER: (color) => <circle r="3.5" fill={color} opacity={0.85} />,
};

const DEFAULT_FIXTURE_COLOR = '#6b7280';

interface LightingPlotProps {
  fixtures: LightingFixture[];
  interactive?: boolean;
  onMove?: (id: string, x: number, y: number) => void;
  /** Per-fixture color overrides (fixtureId -> CSS color string) */
  colorOverrides?: Record<string, string>;
  /** Print-friendly mode: light background, dark labels */
  printMode?: boolean;
  width?: number;
  height?: number;
}

export function LightingPlot({
  fixtures,
  interactive = false,
  onMove,
  colorOverrides,
  printMode = false,
  width = 400,
  height = 250,
}: LightingPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const toSvgCoords = useCallback((e: React.MouseEvent): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  }, []);

  const handleMouseDown = useCallback((id: string) => {
    if (interactive) setDragging(id);
  }, [interactive]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !onMove) return;
    const coords = toSvgCoords(e);
    if (coords) onMove(dragging, Math.round(coords.x), Math.round(100 - coords.y));
  }, [dragging, onMove, toSvgCoords]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const bg = printMode ? '#f3f4f6' : undefined;
  const trussColor = printMode ? '#999' : '#94a3b8';
  const frontLineColor = printMode ? '#b45309' : '#d97706';
  const frontTextColor = printMode ? '#b45309' : '#d97706';
  const backLineColor = printMode ? '#bbb' : '#cbd5e1';
  const backTextColor = printMode ? '#999' : '#94a3b8';
  const labelColor = printMode ? '#111' : '#1e293b';
  const dmxLabelColor = printMode ? '#666' : '#64748b';

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      width={width}
      height={height}
      className={printMode ? '' : 'bg-stage-bg rounded border border-console-border'}
      style={printMode ? { backgroundColor: bg, border: '1px solid #ccc', borderRadius: 2 } : undefined}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Stage back (top) */}
      <line x1="5" y1="5" x2="95" y2="5" stroke={backLineColor} strokeWidth="0.3" />
      <text x="50" y="3" textAnchor="middle" fill={backTextColor} fontSize="2.5">FOND DE SCÈNE</text>

      {/* Truss line */}
      <line x1="10" y1="88" x2="90" y2="88" stroke={trussColor} strokeWidth="0.8" />
      <text x="7" y="88.5" fill={trussColor} fontSize="2" textAnchor="end">TRUSS</text>

      {/* Stage front (bottom) */}
      <line x1="5" y1="95" x2="95" y2="95" stroke={frontLineColor} strokeWidth="0.5" strokeDasharray="2,2" opacity={0.5} />
      <text x="50" y="98" textAnchor="middle" fill={frontTextColor} fontSize="3" opacity={0.6}>PUBLIC</text>

      {fixtures.map((f) => {
        const color = colorOverrides?.[f.id] ?? DEFAULT_FIXTURE_COLOR;
        const isOverridden = !!colorOverrides?.[f.id];
        const shape = FIXTURE_SHAPES[f.type];
        const coneAngle = f.coneAngle ?? 0;
        const coneLength = f.coneLength ?? 15;
        const halfWidth = coneLength * 0.35;

        return (
          <g
            key={f.id}
            transform={`translate(${f.stageX}, ${100 - f.stageY})`}
            onMouseDown={() => handleMouseDown(f.id)}
            style={{ cursor: interactive ? 'grab' : 'default' }}
          >
            {/* Light cone */}
            <g transform={`rotate(${coneAngle})`}>
              <polygon
                points={`0,0 ${-halfWidth},${coneLength} ${halfWidth},${coneLength}`}
                fill={color}
                opacity={printMode ? 0.15 : 0.2}
              />
            </g>

            {/* Glow when color override is active */}
            {isOverridden && (
              <circle r="8" fill={color} opacity={printMode ? 0.2 : 0.15}>
                {!printMode && <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite" />}
              </circle>
            )}

            {shape(color)}

            {/* Outline for interactivity */}
            {interactive && (
              <circle r="6" fill="none" stroke={color} strokeWidth="0.3" opacity={0.3}>
                <animate attributeName="r" from="6" to="8" dur="2s" repeatCount="indefinite" />
              </circle>
            )}

            <text y="-5.5" textAnchor="middle" fill={labelColor} fontSize="2.5" fontWeight="bold">
              {f.name || f.type}
            </text>
            <text y="7" textAnchor="middle" fill={dmxLabelColor} fontSize="1.8">
              DMX {f.dmxStart}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

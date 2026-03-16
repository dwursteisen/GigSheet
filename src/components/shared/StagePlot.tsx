import type { Musician } from '@/types';
import { useRef, useState, useCallback } from 'react';

interface StagePlotProps {
  musicians: Musician[];
  interactive?: boolean;
  onMove?: (id: string, x: number, y: number) => void;
  width?: number;
  height?: number;
}

export function StagePlot({ musicians, interactive = false, onMove, width = 400, height = 250 }: StagePlotProps) {
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
    if (coords) onMove(dragging, Math.round(coords.x), Math.round(coords.y));
  }, [dragging, onMove, toSvgCoords]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      width={width}
      height={height}
      className="bg-stage-bg rounded border border-console-border"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Stage front */}
      <line x1="5" y1="8" x2="95" y2="8" stroke="#d97706" strokeWidth="0.5" strokeDasharray="2,2" opacity={0.5} />
      <text x="50" y="5" textAnchor="middle" fill="#d97706" fontSize="3" opacity={0.6}>PUBLIC</text>

      {/* Stage back */}
      <line x1="5" y1="95" x2="95" y2="95" stroke="#cbd5e1" strokeWidth="0.3" />
      <text x="50" y="99" textAnchor="middle" fill="#94a3b8" fontSize="2.5">FOND DE SCÈNE</text>

      {musicians.map((m) => (
        <g
          key={m.id}
          transform={`translate(${m.stageX}, ${m.stageY})`}
          onMouseDown={() => handleMouseDown(m.id)}
          style={{ cursor: interactive ? 'grab' : 'default' }}
        >
          <circle r="4" fill={m.color} opacity={0.8} />
          <circle r="4" fill="none" stroke={m.color} strokeWidth="0.5" opacity={0.4}>
            {interactive && <animate attributeName="r" from="4" to="6" dur="2s" repeatCount="indefinite" />}
          </circle>
          <text y="-5.5" textAnchor="middle" fill="#1e293b" fontSize="2.8" fontWeight="bold">
            {m.name}
          </text>
          <text y="7.5" textAnchor="middle" fill="#64748b" fontSize="2.2">
            {m.instrument}
          </text>
        </g>
      ))}
    </svg>
  );
}

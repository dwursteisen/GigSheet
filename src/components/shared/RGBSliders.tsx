import { ColorPreview } from './ColorPreview';

interface RGBSlidersProps {
  r: number;
  g: number;
  b: number;
  w: number;
  onChange: (values: { r: number; g: number; b: number; w: number }) => void;
}

export function RGBSliders({ r, g, b, w, onChange }: RGBSlidersProps) {
  const sliders = [
    { label: 'R', value: r, color: '#ef4444', key: 'r' as const },
    { label: 'G', value: g, color: '#22c55e', key: 'g' as const },
    { label: 'B', value: b, color: '#3b82f6', key: 'b' as const },
    { label: 'W', value: w, color: '#94a3b8', key: 'w' as const },
  ];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <ColorPreview r={r} g={g} b={b} w={w} size={28} />
      <div className="flex gap-1.5">
        {sliders.map(({ label, value, color, key }) => (
          <div key={key} className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] tabular-nums text-gray-500">{value}</span>
            <div className="relative h-[80px] w-[18px] bg-console-bg rounded border border-console-border flex items-end">
              <div
                className="w-full rounded-b transition-all"
                style={{
                  height: `${(value / 255) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.7,
                }}
              />
              <input
                type="range"
                min={0}
                max={255}
                value={value}
                onChange={(e) => onChange({ r, g, b, w, [key]: Number(e.target.value) })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize"
                style={{
                  writingMode: 'vertical-lr',
                  direction: 'rtl',
                }}
              />
            </div>
            <span className="text-[9px] font-bold" style={{ color }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

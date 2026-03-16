interface ColorPreviewProps {
  r: number;
  g: number;
  b: number;
  w?: number;
  size?: number;
}

export function ColorPreview({ r, g, b, w = 0, size = 24 }: ColorPreviewProps) {
  const rr = Math.min(255, r + w);
  const gg = Math.min(255, g + w);
  const bb = Math.min(255, b + w);

  return (
    <div
      className="rounded border border-console-border inline-block"
      style={{
        width: size,
        height: size,
        backgroundColor: `rgb(${rr}, ${gg}, ${bb})`,
      }}
    />
  );
}

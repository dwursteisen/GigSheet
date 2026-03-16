interface ColorPreviewProps {
  r: number;
  g: number;
  b: number;
  size?: number;
}

export function ColorPreview({ r, g, b, size = 24 }: ColorPreviewProps) {
  return (
    <div
      className="rounded border border-console-border inline-block"
      style={{
        width: size,
        height: size,
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
      }}
    />
  );
}

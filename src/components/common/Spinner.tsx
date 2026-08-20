interface SpinnerProps {
  size?: number;
  color?: string;
  fadedColor?: string;
  className?: string;
  ariaLabel?: string;
}

export default function Spinner({
  size = 20,
  color = '#F70071',
  fadedColor = 'rgba(247, 0, 113, 0.5)',
  className = '',
  ariaLabel = '로딩 중',
}: SpinnerProps) {
  const spinnerSize = size * (16.67 / 20);
  const borderWidth = size * (1.5 / 20);

  return (
    <span
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label={ariaLabel}
    >
      <span
        className="animate-spin rounded-full"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          background: `conic-gradient(
            ${color} 0deg 90deg,
            ${fadedColor} 90deg 360deg
          )`,
          WebkitMask: `radial-gradient(
            farthest-side,
            transparent calc(100% - ${borderWidth}px),
            #000 calc(100% - ${borderWidth}px)
          )`,
          mask: `radial-gradient(
            farthest-side,
            transparent calc(100% - ${borderWidth}px),
            #000 calc(100% - ${borderWidth}px)
          )`,
        }}
      />
    </span>
  );
}

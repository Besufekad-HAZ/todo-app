export function LoadingSpinner({ size = 6 }: { size?: number }) {
  const sizeClass = `w-${size} h-${size}`;

  return (
    <div
      className={`${sizeClass} animate-spin rounded-full border-t-2 border-r-2 border-pink-500 border-opacity-50`}
    ></div>
  );
}

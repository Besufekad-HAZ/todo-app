export function LoadingSpinner({ size = 5 }: { size?: number }) {
  return (
    <div
      className={`inline-block h-${size} w-${size} animate-spin rounded-full border-2 border-solid border-current border-r-transparent`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

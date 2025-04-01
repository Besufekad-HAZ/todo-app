export function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
  );
}

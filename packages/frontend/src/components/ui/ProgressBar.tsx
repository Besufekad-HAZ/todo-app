export function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-1">
      <div
        className={`h-full rounded-full ${percentage === 100 ? 'bg-green-500' : 'bg-pink-500'}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

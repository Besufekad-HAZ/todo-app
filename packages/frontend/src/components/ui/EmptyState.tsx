// src/components/ui/EmptyState.tsx
export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  const getIcon = () => {
    switch (icon) {
      case 'task':
        return (
          <svg
            className="h-16 w-16 mb-4"
            style={{ color: 'rgb(var(--color-text-muted))' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        );
      case 'collection':
        return (
          <svg
            className="h-16 w-16 mb-4"
            style={{ color: 'rgb(var(--color-text-muted))' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      {getIcon()}
      <h2 className="text-xl font-semibold mb-2" style={{ color: 'rgb(var(--color-text-base))' }}>
        {title}
      </h2>
      <p className="text-center" style={{ color: 'rgb(var(--color-text-muted))' }}>
        {description}
      </p>
    </div>
  );
}

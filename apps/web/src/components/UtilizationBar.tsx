interface UtilizationBarProps {
  current: number;
  projected: number;
}

export function UtilizationBar({ current, projected }: UtilizationBarProps) {
  const getUtilizationColor = (util: number) => {
    if (util >= 50) return 'bg-red-600 dark:bg-red-500';
    if (util >= 30) return 'bg-amber-500 dark:bg-amber-400';
    return 'bg-[#6B6B6B] dark:bg-[#9B9B9B]';
  };

  const showBothBars = Math.abs(current - projected) > 1;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#6B6B6B] dark:text-[#9B9B9B]">Utilization</span>
        <div className="flex items-center gap-3">
          {showBothBars && (
            <span className="text-[#9B9B9B] dark:text-[#6B6B6B]">{current.toFixed(1)}%</span>
          )}
          <span className={`font-medium ${projected >= 50 ? 'text-red-600 dark:text-red-400' : projected >= 30 ? 'text-amber-600 dark:text-amber-400' : 'text-[#1C1C1C] dark:text-[#E4E4E4]'}`}>
            {projected.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="relative h-2 bg-[#E4E4E4] dark:bg-[#3F3F3F] rounded-full overflow-hidden">
        {showBothBars && (
          <div
            className={`absolute left-0 top-0 h-full ${getUtilizationColor(current)} opacity-40`}
            style={{ width: `${Math.min(current, 100)}%` }}
          />
        )}
        <div
          className={`absolute left-0 top-0 h-full ${getUtilizationColor(projected)}`}
          style={{ width: `${Math.min(projected, 100)}%` }}
        />
      </div>
      {showBothBars && (
        <div className="flex items-center gap-1 text-xs text-[#9B9B9B] dark:text-[#6B6B6B]">
          <span>→</span>
          <span>After recommended payments</span>
        </div>
      )}
    </div>
  );
}

import { CreditCard } from '../types/card';

interface CardListItemProps {
  card: CreditCard;
  onClick: () => void;
}

export function CardListItem({ card, onClick }: CardListItemProps) {
  const getUtilizationColor = (util: number) => {
    if (util >= 50) return 'text-red-600 dark:text-red-400';
    if (util >= 30) return 'text-orange-600 dark:text-orange-400';
    return 'text-[#6B6B6B] dark:text-[#9B9B9B]';
  };

  const getUtilizationBarColor = (util: number) => {
    if (util >= 50) return 'bg-red-500';
    if (util >= 30) return 'bg-orange-500';
    if (util >= 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Mock last updated time - in real app this would come from data
  const getLastUpdated = () => {
    const daysAgo = Math.floor(Math.random() * 5);
    if (daysAgo === 0) return 'Updated today';
    if (daysAgo === 1) return 'Updated 1 day ago';
    return `Updated ${daysAgo} days ago`;
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-[#252525] border border-[#E4E4E4] dark:border-[#3F3F3F] rounded-lg p-4 hover:bg-[#FAFAFA] dark:hover:bg-[#2C2C2C] transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-[#1C1C1C] dark:text-[#E4E4E4]">{card.name}</h3>
          <p className="text-sm text-[#6B6B6B] dark:text-[#9B9B9B]">{card.issuer}</p>
        </div>
        {card.excludeFromOptimization && (
          <span className="text-xs text-[#9B9B9B] dark:text-[#6B6B6B] bg-[#E4E4E4] dark:bg-[#3F3F3F] px-2 py-1 rounded">
            Excluded
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm">
          <span className="text-[#1C1C1C] dark:text-[#E4E4E4]">${card.balance.toLocaleString()}</span>
          <span className="text-[#BEBEBE] dark:text-[#6B6B6B] mx-1">/</span>
          <span className="text-[#9B9B9B] dark:text-[#6B6B6B]">${card.creditLimit.toLocaleString()}</span>
        </div>
        <span className={`text-sm font-medium ${getUtilizationColor(card.currentUtilization)}`}>
          {card.currentUtilization.toFixed(1)}%
        </span>
      </div>

      {/* Utilization Bar */}
      <div className="w-full h-1.5 bg-[#E4E4E4] dark:bg-[#3F3F3F] rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${getUtilizationBarColor(card.currentUtilization)} transition-all duration-300`}
          style={{ width: `${Math.min(card.currentUtilization, 100)}%` }}
        />
      </div>

      {/* Last Updated */}
      <p className="text-xs text-[#9B9B9B] dark:text-[#6B6B6B]">
        {getLastUpdated()}
      </p>
    </button>
  );
}

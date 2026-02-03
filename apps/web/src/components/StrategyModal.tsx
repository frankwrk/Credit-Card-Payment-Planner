import { X } from 'lucide-react';

export type Strategy = 'snowball' | 'avalanche' | 'utilization';

interface StrategyModalProps {
  currentStrategy: Strategy;
  onSelect: (strategy: Strategy) => void;
  onClose: () => void;
}

export function StrategyModal({ currentStrategy, onSelect, onClose }: StrategyModalProps) {
  const strategies = [
    {
      id: 'snowball' as Strategy,
      name: 'Snowball',
      description: 'Pay smallest balances first',
      bestFor: 'Quick wins, motivation',
      tradeoff: 'May pay more interest'
    },
    {
      id: 'avalanche' as Strategy,
      name: 'Avalanche',
      description: 'Pay highest APR first',
      bestFor: 'Saving money on interest',
      tradeoff: 'Slower visible progress'
    },
    {
      id: 'utilization' as Strategy,
      name: 'Utilization',
      description: 'Pay high-utilization cards before statement close',
      bestFor: 'Credit score improvement',
      tradeoff: "Doesn't prioritize debt payoff"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white dark:bg-[#252525] rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-[#252525] border-b border-[#E4E4E4] dark:border-[#3F3F3F] px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-[#1C1C1C] dark:text-[#E4E4E4]">Compare Strategies</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F5F5F5] dark:hover:bg-[#2C2C2C] rounded-full"
          >
            <X size={24} className="text-[#6B6B6B] dark:text-[#9B9B9B]" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {strategies.map(strategy => (
            <button
              key={strategy.id}
              onClick={() => {
                onSelect(strategy.id);
                onClose();
              }}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                currentStrategy === strategy.id
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                  : 'border-[#E4E4E4] dark:border-[#3F3F3F] bg-white dark:bg-[#2C2C2C] hover:border-[#BEBEBE] dark:hover:border-[#6B6B6B]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className={`font-medium ${
                  currentStrategy === strategy.id
                    ? 'text-purple-700 dark:text-purple-400'
                    : 'text-[#1C1C1C] dark:text-[#E4E4E4]'
                }`}>
                  {strategy.name}
                </h3>
                {currentStrategy === strategy.id && (
                  <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-sm text-[#3F3F3F] dark:text-[#BEBEBE] mb-3">
                {strategy.description}
              </p>
              <div className="space-y-1 text-xs">
                <p className="text-[#6B6B6B] dark:text-[#9B9B9B]">
                  <span className="font-medium">Best for:</span> {strategy.bestFor}
                </p>
                <p className="text-[#6B6B6B] dark:text-[#9B9B9B]">
                  <span className="font-medium">Trade-off:</span> {strategy.tradeoff}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

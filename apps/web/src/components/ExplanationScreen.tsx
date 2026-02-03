import { ChevronLeft } from 'lucide-react';
import { Strategy } from './StrategyModal';

interface ExplanationScreenProps {
  onBack: () => void;
  currentStrategy?: Strategy;
  onCompareStrategies?: () => void;
}

export function ExplanationScreen({ onBack, currentStrategy = 'utilization', onCompareStrategies }: ExplanationScreenProps) {
  const getStrategyDescription = (strategy: Strategy) => {
    const descriptions = {
      snowball: "You're prioritizing smallest balances first to eliminate cards and build momentum.",
      avalanche: "You're prioritizing highest APR cards first to minimize total interest paid.",
      utilization: "You're prioritizing high-utilization cards before statement close to optimize credit score impact."
    };
    return descriptions[strategy];
  };

  const getStrategyName = (strategy: Strategy) => {
    const names = {
      snowball: 'Snowball',
      avalanche: 'Avalanche',
      utilization: 'Utilization'
    };
    return names[strategy];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1C1C] pb-20">
      <div className="max-w-md mx-auto">
        <div className="sticky top-0 bg-white dark:bg-[#252525] border-b border-[#E4E4E4] dark:border-[#3F3F3F] px-4 py-4 flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-[#F5F5F5] dark:hover:bg-[#2C2C2C] rounded-full">
            <ChevronLeft size={24} className="text-[#1C1C1C] dark:text-[#E4E4E4]" />
          </button>
          <h1 className="text-lg font-medium text-[#1C1C1C] dark:text-[#E4E4E4]">Why This Plan?</h1>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Current Strategy */}
          <section className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 rounded-lg p-4">
            <h2 className="font-medium text-purple-900 dark:text-purple-300 mb-2">
              Your current strategy: {getStrategyName(currentStrategy)}
            </h2>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
              {getStrategyDescription(currentStrategy)}
            </p>
            {onCompareStrategies && (
              <button
                onClick={onCompareStrategies}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                Compare strategies →
              </button>
            )}
          </section>

          <section>
            <h2 className="font-medium text-[#1C1C1C] dark:text-[#E4E4E4] mb-3">How the plan works</h2>
            <p className="text-[#3F3F3F] dark:text-[#BEBEBE] leading-relaxed mb-3">
              Your payment plan is designed to optimize three key factors: avoiding late fees, 
              minimizing credit utilization for reporting purposes, and reducing interest charges.
            </p>
            <p className="text-[#3F3F3F] dark:text-[#BEBEBE] leading-relaxed">
              Not all payments are equal in their impact on your credit and your wallet.
            </p>
          </section>

          <section className="bg-[#F5F5F5] dark:bg-[#252525] rounded-lg p-4 border border-[#E4E4E4] dark:border-[#3F3F3F]">
            <h3 className="font-medium text-[#1C1C1C] dark:text-[#E4E4E4] mb-2">Statement close matters more</h3>
            <p className="text-sm text-[#3F3F3F] dark:text-[#BEBEBE] leading-relaxed mb-3">
              Your credit card issuer reports your balance to credit bureaus on your statement 
              closing date — not your due date. Paying down high balances before this date can 
              reduce the utilization percentage that appears on your credit report.
            </p>
            <div className="bg-white dark:bg-[#2C2C2C] rounded p-3 border border-[#E4E4E4] dark:border-[#3F3F3F]">
              <p className="text-xs text-[#6B6B6B] dark:text-[#9B9B9B] mb-2">Example:</p>
              <p className="text-sm text-[#3F3F3F] dark:text-[#BEBEBE] leading-relaxed">
                Paying $500 on Feb 4 (before statement close) reduces your reported utilization 
                from 52% to 32%. The same $500 paid on Feb 12 (after statement close) won't 
                affect this month's credit report.
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-medium text-[#1C1C1C] dark:text-[#E4E4E4] mb-3">Why certain cards are prioritized</h3>
            <ul className="space-y-3 text-sm text-[#3F3F3F] dark:text-[#BEBEBE]">
              <li className="flex gap-2">
                <span className="text-[#BEBEBE] dark:text-[#6B6B6B] flex-shrink-0">•</span>
                <span>
                  <strong className="text-[#1C1C1C] dark:text-[#E4E4E4]">High utilization cards:</strong> Paying these 
                  down before statement close has the biggest impact on your credit utilization.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#BEBEBE] dark:text-[#6B6B6B] flex-shrink-0">•</span>
                <span>
                  <strong className="text-[#1C1C1C] dark:text-[#E4E4E4]">High APR cards:</strong> After avoiding late 
                  fees and managing utilization, extra payments here save you the most in interest.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#BEBEBE] dark:text-[#6B6B6B] flex-shrink-0">•</span>
                <span>
                  <strong className="text-[#1C1C1C] dark:text-[#E4E4E4]">Small balance cards:</strong> Quick wins that 
                  remove cards from your list and build momentum toward becoming debt-free.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#BEBEBE] dark:text-[#6B6B6B] flex-shrink-0">•</span>
                <span>
                  <strong className="text-[#1C1C1C] dark:text-[#E4E4E4]">Low utilization cards:</strong> Minimum payments 
                  only, since they're not hurting your utilization or costing much in interest.
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-900/30">
            <h3 className="font-medium text-amber-900 dark:text-amber-400 mb-2">Important disclaimer</h3>
            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              This app provides payment recommendations based on general credit optimization principles. 
              It does not guarantee specific credit score changes or financial outcomes. Every credit 
              profile is unique, and other factors affect your score beyond utilization.
            </p>
          </section>

          <section>
            <h3 className="font-medium text-[#1C1C1C] dark:text-[#E4E4E4] mb-3">What this plan doesn't do</h3>
            <ul className="space-y-2 text-sm text-[#3F3F3F] dark:text-[#BEBEBE]">
              <li className="flex gap-2">
                <span className="text-[#BEBEBE] dark:text-[#6B6B6B] flex-shrink-0">•</span>
                <span>Move money automatically</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#BEBEBE] dark:text-[#6B6B6B] flex-shrink-0">•</span>
                <span>Guarantee credit score improvements</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#BEBEBE] dark:text-[#6B6B6B] flex-shrink-0">•</span>
                <span>Provide personalized financial advice</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#BEBEBE] dark:text-[#6B6B6B] flex-shrink-0">•</span>
                <span>Replace consultation with a financial advisor</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

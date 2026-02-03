import { useState } from 'react';
import { CreditCard } from '../types/card';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface AddCardScreenProps {
  onBack: () => void;
  onSave: (newCard: CreditCard) => void;
}

export function AddCardScreen({ onBack, onSave }: AddCardScreenProps) {
  const [cardName, setCardName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [balance, setBalance] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [apr, setApr] = useState('');
  const [statementCloseDate, setStatementCloseDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [promoAPR, setPromoAPR] = useState('');
  const [promoExpiration, setPromoExpiration] = useState('');

  const handleSave = () => {
    const limitNum = parseInt(creditLimit) || 0;
    const balanceNum = parseInt(balance) || 0;
    const currentUtilization = limitNum > 0 ? (balanceNum / limitNum) * 100 : 0;

    const newCard: CreditCard = {
      id: `card-${Date.now()}`,
      name: cardName || 'Unnamed Card',
      issuer: issuer || 'Unknown Issuer',
      balance: balanceNum,
      creditLimit: limitNum,
      minimumPayment: parseInt(minimumPayment) || 0,
      apr: parseFloat(apr) || 0,
      dueDate: dueDate || '',
      statementCloseDate: statementCloseDate || '',
      currentUtilization,
      projectedUtilization: currentUtilization,
      paymentByDueDate: {
        amount: parseInt(minimumPayment) || 0,
        date: dueDate || '',
        explanation: 'Minimum payment required'
      },
      excludeFromOptimization: false,
      editedFields: {}
    };

    onSave(newCard);
    onBack();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1C1C] pb-20">
      <div className="max-w-md mx-auto">
        <div className="sticky top-0 bg-white dark:bg-[#252525] border-b border-[#E4E4E4] dark:border-[#3F3F3F] px-4 py-4 flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-[#F5F5F5] dark:hover:bg-[#2C2C2C] rounded-full">
            <ChevronLeft size={24} className="text-[#1C1C1C] dark:text-[#E4E4E4]" />
          </button>
          <h1 className="text-lg font-medium text-[#1C1C1C] dark:text-[#E4E4E4]">Add Card</h1>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#3F3F3F] dark:text-[#BEBEBE]">Card Information</h3>

            {/* Card Name */}
            <div>
              <label htmlFor="cardName" className="block text-sm text-[#3F3F3F] dark:text-[#BEBEBE] mb-2">
                Card Name
              </label>
              <input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="e.g., Chase Sapphire"
                className="w-full px-3 py-2.5 border border-[#BEBEBE] dark:border-[#3F3F3F] rounded-lg bg-white dark:bg-[#252525] text-[#1C1C1C] dark:text-[#E4E4E4] placeholder:text-[#BEBEBE] dark:placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
              />
            </div>

            {/* Issuer */}
            <div>
              <label htmlFor="issuer" className="block text-sm text-[#3F3F3F] dark:text-[#BEBEBE] mb-2">
                Issuer
              </label>
              <input
                id="issuer"
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g., Chase"
                className="w-full px-3 py-2.5 border border-[#BEBEBE] dark:border-[#3F3F3F] rounded-lg bg-white dark:bg-[#252525] text-[#1C1C1C] dark:text-[#E4E4E4] placeholder:text-[#BEBEBE] dark:placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
              />
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#3F3F3F] dark:text-[#BEBEBE]">Financial Details</h3>

            {/* Credit Limit */}
            <div>
              <label htmlFor="creditLimit" className="block text-sm text-[#3F3F3F] dark:text-[#BEBEBE] mb-2">
                Credit Limit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] dark:text-[#6B6B6B]">$</span>
                <input
                  id="creditLimit"
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2.5 border border-[#BEBEBE] dark:border-[#3F3F3F] rounded-lg bg-white dark:bg-[#252525] text-[#1C1C1C] dark:text-[#E4E4E4] placeholder:text-[#BEBEBE] dark:placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
                />
              </div>
            </div>

            {/* Current Balance */}
            <div>
              <label htmlFor="balance" className="block text-sm text-[#3F3F3F] dark:text-[#BEBEBE] mb-2">
                Current Balance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] dark:text-[#6B6B6B]">$</span>
                <input
                  id="balance"
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2.5 border border-[#BEBEBE] dark:border-[#3F3F3F] rounded-lg bg-white dark:bg-[#252525] text-[#1C1C1C] dark:text-[#E4E4E4] placeholder:text-[#BEBEBE] dark:placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
                />
              </div>
            </div>

            {/* Minimum Payment */}
            <div>
              <label htmlFor="minimumPayment" className="block text-sm text-[#3F3F3F] dark:text-[#BEBEBE] mb-2">
                Minimum Payment
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] dark:text-[#6B6B6B]">$</span>
                <input
                  id="minimumPayment"
                  type="number"
                  value={minimumPayment}
                  onChange={(e) => setMinimumPayment(e.target.value)}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2.5 border border-[#BEBEBE] dark:border-[#3F3F3F] rounded-lg bg-white dark:bg-[#252525] text-[#1C1C1C] dark:text-[#E4E4E4] placeholder:text-[#BEBEBE] dark:placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
                />
              </div>
            </div>

            {/* APR */}
            <div>
              <label htmlFor="apr" className="block text-sm text-[#3F3F3F] dark:text-[#BEBEBE] mb-2">
                APR
              </label>
              <div className="relative">
                <input
                  id="apr"
                  type="number"
                  step="0.01"
                  value={apr}
                  onChange={(e) => setApr(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 pr-8 border border-[#BEBEBE] dark:border-[#3F3F3F] rounded-lg bg-white dark:bg-[#252525] text-[#1C1C1C] dark:text-[#E4E4E4] placeholder:text-[#BEBEBE] dark:placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] dark:text-[#6B6B6B]">%</span>
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#3F3F3F] dark:text-[#BEBEBE]">Important Dates</h3>

            {/* Statement Close Date */}
            <div>
              <label htmlFor="statementClose" className="block text-sm text-[#3F3F3F] dark:text-[#BEBEBE] mb-2">
                Statement Closing Date
              </label>
              <input
                id="statementClose"
                type="date"
                value={statementCloseDate}
                onChange={(e) => setStatementCloseDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#BEBEBE] dark:border-[#3F3F3F] rounded-lg bg-white dark:bg-[#252525] text-[#1C1C1C] dark:text-[#E4E4E4] focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
              />
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm text-[#3F3F3F] dark:text-[#BEBEBE] mb-2">
                Payment Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#BEBEBE] dark:border-[#3F3F3F] rounded-lg bg-white dark:bg-[#252525] text-[#1C1C1C] dark:text-[#E4E4E4] focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
              />
            </div>
          </div>

          {/* Advanced Section - Collapsible */}
          <div className="pt-4 border-t border-[#E4E4E4] dark:border-[#3F3F3F]">
            <button
              onClick={() => setAdvancedExpanded(!advancedExpanded)}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-medium text-[#3F3F3F] dark:text-[#BEBEBE]">Advanced</h3>
              {advancedExpanded ? (
                <ChevronUp size={20} className="text-[#9B9B9B] dark:text-[#6B6B6B]" />
              ) : (
                <ChevronDown size={20} className="text-[#9B9B9B] dark:text-[#6B6B6B]" />
              )}
            </button>
            
            {advancedExpanded && (
              <div className="space-y-4">
                {/* Promotional APR */}
                <div>
                  <label htmlFor="promoAPR" className="block text-sm text-[#3F3F3F] dark:text-[#BEBEBE] mb-2">
                    Promotional APR
                  </label>
                  <div className="relative">
                    <input
                      id="promoAPR"
                      type="number"
                      step="0.01"
                      value={promoAPR}
                      onChange={(e) => setPromoAPR(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2.5 pr-8 border border-[#BEBEBE] dark:border-[#3F3F3F] rounded-lg bg-white dark:bg-[#252525] text-[#1C1C1C] dark:text-[#E4E4E4] placeholder:text-[#BEBEBE] dark:placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] dark:text-[#6B6B6B]">%</span>
                  </div>
                </div>

                {/* Promo Expiration Date */}
                <div>
                  <label htmlFor="promoExpiration" className="block text-sm text-[#3F3F3F] dark:text-[#BEBEBE] mb-2">
                    Promo Expiration Date
                  </label>
                  <input
                    id="promoExpiration"
                    type="date"
                    value={promoExpiration}
                    onChange={(e) => setPromoExpiration(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#BEBEBE] dark:border-[#3F3F3F] rounded-lg bg-white dark:bg-[#252525] text-[#1C1C1C] dark:text-[#E4E4E4] focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="w-full py-3 bg-[#1C1C1C] dark:bg-[#E4E4E4] text-white dark:text-[#1C1C1C] rounded-lg font-medium hover:bg-[#3F3F3F] dark:hover:bg-[#BEBEBE] transition-colors"
            >
              Add Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

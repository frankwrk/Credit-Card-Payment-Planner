import { CreditCard, Settings, LayoutList } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'plan' | 'cards' | 'settings';
  onTabChange: (tab: 'plan' | 'cards' | 'settings') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'plan' as const, label: 'Plan', icon: LayoutList },
    { id: 'cards' as const, label: 'Cards', icon: CreditCard },
    { id: 'settings' as const, label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#252525] border-t border-[#E4E4E4] dark:border-[#3F3F3F] safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-6 py-2 transition-colors ${
                isActive ? 'text-[#1C1C1C] dark:text-[#E4E4E4]' : 'text-[#BEBEBE] dark:text-[#6B6B6B]'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

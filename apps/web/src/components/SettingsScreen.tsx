import { RefreshCw, FileText, MessageSquare, ChevronRight, Moon, Sun, Upload } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();

  const handleExportData = () => {
    // In a real app, this would export actual user data
    const data = {
      cards: [],
      settings: { theme },
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#1C1C1C] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-6">Settings</h1>

        <div className="space-y-4">
          {/* Appearance Section */}
          <div className="bg-white dark:bg-[#252525] rounded-lg border border-neutral-200 dark:border-[#3F3F3F] overflow-hidden">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#2C2C2C] transition-colors"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon size={20} className="text-neutral-600 dark:text-neutral-400" />
                ) : (
                  <Sun size={20} className="text-neutral-600 dark:text-neutral-400" />
                )}
                <div className="text-left">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">Appearance</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-neutral-400 dark:text-neutral-500" />
            </button>
          </div>

          {/* Data Section */}
          <div className="bg-white dark:bg-[#252525] rounded-lg border border-neutral-200 dark:border-[#3F3F3F] overflow-hidden divide-y divide-neutral-200 dark:divide-[#3F3F3F]">
            <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#2C2C2C] transition-colors">
              <div className="flex items-center gap-3">
                <RefreshCw size={20} className="text-neutral-600 dark:text-neutral-400" />
                <div className="text-left">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">Refresh Data</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Last synced 2 hours ago</div>
                </div>
              </div>
              <ChevronRight size={20} className="text-neutral-400 dark:text-neutral-500" />
            </button>
            <button 
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#2C2C2C] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Upload size={20} className="text-neutral-600 dark:text-neutral-400" />
                <div className="text-left">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">Export Data</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Download your data as JSON</div>
                </div>
              </div>
              <ChevronRight size={20} className="text-neutral-400 dark:text-neutral-500" />
            </button>
          </div>

          {/* Support Section */}
          <div className="bg-white dark:bg-[#252525] rounded-lg border border-neutral-200 dark:border-[#3F3F3F] overflow-hidden divide-y divide-neutral-200 dark:divide-[#3F3F3F]">
            <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#2C2C2C] transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-neutral-600 dark:text-neutral-400" />
                <span className="font-medium text-neutral-900 dark:text-neutral-100">Send Feedback</span>
              </div>
              <ChevronRight size={20} className="text-neutral-400 dark:text-neutral-500" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#2C2C2C] transition-colors">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-neutral-600 dark:text-neutral-400" />
                <span className="font-medium text-neutral-900 dark:text-neutral-100">Legal & Privacy</span>
              </div>
              <ChevronRight size={20} className="text-neutral-400 dark:text-neutral-500" />
            </button>
          </div>

          {/* App Info */}
          <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 pt-6">
            <p className="font-medium tracking-wider">APEX</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

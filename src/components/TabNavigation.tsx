'use client';

import { useEffect } from 'react';

interface TabNavigationProps {
  activeTab: 'salary-sacrifice' | 'bik';
  setActiveTab: (tab: 'salary-sacrifice' | 'bik') => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  // Sync URL with active tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'bik') {
      setActiveTab('bik');
    }
  }, [setActiveTab]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.pushState({}, '', url.toString());
  }, [activeTab]);

  const handleTabChange = (tab: 'salary-sacrifice' | 'bik') => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-8">
      <button
        onClick={() => handleTabChange('salary-sacrifice')}
        className={`
          px-6 py-3 rounded-t-lg font-semibold transition-all duration-200
          ${
            activeTab === 'salary-sacrifice'
              ? 'bg-white border-2 border-b-0 border-green-600 text-green-600 shadow-sm'
              : 'bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }
        `}
      >
        💰 Salary Sacrifice
      </button>
      <button
        onClick={() => handleTabChange('bik')}
        className={`
          px-6 py-3 rounded-t-lg font-semibold transition-all duration-200
          ${
            activeTab === 'bik'
              ? 'bg-white border-2 border-b-0 border-green-600 text-green-600 shadow-sm'
              : 'bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }
        `}
      >
        📊 BiK Tax Calculator
      </button>
    </div>
  );
}


'use client';

import { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import SalarySacrificeTab from '@/components/tabs/SalarySacrificeTab';
import BikCalculatorTab from '@/components/tabs/BikCalculatorTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'salary-sacrifice' | 'bik'>('salary-sacrifice');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">UK Car Tax & Salary Sacrifice Calculator</h1>
          <p className="text-lg text-gray-600">
            Calculate your real costs with transparent, independent calculations
          </p>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'salary-sacrifice' ? (
          <SalarySacrificeTab />
        ) : (
          <BikCalculatorTab />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-600">
          <p className="mb-2">
            <strong>UK Car Tax & Salary Sacrifice Calculator</strong> - The UK&apos;s most transparent calculator
          </p>
          <p className="text-sm">
            Built with Next.js, Supabase, and Tailwind CSS • 
            <a href="https://github.com" className="text-blue-600 hover:underline ml-1">View on GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
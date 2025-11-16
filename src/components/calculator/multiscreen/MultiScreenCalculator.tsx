'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CalculatorProvider, useCalculator } from './context/CalculatorContext';
import { ProgressIndicator } from './shared/ProgressIndicator';
import { IntroStep } from './steps/IntroStep';
import { SalaryStep } from './steps/SalaryStep';
import { CarSelectionStep } from './steps/CarSelectionStep';
import { CarOverviewStep } from './steps/CarOverviewStep';
import { ResultsStep } from './steps/ResultsStep';

/**
 * Multi-Screen Calculator Content
 * Renders the appropriate step based on current state
 */
function MultiScreenCalculatorContent() {
  const { currentStep } = useCalculator();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <IntroStep />;
      case 2:
        return <SalaryStep />;
      case 3:
        return <CarSelectionStep />;
      case 4:
        return <CarOverviewStep />;
      case 5:
        return <ResultsStep />;
      default:
        return <IntroStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section - Only show on intro step */}
      {currentStep === 1 && (
        <div className="bg-black py-20">
          <div className="container-1440">
            <h1 className="text-5xl md:text-6xl font-bold text-white text-center">
              Salary Sacrifice Calculator
            </h1>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Progress Indicator - Show on steps 2-5 */}
          {currentStep > 1 && (
            <div className="mb-8">
              <ProgressIndicator currentStep={currentStep - 1} totalSteps={4} />
            </div>
          )}

          {/* Current Step */}
          <div className="animate-in fade-in duration-300">{renderStep()}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/**
 * Multi-Screen Calculator
 * Main wrapper component with context provider
 */
export default function MultiScreenCalculator() {
  return (
    <CalculatorProvider>
      <MultiScreenCalculatorContent />
    </CalculatorProvider>
  );
}

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Car } from '@/lib/carData';

/**
 * Calculator state for multi-screen flow
 */
export interface MultiScreenCalculatorState {
  // Current step (1-5)
  currentStep: number;

  // Step 2: Salary input
  salary: number | null;
  taxBand: '20%' | '40%' | '45%' | null;

  // Step 3-4: Car selection
  selectedCar: Car | null;

  // Step 5: Results
  results: {
    fourYearSavings: number;
    monthlySavings: number;
    currentTakeHome: number;
    newTakeHome: number;
    bikTaxAnnual: number;
    bikTaxMonthly: number;
  } | null;
}

/**
 * Calculator context methods
 */
interface CalculatorContextType extends MultiScreenCalculatorState {
  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  resetCalculator: () => void;

  // State setters
  setSalary: (salary: number) => void;
  setTaxBand: (band: '20%' | '40%' | '45%') => void;
  selectCar: (car: Car) => void;
  setResults: (results: MultiScreenCalculatorState['results']) => void;

  // Validation
  canProceedFromStep: (step: number) => boolean;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

/**
 * Initial state
 */
const initialState: MultiScreenCalculatorState = {
  currentStep: 1,
  salary: null,
  taxBand: null,
  selectedCar: null,
  results: null,
};

/**
 * Calculator Context Provider
 * Manages state for the multi-screen calculator flow
 */
export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MultiScreenCalculatorState>(initialState);

  const nextStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 5),
    }));
  };

  const previousStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setState((prev) => ({ ...prev, currentStep: step }));
    }
  };

  const resetCalculator = () => {
    setState(initialState);
  };

  const setSalary = (salary: number) => {
    setState((prev) => ({ ...prev, salary }));
  };

  const setTaxBand = (band: '20%' | '40%' | '45%') => {
    setState((prev) => ({ ...prev, taxBand: band }));
  };

  const selectCar = (car: Car) => {
    setState((prev) => ({ ...prev, selectedCar: car }));
  };

  const setResults = (results: MultiScreenCalculatorState['results']) => {
    setState((prev) => ({ ...prev, results }));
  };

  /**
   * Validation: check if user can proceed from a step
   */
  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1: // Intro - can always proceed
        return true;
      case 2: // Salary - need valid salary
        return state.salary !== null && state.salary > 0;
      case 3: // Car selection - need selected car
        return state.selectedCar !== null;
      case 4: // Car overview - need selected car
        return state.selectedCar !== null;
      case 5: // Results - can't proceed from final step
        return false;
      default:
        return false;
    }
  };

  const value: CalculatorContextType = {
    ...state,
    nextStep,
    previousStep,
    goToStep,
    resetCalculator,
    setSalary,
    setTaxBand,
    selectCar,
    setResults,
    canProceedFromStep,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

/**
 * Hook to use calculator context
 */
export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}

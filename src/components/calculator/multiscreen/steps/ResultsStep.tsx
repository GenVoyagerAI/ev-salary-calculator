'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalculator } from '../context/CalculatorContext';
import { calculateSalarySacrifice } from '@/lib/calculations';
import { formatCurrency, formatMonthlyCurrency } from '@/lib/utils';

/**
 * Results Step (Step 5)
 * Shows the calculated savings and provides actions
 */
export function ResultsStep() {
  const { salary, selectedCar, goToStep, setResults } = useCalculator();
  const [isCalculating, setIsCalculating] = useState(true);
  const [calculationResults, setCalculationResults] = useState<{
    fourYearSavings: number;
    monthlySavings: number;
    currentTakeHome: number;
    newTakeHome: number;
  } | null>(null);

  // Calculate results when component mounts
  useEffect(() => {
    if (!salary || !selectedCar) {
      goToStep(1);
      return;
    }

    // Simulate calculation delay for better UX
    setTimeout(() => {
      const inputs = {
        salary,
        carValue: selectedCar.listPrice,
        monthlyLease: selectedCar.monthlyLeaseRate,
        bikRate: selectedCar.bikRate,
        studentLoanPlan: 'none' as const,
        pensionContribution: 0,
        employerPensionContribution: 0,
      };

      const result = calculateSalarySacrifice(inputs);

      // Monthly savings is the difference
      const monthlySavings = result.monthlySavings;

      // 4-year savings (48 months)
      const fourYearSavings = monthlySavings * 48;

      const results = {
        fourYearSavings,
        monthlySavings,
        currentTakeHome: result.breakdown.grossMonthly,
        newTakeHome: result.breakdown.grossMonthly - result.breakdown.leaseCost,
        bikTaxAnnual: result.bikTax,
        bikTaxMonthly: result.bikTax / 12,
      };

      setCalculationResults(results);
      setResults(results);
      setIsCalculating(false);
    }, 800);
  }, [salary, selectedCar, goToStep, setResults]);

  const handleEmailResults = () => {
    // TODO: Implement email functionality
    alert('Email functionality coming soon!');
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    alert('PDF download coming soon!');
  };

  const handleTryAnotherCar = () => {
    goToStep(3);
  };

  if (isCalculating || !calculationResults) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Card className="p-8 md:p-12 bg-white border-gray-200 text-center">
          <div className="space-y-4">
            <div className="text-xl font-semibold text-gray-700">
              Calculating your savings...
            </div>
            <div className="flex justify-center">
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse mx-1" />
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse mx-1 delay-100" />
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse mx-1 delay-200" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Main Results Card */}
      <Card className="p-8 md:p-12 bg-white border-gray-200">
        {/* Heading */}
        <div className="text-center space-y-6 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            You could save....
          </h2>

          {/* Big Savings Card */}
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white space-y-2">
              <div className="text-sm font-medium opacity-90">
                You could save
              </div>
              <div className="text-5xl md:text-6xl font-bold">
                {formatCurrency(calculationResults.fourYearSavings)}
              </div>
              <div className="text-sm opacity-90">over 4 years</div>
              <div className="text-base font-medium pt-2">
                That&apos;s {formatMonthlyCurrency(calculationResults.monthlySavings)}/month! 🎉
              </div>
            </div>
          </div>

          {/* How it works section */}
          <div className="pt-6">
            <h3 className="text-base font-semibold text-gray-700 mb-4">
              How it works:
            </h3>

            {/* Comparison Cards */}
            <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
              {/* Current Take-Home */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="text-xs uppercase text-gray-600 mb-1 font-medium">
                  Current Take-Home
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatMonthlyCurrency(calculationResults.currentTakeHome)}
                </div>
              </div>

              {/* With Salary Sacrifice */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="text-xs uppercase text-gray-600 mb-1 font-medium">
                  With {selectedCar?.make} {selectedCar?.model}
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatMonthlyCurrency(calculationResults.newTakeHome)}
                </div>
              </div>
            </div>

            {/* Better off indicator */}
            <div className="mt-4 inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
              + {formatMonthlyCurrency(calculationResults.monthlySavings)} better off
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 max-w-md mx-auto">
          <Button
            onClick={handleEmailResults}
            size="lg"
            className="w-full bg-gray-900 hover:bg-gray-800"
          >
            Email me these results
          </Button>
          <Button
            onClick={handleDownloadPDF}
            size="lg"
            variant="outline"
            className="w-full"
          >
            See Full Breakdown (PDF)
          </Button>
          <Button
            onClick={handleTryAnotherCar}
            size="lg"
            variant="outline"
            className="w-full"
          >
            Try another car
          </Button>
        </div>
      </Card>
    </div>
  );
}

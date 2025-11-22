'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, X } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { formatCurrency } from '@/lib/utils';

/**
 * Car Overview Step (Step 4)
 * User reviews their selected car before seeing results
 */
export function CarOverviewStep() {
  const { selectedCar, previousStep, nextStep, goToStep } = useCalculator();

  if (!selectedCar) {
    // If no car selected, go back to selection
    goToStep(3);
    return null;
  }

  const handleChangeCar = () => {
    goToStep(3);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-8 md:p-12 bg-white border-gray-200">
        {/* Heading */}
        <div className="text-center space-y-6 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Which car are you interested in?
          </h2>

          {/* Selected Car Card */}
          <div className="max-w-md mx-auto">
            <div className="border-2 border-blue-500 rounded-lg p-6 space-y-4 bg-blue-50/30">
              {/* Car Name */}
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedCar.fullName}
              </h3>

              {/* Car Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <div className="text-sm text-gray-600">List Price:</div>
                  <div className="font-medium text-gray-900">
                    {formatCurrency(selectedCar.listPrice)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Monthly Cost:</div>
                  <div className="font-medium text-gray-900">
                    £{selectedCar.monthlyLeaseRate}/mo
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Range:</div>
                  <div className="font-medium text-gray-900">
                    {selectedCar.range} miles
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">BiK Rate:</div>
                  <div className="font-medium text-gray-900">
                    {selectedCar.bikRate}%
                  </div>
                </div>
              </div>

              {/* Change Car Link */}
              <button
                onClick={handleChangeCar}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                Change car
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center gap-4">
          {/* Show my savings button (green) */}
          <Button
            onClick={nextStep}
            size="lg"
            className="min-w-[200px] bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          >
            Show my savings
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Back button */}
          <button
            onClick={previousStep}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </Card>
    </div>
  );
}

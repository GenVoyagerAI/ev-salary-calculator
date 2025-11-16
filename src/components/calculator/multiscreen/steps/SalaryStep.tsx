'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCalculator } from '../context/CalculatorContext';
import { StepNavigation } from '../shared/StepNavigation';
import { getTaxBracketInfo } from '@/lib/tax-rates';

/**
 * Salary Step (Step 2)
 * User enters their annual salary and sees real-time tax band feedback
 */
export function SalaryStep() {
  const { salary, setSalary, setTaxBand, nextStep, canProceedFromStep } =
    useCalculator();

  const [inputValue, setInputValue] = useState(
    salary ? salary.toString() : ''
  );
  const [displayValue, setDisplayValue] = useState('');

  // Update salary and tax band when input changes
  useEffect(() => {
    const numericValue = parseInt(inputValue.replace(/,/g, ''), 10);

    if (!isNaN(numericValue) && numericValue > 0) {
      setSalary(numericValue);

      // Calculate tax band
      const taxBracketInfo = getTaxBracketInfo(numericValue);
      const taxRate = taxBracketInfo.rate * 100;
      setTaxBand(`${taxRate}%` as '20%' | '40%' | '45%');

      // Format display value
      setDisplayValue(numericValue.toLocaleString());
    } else {
      setDisplayValue('');
    }
    // setSalary and setTaxBand are stable functions from context, safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters except for commas
    const value = e.target.value.replace(/[^\d]/g, '');
    setInputValue(value);
  };

  const getTaxBandMessage = () => {
    if (!salary || salary <= 0) return null;

    const taxBracketInfo = getTaxBracketInfo(salary);
    const taxRate = taxBracketInfo.rate * 100;

    return `You're a ${taxRate}% tax payer`;
  };

  const canProceed = canProceedFromStep(2);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-8 md:p-12 md:h-[600px] bg-white border-gray-200">
        {/* Heading */}
        <div className="text-center space-y-6 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            First, tell us about you
          </h2>

          {/* Salary Input */}
          <div className="space-y-3">
            <Label
              htmlFor="salary"
              className="text-base text-gray-700 font-normal text-center block"
            >
              What is your annual salary?
            </Label>
            <div className="relative max-w-md mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                £
              </span>
              <Input
                id="salary"
                type="text"
                value={displayValue}
                onChange={handleInputChange}
                placeholder=""
                className="text-lg h-14 pl-8 pr-4 text-center"
                autoFocus
              />
            </div>
          </div>

          {/* Tax Band Feedback */}
          {getTaxBandMessage() && (
            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm"
              >
                {getTaxBandMessage()}
              </Badge>
            </div>
          )}
        </div>

        {/* Navigation */}
        <StepNavigation
          onNext={nextStep}
          nextDisabled={!canProceed}
          showBack={false}
        />
      </Card>
    </div>
  );
}

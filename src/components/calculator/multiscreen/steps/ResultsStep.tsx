'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { calculateSalarySacrifice } from '@/lib/calculations';
import { formatCurrency, formatMonthlyCurrency, cn } from '@/lib/utils';
import { ExpandableSection } from '../shared/ExpandableSection';

/**
 * Results Step (Step 5)
 * Shows the calculated savings with detailed breakdown and important info
 */
export function ResultsStep() {
  const { salary, selectedCar, goToStep, setResults } = useCalculator();
  const [isCalculating, setIsCalculating] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [calculationResults, setCalculationResults] = useState<{
    fourYearSavings: number;
    monthlySavings: number;
    currentTakeHome: number;
    newTakeHome: number;
    grossMonthly: number;
    incomeTaxBefore: number;
    niBefore: number;
    incomeTaxAfter: number;
    niAfter: number;
    bikTaxMonthly: number;
    leaseCost: number;
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

      // Monthly values
      const grossMonthly = salary / 12;
      const monthlySavings = result.monthlySavings;
      const fourYearSavings = monthlySavings * 48;

      // Tax calculations (simplified estimates)
      const taxRate = salary > 50270 ? 0.40 : 0.20;
      const niRate = salary > 50284 ? 0.02 : 0.08;

      const incomeTaxBefore = grossMonthly * taxRate;
      const niBefore = grossMonthly * niRate;

      const postSacrificeMonthly = grossMonthly - selectedCar.monthlyLeaseRate;
      const incomeTaxAfter = postSacrificeMonthly * taxRate;
      const niAfter = postSacrificeMonthly * niRate;
      const bikTaxMonthly = (selectedCar.listPrice * (selectedCar.bikRate / 100) * taxRate) / 12;

      const results = {
        fourYearSavings,
        monthlySavings,
        currentTakeHome: grossMonthly - incomeTaxBefore - niBefore,
        newTakeHome: postSacrificeMonthly - incomeTaxAfter - niAfter - bikTaxMonthly,
        grossMonthly,
        incomeTaxBefore,
        niBefore,
        incomeTaxAfter,
        niAfter,
        bikTaxMonthly,
        leaseCost: selectedCar.monthlyLeaseRate,
      };

      setCalculationResults(results);
      setResults({
        fourYearSavings,
        monthlySavings,
        currentTakeHome: results.currentTakeHome,
        newTakeHome: results.newTakeHome,
        bikTaxAnnual: bikTaxMonthly * 12,
        bikTaxMonthly,
      });
      setIsCalculating(false);
    }, 800);
  }, [salary, selectedCar, goToStep, setResults]);

  const handleEmailResults = () => {
    alert('Email functionality coming soon!');
  };

  const handleDownloadPDF = () => {
    alert('PDF download coming soon!');
  };

  const handleTryAnotherCar = () => {
    goToStep(3);
  };

  // Get tax bracket info
  const getTaxBracket = () => {
    if (!salary) return '20%';
    if (salary > 125140) return '45%';
    if (salary > 50270) return '40%';
    return '20%';
  };

  // Calculate pension reduction (5% contribution rate)
  const getPensionReduction = () => {
    if (!salary || !selectedCar) return 0;
    const currentPension = salary * 0.05 / 12;
    const newSalary = salary - (selectedCar.monthlyLeaseRate * 12);
    const newPension = newSalary * 0.05 / 12;
    return currentPension - newPension;
  };

  // Calculate savings for different tax brackets
  const getSavingsByBracket = () => {
    if (!selectedCar) return { basic: 0, higher: 0, additional: 0 };
    const leaseCost = selectedCar.monthlyLeaseRate;

    // Tax + NI savings per bracket
    const basicSavings = leaseCost * (0.20 + 0.08) - (selectedCar.listPrice * (selectedCar.bikRate / 100) * 0.20) / 12;
    const higherSavings = leaseCost * (0.40 + 0.02) - (selectedCar.listPrice * (selectedCar.bikRate / 100) * 0.40) / 12;
    const additionalSavings = leaseCost * (0.45 + 0.02) - (selectedCar.listPrice * (selectedCar.bikRate / 100) * 0.45) / 12;

    return {
      basic: Math.max(0, basicSavings),
      higher: Math.max(0, higherSavings),
      additional: Math.max(0, additionalSavings),
    };
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

  const taxBracket = getTaxBracket();
  const pensionReduction = getPensionReduction();
  const savingsByBracket = getSavingsByBracket();
  const maxSavings = savingsByBracket.additional;

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
                That&apos;s {formatMonthlyCurrency(calculationResults.monthlySavings)}/month!
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
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-900">
                <div className="text-xs uppercase text-gray-600 mb-1 font-medium">
                  With {selectedCar?.make} {selectedCar?.model}
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatMonthlyCurrency(calculationResults.newTakeHome)}
                </div>
                <div className="text-sm text-gray-900 font-semibold mt-2">
                  + Brand new car
                </div>
              </div>
            </div>

            {/* Better off indicator */}
            <div className="mt-4 inline-block bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold border-2 border-gray-900">
              + {formatMonthlyCurrency(calculationResults.monthlySavings)} better off
            </div>

            {/* Breakdown Toggle */}
            <div className="mt-4">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-gray-900 font-medium text-sm flex items-center gap-1 mx-auto hover:bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer"
              >
                See detailed breakdown
                <ChevronDown className={cn('h-4 w-4 transition-transform', showBreakdown && 'rotate-180')} />
              </button>
            </div>

            {/* Detailed Breakdown */}
            {showBreakdown && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-6 text-left text-sm">
                  {/* Current Situation */}
                  <div>
                    <h4 className="text-gray-500 font-medium mb-3">Current Situation</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>Gross Salary:</span>
                        <span>{formatMonthlyCurrency(calculationResults.grossMonthly)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>Income Tax ({taxBracket}):</span>
                        <span>-{formatMonthlyCurrency(calculationResults.incomeTaxBefore)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>National Insurance:</span>
                        <span>-{formatMonthlyCurrency(calculationResults.niBefore)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>Car Costs:</span>
                        <span>£0</span>
                      </div>
                      <div className="flex justify-between py-2 border-t-2 border-b-2 border-gray-900 font-bold">
                        <span>Take-home:</span>
                        <span>{formatMonthlyCurrency(calculationResults.currentTakeHome)}</span>
                      </div>
                    </div>
                  </div>

                  {/* With Salary Sacrifice */}
                  <div>
                    <h4 className="text-gray-500 font-medium mb-3">With {selectedCar?.fullName}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>Gross Salary:</span>
                        <span>{formatMonthlyCurrency(calculationResults.grossMonthly - calculationResults.leaseCost)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>Income Tax ({taxBracket}):</span>
                        <span className="text-gray-600 font-semibold">-{formatMonthlyCurrency(calculationResults.incomeTaxAfter)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>National Insurance:</span>
                        <span className="text-gray-600 font-semibold">-{formatMonthlyCurrency(calculationResults.niAfter)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>BiK Tax ({selectedCar?.bikRate}%):</span>
                        <span>-{formatMonthlyCurrency(calculationResults.bikTaxMonthly)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t-2 border-b-2 border-gray-900 font-bold">
                        <span>Take-home:</span>
                        <span>{formatMonthlyCurrency(calculationResults.newTakeHome)}</span>
                      </div>
                      <p className="text-gray-900 font-semibold mt-2">+ Car included!</p>
                    </div>
                  </div>
                </div>

                {/* How we calculated this */}
                <div className="mt-4 bg-gray-50 border-l-4 border-gray-900 p-4 rounded-r-lg text-sm">
                  <strong>How we calculated this:</strong><br />
                  Salary sacrifice of {formatMonthlyCurrency(calculationResults.leaseCost)} saves you {formatMonthlyCurrency(calculationResults.incomeTaxBefore - calculationResults.incomeTaxAfter + calculationResults.niBefore - calculationResults.niAfter)} in tax and NI. You pay {formatMonthlyCurrency(calculationResults.bikTaxMonthly)} BiK tax on the car benefit.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 max-w-md mx-auto">
          <Button
            onClick={handleEmailResults}
            size="lg"
            className="w-full bg-gray-900 hover:bg-gray-800 cursor-pointer"
          >
            Email me these results
          </Button>
          <Button
            onClick={handleDownloadPDF}
            size="lg"
            variant="outline"
            className="w-full cursor-pointer"
          >
            See Full Breakdown (PDF)
          </Button>
          <Button
            onClick={handleTryAnotherCar}
            size="lg"
            variant="outline"
            className="w-full cursor-pointer"
          >
            Try another car
          </Button>
        </div>
      </Card>

      {/* What's Included */}
      <Card className="p-6 md:p-8 bg-white border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s Included</h3>
        <p className="text-sm text-gray-600 mb-4">Everything you need, with no hidden costs:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            `Brand new ${selectedCar?.fullName}`,
            'Full comprehensive insurance',
            'All servicing & maintenance',
            'Road tax (£0 for EVs)',
            'Breakdown cover',
            'Tyre replacement',
            'Home charger installation',
            'Charging credit',
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <Check className="h-4 w-4 text-gray-900 flex-shrink-0" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
          <strong className="text-sm">No surprises, no hidden fees</strong>
        </div>
      </Card>

      {/* Important Things to Know */}
      <Card className="p-6 md:p-8 bg-white border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Things to Know</h3>

        <div className="space-y-3">
          <ExpandableSection title="Your pension will be affected">
            <p>Your pension contribution will reduce by approximately <strong>{formatMonthlyCurrency(pensionReduction)}</strong> because it&apos;s calculated on your post-sacrifice salary.</p>
            <p className="mt-2">However, you&apos;re still <strong>{formatMonthlyCurrency(calculationResults.monthlySavings - pensionReduction)}</strong> better off overall, so it&apos;s still a great deal!</p>
            <p className="mt-2 text-xs text-gray-500">Example: 5% pension on {formatCurrency(salary || 0)} = {formatMonthlyCurrency((salary || 0) * 0.05 / 12)}. After sacrifice: {formatMonthlyCurrency(((salary || 0) - (selectedCar?.monthlyLeaseRate || 0) * 12) * 0.05 / 12)}. Difference: {formatMonthlyCurrency(pensionReduction)}</p>
          </ExpandableSection>

          <ExpandableSection title="Eligibility requirements">
            <p>To qualify for salary sacrifice, you must:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Have completed your probation period</li>
              <li>Be on a permanent contract</li>
              <li>Be paid via PAYE</li>
              <li>Earn above minimum wage after sacrifice</li>
              <li>Hold a valid UK driving licence</li>
              <li>Not be planning to retire during the contract</li>
            </ul>
            <p className="mt-2">Your employer will verify eligibility during the application process.</p>
          </ExpandableSection>

          <ExpandableSection title="What if I leave my company?">
            <p>If you leave your employer during the lease period:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>Early termination fees</strong> may apply (typically remaining lease payments)</li>
              <li>Your employer&apos;s policy will determine the exact process</li>
              <li>Some schemes allow you to continue the lease privately</li>
              <li>Others may require you to return the vehicle</li>
            </ul>
            <p className="mt-2 text-gray-600 font-semibold">It&apos;s important to discuss this with your HR department before signing up.</p>
          </ExpandableSection>

          <ExpandableSection title="BiK rates are changing">
            <p>Electric vehicle BiK rates will increase over the next few years:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>2025/26:</strong> 3% (current)</li>
              <li><strong>2026/27:</strong> 4%</li>
              <li><strong>2027/28:</strong> 5%</li>
              <li><strong>2028/29:</strong> 5%</li>
            </ul>
            <p className="mt-2">Even with these increases, EVs remain significantly cheaper than petrol/diesel cars (which can be 20-37% BiK).</p>
          </ExpandableSection>
        </div>
      </Card>

      {/* Tax Bracket Comparison */}
      <Card className="p-6 md:p-8 bg-white border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">How This Compares</h3>
        <p className="text-sm text-gray-600 mb-4">Your savings compared to other tax brackets:</p>

        <div className="space-y-4">
          {/* 20% taxpayer */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={taxBracket === '20%' ? 'font-bold' : ''}>
                20% taxpayer {taxBracket === '20%' && '(You!)'}
              </span>
              <span className={taxBracket === '20%' ? 'font-bold' : ''}>
                {formatMonthlyCurrency(savingsByBracket.basic)}/month
              </span>
            </div>
            <div className="h-7 bg-gray-200 rounded-lg overflow-hidden">
              <div
                className={cn(
                  'h-full flex items-center justify-end pr-2 text-white text-xs font-semibold',
                  taxBracket === '20%' ? 'bg-gray-900' : 'bg-gray-500'
                )}
                style={{ width: `${Math.max(10, (savingsByBracket.basic / maxSavings) * 100)}%` }}
              >
                {formatMonthlyCurrency(savingsByBracket.basic)}
              </div>
            </div>
          </div>

          {/* 40% taxpayer */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={taxBracket === '40%' ? 'font-bold' : ''}>
                40% taxpayer {taxBracket === '40%' && '(You!)'}
              </span>
              <span className={taxBracket === '40%' ? 'font-bold' : ''}>
                {formatMonthlyCurrency(savingsByBracket.higher)}/month
              </span>
            </div>
            <div className="h-7 bg-gray-200 rounded-lg overflow-hidden">
              <div
                className={cn(
                  'h-full flex items-center justify-end pr-2 text-white text-xs font-semibold',
                  taxBracket === '40%' ? 'bg-gray-900' : 'bg-gray-500'
                )}
                style={{ width: `${Math.max(10, (savingsByBracket.higher / maxSavings) * 100)}%` }}
              >
                {formatMonthlyCurrency(savingsByBracket.higher)}
              </div>
            </div>
          </div>

          {/* 45% taxpayer */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={taxBracket === '45%' ? 'font-bold' : ''}>
                45% taxpayer {taxBracket === '45%' && '(You!)'}
              </span>
              <span className={taxBracket === '45%' ? 'font-bold' : ''}>
                {formatMonthlyCurrency(savingsByBracket.additional)}/month
              </span>
            </div>
            <div className="h-7 bg-gray-200 rounded-lg overflow-hidden">
              <div
                className={cn(
                  'h-full flex items-center justify-end pr-2 text-white text-xs font-semibold',
                  taxBracket === '45%' ? 'bg-gray-900' : 'bg-gray-500'
                )}
                style={{ width: '100%' }}
              >
                {formatMonthlyCurrency(savingsByBracket.additional)}
              </div>
            </div>
          </div>
        </div>

        {taxBracket === '40%' && (
          <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <strong className="text-sm">As a 40% taxpayer, you&apos;re in the sweet spot!</strong><br />
            <span className="text-xs text-gray-600">You save significantly more than basic rate taxpayers, making this an excellent benefit.</span>
          </div>
        )}
      </Card>
    </div>
  );
}

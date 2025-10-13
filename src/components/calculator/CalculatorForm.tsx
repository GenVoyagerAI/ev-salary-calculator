'use client';

import { useState } from 'react';
import { CalculatorInputs, CalculationResult } from '@/types';
import { calculateSalarySacrifice, formatCurrency, formatMonthlyCurrency } from '@/lib/calculations';
import { saveCalculation, trackEvent } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Calculator, Car, CreditCard, AlertTriangle, Share2, Copy } from 'lucide-react';

const initialInputs: CalculatorInputs = {
  salary: 50000,
  carValue: 35000,
  monthlyLease: 350,
  bikRate: 2,
  studentLoanPlan: 'none',
  pensionContribution: 5,
  employerPensionContribution: 3,
};

export default function CalculatorForm() {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const calculationResult = calculateSalarySacrifice(inputs);
      setResult(calculationResult);
      
      // Save calculation to database for analytics
      await saveCalculation(inputs, calculationResult);
      
      // Track calculation event
      await trackEvent('calculation_completed', {
        salary: inputs.salary,
        carValue: inputs.carValue,
        monthlyLease: inputs.monthlyLease,
        bikRate: inputs.bikRate,
        studentLoanPlan: inputs.studentLoanPlan,
        totalMonthlyCost: calculationResult.totalMonthlyCost,
        monthlySavings: calculationResult.monthlySavings
      });
      
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getTaxBracket = (salary: number) => {
    if (salary <= 50270) return 'Basic Rate (20%)';
    if (salary <= 125140) return 'Higher Rate (40%)';
    return 'Additional Rate (45%)';
  };

  const getStudentLoanPlanName = (plan: string) => {
    switch (plan) {
      case 'plan1': return 'Plan 1';
      case 'plan2': return 'Plan 2';
      case 'plan4': return 'Plan 4';
      case 'plan5': return 'Plan 5';
      default: return 'None';
    }
  };

  const handleShare = async () => {
    if (!result) return;

    const shareText = `🚗 EV Salary Sacrifice Calculator Results:
    
💰 Monthly Cost: ${formatMonthlyCurrency(result.totalMonthlyCost)}
💸 Tax Savings: ${formatMonthlyCurrency(result.monthlySavings)}
📊 Net Monthly Cost: ${formatMonthlyCurrency(result.totalMonthlyCost - result.monthlySavings)}

Try the calculator: ${window.location.origin}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'EV Salary Sacrifice Calculator Results',
          text: shareText,
          url: window.location.origin
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareMessage('Results copied to clipboard!');
        setTimeout(() => setShareMessage(''), 3000);
      }
      
      // Track share event
      await trackEvent('results_shared', {
        totalMonthlyCost: result.totalMonthlyCost,
        monthlySavings: result.monthlySavings
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">EV Salary Sacrifice Calculator</h1>
        <p className="text-lg text-gray-600">
          Calculate the real monthly cost of your electric car lease after tax savings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Your Details
            </CardTitle>
            <CardDescription>
              Enter your salary and car details to calculate your monthly cost
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Annual Salary (£)</Label>
              <Input
                id="salary"
                type="number"
                value={inputs.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="50000"
              />
              <p className="text-sm text-gray-500">
                Tax bracket: {getTaxBracket(inputs.salary)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carValue">Car Value (£)</Label>
              <Input
                id="carValue"
                type="number"
                value={inputs.carValue}
                onChange={(e) => handleInputChange('carValue', e.target.value)}
                placeholder="35000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyLease">Monthly Lease Cost (£)</Label>
              <Input
                id="monthlyLease"
                type="number"
                value={inputs.monthlyLease}
                onChange={(e) => handleInputChange('monthlyLease', e.target.value)}
                placeholder="350"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bikRate">BiK Rate (%)</Label>
              <Input
                id="bikRate"
                type="number"
                value={inputs.bikRate}
                onChange={(e) => handleInputChange('bikRate', e.target.value)}
                placeholder="2"
              />
              <p className="text-sm text-gray-500">
                Most electric vehicles have a 2% BiK rate
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentLoanPlan">Student Loan Plan</Label>
              <Select
                value={inputs.studentLoanPlan}
                onValueChange={(value) => handleInputChange('studentLoanPlan', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Student Loan</SelectItem>
                  <SelectItem value="plan1">Plan 1</SelectItem>
                  <SelectItem value="plan2">Plan 2</SelectItem>
                  <SelectItem value="plan4">Plan 4</SelectItem>
                  <SelectItem value="plan5">Plan 5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pensionContribution">Your Pension Contribution (%)</Label>
              <Input
                id="pensionContribution"
                type="number"
                value={inputs.pensionContribution}
                onChange={(e) => handleInputChange('pensionContribution', e.target.value)}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employerPensionContribution">Employer Pension Contribution (%)</Label>
              <Input
                id="employerPensionContribution"
                type="number"
                value={inputs.employerPensionContribution}
                onChange={(e) => handleInputChange('employerPensionContribution', e.target.value)}
                placeholder="3"
              />
            </div>

            <Button 
              onClick={handleCalculate} 
              className="w-full"
              disabled={isCalculating}
            >
              {isCalculating ? 'Calculating...' : 'Calculate Monthly Cost'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Your Results
            </CardTitle>
            <CardDescription>
              {result ? 'Here\'s your monthly cost breakdown' : 'Enter your details and click calculate'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {/* Monthly Cost Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-green-600 mb-1">Your Monthly Cost</p>
                    <p className="text-3xl font-bold text-green-700">
                      {formatMonthlyCurrency(result.totalMonthlyCost)}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      (Lease + BiK Tax)
                    </p>
                  </div>
                </div>

                {/* Savings */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-blue-600 mb-1">Monthly Tax Savings</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {formatMonthlyCurrency(result.monthlySavings)}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      (Income Tax + National Insurance)
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Cost Breakdown</h4>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Lease</span>
                    <span className="font-medium">{formatMonthlyCurrency(result.breakdown.leaseCost)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">BiK Tax (monthly)</span>
                    <span className="font-medium">{formatMonthlyCurrency(result.breakdown.bikCost)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax Savings</span>
                    <span className="font-medium text-green-600">-{formatMonthlyCurrency(result.monthlySavings)}</span>
                  </div>
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Net Monthly Cost</span>
                      <span>{formatMonthlyCurrency(result.totalMonthlyCost - result.monthlySavings)}</span>
                    </div>
                  </div>
                </div>

                {/* Pension Warning */}
                {result.pensionImpact > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pension Impact:</strong> Your pension contributions will be reduced by{' '}
                      {formatCurrency(result.pensionImpact)} per year due to the lower salary.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Annual Salary</p>
                    <p className="font-semibold">{formatCurrency(result.grossSalary)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Adjusted Salary</p>
                    <p className="font-semibold">{formatCurrency(result.adjustedSalary)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Student Loan Plan</p>
                    <p className="font-semibold">{getStudentLoanPlanName(inputs.studentLoanPlan)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">BiK Rate</p>
                    <p className="font-semibold">{inputs.bikRate}%</p>
                  </div>
                </div>

                {/* Share Button */}
                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleShare}
                    variant="outline" 
                    className="w-full"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Results
                  </Button>
                  {shareMessage && (
                    <p className="text-sm text-green-600 mt-2 text-center">{shareMessage}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter your details to see your monthly cost</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

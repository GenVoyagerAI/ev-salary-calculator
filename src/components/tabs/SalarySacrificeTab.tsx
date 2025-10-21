'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Calculator, Zap, Battery, Car } from 'lucide-react';
import { getBikRate } from '@/lib/co2-bik-rates';

interface SalarySacrificeInputs {
  salary: number;
  monthlyLeaseCost: number;
  p11dValue: number;
  fuelType: 'electric' | 'hybrid' | 'petrol';
}

const initialInputs: SalarySacrificeInputs = {
  salary: 50000,
  monthlyLeaseCost: 500,
  p11dValue: 35000,
  fuelType: 'electric',
};

export default function SalarySacrificeTab() {
  const [inputs, setInputs] = useState<SalarySacrificeInputs>(initialInputs);
  const [result, setResult] = useState<{
    monthlyLeaseCost: number;
    incomeTaxSaved: number;
    niSaved: number;
    bikTax: number;
    netMonthlyCost: number;
    monthlySavings: number;
    savingsPercentage: number;
    taxBracket: { rate: number; name: string };
    annualBiK: number;
    netAnnualCost: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: keyof SalarySacrificeInputs, value: string | number) => {
    console.log('Salary Sacrifice - Input change:', field, value);
    setInputs(prev => ({
      ...prev,
      [field]: field === 'fuelType' ? value : (typeof value === 'string' ? parseFloat(value) || 0 : value)
    }));
  };

  // Tax bracket determination
  const getTaxBracket = (salary: number) => {
    if (salary <= 50270) return { rate: 0.20, name: 'Basic' };
    if (salary <= 125140) return { rate: 0.40, name: 'Higher' };
    return { rate: 0.45, name: 'Additional' };
  };

  // NI rate (simplified)
  const getNIRate = (salary: number) => {
    if (salary <= 50270) return 0.08;
    return 0.02;
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const { salary, monthlyLeaseCost, p11dValue, fuelType } = inputs;
      
      // Main calculation
      const annualLeaseCost = monthlyLeaseCost * 12;
      const taxBracket = getTaxBracket(salary);
      const niRate = getNIRate(salary);
      const bikRate = getBikRate(fuelType);

      // Savings from salary sacrifice
      const incomeTaxSaved = annualLeaseCost * taxBracket.rate;
      const niSaved = annualLeaseCost * niRate;
      const totalSavings = incomeTaxSaved + niSaved;

      // BiK tax (added back)
      const annualBiK = p11dValue * bikRate;
      const bikTax = annualBiK * taxBracket.rate;

      // Net monthly cost
      const netAnnualCost = annualLeaseCost - totalSavings + bikTax;
      const netMonthlyCost = netAnnualCost / 12;

      // Savings calculation
      const afterTaxCost = monthlyLeaseCost * (1 - taxBracket.rate);
      const monthlySavings = afterTaxCost - netMonthlyCost;
      const savingsPercentage = (monthlySavings / afterTaxCost) * 100;

      setResult({
        monthlyLeaseCost,
        incomeTaxSaved,
        niSaved,
        bikTax,
        netMonthlyCost,
        monthlySavings,
        savingsPercentage,
        taxBracket,
        annualBiK,
        netAnnualCost
      });
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonthlyCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">💰 Salary Sacrifice Calculator</h1>
        <p className="text-lg text-gray-600">
          Calculate your real monthly cost after tax savings
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
            {/* Annual Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary">Annual Salary (£)</Label>
              <Input
                id="salary"
                type="number"
                value={inputs.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="50000"
                min="20000"
                max="200000"
              />
              <p className="text-sm text-gray-500">
                Tax Bracket: {getTaxBracket(inputs.salary).name} ({getTaxBracket(inputs.salary).rate * 100}%)
              </p>
            </div>

            {/* Monthly Lease Cost */}
            <div className="space-y-2">
              <Label htmlFor="monthlyLeaseCost">Monthly Lease Cost (£)</Label>
              <Input
                id="monthlyLeaseCost"
                type="number"
                value={inputs.monthlyLeaseCost}
                onChange={(e) => handleInputChange('monthlyLeaseCost', e.target.value)}
                placeholder="500"
                min="100"
                max="3000"
              />
              <p className="text-sm text-gray-500">
                The gross monthly cost from your employer scheme
              </p>
            </div>

            {/* Car Value / P11D */}
            <div className="space-y-2">
              <Label htmlFor="p11dValue">Car Value / P11D (£{inputs.p11dValue.toLocaleString()})</Label>
              <input
                type="range"
                min="15000"
                max="100000"
                step="1000"
                value={inputs.p11dValue}
                onChange={(e) => handleInputChange('p11dValue', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-sm text-gray-500">
                The official list price of the car
              </p>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <Label>Fuel Type (affects BiK rate)</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('fuelType', 'electric')}
                  className={`
                    flex flex-col items-center p-3 h-auto rounded-lg border-2 transition-all duration-200
                    ${inputs.fuelType === 'electric' 
                      ? 'border-green-600 bg-green-50 text-green-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <Zap className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Electric</span>
                  <span className="text-xs text-gray-500">2% BiK</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('fuelType', 'hybrid')}
                  className={`
                    flex flex-col items-center p-3 h-auto rounded-lg border-2 transition-all duration-200
                    ${inputs.fuelType === 'hybrid' 
                      ? 'border-green-600 bg-green-50 text-green-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <Battery className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Hybrid</span>
                  <span className="text-xs text-gray-500">8% BiK</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('fuelType', 'petrol')}
                  className={`
                    flex flex-col items-center p-3 h-auto rounded-lg border-2 transition-all duration-200
                    ${inputs.fuelType === 'petrol' 
                      ? 'border-green-600 bg-green-50 text-green-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <Car className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Petrol/Diesel</span>
                  <span className="text-xs text-gray-500">25% BiK</span>
                </button>
              </div>
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
              <Calculator className="h-5 w-5" />
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
                <Card className="bg-white border-2 border-green-600">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">💰 Your Real Monthly Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Monthly lease:</span>
                        <span>{formatMonthlyCurrency(result.monthlyLeaseCost)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Tax saved:</span>
                        <span>-{formatMonthlyCurrency(result.incomeTaxSaved / 12)} ({result.taxBracket.rate * 100}%)</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>NI saved:</span>
                        <span>-{formatMonthlyCurrency(result.niSaved / 12)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>BiK tax:</span>
                        <span>+{formatMonthlyCurrency(result.bikTax / 12)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-2xl font-bold">
                        <span>NET COST:</span>
                        <span className="text-green-600">{formatMonthlyCurrency(result.netMonthlyCost)}/month</span>
                      </div>
                    </div>

                    <Alert className="bg-green-50 border-green-200">
                      <span className="text-lg">🎉 You save {formatMonthlyCurrency(result.monthlySavings)}/month ({result.savingsPercentage.toFixed(0)}%)</span>
                      <p className="text-sm text-gray-600">vs paying after tax</p>
                    </Alert>

                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                      <p>Tax Bracket: {result.taxBracket.name} Rate ({result.taxBracket.rate * 100}%)</p>
                      <p>Annual BiK Tax: {formatCurrency(result.bikTax)}</p>
                      <p>Total over 3 years: {formatCurrency(result.netAnnualCost * 3)}</p>
                    </div>

                    <Alert className="mt-4" variant="destructive">
                      ⚠️ This may reduce your pension contributions
                    </Alert>
                  </CardContent>
                </Card>
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

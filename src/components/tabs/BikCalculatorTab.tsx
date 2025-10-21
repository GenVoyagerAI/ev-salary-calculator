'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Calculator, Zap, Battery, Car, Info } from 'lucide-react';
import { getBikRate, getFuelTypeLabel } from '@/lib/co2-bik-rates';
import { calculateBikForecast } from '@/lib/calculations';
import { BikForecast } from '@/components/BikForecast';

interface BikCalculatorInputs {
  salary: number;
  p11dValue: number;
  fuelType: 'electric' | 'hybrid' | 'petrol';
  co2Emissions: number;
}

const initialInputs: BikCalculatorInputs = {
  salary: 50000,
  p11dValue: 35000,
  fuelType: 'electric',
  co2Emissions: 0,
};

export default function BikCalculatorTab() {
  const [inputs, setInputs] = useState<BikCalculatorInputs>(initialInputs);
  const [result, setResult] = useState<{
    p11dValue: number;
    bikRate: number;
    annualBenefit: number;
    annualBikTax: number;
    monthlyBikTax: number;
    taxBracket: { rate: number; name: string };
    fuelTypeLabel: string;
    forecastData: any;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: keyof BikCalculatorInputs, value: string | number) => {
    console.log('BiK Calculator - Input change:', field, value);
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

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const { salary, p11dValue, fuelType, co2Emissions } = inputs;
      
      // Get BiK rate
      const bikRate = getBikRate(fuelType, co2Emissions);
      
      // Calculate BiK tax
      const annualBenefit = p11dValue * bikRate;
      const taxBracket = getTaxBracket(salary);
      const annualBikTax = annualBenefit * taxBracket.rate;
      const monthlyBikTax = annualBikTax / 12;

      // Calculate 4-year forecast
      const forecastData = calculateBikForecast(
        salary,
        p11dValue,
        fuelType,
        co2Emissions,
        taxBracket.rate
      );

      setResult({
        p11dValue,
        bikRate,
        annualBenefit,
        annualBikTax,
        monthlyBikTax,
        taxBracket,
        fuelTypeLabel: getFuelTypeLabel(fuelType),
        forecastData
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
        <h1 className="text-4xl font-bold text-gray-900">📊 BiK Tax Calculator</h1>
        <p className="text-lg text-gray-600">
          Calculate the Benefit in Kind tax on a company car
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Car Details
            </CardTitle>
            <CardDescription>
              Enter your salary and car details to calculate BiK tax
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Annual Salary */}
            <div className="space-y-2">
              <Label htmlFor="bik-salary">Annual Salary (£)</Label>
              <Input
                id="bik-salary"
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

            {/* Car Value / P11D */}
            <div className="space-y-2">
              <Label htmlFor="bik-p11dValue">Car Value / P11D (£{inputs.p11dValue.toLocaleString()})</Label>
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
              <Label>Fuel Type / BiK Rate</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('fuelType', 'electric')}
                  className={`
                    flex flex-col items-center p-3 h-auto rounded-lg border-2 transition-all duration-200
                    ${inputs.fuelType === 'electric' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <Zap className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Electric</span>
                  <span className="text-xs text-gray-500">2%</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('fuelType', 'hybrid')}
                  className={`
                    flex flex-col items-center p-3 h-auto rounded-lg border-2 transition-all duration-200
                    ${inputs.fuelType === 'hybrid' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <Battery className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Hybrid</span>
                  <span className="text-xs text-gray-500">8%</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('fuelType', 'petrol')}
                  className={`
                    flex flex-col items-center p-3 h-auto rounded-lg border-2 transition-all duration-200
                    ${inputs.fuelType === 'petrol' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <Car className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Petrol/Diesel</span>
                  <span className="text-xs text-gray-500">Custom</span>
                </button>
              </div>
            </div>

            {/* CO2 Emissions - Only show if Petrol/Diesel selected */}
            {inputs.fuelType === 'petrol' && (
              <div className="space-y-2">
                <Label htmlFor="bik-co2">CO₂ Emissions (g/km)</Label>
                <Input
                  id="bik-co2"
                  type="number"
                  value={inputs.co2Emissions}
                  onChange={(e) => handleInputChange('co2Emissions', e.target.value)}
                  placeholder="120"
                  min="0"
                  max="300"
                />
                <p className="text-sm text-gray-500">
                  Find this in your car specifications
                </p>
              </div>
            )}

            <Button 
              onClick={handleCalculate} 
              className="w-full"
              disabled={isCalculating}
            >
              {isCalculating ? 'Calculating...' : 'Calculate BiK Tax'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              BiK Tax Results
            </CardTitle>
            <CardDescription>
              {result ? 'Here\'s your BiK tax breakdown' : 'Enter your details and click calculate'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {/* BiK Tax Summary */}
                <Card className="bg-white border-2 border-blue-600">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">📊 Your BiK Tax</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Car Value (P11D):</span>
                        <span>{formatCurrency(result.p11dValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BiK Rate:</span>
                        <span>{(result.bikRate * 100).toFixed(0)}% ({result.fuelTypeLabel})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxable Benefit:</span>
                        <span>{formatCurrency(result.annualBenefit)}/year</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-2xl font-bold">
                        <span>ANNUAL BiK TAX:</span>
                        <span className="text-blue-600">{formatCurrency(result.annualBikTax)}</span>
                      </div>
                      <div className="flex justify-between text-xl">
                        <span>MONTHLY:</span>
                        <span className="text-blue-600">{formatMonthlyCurrency(result.monthlyBikTax)}</span>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                      <p>Tax Bracket: {result.taxBracket.name} Rate ({result.taxBracket.rate * 100}%)</p>
                      <p>Over 3 years: {formatCurrency(result.annualBikTax * 3)} total BiK tax</p>
                    </div>

                    <Alert className="mt-4">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        ℹ️ Electric cars have the lowest BiK rates (2%)
                      </AlertDescription>
                    </Alert>
                    <Alert className="mt-2">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        ℹ️ BiK rates increase 1% per year until 2027/28
                      </AlertDescription>
                    </Alert>

                    {/* 4-Year Forecast Section */}
                    {result.forecastData && (
                      <BikForecast
                        forecastData={result.forecastData}
                        salary={inputs.salary}
                        p11dValue={inputs.p11dValue}
                        taxBracketName={result.taxBracket.name}
                        taxRate={result.taxBracket.rate}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter your details to see your BiK tax</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

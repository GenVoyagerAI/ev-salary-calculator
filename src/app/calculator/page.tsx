'use client';

import { useState, useRef, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBikRate } from '@/lib/co2-bik-rates';
import { formatCurrency } from '@/lib/utils';

type ViewMode = 'annual' | 'monthly';

export default function CalculatorPage() {
  const [listPrice, setListPrice] = useState<string>('35000');
  const [fuelType, setFuelType] = useState<string>('petrol');
  const [co2Emissions, setCo2Emissions] = useState<string>('120');
  const [taxRate, setTaxRate] = useState<string>('20');
  const [carFuelBenefit, setCarFuelBenefit] = useState<string>('yes');
  const [result, setResult] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('annual');
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const price = parseFloat(listPrice) || 0;
    const co2 = parseFloat(co2Emissions) || 0;
    const rate = parseFloat(taxRate) / 100;

    // Get BiK rate based on fuel type and CO2
    const bikRate = getBikRate(fuelType as 'electric' | 'hybrid' | 'petrol', co2);

    // Calculate annual benefit value
    const annualBenefit = price * bikRate * rate;

    setResult(annualBenefit);
  };

  // Scroll to results on mobile after calculation
  useEffect(() => {
    if (result !== null && resultsRef.current && window.innerWidth < 1024) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [result]);

  const displayValue = result !== null
    ? (viewMode === 'annual' ? result : result / 12)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-black py-20">
        <div className="container-1440">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center">
            Company car BIK rate
          </h1>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="container-1440 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:divide-x lg:divide-gray-200">
            {/* Left Column - Form */}
            <div className="space-y-6 lg:pr-12 lg:col-span-1">
              <div className="space-y-2">
                <Label htmlFor="listPrice" className="text-base">
                  List price (£)
                </Label>
                <Input
                  id="listPrice"
                  type="number"
                  placeholder="0"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType" className="text-base">
                  Fuel type
                </Label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger id="fuelType" className="h-12 text-base">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(fuelType === 'petrol' || fuelType === 'diesel') && (
                <div className="space-y-2">
                  <Label htmlFor="co2Emissions" className="text-base">
                    CO2 emissions (g/km)
                  </Label>
                  <Input
                    id="co2Emissions"
                    type="number"
                    placeholder="Value"
                    value={co2Emissions}
                    onChange={(e) => setCo2Emissions(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="taxRate" className="text-base">
                  Income tax rate
                </Label>
                <Select value={taxRate} onValueChange={setTaxRate}>
                  <SelectTrigger id="taxRate" className="h-12 text-base">
                    <SelectValue placeholder="Select tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">Basic Rate (20%)</SelectItem>
                    <SelectItem value="40">Higher Rate (40%)</SelectItem>
                    <SelectItem value="45">Additional Rate (45%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carFuelBenefit" className="text-base">
                  Car fuel benefit?
                </Label>
                <Select value={carFuelBenefit} onValueChange={setCarFuelBenefit}>
                  <SelectTrigger id="carFuelBenefit" className="h-12 text-base">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full h-12 bg-black text-white hover:bg-gray-800 text-base font-medium"
              >
                Calculate
              </Button>
            </div>

            {/* Right Column - Results - Desktop */}
            <div
              className={`flex-col items-center justify-center space-y-8 lg:pl-12 lg:col-span-1 ${
                result === null ? 'hidden lg:flex' : 'hidden lg:flex'
              }`}
            >
                <h2 className="text-2xl font-semibold text-gray-900">Your results</h2>

                {/* Toggle Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant={viewMode === 'annual' ? 'default' : 'outline'}
                    onClick={() => setViewMode('annual')}
                    className={`px-8 py-2 rounded-full ${
                      viewMode === 'annual'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  >
                    Annual
                  </Button>
                  <Button
                    variant={viewMode === 'monthly' ? 'default' : 'outline'}
                    onClick={() => setViewMode('monthly')}
                    className={`px-8 py-2 rounded-full ${
                      viewMode === 'monthly'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  >
                    Monthly
                  </Button>
                </div>

                {/* Result Display */}
                <div className="text-center space-y-4">
                  <p className="text-gray-600 text-lg">Benefit value</p>
                  <p className="text-6xl font-bold text-gray-900">
                    {formatCurrency(displayValue)}
                  </p>
                </div>
              </div>
          </div>
        </div>

        {/* Mobile Results - Separate Card */}
        {result !== null && (
          <div
            ref={resultsRef}
            className="lg:hidden mt-8 bg-white rounded-3xl shadow-lg p-8"
          >
            <div className="flex flex-col items-center justify-center space-y-8">
              <h2 className="text-2xl font-semibold text-gray-900">Your results</h2>

              {/* Toggle Buttons */}
              <div className="flex gap-4">
                <Button
                  variant={viewMode === 'annual' ? 'default' : 'outline'}
                  onClick={() => setViewMode('annual')}
                  className={`px-8 py-2 rounded-full ${
                    viewMode === 'annual'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                >
                  Annual
                </Button>
                <Button
                  variant={viewMode === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setViewMode('monthly')}
                  className={`px-8 py-2 rounded-full ${
                    viewMode === 'monthly'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                >
                  Monthly
                </Button>
              </div>

              {/* Result Display */}
              <div className="text-center space-y-4">
                <p className="text-gray-600 text-lg">Benefit value</p>
                <p className="text-6xl font-bold text-gray-900">
                  {formatCurrency(displayValue)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

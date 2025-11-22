'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StepNavigation } from '../shared/StepNavigation';
import { useCalculator } from '../context/CalculatorContext';
import { searchCars, formatCarSummary, Car } from '@/lib/carData';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Car Selection Step (Step 3)
 * User searches for and selects a car
 */
export function CarSelectionStep() {
  const { selectCar, nextStep, previousStep, canProceedFromStep } =
    useCalculator();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update search results when query changes
  useEffect(() => {
    async function fetchCars() {
      if (searchQuery.trim()) {
        const results = await searchCars(searchQuery);
        setSearchResults(results);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }
    fetchCars();
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCarSelect = (car: Car) => {
    selectCar(car);
    setSelectedCarId(car.id);
    setSearchQuery(car.fullName);
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  const canProceed = canProceedFromStep(3);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-8 md:p-12 md:h-[600px] bg-white border-gray-200">
        {/* Heading */}
        <div className="text-center space-y-6 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Which car are you interested in?
          </h2>

          {/* Search Input */}
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Search for a car..."
                className="h-14 pl-12 pr-4 text-base"
              />
            </div>

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
              >
                {searchResults.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => handleCarSelect(car)}
                    className={cn(
                      'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer',
                      selectedCarId === car.id && 'bg-blue-50'
                    )}
                  >
                    <div className="font-medium text-gray-900">{car.fullName}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatCarSummary(car)}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results message */}
            {showDropdown && searchQuery && searchResults.length === 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500"
              >
                No cars found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <StepNavigation
          onNext={canProceed ? nextStep : undefined}
          onBack={previousStep}
          nextDisabled={!canProceed}
        />
      </Card>
    </div>
  );
}

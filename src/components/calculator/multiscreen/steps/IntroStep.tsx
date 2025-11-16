'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';

/**
 * Intro Step (Step 1)
 * Landing screen that introduces the calculator
 */
export function IntroStep() {
  const { nextStep } = useCalculator();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-8 md:p-12 text-center space-y-6 bg-white border-gray-200">
        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            How much could you save with an EV on Salary Sacrifice?
          </h1>
          <p className="text-gray-600 text-lg">Find out in 30 seconds</p>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Button
            onClick={nextStep}
            size="lg"
            className="min-w-[220px] text-base"
          >
            Calculate my savings
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* No signup note */}
        <p className="text-sm text-gray-500">No sign up required</p>
      </Card>
    </div>
  );
}

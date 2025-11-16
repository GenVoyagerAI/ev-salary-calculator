'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  className?: string;
}

/**
 * Progress Indicator Component
 * Shows dots indicating the current step in the flow
 * Based on the 4-dot design from mockups
 */
export function ProgressIndicator({
  currentStep,
  totalSteps = 4,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isPast = stepNumber < currentStep;

        return (
          <div
            key={stepNumber}
            className={cn(
              'h-2 w-2 rounded-full transition-colors duration-300',
              {
                'bg-blue-600': isActive,
                'bg-gray-800': isPast,
                'bg-gray-300': !isActive && !isPast,
              }
            )}
            aria-label={`Step ${stepNumber}${isActive ? ' (current)' : ''}`}
          />
        );
      })}
    </div>
  );
}

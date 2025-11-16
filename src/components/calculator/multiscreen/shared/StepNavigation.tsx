'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  nextVariant?: 'default' | 'success';
  className?: string;
}

/**
 * Step Navigation Component
 * Provides Next and Back buttons for multi-step flow
 */
export function StepNavigation({
  onNext,
  onBack,
  nextLabel = 'Next',
  nextDisabled = false,
  showBack = true,
  nextVariant = 'default',
  className,
}: StepNavigationProps) {
  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Next Button */}
      {onNext && (
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          size="lg"
          className={cn(
            'min-w-[160px] transition-all',
            nextVariant === 'success' &&
              'bg-green-600 hover:bg-green-700 text-white'
          )}
        >
          {nextLabel}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}

      {/* Back Button */}
      {showBack && onBack && (
        <button
          onClick={onBack}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </button>
      )}
    </div>
  );
}

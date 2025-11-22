'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Expandable Section Component
 * Accordion-style collapsible content section
 */
export function ExpandableSection({
  title,
  children,
  defaultOpen = false,
  className,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        'border border-gray-200 rounded-lg overflow-hidden',
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-white text-sm text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

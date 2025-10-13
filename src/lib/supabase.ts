import { createClient } from '@supabase/supabase-js';
import { CalculatorInputs, CalculationResult } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Calculation {
  id: string;
  created_at: string;
  salary: number;
  car_value: number;
  monthly_lease: number;
  bik_rate: number;
  student_loan_plan: string;
  pension_contribution: number;
  result_data: Record<string, unknown>;
}

export interface Analytics {
  id: string;
  event_type: string;
  calculation_id?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Database functions
export async function saveCalculation(inputs: CalculatorInputs, result: CalculationResult) {
  // Skip database operations if Supabase isn't configured
  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
    console.log('Supabase not configured, skipping database save');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('calculations')
      .insert([
        {
          salary: inputs.salary,
          car_value: inputs.carValue,
          monthly_lease: inputs.monthlyLease,
          bik_rate: inputs.bikRate,
          student_loan_plan: inputs.studentLoanPlan,
          pension_contribution: inputs.pensionContribution,
          result_data: result
        }
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving calculation:', error);
    return null;
  }
}

export async function trackEvent(eventType: string, metadata: Record<string, unknown> = {}) {
  // Skip database operations if Supabase isn't configured
  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
    console.log('Supabase not configured, skipping event tracking');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('analytics')
      .insert([
        {
          event_type: eventType,
          metadata: metadata
        }
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking event:', error);
    return null;
  }
}

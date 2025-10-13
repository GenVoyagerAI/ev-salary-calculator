import { CalculatorInputs, CalculationResult } from '@/types';
import { TAX_BRACKETS, getTaxBracket, getStudentLoanThreshold, getStudentLoanRate, getBiKRate } from './tax-rates';

export function calculateSalarySacrifice(inputs: CalculatorInputs): CalculationResult {
  const {
    salary,
    carValue,
    monthlyLease,
    bikRate,
    studentLoanPlan,
    pensionContribution,
    employerPensionContribution
  } = inputs;

  // Annual values
  const annualLease = monthlyLease * 12;
  const salarySacrificeAmount = annualLease;
  const adjustedSalary = salary - salarySacrificeAmount;

  // Calculate income tax
  const incomeTax = calculateIncomeTax(adjustedSalary);

  // Calculate National Insurance (12% on earnings between £12,570 and £50,270, 2% above)
  const nationalInsurance = calculateNationalInsurance(adjustedSalary);

  // Calculate student loan repayment
  const studentLoanRepayment = calculateStudentLoanRepayment(adjustedSalary, studentLoanPlan);

  // Calculate pension contribution (employee + employer)
  const totalPensionContribution = (pensionContribution / 100) * adjustedSalary;
  const employerPensionAmount = (employerPensionContribution / 100) * adjustedSalary;

  // Calculate net salary
  const netSalary = adjustedSalary - incomeTax - nationalInsurance - studentLoanRepayment - totalPensionContribution;

  // Calculate BiK tax
  const bikTax = calculateBiKTax(carValue, bikRate, salary);

  // Calculate total monthly cost
  const totalMonthlyCost = monthlyLease + (bikTax / 12);

  // Calculate monthly savings (what they would have paid in tax/NI on the sacrificed amount)
  const taxBracket = getTaxBracket(salary);
  const taxRate = taxBracket === 'basic' ? 0.20 : taxBracket === 'higher' ? 0.40 : 0.45;
  const niRate = taxBracket === 'basic' ? 0.12 : 0.02;
  const monthlySavings = (annualLease * (taxRate + niRate)) / 12;

  // Calculate pension impact (reduction in pension contributions due to lower salary)
  const pensionImpact = (pensionContribution / 100) * annualLease;

  // Monthly breakdown
  const grossMonthly = salary / 12;
  const netMonthly = netSalary / 12;
  const leaseCost = monthlyLease;
  const bikCost = bikTax / 12;
  const totalCost = totalMonthlyCost;

  return {
    grossSalary: salary,
    salarySacrificeAmount,
    adjustedSalary,
    incomeTax,
    nationalInsurance,
    studentLoanRepayment,
    pensionContribution: totalPensionContribution,
    netSalary,
    bikTax,
    totalMonthlyCost,
    monthlySavings,
    pensionImpact,
    breakdown: {
      grossMonthly,
      netMonthly,
      leaseCost,
      bikCost,
      totalCost
    }
  };
}

function calculateIncomeTax(salary: number): number {
  let tax = 0;
  
  // Personal allowance
  const taxableIncome = Math.max(0, salary - TAX_BRACKETS.personalAllowance);
  
  if (taxableIncome <= 0) return 0;

  // Basic rate (20%)
  const basicRateIncome = Math.min(taxableIncome, TAX_BRACKETS.basicRate.threshold - TAX_BRACKETS.personalAllowance);
  tax += basicRateIncome * TAX_BRACKETS.basicRate.rate;

  // Higher rate (40%)
  if (taxableIncome > TAX_BRACKETS.basicRate.threshold - TAX_BRACKETS.personalAllowance) {
    const higherRateIncome = Math.min(
      taxableIncome - (TAX_BRACKETS.basicRate.threshold - TAX_BRACKETS.personalAllowance),
      TAX_BRACKETS.higherRate.threshold - TAX_BRACKETS.basicRate.threshold
    );
    tax += higherRateIncome * TAX_BRACKETS.higherRate.rate;
  }

  // Additional rate (45%) - for very high earners
  if (taxableIncome > TAX_BRACKETS.higherRate.threshold - TAX_BRACKETS.personalAllowance) {
    const additionalRateIncome = taxableIncome - (TAX_BRACKETS.higherRate.threshold - TAX_BRACKETS.personalAllowance);
    tax += additionalRateIncome * 0.45;
  }

  return tax;
}

function calculateNationalInsurance(salary: number): number {
  let ni = 0;
  
  // Primary threshold: £12,570
  const primaryThreshold = 12570;
  // Upper earnings limit: £50,270
  const upperEarningsLimit = 50270;

  // 12% on earnings between primary threshold and upper earnings limit
  const basicRateIncome = Math.min(salary, upperEarningsLimit) - primaryThreshold;
  if (basicRateIncome > 0) {
    ni += basicRateIncome * 0.12;
  }

  // 2% on earnings above upper earnings limit
  if (salary > upperEarningsLimit) {
    const higherRateIncome = salary - upperEarningsLimit;
    ni += higherRateIncome * 0.02;
  }

  return ni;
}

function calculateStudentLoanRepayment(salary: number, plan: string): number {
  if (plan === 'none') return 0;

  const threshold = getStudentLoanThreshold(plan);
  const rate = getStudentLoanRate(plan);

  const repayableIncome = Math.max(0, salary - threshold);
  return repayableIncome * rate;
}

function calculateBiKTax(carValue: number, bikRate: number, salary: number): number {
  // BiK tax is calculated on the car value at the employee's marginal tax rate
  const taxBracket = getTaxBracket(salary);
  const taxRate = taxBracket === 'basic' ? 0.20 : taxBracket === 'higher' ? 0.40 : 0.45;
  return (carValue * bikRate / 100) * taxRate;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMonthlyCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

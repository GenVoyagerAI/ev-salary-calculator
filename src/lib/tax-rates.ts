import { TaxBrackets, StudentLoanRates, BiKRates } from '@/types';

// 2024/25 UK Tax Rates
export const TAX_BRACKETS: TaxBrackets = {
  personalAllowance: 12570,
  basicRate: {
    threshold: 50270,
    rate: 0.20
  },
  higherRate: {
    threshold: 125140,
    rate: 0.40
  }
};

// 2024/25 Student Loan Rates
export const STUDENT_LOAN_RATES: StudentLoanRates = {
  plan1: {
    threshold: 22015,
    rate: 0.09
  },
  plan2: {
    threshold: 27295,
    rate: 0.09
  },
  plan4: {
    threshold: 27660,
    rate: 0.09
  },
  plan5: {
    threshold: 25000,
    rate: 0.09
  }
};

// 2024/25 BiK Rates for Electric Vehicles
export const BIK_RATES: BiKRates = {
  0: 2,    // 0g CO2/km - 2% BiK
  1: 2,    // 1-50g CO2/km - 2% BiK
  51: 2,   // 51-54g CO2/km - 2% BiK
  55: 2,   // 55-59g CO2/km - 2% BiK
  60: 2,   // 60-64g CO2/km - 2% BiK
  65: 2,   // 65-69g CO2/km - 2% BiK
  70: 2,   // 70-74g CO2/km - 2% BiK
  75: 2,   // 75-79g CO2/km - 2% BiK
  80: 2,   // 80-84g CO2/km - 2% BiK
  85: 2,   // 85-89g CO2/km - 2% BiK
  90: 2,   // 90-94g CO2/km - 2% BiK
  95: 2,   // 95-99g CO2/km - 2% BiK
  100: 2,  // 100-104g CO2/km - 2% BiK
  105: 2,  // 105-109g CO2/km - 2% BiK
  110: 2,  // 110-114g CO2/km - 2% BiK
  115: 2,  // 115-119g CO2/km - 2% BiK
  120: 2,  // 120-124g CO2/km - 2% BiK
  125: 2,  // 125-129g CO2/km - 2% BiK
  130: 2,  // 130-134g CO2/km - 2% BiK
  135: 2,  // 135-139g CO2/km - 2% BiK
  140: 2,  // 140-144g CO2/km - 2% BiK
  145: 2,  // 145-149g CO2/km - 2% BiK
  150: 2   // 150g+ CO2/km - 2% BiK
};

export function getBiKRate(): number {
  // For electric vehicles, BiK rate is typically 2% regardless of CO2 emissions
  // This function could be extended for hybrid vehicles
  return 2;
}

export function getTaxBracket(salary: number): 'basic' | 'higher' | 'additional' {
  if (salary <= TAX_BRACKETS.basicRate.threshold) {
    return 'basic';
  } else if (salary <= TAX_BRACKETS.higherRate.threshold) {
    return 'higher';
  } else {
    return 'additional';
  }
}

export function getStudentLoanThreshold(plan: string): number {
  switch (plan) {
    case 'plan1':
      return STUDENT_LOAN_RATES.plan1.threshold;
    case 'plan2':
      return STUDENT_LOAN_RATES.plan2.threshold;
    case 'plan4':
      return STUDENT_LOAN_RATES.plan4.threshold;
    case 'plan5':
      return STUDENT_LOAN_RATES.plan5.threshold;
    default:
      return 0;
  }
}

export function getStudentLoanRate(plan: string): number {
  switch (plan) {
    case 'plan1':
      return STUDENT_LOAN_RATES.plan1.rate;
    case 'plan2':
      return STUDENT_LOAN_RATES.plan2.rate;
    case 'plan4':
      return STUDENT_LOAN_RATES.plan4.rate;
    case 'plan5':
      return STUDENT_LOAN_RATES.plan5.rate;
    default:
      return 0;
  }
}

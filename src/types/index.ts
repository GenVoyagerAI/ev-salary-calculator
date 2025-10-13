export interface CalculatorInputs {
  salary: number;
  carValue: number;
  monthlyLease: number;
  bikRate: number;
  studentLoanPlan: 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5';
  pensionContribution: number;
  employerPensionContribution: number;
}

export interface CalculationResult {
  grossSalary: number;
  salarySacrificeAmount: number;
  adjustedSalary: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoanRepayment: number;
  pensionContribution: number;
  netSalary: number;
  bikTax: number;
  totalMonthlyCost: number;
  monthlySavings: number;
  pensionImpact: number;
  breakdown: {
    grossMonthly: number;
    netMonthly: number;
    leaseCost: number;
    bikCost: number;
    totalCost: number;
  };
}

export interface TaxBrackets {
  personalAllowance: number;
  basicRate: {
    threshold: number;
    rate: number;
  };
  higherRate: {
    threshold: number;
    rate: number;
  };
}

export interface StudentLoanRates {
  plan1: {
    threshold: number;
    rate: number;
  };
  plan2: {
    threshold: number;
    rate: number;
  };
  plan4: {
    threshold: number;
    rate: number;
  };
  plan5: {
    threshold: number;
    rate: number;
  };
}

export interface BiKRates {
  [key: number]: number; // CO2 emissions to BiK rate percentage
}

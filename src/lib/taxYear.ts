/**
 * Get the current UK tax year
 * UK tax year runs from 6 April to 5 April
 * 
 * @returns Tax year string in format "2024/25"
 */
export const getCurrentTaxYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11 (0 = January)
  
  // Tax year starts on 6 April (month 3, day 6)
  // If we're in Jan-Mar, we're in the tax year that started last year
  // If we're in Apr-Dec, we're in the tax year that started this year
  
  if (month < 3) {
    // January, February, March
    return `${year - 1}/${String(year).slice(2)}`;
  } else if (month === 3) {
    // April - check if before or after 6th
    const day = now.getDate();
    if (day < 6) {
      return `${year - 1}/${String(year).slice(2)}`;
    } else {
      return `${year}/${String(year + 1).slice(2)}`;
    }
  } else {
    // May through December
    return `${year}/${String(year + 1).slice(2)}`;
  }
};

/**
 * Get tax year N years ahead of the given tax year
 * 
 * @param currentTaxYear - Tax year in format "2024/25"
 * @param yearsAhead - Number of years to add (1-3)
 * @returns Tax year string
 */
export const getNextTaxYear = (currentTaxYear: string, yearsAhead: number): string => {
  const [startYear] = currentTaxYear.split('/');
  const nextStartYear = parseInt(startYear) + yearsAhead;
  return `${nextStartYear}/${String(nextStartYear + 1).slice(2)}`;
};

/**
 * Get array of next 4 tax years starting from current
 * 
 * @returns Array of 4 tax year strings
 */
export const getNext4TaxYears = (): string[] => {
  const currentTaxYear = getCurrentTaxYear();
  return [
    currentTaxYear,
    getNextTaxYear(currentTaxYear, 1),
    getNextTaxYear(currentTaxYear, 2),
    getNextTaxYear(currentTaxYear, 3),
  ];
};


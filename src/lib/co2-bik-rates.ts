/**
 * CO2 to BiK Rate Lookup Table (2024/25 HMRC rates)
 * Based on official HMRC CO2 emissions bands
 */
export function getCO2BikRate(co2: number): number {
  // Handle edge cases
  if (co2 < 0) return 0.02; // Default to electric rate for negative values
  if (co2 === 0) return 0.02; // Electric vehicles
  
  // CO2 emissions bands (2024/25 rates)
  if (co2 <= 50) return 0.15;   // 0-50g/km
  if (co2 <= 75) return 0.19;   // 51-75g/km
  if (co2 <= 94) return 0.22;   // 76-94g/km
  if (co2 <= 100) return 0.24;  // 95-100g/km
  if (co2 <= 110) return 0.26;  // 101-110g/km
  if (co2 <= 130) return 0.30;  // 111-130g/km
  if (co2 <= 150) return 0.34;  // 131-150g/km
  if (co2 <= 170) return 0.37;  // 151-170g/km
  
  return 0.37; // Max rate for 170g/km+
}

/**
 * Get BiK rate based on fuel type and CO2 emissions
 */
export function getBikRate(fuelType: 'electric' | 'hybrid' | 'petrol', co2Emissions?: number): number {
  switch (fuelType) {
    case 'electric':
      return 0.02; // 2% for electric vehicles
    case 'hybrid':
      return 0.08; // 8% for hybrid vehicles
    case 'petrol':
      return co2Emissions ? getCO2BikRate(co2Emissions) : 0.25; // Default 25% if no CO2 data
    default:
      return 0.02;
  }
}

/**
 * Get fuel type label for display
 */
export function getFuelTypeLabel(fuelType: 'electric' | 'hybrid' | 'petrol'): string {
  switch (fuelType) {
    case 'electric':
      return 'Electric';
    case 'hybrid':
      return 'Hybrid';
    case 'petrol':
      return 'Petrol/Diesel';
    default:
      return 'Unknown';
  }
}


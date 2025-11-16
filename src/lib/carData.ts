/**
 * EV Car Database
 * Data for available electric vehicles in the salary sacrifice calculator
 */

export interface Car {
  id: string;
  make: string;
  model: string;
  fullName: string;
  listPrice: number;
  range: number; // miles
  monthlyLeaseRate: number;
  bikRate: number; // percentage (e.g., 3 for 3%)
  co2Emissions: number; // g/km (0 for pure EVs)
  fuelType: 'electric' | 'hybrid';
}

/**
 * Available cars for salary sacrifice
 * Data based on 2024/2025 models and typical lease rates
 */
export const cars: Car[] = [
  {
    id: 'tesla-model-3',
    make: 'Tesla',
    model: 'Model 3',
    fullName: 'Tesla Model 3',
    listPrice: 39990,
    range: 318,
    monthlyLeaseRate: 499,
    bikRate: 3, // 2024/25 rate for pure EVs
    co2Emissions: 0,
    fuelType: 'electric',
  },
  {
    id: 'tesla-model-y',
    make: 'Tesla',
    model: 'Model Y',
    fullName: 'Tesla Model Y',
    listPrice: 44990,
    range: 283,
    monthlyLeaseRate: 549,
    bikRate: 3,
    co2Emissions: 0,
    fuelType: 'electric',
  },
  {
    id: 'nissan-leaf',
    make: 'Nissan',
    model: 'Leaf',
    fullName: 'Nissan Leaf',
    listPrice: 28995,
    range: 239,
    monthlyLeaseRate: 379,
    bikRate: 3,
    co2Emissions: 0,
    fuelType: 'electric',
  },
  {
    id: 'nissan-ariya',
    make: 'Nissan',
    model: 'Ariya',
    fullName: 'Nissan Ariya',
    listPrice: 43845,
    range: 250,
    monthlyLeaseRate: 529,
    bikRate: 3,
    co2Emissions: 0,
    fuelType: 'electric',
  },
  // Additional popular EVs
  {
    id: 'mg4',
    make: 'MG',
    model: 'MG4',
    fullName: 'MG MG4',
    listPrice: 26995,
    range: 218,
    monthlyLeaseRate: 349,
    bikRate: 3,
    co2Emissions: 0,
    fuelType: 'electric',
  },
  {
    id: 'volkswagen-id3',
    make: 'Volkswagen',
    model: 'ID.3',
    fullName: 'Volkswagen ID.3',
    listPrice: 35880,
    range: 263,
    monthlyLeaseRate: 449,
    bikRate: 3,
    co2Emissions: 0,
    fuelType: 'electric',
  },
];

/**
 * Search cars by name (make or model)
 */
export function searchCars(query: string): Car[] {
  if (!query.trim()) {
    return cars;
  }

  const searchTerm = query.toLowerCase().trim();

  return cars.filter(
    (car) =>
      car.fullName.toLowerCase().includes(searchTerm) ||
      car.make.toLowerCase().includes(searchTerm) ||
      car.model.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get a car by ID
 */
export function getCarById(id: string): Car | undefined {
  return cars.find((car) => car.id === id);
}

/**
 * Format car details for display
 */
export function formatCarSummary(car: Car): string {
  return `£${car.listPrice.toLocaleString()} • ${car.range} miles range • £${car.monthlyLeaseRate}/mo`;
}

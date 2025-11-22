import { supabase } from './supabase';

/**
 * Car interface for EV salary sacrifice calculator
 * Data sourced from Supabase cars table
 */
export interface Car {
  id: string;
  make: string;
  model: string;
  fullName: string; // Maps to full_name in database
  listPrice: number; // Maps to list_price in database
  range: number; // miles (WLTP)
  monthlyLeaseRate: number; // Maps to monthly_lease_rate, GBP per month
  bikRate: number; // Maps to bik_rate, BiK percentage
  co2Emissions: number; // Maps to co2_emissions, g/km
  fuelType: 'electric' | 'hybrid'; // Maps to fuel_type
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all active cars from database
 * @returns Promise<Car[]>
 */
export async function getAllCars(): Promise<Car[]> {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('is_active', true)
      .order('make', { ascending: true });

    if (error) {
      console.error('Error fetching cars:', error);
      return [];
    }

    // Map database fields to interface (snake_case -> camelCase)
    return (data || []).map(mapDatabaseCarToInterface);
  } catch (err) {
    console.error('Unexpected error fetching cars:', err);
    return [];
  }
}

/**
 * Search cars by make, model, or full name
 * @param query - Search query string
 * @returns Promise<Car[]>
 */
export async function searchCars(query: string): Promise<Car[]> {
  // If empty query, return all cars
  if (!query.trim()) {
    return getAllCars();
  }

  try {
    const searchTerm = query.trim();

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('is_active', true)
      .or(`full_name.ilike.%${searchTerm}%,make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`)
      .order('make', { ascending: true });

    if (error) {
      console.error('Error searching cars:', error);
      return [];
    }

    return (data || []).map(mapDatabaseCarToInterface);
  } catch (err) {
    console.error('Unexpected error searching cars:', err);
    return [];
  }
}

/**
 * Get a single car by ID
 * @param id - Car UUID
 * @returns Promise<Car | null>
 */
export async function getCarById(id: string): Promise<Car | null> {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching car by ID:', error);
      return null;
    }

    return data ? mapDatabaseCarToInterface(data) : null;
  } catch (err) {
    console.error('Unexpected error fetching car:', err);
    return null;
  }
}

/**
 * Map database car object (snake_case) to interface (camelCase)
 * @param dbCar - Car object from database
 * @returns Car object with camelCase properties
 */
function mapDatabaseCarToInterface(dbCar: any): Car {
  return {
    id: dbCar.id,
    make: dbCar.make,
    model: dbCar.model,
    fullName: dbCar.full_name,
    listPrice: parseFloat(dbCar.list_price),
    range: dbCar.range,
    monthlyLeaseRate: parseFloat(dbCar.monthly_lease_rate),
    bikRate: parseFloat(dbCar.bik_rate),
    co2Emissions: dbCar.co2_emissions,
    fuelType: dbCar.fuel_type,
    is_active: dbCar.is_active,
    created_at: dbCar.created_at,
    updated_at: dbCar.updated_at,
  };
}

/**
 * Format car summary for display
 * @param car - Car object
 * @returns Formatted string with key specs
 */
export function formatCarSummary(car: Car): string {
  return `£${car.listPrice.toLocaleString()} • ${car.range} miles range • £${car.monthlyLeaseRate}/mo`;
}

/**
 * Format car full details
 * @param car - Car object
 * @returns Object with formatted details
 */
export function formatCarDetails(car: Car) {
  return {
    name: car.fullName,
    listPrice: `£${car.listPrice.toLocaleString()}`,
    monthlyCost: `£${car.monthlyLeaseRate}/mo`,
    range: `${car.range} miles`,
    bikRate: `${car.bikRate}%`,
    fuelType: car.fuelType === 'electric' ? 'Electric' : 'Hybrid',
    emissions: `${car.co2Emissions}g/km CO₂`,
  };
}

-- Create cars table for EV salary sacrifice calculator
-- Source: Manual data entry from ev-database.org/uk and UK lease comparison sites
-- Created: 2025-01-22

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  list_price DECIMAL(10,2) NOT NULL,
  range INTEGER NOT NULL, -- miles (WLTP)
  monthly_lease_rate DECIMAL(10,2) NOT NULL, -- GBP per month (36mo, 10k miles/year)
  bik_rate DECIMAL(5,2) NOT NULL, -- BiK percentage for 2025/26
  co2_emissions INTEGER NOT NULL DEFAULT 0, -- g/km
  fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('electric', 'hybrid')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cars_make ON cars(make);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_is_active ON cars(is_active);

-- Full-text search index for searching by make, model, or full name
CREATE INDEX IF NOT EXISTS idx_cars_search
  ON cars USING gin(to_tsvector('english', full_name || ' ' || make || ' ' || model));

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active cars
CREATE POLICY "Allow public read access to active cars"
  ON cars
  FOR SELECT
  USING (is_active = true);

-- Create policy for service role to manage cars (admin only)
CREATE POLICY "Allow service role to manage cars"
  ON cars
  USING (auth.role() = 'service_role');

-- Add comment for documentation
COMMENT ON TABLE cars IS 'EV and hybrid vehicles available for salary sacrifice calculator. Data sourced from ev-database.org/uk and UK leasing companies.';
COMMENT ON COLUMN cars.range IS 'WLTP range in miles';
COMMENT ON COLUMN cars.monthly_lease_rate IS 'Monthly lease cost in GBP (36 months, 10,000 miles/year)';
COMMENT ON COLUMN cars.bik_rate IS 'Benefit-in-Kind tax rate percentage for current tax year (2025/26: 3% for EVs)';

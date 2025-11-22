-- Seed initial car data for EV salary sacrifice calculator
-- Data sourced from: ev-database.org/uk, Select Car Leasing, LeaseLoco
-- Lease rates: 36 months, 10,000 miles/year, approximate business lease costs
-- BiK rate: 3% for all EVs (2025/26 tax year)
-- Created: 2025-01-22

INSERT INTO cars (make, model, full_name, list_price, range, monthly_lease_rate, bik_rate, co2_emissions, fuel_type) VALUES
-- Tesla Models (Premium segment)
('Tesla', 'Model 3', 'Tesla Model 3', 39990.00, 318, 499.00, 3.00, 0, 'electric'),
('Tesla', 'Model Y', 'Tesla Model Y', 44990.00, 283, 549.00, 3.00, 0, 'electric'),

-- Nissan Models (Mid-range segment)
('Nissan', 'Leaf', 'Nissan Leaf', 28995.00, 239, 379.00, 3.00, 0, 'electric'),
('Nissan', 'Ariya', 'Nissan Ariya', 43845.00, 250, 529.00, 3.00, 0, 'electric'),

-- MG Models (Budget-friendly segment)
('MG', 'MG4', 'MG MG4', 26995.00, 218, 349.00, 3.00, 0, 'electric'),
('MG', 'MG5 EV', 'MG MG5 EV', 31495.00, 250, 399.00, 3.00, 0, 'electric'),

-- Volkswagen Models (Popular German brand)
('Volkswagen', 'ID.3', 'Volkswagen ID.3', 35880.00, 263, 449.00, 3.00, 0, 'electric'),
('Volkswagen', 'ID.4', 'Volkswagen ID.4', 40550.00, 259, 499.00, 3.00, 0, 'electric'),

-- Hyundai Models (Great value segment)
('Hyundai', 'Ioniq 5', 'Hyundai Ioniq 5', 41450.00, 238, 495.00, 3.00, 0, 'electric'),
('Hyundai', 'Kona Electric', 'Hyundai Kona Electric', 35950.00, 234, 439.00, 3.00, 0, 'electric'),

-- Kia Models (Sister brand to Hyundai)
('Kia', 'EV6', 'Kia EV6', 42895.00, 239, 509.00, 3.00, 0, 'electric'),
('Kia', 'Niro EV', 'Kia Niro EV', 36795.00, 253, 449.00, 3.00, 0, 'electric'),

-- Peugeot Models (French affordable EVs)
('Peugeot', 'e-208', 'Peugeot e-208', 31995.00, 225, 389.00, 3.00, 0, 'electric'),
('Peugeot', 'e-2008', 'Peugeot e-2008', 34995.00, 214, 419.00, 3.00, 0, 'electric'),

-- Vauxhall Models (UK popular brand)
('Vauxhall', 'Corsa Electric', 'Vauxhall Corsa Electric', 32095.00, 222, 395.00, 3.00, 0, 'electric'),
('Vauxhall', 'Mokka Electric', 'Vauxhall Mokka Electric', 33940.00, 209, 409.00, 3.00, 0, 'electric'),

-- Audi Models (Premium German)
('Audi', 'Q4 e-tron', 'Audi Q4 e-tron', 47650.00, 243, 589.00, 3.00, 0, 'electric'),

-- BMW Models (Premium German)
('BMW', 'i4', 'BMW i4', 51905.00, 297, 639.00, 3.00, 0, 'electric'),

-- Mercedes Models (Luxury segment)
('Mercedes-Benz', 'EQA', 'Mercedes-Benz EQA', 49495.00, 263, 599.00, 3.00, 0, 'electric'),

-- Skoda Models (Value VW Group brand)
('Skoda', 'Enyaq iV', 'Skoda Enyaq iV', 38970.00, 256, 479.00, 3.00, 0, 'electric');

-- Add comment for tracking
COMMENT ON TABLE cars IS 'Last updated: 2025-01-22. Lease rates based on 36mo/10k miles. Review quarterly.';

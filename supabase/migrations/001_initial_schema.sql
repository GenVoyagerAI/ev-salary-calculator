-- Create calculations table
CREATE TABLE IF NOT EXISTS calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  salary DECIMAL(10,2) NOT NULL,
  car_value DECIMAL(10,2) NOT NULL,
  monthly_lease DECIMAL(10,2) NOT NULL,
  bik_rate DECIMAL(5,2) NOT NULL,
  student_loan_plan VARCHAR(10) NOT NULL,
  pension_contribution DECIMAL(5,2) NOT NULL,
  result_data JSONB NOT NULL
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  calculation_id UUID REFERENCES calculations(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calculations_created_at ON calculations(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public calculator)
CREATE POLICY "Allow public read access to calculations" ON calculations
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to calculations" ON calculations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to analytics" ON analytics
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to analytics" ON analytics
  FOR INSERT WITH CHECK (true);

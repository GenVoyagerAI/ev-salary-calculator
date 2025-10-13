# EV Salary Sacrifice Calculator

A free, transparent salary sacrifice car lease calculator that shows UK employees the **real monthly cost** after tax savings.

## 🎯 Features

- **Accurate Tax Calculations**: Handles 20%, 40%, and 45% tax brackets
- **Student Loan Support**: All UK student loan plans (1, 2, 4, 5)
- **BiK Tax Calculation**: Benefit in Kind tax for electric vehicles
- **Pension Impact Warnings**: Shows how salary sacrifice affects pension contributions
- **Real-time Calculations**: Instant results as you type
- **Mobile Responsive**: Works perfectly on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for analytics)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SalSac
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up Supabase database:
   - Create a new Supabase project
   - Run the migration in `supabase/migrations/001_initial_schema.sql`

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

- **Frontend**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React

## 📊 How It Works

The calculator takes into account:

1. **Salary Sacrifice**: Reduces your gross salary by the lease amount
2. **Tax Savings**: You pay less income tax and National Insurance
3. **BiK Tax**: Benefit in Kind tax on the car value
4. **Student Loans**: Repayments based on your adjusted salary
5. **Pension Impact**: Lower salary means lower pension contributions

## 🎨 Customization

The calculator is built with modular components:

- `src/components/calculator/CalculatorForm.tsx` - Main form component
- `src/lib/calculations.ts` - Core calculation logic
- `src/lib/tax-rates.ts` - UK tax rates and thresholds
- `src/types/index.ts` - TypeScript interfaces

## 📈 Analytics

The app tracks:
- Calculation completions
- User interactions
- Popular salary ranges
- Most common car values

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you find any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ for UK employees considering salary sacrifice car schemes.
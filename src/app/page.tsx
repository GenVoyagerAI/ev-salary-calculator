import CalculatorForm from '@/components/calculator/CalculatorForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CalculatorForm />
      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-600">
          <p className="mb-2">
            <strong>EV Salary Sacrifice Calculator</strong> - The UK&apos;s most transparent calculator
          </p>
          <p className="text-sm">
            Built with Next.js, Supabase, and Tailwind CSS • 
            <a href="https://github.com" className="text-blue-600 hover:underline ml-1">View on GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Hero showCta={true} />

      {/* Content Section */}
      <div className="container-1440 py-16">
        <div className="space-y-8 text-gray-900">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Calculate Your Electric Vehicle Salary Sacrifice Savings
            </h2>
            <p className="text-lg leading-relaxed">
              SalSacEV is the UK&apos;s leading free EV salary sacrifice calculator. Whether you&apos;re an employee considering an electric company car or an employer looking to understand the benefits, our calculator provides instant, accurate tax savings calculations for electric vehicle schemes.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              Why Choose Electric Vehicle Salary Sacrifice?
            </h3>
            <p className="text-lg leading-relaxed">
              Electric vehicles benefit from the lowest Benefit in Kind (BIK) tax rates in the UK, currently just 2% for pure electric cars. This makes EV salary sacrifice schemes incredibly tax-efficient for both employees and employers. Our calculator helps you understand exactly how much you could save on income tax and National Insurance contributions when choosing an electric company car through a salary sacrifice arrangement.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              How Our EV BIK Calculator Works
            </h3>
            <p className="text-lg leading-relaxed">
              Simply enter your vehicle&apos;s P11D value, fuel type, CO2 emissions, and income tax rate. Our calculator instantly shows your annual and monthly benefit value, helping you make informed decisions about electric company car schemes. Perfect for HR managers, fleet managers, and employees exploring green company car options.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
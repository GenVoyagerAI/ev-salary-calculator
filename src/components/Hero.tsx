import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeroProps {
  showCta?: boolean;
}

export default function Hero({ showCta = false }: HeroProps) {
  return (
    <div className="hero-section relative h-[400px] flex items-center justify-center">
      {/* Fixed background image */}
      <div
        className="hero-background absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center 30px'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white space-y-6 px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          EV Salary Sacrifice Calculator: Calculate Your Electric Company Car Savings
        </h1>
        {showCta && (
          <Link href="/calculator" className="cursor-pointer">
            <Button
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all text-lg px-8 py-6 rounded-md cursor-pointer"
            >
              How much you could save?
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

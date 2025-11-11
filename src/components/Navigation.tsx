import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  return (
    <nav className="w-full bg-white py-4 px-6 border-b border-gray-200">
      <div className="container-1440 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors cursor-pointer">
          BikCal
        </Link>
        <Link href="/calculator" className="cursor-pointer">
          <Button className="bg-black text-white hover:bg-gray-800 rounded-md px-6 py-2">
            Calculate
          </Button>
        </Link>
      </div>
    </nav>
  );
}

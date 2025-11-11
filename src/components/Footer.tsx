import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white py-8 px-6 border-t border-gray-200 mt-12">
      <div className="container-1440 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors cursor-pointer">
          SalSacEV
        </Link>
        <div className="flex items-center gap-8 text-gray-700">
          <span>email@email.com</span>
          <span>098-773-987</span>
        </div>
      </div>
    </footer>
  );
}

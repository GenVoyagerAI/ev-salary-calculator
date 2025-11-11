import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Salary Sacrifice Calculator | Calculate Your Electric Car Tax Savings - SalSacEV",
  description: "Use our free EV salary sacrifice calculator to see how much you can save on tax with an electric company car. Calculate BIK rates, P11D values, and annual savings instantly.",
  alternates: {
    canonical: "https://www.salsacev.com/calculator",
  },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

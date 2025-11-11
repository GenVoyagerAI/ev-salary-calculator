import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: "#10b981",
};

export const metadata: Metadata = {
  title: "SalSacEV | EV Salary Sacrifice Calculator | Electric Company Car Tax Savings 2025",
  description: "Calculate your electric vehicle salary sacrifice savings with SalSacEV. Free EV BIK calculator for company cars. See how much you save on tax with electric salary sacrifice schemes in the UK.",
  keywords: "EV salary sacrifice, electric vehicle salary sacrifice, EV sal sac calculator, electric company car, EV BIK calculator, salary sacrifice EV scheme, company EV tax savings, electric car benefits, EV P11D calculator, green company car",
  authors: [{ name: "SalSacEV" }],
  robots: "index, follow",
  openGraph: {
    title: "SalSacEV - Electric Vehicle Salary Sacrifice Calculator UK",
    description: "Calculate your EV salary sacrifice savings. Quick reference guide for electric company car tax, BIK rates, and potential savings for drivers and employers.",
    type: "website",
    url: "https://www.salsacev.com",
    siteName: "SalSacEV",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "SalSacEV | EV Salary Sacrifice Calculator",
    description: "Free calculator for electric vehicle salary sacrifice. See your tax savings on company EVs instantly.",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "apple-mobile-web-app-title": "SalSacEV",
    "application-name": "SalSacEV",
  },
  alternates: {
    canonical: "https://www.salsacev.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* JSON-LD Structured Data - WebApplication */}
        <Script
          id="schema-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SalSacEV - Electric Vehicle Salary Sacrifice Calculator",
              "url": "https://www.salsacev.com",
              "description": "This Car Tax Guide is intended to provide a quick reference to the current tax regulations for drivers of company cars and employers, specifically focused on electric vehicle salary sacrifice schemes.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "GBP"
              },
              "featureList": "EV salary sacrifice calculation, Electric vehicle BIK calculation, Company EV tax savings, CO2 emissions analysis, P11D value assessment for electric vehicles",
              "audience": {
                "@type": "Audience",
                "audienceType": "Company car drivers, HR managers, Fleet managers, Employers"
              }
            })
          }}
        />

        {/* JSON-LD Structured Data - Breadcrumbs */}
        <Script
          id="schema-breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.salsacev.com"
              },{
                "@type": "ListItem",
                "position": 2,
                "name": "EV Calculator",
                "item": "https://www.salsacev.com/calculator"
              }]
            })
          }}
        />
      </body>
    </html>
  );
}

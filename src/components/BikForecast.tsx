import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BikForecastResult } from '@/lib/calculations';

interface BikForecastProps {
  forecastData: BikForecastResult;
  salary: number;
  p11dValue: number;
  taxBracketName: string;
  taxRate: number;
}

export const BikForecast: React.FC<BikForecastProps> = ({
  forecastData,
  salary,
  p11dValue,
  taxBracketName,
  taxRate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-6">
      {/* Collapsible trigger button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">
            View 4-Year BiK Tax Forecast
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-blue-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600" />
        )}
      </button>

      {/* Expanded forecast content */}
      {isExpanded && (
        <div className="mt-4 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">
            BiK Tax Forecast (2024-2028)
          </h3>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-blue-300">
                  <th className="text-left py-2 px-3 font-semibold text-blue-900">
                    Tax Year
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-blue-900">
                    BiK Rate
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-blue-900">
                    Annual Tax
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-blue-900">
                    Monthly
                  </th>
                </tr>
              </thead>
              <tbody>
                {forecastData.forecast.map((year) => (
                  <tr
                    key={year.taxYear}
                    className={`border-b border-blue-200 ${
                      year.isCurrentYear
                        ? 'bg-green-100 font-semibold'
                        : 'hover:bg-blue-100'
                    }`}
                  >
                    <td className="py-3 px-3 flex items-center gap-2">
                      {year.taxYear}
                      {year.isCurrentYear && (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </td>
                    <td className="text-right py-3 px-3">
                      {year.bikRatePercent}
                    </td>
                    <td className="text-right py-3 px-3">
                      {year.annualTax}
                    </td>
                    <td className="text-right py-3 px-3">
                      {year.monthlyTax}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-blue-400 bg-blue-100 font-bold">
                  <td className="py-3 px-3" colSpan={2}>
                    Total (4 years)
                  </td>
                  <td className="text-right py-3 px-3">
                    {forecastData.totalAnnualTax}
                  </td>
                  <td className="text-right py-3 px-3">
                    {forecastData.totalMonthlyAverage} avg
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="sm:hidden space-y-3">
            {forecastData.forecast.map((year) => (
              <div
                key={year.taxYear}
                className={`p-4 rounded-lg border ${
                  year.isCurrentYear
                    ? 'bg-green-100 border-green-400'
                    : 'bg-white border-blue-200'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">
                    {year.taxYear}
                  </span>
                  {year.isCurrentYear && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                      Current Year
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">BiK Rate:</span>
                    <span className="font-medium">{year.bikRatePercent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Tax:</span>
                    <span className="font-medium">{year.annualTax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly:</span>
                    <span className="font-medium">{year.monthlyTax}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Mobile total */}
            <div className="p-4 rounded-lg bg-blue-100 border-2 border-blue-400">
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Total (4 years):</span>
                  <span>{forecastData.totalAnnualTax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Monthly:</span>
                  <span>{forecastData.totalMonthlyAverage}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assumptions alert */}
          <Alert className="mt-6 bg-yellow-50 border-yellow-300">
            <AlertDescription>
              <p className="font-semibold text-sm mb-2 text-yellow-900">
                ⚠️ Forecast Assumptions:
              </p>
              <ul className="text-xs space-y-1 text-yellow-900 list-disc ml-4">
                <li>Based on HMRC published BiK rates (2024-2028)</li>
                <li>
                  Your salary remains at £{salary.toLocaleString()}
                </li>
                <li>
                  P11D value fixed at £{p11dValue.toLocaleString()} (standard
                  for BiK calculations)
                </li>
                <li>
                  Tax bracket: {taxBracketName} ({(taxRate * 100).toFixed(0)}%)
                </li>
                <li>
                  Note: Tax thresholds and rates may change during this period
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};













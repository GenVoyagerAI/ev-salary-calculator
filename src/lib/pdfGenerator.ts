import { jsPDF } from 'jspdf';
import type { Car } from './carData';

interface PDFData {
  salary: number;
  car: Car;
  fourYearSavings: number;
  monthlySavings: number;
  currentTakeHome: number;
  newTakeHome: number;
  bikTaxMonthly: number;
}

/**
 * Generate PDF for salary sacrifice results
 * @param data - Results data to include in PDF
 */
export function generateResultsPDF(data: PDFData): void {
  const doc = new jsPDF();

  // Colors
  const primaryColor: [number, number, number] = [26, 26, 26]; // #1a1a1a
  const accentColor: [number, number, number] = [59, 130, 246]; // blue-500
  const textColor: [number, number, number] = [75, 85, 99]; // gray-600

  let yPos = 20;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text('Your EV Salary Sacrifice Results', 105, yPos, { align: 'center' });

  yPos += 15;
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  doc.text(`${data.car.fullName}`, 105, yPos, { align: 'center' });

  // Line separator
  yPos += 10;
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);

  // Main Savings Box
  yPos += 15;
  doc.setFillColor(59, 130, 246); // blue-500
  doc.roundedRect(40, yPos, 130, 35, 3, 3, 'F');

  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('You could save', 105, yPos + 10, { align: 'center' });

  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(`£${data.fourYearSavings.toLocaleString()}`, 105, yPos + 22, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('over 4 years', 105, yPos + 30, { align: 'center' });

  // Monthly savings
  yPos += 45;
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(`That's £${data.monthlySavings.toLocaleString()}/month!`, 105, yPos, { align: 'center' });

  // How it works section
  yPos += 15;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('How it works:', 20, yPos);

  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...textColor);

  // Before/After boxes
  // Current situation
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.rect(20, yPos, 80, 40);

  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  doc.text('CURRENT TAKE-HOME', 60, yPos + 7, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`£${data.currentTakeHome.toLocaleString()}`, 60, yPos + 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  doc.text('per month', 60, yPos + 28, { align: 'center' });

  // With salary sacrifice
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.rect(110, yPos, 80, 40);

  doc.setFontSize(10);
  doc.text(`WITH ${data.car.make.toUpperCase()} ${data.car.model.toUpperCase()}`, 150, yPos + 7, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`£${data.newTakeHome.toLocaleString()}`, 150, yPos + 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  doc.text('per month', 150, yPos + 28, { align: 'center' });
  doc.text('+ Brand new car', 150, yPos + 35, { align: 'center' });

  // Better off badge
  yPos += 48;
  doc.setFillColor(229, 231, 235); // gray-200
  doc.roundedRect(70, yPos, 70, 10, 2, 2, 'F');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`+ £${data.monthlySavings.toLocaleString()}/month better off`, 105, yPos + 7, { align: 'center' });

  // Car Details
  yPos += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text('Car Details:', 20, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...textColor);

  const details = [
    `List Price: £${data.car.listPrice.toLocaleString()}`,
    `Monthly Lease: £${data.car.monthlyLeaseRate}/month`,
    `Range: ${data.car.range} miles (WLTP)`,
    `BiK Rate: ${data.car.bikRate}% (£${data.bikTaxMonthly.toFixed(2)}/month)`,
    `Fuel Type: ${data.car.fuelType === 'electric' ? 'Electric' : 'Hybrid'}`,
    `CO₂ Emissions: ${data.car.co2Emissions}g/km`,
  ];

  details.forEach(detail => {
    doc.text(`• ${detail}`, 25, yPos);
    yPos += 5;
  });

  // Important notes
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text('Important Information:', 20, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textColor);

  const notes = [
    'These calculations are estimates based on 2025/26 UK tax rates.',
    'Salary sacrifice reduces your gross salary, which may affect pension contributions.',
    'BiK tax rates for EVs are scheduled to increase: 4% (2026/27), 5% (2027/28).',
    'Early termination fees may apply if you leave your employer during the lease.',
    'Always check with your HR department for specific scheme details.',
  ];

  notes.forEach(note => {
    const lines = doc.splitTextToSize(note, 170);
    lines.forEach((line: string) => {
      doc.text(`• ${line}`, 20, yPos);
      yPos += 4;
    });
    yPos += 2;
  });

  // Footer
  yPos = 280;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by SalSacEV Calculator', 105, yPos, { align: 'center' });
  doc.text(`${new Date().toLocaleDateString('en-GB')}`, 105, yPos + 4, { align: 'center' });

  // Save PDF
  const filename = `EV-Salary-Sacrifice-${data.car.make}-${data.car.model}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

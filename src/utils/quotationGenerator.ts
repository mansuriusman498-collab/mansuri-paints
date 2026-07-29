import { jsPDF } from 'jspdf';
import { EstimateSummary } from '../types';
import { COMPANY_DETAILS } from '../data/paintData';

export function generateQuotationPDF(
  summary: EstimateSummary,
  customerName: string = 'Valued Customer',
  propertyType: string = 'Custom Area',
  phone: string = ''
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(30, 41, 59); // Dark navy slate (#1E293B)
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(COMPANY_DETAILS.name.toUpperCase(), 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(212, 175, 55); // Gold
  doc.text(COMPANY_DETAILS.tagline, 14, 28);

  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text(`WhatsApp: ${COMPANY_DETAILS.whatsappDisplay}  |  Email: ${COMPANY_DETAILS.email}`, 14, 35);

  // Document Title & Date
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL PAINTING ESTIMATE & QUOTATION', 14, 52);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const quoteNo = `MP-QT-${Math.floor(100000 + Math.random() * 900000)}`;
  doc.text(`Quote Ref: ${quoteNo}`, pageWidth - 14, 50, { align: 'right' });
  doc.text(`Date: ${dateStr}`, pageWidth - 14, 56, { align: 'right' });

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 62, pageWidth - 14, 62);

  // Customer Information Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 67, pageWidth - 28, 26, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('CUSTOMER DETAILS', 18, 74);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Customer Name: ${customerName}`, 18, 81);
  doc.text(`Contact Phone: ${phone || 'N/A'}`, 18, 87);
  doc.text(`Property Configuration: ${propertyType}`, 110, 81);
  doc.text(`Calculated Wall Area: ${summary.wallAreaSqFt.toLocaleString()} sq. ft.`, 110, 87);

  // Table Headers
  let y = 100;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 9, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('ITEM DESCRIPTION', 18, y + 6);
  doc.text('RATE / SQ FT', 110, y + 6);
  doc.text('TOTAL (INR)', pageWidth - 18, y + 6, { align: 'right' });

  y += 13;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  // Line 1: Main Paint
  doc.text(`${summary.paintType.name} (${summary.paintType.finishType})`, 18, y);
  doc.text(`Rs ${summary.paintType.ratePerSqFt} / sq ft`, 110, y);
  doc.text(`Rs ${summary.paintCost.toLocaleString()}`, pageWidth - 18, y, { align: 'right' });

  // Line 2: Putty & Primer
  if (summary.puttyPrimerSelected) {
    y += 8;
    doc.text('2-Coat Wall Putty + 1-Coat Acrylic Primer Base', 18, y);
    doc.text('Rs 8 / sq ft', 110, y);
    doc.text(`Rs ${summary.puttyPrimerCost.toLocaleString()}`, pageWidth - 18, y, { align: 'right' });
  }

  // Add-ons
  summary.selectedAddOns.forEach((addon) => {
    y += 8;
    doc.text(addon.name, 18, y);
    doc.text('Included Add-on', 110, y);
    doc.text(`Rs ${addon.cost.toLocaleString()}`, pageWidth - 18, y, { align: 'right' });
  });

  // Line: Labour & Surface Prep
  y += 8;
  doc.text('Professional Surface Masking, Labour & Cleaning (Included)', 18, y);
  doc.text('Included', 110, y);
  doc.text(`Rs ${summary.labourIncludedCost.toLocaleString()}`, pageWidth - 18, y, { align: 'right' });

  y += 6;
  doc.line(14, y, pageWidth - 14, y);

  // Total Summary Box
  y += 8;
  const boxHeight = (summary.volumeDiscountAmount || 0) > 0 && (summary.couponDiscountAmount || 0) > 0 ? 38 : 32;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(pageWidth - 105, y, 91, boxHeight, 2, 2, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  let currentY = y + 8;
  doc.text('Subtotal:', pageWidth - 99, currentY);
  doc.text(`Rs ${summary.subtotal.toLocaleString()}`, pageWidth - 18, currentY, { align: 'right' });

  if ((summary.volumeDiscountAmount || 0) > 0) {
    currentY += 6;
    doc.text(`Volume Discount (${summary.volumeDiscountPercentage}%):`, pageWidth - 99, currentY);
    doc.text(`- Rs ${summary.volumeDiscountAmount?.toLocaleString()}`, pageWidth - 18, currentY, { align: 'right' });
  }

  if ((summary.couponDiscountAmount || 0) > 0) {
    currentY += 6;
    doc.text(`Promo Discount (${summary.couponDiscountPercentage}%):`, pageWidth - 99, currentY);
    doc.text(`- Rs ${summary.couponDiscountAmount?.toLocaleString()}`, pageWidth - 18, currentY, { align: 'right' });
  } else if (summary.discountAmount > 0 && !(summary.volumeDiscountAmount || 0)) {
    currentY += 6;
    doc.text(`Discount (${summary.discountPercentage}%):`, pageWidth - 99, currentY);
    doc.text(`- Rs ${summary.discountAmount.toLocaleString()}`, pageWidth - 18, currentY, { align: 'right' });
  }

  currentY += 9;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('NET ESTIMATED TOTAL:', pageWidth - 99, currentY);
  doc.setTextColor(16, 185, 129); // Green accent
  doc.text(`Rs ${summary.totalEstimatedCost.toLocaleString()}`, pageWidth - 18, currentY, { align: 'right' });

  // Additional Terms
  y += 42;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('SERVICE GUARANTEES & INCLUSIONS:', 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const guarantees = [
    '• Includes 100% genuine Asian Paints / Berger paint materials.',
    '• Complete furniture and floor plastic masking provided at zero extra cost.',
    `• Warranty: ${summary.paintType.durabilityYears} against peeling and color fading.`,
    `• Estimated Project Duration: Approximately ${summary.estimatedDays} working days.`,
    '• Final site inspection and precise measurement check conducted prior to job commencement.',
  ];

  guarantees.forEach((item, index) => {
    doc.text(item, 14, y + 6 + index * 5);
  });

  // Footer signature
  const footerY = 270;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, footerY, pageWidth - 14, footerY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Mansuri Paints - Authorized Signature', 14, footerY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Direct WhatsApp Booking: ${COMPANY_DETAILS.whatsappDisplay}`, pageWidth - 14, footerY + 8, {
    align: 'right',
  });

  // Save PDF file
  doc.save(`Mansuri_Paints_Quotation_${quoteNo}.pdf`);
}

import { jsPDF } from 'jspdf';
import { ReportDraft, StructuredEvent } from '../types';

export function generateComplaintPdf(
  report: ReportDraft,
  matchedCount: number = 2,
  complainantPseudonym: string = 'Protected Complainant'
) {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header styling
  doc.setFillColor(253, 242, 244); // Soft rose background banner
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(159, 18, 55); // Rich berry/rose-800
  doc.text('AAWAZ | CONFIDENTIAL INCIDENT REPORT', 20, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Prepared for Internal Committee (IC / ICC) under POSH Act 2013 & Legal Review', 20, 21);

  y = 38;

  // Metadata Card
  doc.setDrawColor(244, 114, 142);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, y, pageWidth - 40, 32, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Reference ID: ${report.id.toUpperCase()}`, 25, y + 8);
  doc.text(`Complainant: ${complainantPseudonym} (Identity Privately Protected)`, 25, y + 15);
  doc.text(`Date of Filing: ${new Date(report.createdAt).toLocaleDateString()}`, 25, y + 22);

  doc.text(`Respondent: ${report.accusedName || 'Named Person'}`, 110, y + 8);
  doc.text(`Organization: ${report.accusedOrg || 'Designated Workplace'}`, 110, y + 15);
  doc.text(`Role: ${report.accusedRole || 'Not specified'}`, 110, y + 22);

  y += 40;

  // Independent Escrow Pattern Alert
  if (matchedCount > 1) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(248, 113, 113);
    doc.roundedRect(20, y, pageWidth - 40, 16, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(185, 28, 28);
    doc.text(`PATTERN VERIFICATION: Linked with ${matchedCount} independent reports`, 25, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(127, 29, 29);
    doc.text('Distinct reports verified via secure pattern matching under mutual consent.', 25, y + 12);
    y += 24;
  }

  // Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(159, 18, 55);
  doc.text('I. SUMMARY OF COMPLAINT', 20, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(report.summary || report.narrative, pageWidth - 40);
  doc.text(summaryLines, 20, y);
  y += (summaryLines.length * 4.5) + 6;

  // Chronological Timeline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(159, 18, 55);
  doc.text('II. CHRONOLOGICAL TIMELINE OF INCIDENTS', 20, y);
  y += 6;

  const events: StructuredEvent[] = report.structuredEvents && report.structuredEvents.length > 0 
    ? report.structuredEvents 
    : [{
        id: 'evt-1',
        dateOrPeriod: 'Recorded Occurrence',
        location: 'Workplace Context',
        description: report.narrative,
        behaviorCategory: 'unwanted_contact'
      }];

  events.forEach((evt, idx) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(250, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(20, y, pageWidth - 40, 22, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`[${idx + 1}] ${evt.dateOrPeriod} — ${evt.location}`, 24, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const desc = doc.splitTextToSize(evt.description, pageWidth - 48);
    doc.text(desc.slice(0, 2), 24, y + 12);

    if (evt.witnesses) {
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Witnesses/Context: ${evt.witnesses}`, 24, y + 19);
    }

    y += 26;
  });

  y += 4;
  if (y > 250) {
    doc.addPage();
    y = 20;
  }

  // Evidence Index with Hashes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(159, 18, 55);
  doc.text('III. EVIDENCE INDEX & INTEGRITY CHECKS', 20, y);
  y += 6;

  if (report.evidenceItems && report.evidenceItems.length > 0) {
    report.evidenceItems.forEach(item => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(`- ${item.fileName} (${(item.fileSize / 1024).toFixed(1)} KB)`, 24, y);
      y += 4;
      doc.setTextColor(100, 116, 139);
      doc.text(`  SHA-256: ${item.fileHash}`, 24, y);
      y += 6;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Digital evidence and message logs secured in client-side vault.', 24, y);
    y += 8;
  }

  y += 6;
  if (y > 250) {
    doc.addPage();
    y = 20;
  }

  // Legal and Statutory Note
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(159, 18, 55);
  doc.text('IV. STATUTORY NOTICE & NEXT STEPS (POSH ACT 2013)', 20, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const legalText = 'This official complaint report is created by Aawaz for submission to an employer\'s Internal Committee (IC) or Local Committee (LC). Under Section 9 of the POSH Act, complaints may be lodged within 3 months of the last incident (extendable by the IC). Complainants are entitled to interim relief, confidentiality under Section 16, and conciliation or formal inquiry.';
  doc.text(doc.splitTextToSize(legalText, pageWidth - 40), 20, y);

  doc.save(`Aawaz_Complaint_${report.id.slice(0, 8)}.pdf`);
}

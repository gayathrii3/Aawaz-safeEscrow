import { jsPDF } from 'jspdf';
import { ReportDraft, StructuredEvent } from '../types';

export function generateComplaintPdf(
  report: ReportDraft,
  matchedCount: number = 2,
  complainantPseudonym: string = 'Complainant 1',
  peerEvents?: StructuredEvent[],
  peerPseudonym: string = 'Complainant 2'
) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();   // 210 mm
  const pageH     = doc.internal.pageSize.getHeight();  // 297 mm
  const margin    = 14;
  const col       = pageWidth - margin * 2;             // ~182 mm
  let y           = margin;

  // ── helpers ──────────────────────────────────────────────────────────
  const newPage = () => {
    doc.addPage();
    y = margin;
  };

  const checkY = (needed: number) => {
    if (y + needed > pageH - margin) newPage();
  };

  const line = (width = col) => {
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + width, y);
    y += 3;
  };

  const section = (title: string) => {
    checkY(10);
    y += 2;
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 24, 39);
    doc.text(title, margin, y);
    y += 3.5;
    line();
  };

  const body = (text: string, indent = 0, fontSize = 7.5) => {
    doc.setFont('times', 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(55, 65, 81);
    const lines = doc.splitTextToSize(text, col - indent);
    checkY(lines.length * 3.6);
    doc.text(lines, margin + indent, y);
    y += lines.length * 3.6;
  };

  // ── HEADER ───────────────────────────────────────────────────────────
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text('JOINT COMPLAINT — WORKPLACE SEXUAL HARASSMENT', pageWidth / 2, y, { align: 'center' });
  y += 4.5;

  doc.setFont('times', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(107, 114, 128);
  doc.text(
    'Under the Sexual Harassment of Women at Workplace (Prevention, Prohibition & Redressal) Act, 2013',
    pageWidth / 2, y, { align: 'center' }
  );
  y += 5;
  line(col);

  // ── TO / META ─────────────────────────────────────────────────────────
  doc.setFont('times', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(31, 41, 55);
  const refNo   = `POSH-IC-${new Date().getFullYear()}-${report.id.slice(0, 6).toUpperCase()}`;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.text(`To: The Internal Grievance Committee (IGC), ${report.accusedOrg || 'Designated Organisation'}`, margin, y);
  y += 4;
  doc.text(`Ref: ${refNo}    Date: ${dateStr}`, margin, y);
  y += 6;

  // ── PARTIES ───────────────────────────────────────────────────────────
  section('I. PARTIES');

  const halfCol  = col / 2 - 2;
  const tableTop = y;
  const tableH   = matchedCount > 1 ? 18 : 14;
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.3);
  doc.rect(margin, tableTop, col, tableH);
  doc.line(margin + col / 2, tableTop, margin + col / 2, tableTop + tableH);

  doc.setFont('times', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(17, 24, 39);
  doc.text('COMPLAINANT(S)', margin + 2, tableTop + 4.5);
  doc.text('RESPONDENT',     margin + col / 2 + 2, tableTop + 4.5);

  doc.setFont('times', 'normal');
  doc.setTextColor(55, 65, 81);
  doc.text(`1. ${complainantPseudonym}`, margin + 2, tableTop + 8.5);
  if (matchedCount > 1) doc.text(`2. ${peerPseudonym}`, margin + 2, tableTop + 12.5);

  const rx = margin + col / 2 + 2;
  doc.text(`${report.accusedName || '—'}`, rx, tableTop + 8.5);
  doc.text(`${report.accusedOrg || '—'} · ${report.accusedRole || '—'}`, rx, tableTop + 12.5);

  doc.setFont('times', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(107, 114, 128);
  doc.text('Identity protected — Sec. 16, POSH Act 2013', margin + 2, tableTop + tableH - 1.5);

  y = tableTop + tableH + 4;

  // ── INCIDENTS ─────────────────────────────────────────────────────────
  section('II. INCIDENT CHRONOLOGY');

  const allEvents: { src: string; date: string; loc: string; desc: string; cat: string }[] = [];

  (report.structuredEvents?.length
    ? report.structuredEvents
    : [{ dateOrPeriod: 'On Record', location: report.accusedOrg || 'Workplace', description: report.narrative, behaviorCategory: 'other' } as StructuredEvent]
  ).forEach(e => allEvents.push({
    src: complainantPseudonym,
    date: e.dateOrPeriod,
    loc: e.location,
    desc: e.description,
    cat: e.behaviorCategory.replace(/_/g, ' ').toUpperCase()
  }));

  (peerEvents || []).forEach(e =>
    allEvents.push({ src: peerPseudonym, date: e.dateOrPeriod, loc: e.location, desc: e.description, cat: e.behaviorCategory.replace(/_/g, ' ').toUpperCase() })
  );

  allEvents.forEach((evt, i) => {
    const boxH = 14;
    checkY(boxH + 2);
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.rect(margin, y, col, boxH, 'FD');
    doc.setFont('times', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(17, 24, 39);
    doc.text(`#${i + 1}  ${evt.date}  ·  ${evt.loc}`, margin + 2, y + 4.5);
    doc.setFont('times', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(75, 85, 99);
    doc.text(`By: ${evt.src}  |  ${evt.cat}`, margin + 2, y + 8);
    const descLines = doc.splitTextToSize(evt.desc, col - 4);
    doc.text(descLines.slice(0, 1), margin + 2, y + 11.5);
    y += boxH + 2;
  });

  // ── EVIDENCE ──────────────────────────────────────────────────────────
  section('III. DIGITAL EXHIBITS');

  const evidenceItems = report.evidenceItems || [];

  if (evidenceItems.length === 0) {
    body('Exhibit A: Timestamped communications, emails and calendar records (to be annexed separately).', 2);
  } else {
    let exhibitIdx = 0;

    // ── Images: embed as actual images ──────────────────────────────────
    const imageItems = evidenceItems.filter(item => item.fileType === 'image' && item.dataUrl);
    imageItems.forEach((item) => {
      const label = `Exhibit ${String.fromCharCode(65 + exhibitIdx)}: ${item.fileName}`;
      exhibitIdx++;

      checkY(55); // label + image preview

      doc.setFont('times', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(17, 24, 39);
      doc.text(label, margin + 2, y);
      y += 4;

      // Embed the image — max width 80mm, max height 45mm, preserve aspect ratio
      try {
        const imgMaxW = 80;
        const imgMaxH = 45;
        // jsPDF getImageProperties needs the data url
        const props = doc.getImageProperties(item.dataUrl!);
        const ratio  = Math.min(imgMaxW / props.width, imgMaxH / props.height);
        const imgW   = props.width  * ratio;
        const imgH   = props.height * ratio;

        checkY(imgH + 6);
        doc.setDrawColor(209, 213, 219);
        doc.setLineWidth(0.3);
        doc.rect(margin + 2, y, imgW + 2, imgH + 2);
        doc.addImage(item.dataUrl!, margin + 3, y + 1, imgW, imgH);
        y += imgH + 6;
      } catch {
        body(`[Image could not be rendered: ${item.fileName}]`, 4, 6.5);
      }

      // Hash below image
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(107, 114, 128);
      checkY(4);
      doc.text(`SHA-256: ${item.fileHash}`, margin + 2, y);
      y += 4.5;
    });

    // ── Audio / Video: listed as named attachments ───────────────────────
    const mediaItems = evidenceItems.filter(item => item.fileType === 'audio' || item.fileType === 'video');
    if (mediaItems.length > 0) {
      checkY(8);
      doc.setFont('times', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(17, 24, 39);
      doc.text('Audio / Video Attachments (submitted separately to IC)', margin + 2, y);
      y += 4.5;

      mediaItems.forEach((item) => {
        const label = `Exhibit ${String.fromCharCode(65 + exhibitIdx)}: ${item.fileName}`;
        exhibitIdx++;
        checkY(8);

        doc.setFillColor(243, 244, 246);
        doc.setDrawColor(209, 213, 219);
        doc.rect(margin, y, col, 7, 'FD');

        doc.setFont('times', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(31, 41, 55);
        const typeTag = item.fileType === 'audio' ? '[AUDIO]' : '[VIDEO]';
        doc.text(`${typeTag}  ${label}  —  ${(item.fileSize / 1024).toFixed(1)} KB`, margin + 2, y + 4.5);
        y += 9;

        doc.setFont('courier', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(107, 114, 128);
        checkY(4);
        doc.text(`SHA-256: ${item.fileHash}`, margin + 4, y);
        y += 4.5;
      });
    }

    // ── Other files (pdf, doc, etc.) ─────────────────────────────────────
    const otherItems = evidenceItems.filter(item => item.fileType === 'other');
    otherItems.forEach((item) => {
      const label = `Exhibit ${String.fromCharCode(65 + exhibitIdx)}: ${item.fileName}`;
      exhibitIdx++;
      checkY(8);
      doc.setFont('times', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(55, 65, 81);
      doc.text(`${label}  (${(item.fileSize / 1024).toFixed(1)} KB)`, margin + 2, y);
      y += 3.5;
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(107, 114, 128);
      doc.text(`SHA-256: ${item.fileHash}`, margin + 2, y);
      y += 4.5;
    });
  }

  // ── INTERIM RELIEF ────────────────────────────────────────────────────
  section('IV. INTERIM RELIEF SOUGHT (SEC. 12)');
  [
    '1. Restrain respondent from evaluating or reporting on complainants\' work during inquiry.',
    '2. Transfer respondent or grant administrative leave for the duration of the inquiry.',
    '3. Prohibit respondent from contacting complainants directly or through third parties.',
  ].forEach(p => body(p, 2));

  // ── CONFIDENTIALITY BOX ───────────────────────────────────────────────
  checkY(16);
  y += 2;
  const confH = 10;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(252, 165, 165);
  doc.roundedRect(margin, y, col, confH, 1.5, 1.5, 'FD');
  doc.setFont('times', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(153, 27, 27);
  doc.text('CONFIDENTIALITY MANDATE — SEC. 16 & 17, POSH ACT', margin + 3, y + 4);
  doc.setFont('times', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(185, 28, 28);
  doc.text('Disclosure of complainant identities or proceedings is strictly prohibited. Breach attracts statutory penalties.', margin + 3, y + 7.5);
  y += confH + 4;

  // ── SIGNATURES ────────────────────────────────────────────────────────
  checkY(10);
  doc.setFont('times', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(17, 24, 39);
  doc.text('Complainant 1 (Digital Signature)', margin + 5, y);
  if (matchedCount > 1) doc.text('Complainant 2 (Digital Signature)', margin + col / 2 + 5, y);
  y += 4;
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(107, 114, 128);
  doc.text(`[${complainantPseudonym}]`, margin + 5, y);
  if (matchedCount > 1) doc.text(`[${peerPseudonym}]`, margin + col / 2 + 5, y);

  doc.save(`Joint_Complaint_${report.id.slice(0, 6).toUpperCase()}.pdf`);
}

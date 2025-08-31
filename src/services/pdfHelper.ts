import { jsPDF } from 'jspdf';

export interface FamilyReceiptData {
  id: string | number;
  familyName: string;
  community: string;
  familyHead: string;
  contactNumber: string;
  totalAmount: string | number;
  generatedBy?: string;
  generatedAt?: Date;
  parish: string;
}

export interface ReceiptOptions {
  mode?: 'download' | 'print'; // default download
  filename?: string; // optional override
}

export interface GenericReceiptField {
  label: string;
  value: string | number;
}
export interface GenericReceiptPayload {
  id: string | number;
  title: string; // main entity name (Family Name / Church Name / Name / Institution Name)
  subtitleLabel?: string; // label for the secondary field (Community / Place / House Name)
  subtitleValue?: string; // value for subtitle
  fields: GenericReceiptField[]; // grid fields (will auto layout 2 columns)
  totalLabel?: string; // default TOTAL CONTRIBUTION
  totalValue?: string | number; // formatted later
  badgeText?: string; // default same donation receipt text
  generatedBy?: string;
  generatedAt?: Date;
}

// Robust currency formatter handling inputs like "Rs. 50,000", "INR 75,250.5", 60000, etc.
const formatCurrency = (value: string | number) => {
  if (typeof value === 'number') {
    return `Rs. ${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  const raw = value.toString().trim();
  // Extract first numeric token with optional decimal part
  const match = raw.match(
    /\d{1,3}(?:[,\s]\d{2,3})*(?:[.,]\d+)?|\d+(?:[.,]\d+)?/
  );
  let numericStr = match ? match[0] : raw;
  // Remove spaces and commas used as thousand separators
  numericStr = numericStr.replace(/[ ,]/g, '');
  // If both comma and dot appear, assume last dot/comma is decimal separator
  // Normalize decimal separator to '.'
  const decimalParts = numericStr.split(/[.]/g);
  if (decimalParts.length > 2) {
    // If something odd, fallback to stripping all non-digits
    numericStr = numericStr.replace(/[^0-9]/g, '');
  }
  let num = Number(numericStr);
  if (isNaN(num)) {
    // Fallback: remove non-digits and retry
    const digitsOnly = raw.replace(/[^0-9]/g, '');
    num = Number(digitsOnly || '0');
  }
  // Avoid duplicate Rs prefix if original already had it (case-insensitive)
  const alreadyPrefixed = /^\s*rs\.?/i.test(raw);
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${alreadyPrefixed ? 'Rs.' : 'Rs.'} ${formatted}`; // always unify style
};

const BASE_BADGE = 'MMT HOSPITAL DONATION RECEIPT';

// Generic builder
export const buildGenericReceiptPdf = (
  payload: GenericReceiptPayload
): jsPDF => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 56;
  const marginTop = 64;
  let cursorY = marginTop;

  const primary = '#1d4ed8';
  const grayDark = '#111827';
  const gray = '#6b7280';
  const accent = '#15803d';

  // Border
  doc.setDrawColor('#d1d5db');
  doc.setLineWidth(1);
  doc.rect(24, 24, pageWidth - 48, pageHeight - 48);

  // Badge
  const badgeText = payload.badgeText || BASE_BADGE;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const badgeWidth = doc.getTextWidth(badgeText) + 32;
  doc.setFillColor(primary);
  doc.roundedRect(marginX, cursorY - 30, badgeWidth, 34, 8, 8, 'F');
  doc.setTextColor('#ffffff');
  doc.text(badgeText, marginX + 16, cursorY - 9);

  // Title
  cursorY += 12;
  doc.setTextColor(grayDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  const wrappedTitle = doc.splitTextToSize(
    payload.title,
    pageWidth - marginX * 2
  );
  doc.text(wrappedTitle, marginX, cursorY + 26);
  cursorY += 26 + wrappedTitle.length * 22;

  // Subtitle (optional)
  if (payload.subtitleLabel && payload.subtitleValue) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primary);
    doc.text(payload.subtitleLabel.toUpperCase(), marginX, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(grayDark);
    const wrappedSub = doc.splitTextToSize(
      payload.subtitleValue,
      pageWidth - marginX * 2
    );
    doc.text(wrappedSub, marginX, cursorY + 18);
    cursorY += 18 + wrappedSub.length * 18 + 8;
  }

  // Meta line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(gray);
  const metaParts = [
    `Receipt ID: ENT-${payload.id}`,
    `Generated: ${(payload.generatedAt || new Date()).toLocaleString()}`,
    payload.generatedBy ? `By: ${payload.generatedBy}` : undefined,
  ].filter(Boolean) as string[];
  doc.text(metaParts.join('  •  '), marginX, cursorY);
  cursorY += 28;

  // Divider
  doc.setDrawColor(primary);
  doc.setLineWidth(1);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 32;

  // Fields grid
  const labelStyle = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primary);
  };
  const valueStyle = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(grayDark);
  };
  const fields = payload.fields;
  const colGap = 40;
  const colWidth = (pageWidth - marginX * 2 - colGap) / 2;
  let x = marginX;
  let y = cursorY;
  fields.forEach((f, idx) => {
    labelStyle();
    doc.text(f.label.toUpperCase(), x, y);
    valueStyle();
    const wrapped = doc.splitTextToSize(String(f.value), colWidth);
    doc.text(wrapped, x, y + 18);
    const blockHeight = 18 + wrapped.length * 16;
    if (idx % 2 === 1) {
      x = marginX;
      y += Math.max(blockHeight, 54);
    } else {
      x = marginX + colWidth + colGap;
    }
  });
  cursorY = y + 32;

  // Total card
  if (payload.totalValue !== undefined) {
    const totalCardY = cursorY;
    const totalCardHeight = 92;
    doc.setFillColor(accent);
    doc.roundedRect(
      marginX,
      totalCardY,
      pageWidth - marginX * 2,
      totalCardHeight,
      12,
      12,
      'F'
    );
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor('#ffffff');
    doc.text(
      (payload.totalLabel || 'TOTAL CONTRIBUTION').toUpperCase(),
      marginX + 28,
      totalCardY + 34
    );
    doc.setFontSize(28);
    doc.text(formatCurrency(payload.totalValue), marginX + 28, totalCardY + 70);
    cursorY = totalCardY + totalCardHeight + 40;
  }

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(gray);
  const footer =
    'This is a system generated receipt. For queries contact the administrator.';
  const wrappedFooter = doc.splitTextToSize(footer, pageWidth - marginX * 2);
  doc.text(wrappedFooter, marginX, Math.min(cursorY, pageHeight - 72));
  return doc;
};

// Existing specific family builder kept for backward compatibility
export const buildFamilyReceiptPdf = (data: FamilyReceiptData): jsPDF => {
  return buildGenericReceiptPdf({
    id: data.id,
    title: data.familyName,
    subtitleLabel: 'Community',
    subtitleValue: data.community,
    fields: [
      { label: 'Parish', value: data.parish },
      { label: 'Family Head', value: data.familyHead },
      { label: 'Contact Number', value: data.contactNumber },
    ],
    totalValue: data.totalAmount,
    generatedAt: data.generatedAt,
    generatedBy: data.generatedBy,
  });
};

export const generateReceiptPdf = (
  payload: GenericReceiptPayload,
  options: ReceiptOptions = {}
) => {
  const { mode = 'download', filename } = options;
  const doc = buildGenericReceiptPdf(payload);
  const name = filename || `Receipt_${payload.id}.pdf`;
  if (mode === 'print') {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const win = window.open(url);
    if (win) {
      win.onload = () => {
        win.focus();
        win.print();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      };
    } else {
      doc.save(name);
    }
  } else {
    doc.save(name);
  }
};

export const generateFamilyReceiptPdf = (
  data: FamilyReceiptData,
  options: ReceiptOptions = {}
) => {
  const doc = buildFamilyReceiptPdf(data);
  const name = `Family_Receipt_${data.id}.pdf`;
  if (options.mode === 'print') {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const win = window.open(url);
    if (win) {
      win.onload = () => {
        win.focus();
        win.print();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      };
    } else {
      doc.save(name);
    }
  } else {
    doc.save(options.filename || name);
  }
};

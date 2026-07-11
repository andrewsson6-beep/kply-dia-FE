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
  reportPeriod?: {
    from?: string;
    to?: string;
  };
}

export interface ReceiptOptions {
  mode?: 'download' | 'print'; // default download
  filename?: string; // optional override
  detailLevel?: 'summary' | 'detail';
}

export interface ContributionReportData {
  period?: {
    from_year?: number | string;
    to_year?: number | string;
    from_date?: string;
    to_date?: string;
  };
  entity?: {
    type?: string;
    id?: number | string;
    code?: string;
    name?: string;
    par_location?: string;
    par_vicar_name?: string;
    for_location?: string;
    for_vicar_name?: string;
    for_name?: string;
    forane_name?: string;
    address?: string;
    location?: string;
    vicar_name?: string;
    contact_number?: string | null;
    house_name?: string;
    head_name?: string;
    phone_number?: string | null;
    community?: {
      id?: number | string;
      code?: string;
      name?: string;
    };
  };
  summary?: {
    total_amount?: string | number;
    total_count?: string | number;
  };
  contributions?: Array<{
    id?: number | string;
    source_type?: string;
    source_id?: number | string;
    source_name?: string;
    amount?: string | number;
    date?: string;
    purpose?: string;
    family?: { code?: string; house_name?: string; head_name?: string };
    community?: { code?: string; name?: string };
    parish?: {
      code?: string;
      name?: string;
      location?: string;
      par_location?: string;
    };
    forane?: {
      code?: string;
      name?: string;
      location?: string;
      for_location?: string;
    };
  }>;
}

export interface GenericReceiptField {
  label: string;
  value: string | number;
}
export interface ContributionItem {
  date: string; // formatted date string
  amount: string | number; // raw or formatted, will be formatted
  // purpose?: string; // intentionally unused in PDF per current design
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
  contributionsTitle?: string; // default 'Contributions'
  contributions?: ContributionItem[]; // optional list (will render Date & Amount columns only)
}

// Robust currency formatter handling inputs like "Rs. 50,000", "INR 75,250.5", 60000, null, undefined, etc.
const formatCurrency = (value: string | number | null | undefined) => {
  const formatNum = (n: number) =>
    `Rs. ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (value === null || value === undefined) return formatNum(0);
  if (typeof value === 'number') return formatNum(value);

  const raw = String(value ?? '').trim();
  if (!raw) return formatNum(0);

  // Remove common thousand separators first
  let cleaned = raw.replace(/[\s,]/g, '');
  // If multiple dots present, strip all non-digits to avoid mis-parse
  if ((cleaned.match(/[.]/g) || []).length > 1) {
    cleaned = cleaned.replace(/[^0-9]/g, '');
  }
  let num = Number(cleaned);
  if (isNaN(num)) {
    // Fallback: extract a simple numeric token
    const m = cleaned.match(/\d+(?:\.\d+)?/);
    num = Number(m ? m[0] : '0');
  }
  return formatNum(Number.isFinite(num) ? num : 0);
};

const BASE_BADGE = 'MMT HOSPITAL DONATION RECEIPT';

const saveOrPrintDoc = (doc: jsPDF, options: ReceiptOptions, name: string) => {
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

const parseAmount = (value: string | number | null | undefined) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const cleaned = String(value ?? '').replace(/[^0-9.-]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Format dates as DD/MM/YYYY from common date/time strings
const formatDateOnly = (value: string | Date): string => {
  try {
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    if (value instanceof Date) {
      const d = value;
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    }
    const raw = String(value || '').trim();
    if (!raw) return '';
    // Extract YYYY-MM-DD if present anywhere
    const m = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const [, y, mo, d] = m;
      return `${d}/${mo}/${y}`;
    }
    // Try generic parse
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    }
    return raw;
  } catch {
    return String(value || '');
  }
};

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

  // (Meta moved to footer)

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

  // Total card (only when no contributions table is provided)
  if (
    payload.totalValue !== undefined &&
    !(payload.contributions && payload.contributions.length)
  ) {
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

  // Contributions table (optional): Date | Amount (no purpose/action)
  const drawContributionsTable = (items: ContributionItem[]) => {
    if (!items.length) return;
    // Section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(grayDark);
    const title = payload.contributionsTitle || 'Contributions';
    doc.text(title, marginX, cursorY);
    cursorY += 18;

    // Table header background
    const headerHeight = 28;
    const tableLeft = marginX;
    const tableRight = pageWidth - marginX;
    const tableWidth = tableRight - tableLeft;
    doc.setFillColor('#f3f4f6');
    doc.rect(tableLeft, cursorY, tableWidth, headerHeight, 'F');

    // Header text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primary);
    const dateColX = tableLeft + 12;
    const amountColX = tableRight - 12; // right-aligned
    doc.text('DATE', dateColX, cursorY + 18);
    doc.text('AMOUNT', amountColX, cursorY + 18, { align: 'right' });
    cursorY += headerHeight;

    // Rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(grayDark);
    const rowHeight = 24;
    const bottomLimit = pageHeight - 72; // footer margin

    items.forEach((it, idx) => {
      // Page break check
      if (cursorY + rowHeight > bottomLimit) {
        doc.addPage();
        cursorY = marginTop;
        // Re-draw header on new page
        doc.setFillColor('#f3f4f6');
        doc.rect(tableLeft, cursorY, tableWidth, headerHeight, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(primary);
        doc.text('DATE', dateColX, cursorY + 18);
        doc.text('AMOUNT', amountColX, cursorY + 18, { align: 'right' });
        cursorY += headerHeight;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(grayDark);
      }

      // zebra rows
      if (idx % 2 === 1) {
        doc.setFillColor('#fafafa');
        doc.rect(tableLeft, cursorY, tableWidth, rowHeight, 'F');
      }

      const amountText = formatCurrency(it.amount);
      const dateText = formatDateOnly(it.date as any);
      doc.text(dateText, dateColX, cursorY + 16);
      doc.text(amountText, amountColX, cursorY + 16, { align: 'right' });
      cursorY += rowHeight;
    });

    // Total row (highlighted)
    const totalVal =
      payload.totalValue !== undefined
        ? payload.totalValue
        : items.reduce((sum, it) => {
            const n =
              typeof it.amount === 'number'
                ? it.amount
                : Number(String(it.amount).replace(/[^0-9.]/g, '')) || 0;
            return sum + n;
          }, 0);

    const totalRowHeight = 28;
    if (cursorY + totalRowHeight > bottomLimit) {
      doc.addPage();
      cursorY = marginTop;
      // Re-draw header on new page
      doc.setFillColor('#f3f4f6');
      doc.rect(tableLeft, cursorY, tableWidth, headerHeight, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(primary);
      doc.text('DATE', dateColX, cursorY + 18);
      doc.text('AMOUNT', amountColX, cursorY + 18, { align: 'right' });
      cursorY += headerHeight;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(grayDark);
    }

    doc.setFillColor(accent);
    doc.rect(tableLeft, cursorY, tableWidth, totalRowHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor('#ffffff');
    doc.text('TOTAL CONTRIBUTION', dateColX, cursorY + 18);
    doc.text(formatCurrency(totalVal), amountColX, cursorY + 18, {
      align: 'right',
    });
    cursorY += totalRowHeight + 24; // spacing after table
  };

  if (payload.contributions && payload.contributions.length) {
    drawContributionsTable(payload.contributions);
  }

  // Footer (fixed at bottom): meta line + note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(gray);
  const metaParts = [
    `Receipt ID: ENT-${payload.id}`,
    `Generated: ${(payload.generatedAt || new Date()).toLocaleString()}`,
    payload.generatedBy ? `By: ${payload.generatedBy}` : undefined,
  ].filter(Boolean) as string[];
  const metaText = metaParts.join('  •  ');
  const footerNote =
    'This is a system generated receipt. For queries contact the administrator.';
  const footerNoteWrapped = doc.splitTextToSize(
    footerNote,
    pageWidth - marginX * 2
  );
  const footerMetaY = pageHeight - 60;
  const footerNoteY = pageHeight - 40;
  doc.text(metaText, marginX, footerMetaY);
  doc.text(footerNoteWrapped, marginX, footerNoteY);
  return doc;
};

export const buildContributionReportPdf = (
  report: ContributionReportData,
  detailLevel: 'summary' | 'detail' = 'summary'
): jsPDF => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 48;
  const marginTop = 52;
  const bottomY = pageHeight - 58;
  let cursorY = marginTop;

  const primary = '#1f4e79';
  const grayDark = '#111827';
  const gray = '#6b7280';
  const lightGray = '#f6f8fb';
  const line = '#d8dee8';
  const green = '#0f766e';

  const period = report.period || {};
  const entity = report.entity || {};
  const summary = report.summary || {};
  const contributions = Array.isArray(report.contributions)
    ? report.contributions
    : [];

  const clean = (value: unknown) =>
    String(value ?? '-')
      .replace(/\s+/g, ' ')
      .trim() || '-';
  const withLocation = (
    name: unknown,
    location: unknown,
    fallback: unknown = '-'
  ) => {
    const cleanName = clean(name);
    const cleanLocation = clean(location);
    if (cleanName !== '-' && cleanLocation !== '-') {
      return `${cleanName}, ${cleanLocation}`;
    }
    if (cleanName !== '-') return cleanName;
    if (cleanLocation !== '-') return cleanLocation;
    return clean(fallback);
  };
  const parishLabel = (item: any) =>
    withLocation(
      item.parish?.name,
      item.parish?.location || item.parish?.par_location,
      item.source_name
    );
  const foraneLabel = (item: any) =>
    withLocation(
      item.forane?.name,
      item.forane?.location || item.forane?.for_location
    );
  const contributionContext = (item: any) => {
    if (clean(entity.type) === 'forane') return parishLabel(item);
    if (clean(entity.type) === 'parish') return foraneLabel(item);
    if (clean(entity.type) === 'family') {
      return [parishLabel(item), foraneLabel(item)]
        .filter(value => clean(value) !== '-')
        .join(' / ');
    }
    return [parishLabel(item), foraneLabel(item)]
      .filter(value => clean(value) !== '-')
      .join(' / ');
  };
  const contextHeader =
    clean(entity.type) === 'forane'
      ? 'PARISH'
      : clean(entity.type) === 'parish'
        ? 'FORANE'
        : 'PARISH / FORANE';
  const titleCase = (value: unknown) =>
    clean(value).replace(/\b\w/g, char => char.toUpperCase());
  const periodText =
    period.from_year && period.to_year
      ? `${period.from_year} - ${period.to_year}`
      : '-';
  const isDetailed = detailLevel === 'detail';

  const entityDetails = [
    {
      label: 'Location',
      value:
        entity.par_location ||
        entity.for_location ||
        entity.location ||
        entity.address,
    },
    {
      label: 'Vicar',
      value: entity.par_vicar_name || entity.for_vicar_name || entity.vicar_name,
    },
    {
      label: 'Contact',
      value: entity.contact_number || entity.phone_number,
    },
    {
      label: 'Forane',
      value:
        clean(entity.type) === 'parish'
          ? withLocation(
              entity.for_name || entity.forane_name,
              entity.for_location
            )
          : undefined,
    },
    {
      label: 'House Name',
      value: entity.house_name,
    },
    {
      label: 'Family Head',
      value: entity.head_name,
    },
    {
      label: 'Community',
      value: entity.community?.name,
    },
  ].filter(item => clean(item.value) !== '-');

  const groupContributions = (keyGetter: (item: any) => string) => {
    const map = new Map<string, { label: string; count: number; amount: number }>();
    contributions.forEach(item => {
      const label = clean(keyGetter(item));
      const current = map.get(label) || { label, count: 0, amount: 0 };
      current.count += 1;
      current.amount += parseAmount(item.amount);
      map.set(label, current);
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  };

  const ensurePage = (needed = 32) => {
    if (cursorY + needed <= bottomY) return;
    doc.addPage();
    cursorY = marginTop;
  };

  const drawFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(gray);
      doc.text(
        `Generated: ${new Date().toLocaleString()}   Page ${page} of ${pageCount}`,
        marginX,
        pageHeight - 28
      );
    }
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primary);
  doc.text('ARDRAM', marginX, cursorY - 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(grayDark);
  doc.text('Donation Contribution Report', marginX, cursorY + 16);

  doc.setDrawColor(primary);
  doc.setLineWidth(1.5);
  doc.line(marginX, cursorY + 28, pageWidth - marginX, cursorY + 28);

  cursorY += 52;
  const entityName =
    clean(entity.type) === 'family' &&
    (clean(entity.head_name) !== '-' || clean(entity.house_name) !== '-')
      ? [entity.head_name, entity.house_name]
          .map(clean)
          .filter(value => value !== '-')
          .join(', ')
      : clean(entity.name);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(grayDark);
  const wrappedTitle = doc.splitTextToSize(entityName, pageWidth - marginX * 2);
  doc.text(wrappedTitle, marginX, cursorY);
  cursorY += wrappedTitle.length * 18 + 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(gray);
  doc.text(
    `${titleCase(entity.type)}${entity.code ? ` | ${entity.code}` : ''}`,
    marginX,
    cursorY
  );
  cursorY += 18;

  if (entityDetails.length) {
    const detailColWidth = (pageWidth - marginX * 2) / 2;
    const detailRowHeight = 42;
    const detailPanelHeight =
      Math.ceil(entityDetails.length / 2) * detailRowHeight;
    doc.setFillColor(lightGray);
    doc.roundedRect(
      marginX,
      cursorY,
      pageWidth - marginX * 2,
      detailPanelHeight,
      4,
      4,
      'F'
    );
    doc.setDrawColor(line);
    doc.roundedRect(
      marginX,
      cursorY,
      pageWidth - marginX * 2,
      detailPanelHeight,
      4,
      4,
      'S'
    );
    entityDetails.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = marginX + 14 + col * detailColWidth;
      const y = cursorY + row * detailRowHeight;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(gray);
      doc.text(item.label.toUpperCase(), x, y + 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(grayDark);
      const wrapped = doc.splitTextToSize(clean(item.value), detailColWidth - 28);
      doc.text(wrapped.slice(0, 1), x, y + 32);
    });
    cursorY += detailPanelHeight + 16;
  }

  const cardGap = 12;
  const cardWidth = (pageWidth - marginX * 2 - cardGap) / 2;
  const drawSummaryCard = (
    x: number,
    label: string,
    value: string,
    color = grayDark
  ) => {
    doc.setFillColor('#ffffff');
    doc.roundedRect(x, cursorY, cardWidth, 58, 4, 4, 'F');
    doc.setDrawColor(line);
    doc.roundedRect(x, cursorY, cardWidth, 58, 4, 4, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(gray);
    doc.text(label.toUpperCase(), x + 12, cursorY + 18);
    doc.setFontSize(15);
    doc.setTextColor(color);
    doc.text(value, x + 12, cursorY + 42);
  };

  drawSummaryCard(
    marginX,
    'Total Contribution',
    formatCurrency(summary.total_amount),
    green
  );
  drawSummaryCard(
    marginX + cardWidth + cardGap,
    'Year Range',
    periodText
  );
  cursorY += 82;

  doc.setDrawColor(line);
  doc.setLineWidth(0.8);
  doc.line(marginX, cursorY - 18, pageWidth - marginX, cursorY - 18);

  if (!isDetailed) {
    if (!contributions.length) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(gray);
      doc.text(
        'No contributions found for the selected period.',
        marginX,
        cursorY
      );
      drawFooter();
      return doc;
    }

    const primaryGroups =
      clean(entity.type) === 'forane'
        ? groupContributions(item => parishLabel(item))
        : clean(entity.type) === 'parish'
          ? groupContributions(item => item.community?.name || item.source_name)
          : groupContributions(item => item.source_name);
    const yearGroups = groupContributions(item =>
      String(item.date || '').slice(0, 4) || 'Unknown Year'
    ).sort((a, b) => clean(a.label).localeCompare(clean(b.label)));

    const drawSummaryTable = (
      title: string,
      labelHeader: string,
      rows: Array<{ label: string; count: number; amount: number }>
    ) => {
      ensurePage(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(grayDark);
      doc.text(title, marginX, cursorY);
      cursorY += 14;

      const tableLeft = marginX;
      const tableRight = pageWidth - marginX;
      const labelX = tableLeft + 10;
      const amountX = tableRight - 10;
      const headerHeight = 24;
      const rowHeight = 24;

      doc.setFillColor('#eef3f8');
      doc.rect(tableLeft, cursorY, tableRight - tableLeft, headerHeight, 'F');
      doc.setFontSize(8);
      doc.setTextColor(primary);
      doc.text(labelHeader.toUpperCase(), labelX, cursorY + 16);
      doc.text('AMOUNT', amountX, cursorY + 16, { align: 'right' });
      cursorY += headerHeight;

      rows.forEach((row, index) => {
        ensurePage(rowHeight + 20);
        if (index % 2 === 1) {
          doc.setFillColor('#fbfcfe');
          doc.rect(tableLeft, cursorY, tableRight - tableLeft, rowHeight, 'F');
        }
        doc.setDrawColor('#eef1f5');
        doc.line(tableLeft, cursorY + rowHeight, tableRight, cursorY + rowHeight);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(grayDark);
        const wrappedLabel = doc.splitTextToSize(clean(row.label), 390);
        doc.text(wrappedLabel.slice(0, 1), labelX, cursorY + 16);
        doc.setFont('helvetica', 'bold');
        doc.text(formatCurrency(row.amount), amountX, cursorY + 16, {
          align: 'right',
        });
        cursorY += rowHeight;
      });
      cursorY += 18;
    };

    drawSummaryTable('Contributions Over the Years', 'Year', yearGroups);
    drawSummaryTable(
      clean(entity.type) === 'forane'
        ? 'Contributions from Parishes Over the Years'
        : clean(entity.type) === 'parish'
          ? 'Contributions from Communities Over the Years'
          : 'Contributions by Contributor',
      clean(entity.type) === 'forane'
        ? 'Parish'
        : clean(entity.type) === 'parish'
          ? 'Community'
          : 'Contributor',
      primaryGroups
    );

    drawFooter();
    return doc;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(grayDark);
  doc.text('Contribution Details', marginX, cursorY);
  cursorY += 20;

  if (!contributions.length) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(gray);
    doc.text('No contributions found for the selected period.', marginX, cursorY);
    drawFooter();
    return doc;
  }

  const columns = {
    date: marginX + 8,
    contributor: marginX + 74,
    context: marginX + 242,
    amount: pageWidth - marginX - 8,
  };
  const tableLeft = marginX;
  const tableWidth = pageWidth - marginX * 2;
  const headerHeight = 26;
  const rowHeight = 38;
  const amountGutterWidth = 92;
  const contextWidth = columns.amount - amountGutterWidth - columns.context;

  const drawHeader = () => {
    doc.setFillColor('#eef3f8');
    doc.rect(tableLeft, cursorY, tableWidth, headerHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(primary);
    doc.text('DATE', columns.date, cursorY + 17);
    doc.text('CONTRIBUTOR', columns.contributor, cursorY + 17);
    doc.text(contextHeader, columns.context, cursorY + 17);
    doc.text('AMOUNT', columns.amount, cursorY + 17, { align: 'right' });
    cursorY += headerHeight;
  };

  drawHeader();
  contributions.forEach((item, index) => {
    ensurePage(rowHeight + headerHeight);
    if (cursorY === marginTop) drawHeader();

    if (index % 2 === 1) {
      doc.setFillColor('#fbfcfe');
      doc.rect(tableLeft, cursorY, tableWidth, rowHeight, 'F');
    }
    doc.setDrawColor('#eef1f5');
    doc.line(tableLeft, cursorY + rowHeight, tableLeft + tableWidth, cursorY + rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(grayDark);
    doc.text(formatDateOnly(item.date || ''), columns.date, cursorY + 14);

    const contributor = doc.splitTextToSize(clean(item.source_name), 146);
    doc.text(contributor.slice(0, 2), columns.contributor, cursorY + 12);

    const contextText = contributionContext(item);
    const context = doc.splitTextToSize(contextText || '-', contextWidth);
    doc.text(context.slice(0, 2), columns.context, cursorY + 12);

    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(item.amount), columns.amount, cursorY + 14, {
      align: 'right',
    });

    cursorY += rowHeight;
  });

  ensurePage(32);
  doc.setFillColor(green);
  doc.rect(tableLeft, cursorY, tableWidth, 30, 'F');
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL', tableLeft + 10, cursorY + 20);
  doc.text(formatCurrency(summary.total_amount), columns.amount, cursorY + 20, {
    align: 'right',
  });

  drawFooter();
  return doc;
};

export const generateContributionReportPdf = (
  report: ContributionReportData,
  options: ReceiptOptions = {}
) => {
  const entity = report.entity || {};
  const period = report.period || {};
  const safeName = String(entity.name || entity.type || 'Contribution_Report')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '');
  const name =
    options.filename ||
    `${safeName || 'Contribution_Report'}_${period.from_year || 'from'}_${period.to_year || 'to'}.pdf`;
  saveOrPrintDoc(
    buildContributionReportPdf(report, options.detailLevel || 'summary'),
    options,
    name
  );
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
      {
        label: 'Report Period',
        value:
          data.reportPeriod?.from && data.reportPeriod?.to
            ? `${data.reportPeriod.from} to ${data.reportPeriod.to}`
            : '-',
      },
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
    saveOrPrintDoc(doc, options, name);
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
  saveOrPrintDoc(doc, options, name);
};

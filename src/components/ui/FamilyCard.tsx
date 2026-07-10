import React from 'react';
import { generateContributionReportPdf } from '../../services/pdfHelper';
import Modal from './Modal';
import { FaFilePdf } from 'react-icons/fa6';
import { domainApi } from '../../api/api.js';

interface FamilyCardProps {
  id: number | string;
  familyName: string;
  community: string;
  familyHead: string;
  contactNumber: string;
  totalAmount: string | number;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
  onAddContribution: (id: number | string) => void;
  onVisit?: (id: number | string) => void;
  height?: string;
  width?: string;
  className?: string;
}

const FamilyCard: React.FC<FamilyCardProps> = ({
  id,
  familyName,
  community,
  familyHead,
  contactNumber,
  totalAmount,
  onEdit,
  onDelete,
  onAddContribution,
  onVisit,
  height = 'auto',
  width = '100%',
  className = '',
}) => {
  const cardStyle = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0,
  };

  const [receiptModalOpen, setReceiptModalOpen] = React.useState(false);
  const [reportPeriod, setReportPeriod] = React.useState({ from: '', to: '' });
  const [reportDetailLevel, setReportDetailLevel] = React.useState<
    'summary' | 'detail'
  >('summary');
  const [reportLoading, setReportLoading] = React.useState(false);
  const [reportError, setReportError] = React.useState('');
  const currentYear = new Date().getFullYear();
  const fromYear = Number(reportPeriod.from);
  const toYear = Number(reportPeriod.to);
  const periodReady =
    reportPeriod.from &&
    reportPeriod.to &&
    fromYear >= 1900 &&
    toYear <= currentYear + 1 &&
    fromYear <= toYear;
  const openReceiptModal = () => {
    setReportPeriod({ from: '', to: '' });
    setReportDetailLevel('summary');
    setReportError('');
    setReceiptModalOpen(true);
  };
  const closeReceiptModal = () => setReceiptModalOpen(false);

  const generateReport = async (mode: 'download' | 'print') => {
    if (!periodReady) return;
    setReportLoading(true);
    setReportError('');
    try {
      const report = await domainApi.fetchContributionReport({
        entity_type: 'family',
        entity_id: Number(id),
        from_year: Number(reportPeriod.from),
        to_year: Number(reportPeriod.to),
      });
      generateContributionReportPdf(report, {
        mode,
        detailLevel: reportDetailLevel,
      });
      closeReceiptModal();
    } catch (error: any) {
      setReportError(error.message || 'Failed to generate report');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full ${className}`}
      style={cardStyle}
    >
      <div className="flex flex-col sm:flex-row h-full p-3 sm:p-4 gap-3 sm:gap-4">
        <div className="flex-1 p-3 sm:p-4 border-2 border-blue-400 rounded-xl overflow-hidden min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 h-full">
            {/* Left Column */}
            <div className="space-y-2 flex flex-col">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Family Name
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm break-words overflow-hidden">
                  {familyName}
                </div>
              </div>
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Family Head
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {familyHead}
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-2 flex flex-col">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Community
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {community}
                </div>
              </div>
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Contact Number
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {contactNumber}
                </div>
              </div>
              {/* Mobile Total */}
              <div className="flex-shrink-0 sm:hidden">
                <label className="text-blue-500 font-medium text-xs mb-1 block">
                  Total Amount
                </label>
                <div className="bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-xs w-full text-center break-words">
                  {totalAmount}
                </div>
              </div>
              {/* Desktop Total */}
              <div className="hidden sm:flex flex-1 items-end">
                <div className="w-full">
                  <label className="text-blue-500 font-medium text-sm mb-1 block">
                    Total Amount
                  </label>
                  <div className="bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-sm w-full text-center break-words">
                    {totalAmount}
                  </div>
                </div>
              </div>
              {/* Mobile action buttons */}
              <div className="flex-shrink-0 sm:hidden flex gap-2">
                <button
                  onClick={() => onVisit && onVisit(id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-md cursor-pointer transition-all duration-200 ease-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-[10px]"
                >
                  VISIT FAMILY
                </button>
                <button
                  onClick={() => onAddContribution(id)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Add contribution"
                  title="Add contribution"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onEdit(id)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Edit family"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 00.707-.293l11.414-11.414a1 1 0 000-1.414L16.414 4.293a1 1 0 00-1.414 0L3.586 15.707A1 1 0 003.293 16.414V20z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Delete family"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
                    />
                  </svg>
                </button>
                <button
                  onClick={openReceiptModal}
                  className="h-9 w-10 shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Export PDF report"
                  title="Export PDF report"
                >
                  <FaFilePdf className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            {/* Desktop actions */}
            <div className="hidden sm:flex sm:col-span-2 items-center justify-between gap-3 mt-2">
              <button
                onClick={() => onVisit && onVisit(id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-all duration-200 ease-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              >
                VISIT FAMILY
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => onAddContribution(id)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Add contribution"
                  title="Add contribution"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onEdit(id)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Edit family"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 00.707-.293l11.414-11.414a1 1 0 000-1.414L16.414 4.293a1 1 0 00-1.414 0L3.586 15.707A1 1 0 003.293 16.414V20z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Delete family"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
                    />
                  </svg>
                </button>
                <button
                  onClick={openReceiptModal}
                  className="h-10 w-11 shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Export PDF report"
                  title="Export PDF report"
                >
                  <FaFilePdf className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {receiptModalOpen && (
        <Modal
          isOpen={receiptModalOpen}
          onClose={closeReceiptModal}
          title="Export PDF Report"
          size="sm"
          footer={
            <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={closeReceiptModal}
                className="sm:mr-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => generateReport('download')}
                disabled={!periodReady || reportLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md shadow hover:shadow-md transition-all cursor-pointer"
              >
                {reportLoading ? 'Preparing...' : 'Download'}
              </button>
              <button
                onClick={() => generateReport('print')}
                disabled={!periodReady || reportLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md shadow hover:shadow-md transition-all cursor-pointer"
              >
                Print
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <p>
              Select the report period for{' '}
              <span className="font-semibold text-gray-800">{familyName}</span>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-semibold text-gray-600">
                  From Year
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1900"
                  max={currentYear + 1}
                  placeholder="2024"
                  value={reportPeriod.from}
                  onChange={e =>
                    setReportPeriod(prev => ({ ...prev, from: e.target.value }))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-gray-600">
                  To Year
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={reportPeriod.from || 1900}
                  max={currentYear + 1}
                  placeholder={String(currentYear)}
                  value={reportPeriod.to}
                  onChange={e =>
                    setReportPeriod(prev => ({ ...prev, to: e.target.value }))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-600">
                Report Type
              </span>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-start gap-2 rounded-md border border-gray-300 px-3 py-2 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name={`family-report-type-${id}`}
                    value="summary"
                    checked={reportDetailLevel === 'summary'}
                    onChange={() => setReportDetailLevel('summary')}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-gray-800">
                      Summarized
                    </span>
                    {/* <span className="block text-xs text-gray-500">
                      Totals and grouped breakdowns.
                    </span> */}
                  </span>
                </label>
                <label className="flex items-start gap-2 rounded-md border border-gray-300 px-3 py-2 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name={`family-report-type-${id}`}
                    value="detail"
                    checked={reportDetailLevel === 'detail'}
                    onChange={() => setReportDetailLevel('detail')}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-gray-800">
                      Detailed
                    </span>
                    {/* <span className="block text-xs text-gray-500">
                      Every contribution row.
                    </span> */}
                  </span>
                </label>
              </div>
            </div>
            {!periodReady && (
              <p className="text-xs text-gray-500">
                Choose a valid year range to enable export actions.
              </p>
            )}
            {reportError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {reportError}
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FamilyCard;

// Example usage:
/*
import FamilyCard from './FamilyCard';

const ExampleUsage = () => {
  const handleVisitParish = () => {
    console.log('Visit Parish clicked');
    // Handle navigation or modal opening
  };

  return (
    <div className="space-y-4 p-4">
      <FamilyCard
        id={1}
        churchName="Our Lady of Dolours Church"
        place="Mundakkayam"
        vicarName="Rev. Fr. James Muthanattu"
        contactNumber="9633104090"
        totalAmount="Rs. 12,00,692"
        imageUrl="/path/to/church-image.jpg"
        onVisitParish={handleVisitParish}
        className="max-w-4xl mx-auto"
      />
      
      <FamilyCard
        id={2}
        churchName="St. Mary's Cathedral"
        place="Kochi"
        vicarName="Rev. Fr. John Doe"
        contactNumber="9876543210"
        totalAmount="Rs. 15,00,000"
        imageUrl="/path/to/church-image.jpg"
        onVisitParish={handleVisitParish}
        height="300px"
        width="600px"
        className="mx-auto"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FamilyCard
          id={3}
          churchName="Holy Cross Church"
          place="Thrissur"
          vicarName="Rev. Fr. Michael"
          contactNumber="9999888777"
          totalAmount="Rs. 8,50,000"
          imageUrl="/path/to/church-image.jpg"
          onVisitParish={handleVisitParish}
          height="350px"
        />
      </div>
    </div>
  );
};
*/

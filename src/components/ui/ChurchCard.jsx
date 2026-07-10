import React, { useState } from 'react';
import Modal from './Modal';
import { generateContributionReportPdf } from '../../services/pdfHelper';
import { FaFilePdf } from 'react-icons/fa6';
import { domainApi } from '../../api/api.js';

const ChurchCard = ({
  id,
  churchName,
  place,
  vicarName,
  contactNumber,
  totalAmount,
  onVisitParish,
  height = 'auto',
  width = '100%',
  className = '',
  forane, // optional new prop if available
  visitLabel = 'VISIT PARISH', // new customizable label
  reportEntityType = 'parish',
  reportEntityId,
}) => {
  const cardStyle = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0, // Allows flex items to shrink below their content size
  };
  const [open, setOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState({ from: '', to: '' });
  const [reportDetailLevel, setReportDetailLevel] = useState('summary');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const currentYear = new Date().getFullYear();
  const fromYear = Number(reportPeriod.from);
  const toYear = Number(reportPeriod.to);
  const periodReady =
    reportPeriod.from &&
    reportPeriod.to &&
    fromYear >= 1900 &&
    toYear <= currentYear + 1 &&
    fromYear <= toYear;

  const openReportModal = () => {
    setReportPeriod({ from: '', to: '' });
    setReportDetailLevel('summary');
    setReportError('');
    setOpen(true);
  };

  const handleKeyDown = e => {
    if ((e.key === 'Enter' || e.key === ' ') && onVisitParish) {
      e.preventDefault();
      onVisitParish();
    }
  };
  const generateReport = async mode => {
    if (!periodReady) return;
    setReportLoading(true);
    setReportError('');
    try {
      const report = await domainApi.fetchContributionReport({
        entity_type: reportEntityType,
        entity_id: Number(reportEntityId ?? id),
        from_year: Number(reportPeriod.from),
        to_year: Number(reportPeriod.to),
      });
      generateContributionReportPdf(report, {
        mode,
        detailLevel: reportDetailLevel,
      });
      setOpen(false);
    } catch (error) {
      setReportError(error.message || 'Failed to generate report');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full ${onVisitParish ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''} ${className}`}
      style={cardStyle}
      onClick={onVisitParish}
      onKeyDown={handleKeyDown}
      role={onVisitParish ? 'button' : undefined}
      tabIndex={onVisitParish ? 0 : undefined}
      aria-label={onVisitParish ? `Visit parish ${churchName}` : undefined}
    >
      <div className="flex flex-col h-full p-3 sm:p-4">
        {/* Church Details */}
        <div className="relative flex-1 p-3 sm:p-4 border-2 border-blue-400 rounded-xl overflow-hidden min-w-0">
          {id && (
            <div className="absolute top-2 left-2">
              <div className="bg-blue-500 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">
                {id}
              </div>
            </div>
          )}
          <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 h-full">
            {/* Left Column */}
            <div className="space-y-2 flex flex-col">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Church Name
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm break-words overflow-hidden">
                  {churchName}
                </div>
              </div>

              {forane ? (
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Forane
                  </label>
                  <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                    {forane}
                  </div>
                </div>
              ) : null}

              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Place
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {place}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2 flex flex-col">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Vicar Name
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {vicarName}
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

              {/* Mobile: Show Total Amount here (second-to-last) */}
              <div className="flex-shrink-0 sm:hidden">
                <label className="text-blue-500 font-medium text-xs mb-1 block">
                  Total Amount
                </label>
                <div className="bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-xs w-full text-center break-words">
                  {totalAmount}
                </div>
              </div>

              {/* Desktop: Show Total Amount here */}
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

              {/* Mobile: Show button here (last item) */}
              <div className="flex-shrink-0 sm:hidden flex gap-2 mt-1">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onVisitParish && onVisitParish();
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-[10px] cursor-pointer"
                >
                  {visitLabel}
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    openReportModal();
                  }}
                  className="h-9 w-10 shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Export PDF report"
                  title="Export PDF report"
                >
                  <FaFilePdf className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Desktop: Button spans full width at bottom */}
              <div className="hidden sm:flex sm:col-span-2 items-center gap-3 mt-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onVisitParish && onVisitParish();
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-sm cursor-pointer"
                >
                  {visitLabel}
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    openReportModal();
                  }}
                  className="h-10 w-11 shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
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
      {open && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Export PDF Report"
          size="sm"
          footer={
            <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setOpen(false)}
                className="sm:mr-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => generateReport('download')}
                disabled={!periodReady || reportLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md shadow transition-all cursor-pointer"
              >
                {reportLoading ? 'Preparing...' : 'Download'}
              </button>
              <button
                onClick={() => generateReport('print')}
                disabled={!periodReady || reportLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md shadow transition-all cursor-pointer"
              >
                Print
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select the report period for{' '}
              <span className="font-semibold text-gray-800">{churchName}</span>.
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
                    name={`church-report-type-${id}`}
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
                    name={`church-report-type-${id}`}
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

export default ChurchCard;

// Example usage:
/*
import ChurchCard from './ChurchCard';

const ExampleUsage = () => {
  const handleVisitParish = () => {
    console.log('Visit Parish clicked');
    // Handle navigation or modal opening
  };

  return (
    <div className="space-y-4 p-4">
      <ChurchCard
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
      
      <ChurchCard
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
        <ChurchCard
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

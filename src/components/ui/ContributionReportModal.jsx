import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { domainApi } from '../../api/api.js';
import { generateContributionReportPdf } from '../../services/pdfHelper';

const ContributionReportModal = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  entityName,
}) => {
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

  useEffect(() => {
    if (isOpen) {
      setReportPeriod({ from: '', to: '' });
      setReportDetailLevel('summary');
      setReportError('');
    }
  }, [isOpen]);

  const generateReport = async mode => {
    if (!periodReady) return;
    setReportLoading(true);
    setReportError('');
    try {
      const report = await domainApi.fetchContributionReport({
        entity_type: entityType,
        entity_id: Number(entityId),
        from_year: fromYear,
        to_year: toYear,
      });
      generateContributionReportPdf(report, {
        mode,
        detailLevel: reportDetailLevel,
      });
      onClose();
    } catch (error) {
      setReportError(error.message || 'Failed to generate report');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export PDF Report"
      size="sm"
      footer={
        <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onClose}
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
          <span className="font-semibold text-gray-800">{entityName}</span>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-gray-600">From Year</span>
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
            <span className="text-xs font-semibold text-gray-600">To Year</span>
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
          <span className="text-xs font-semibold text-gray-600">Report Type</span>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {['summary', 'detail'].map(level => (
              <label
                key={level}
                className="flex items-start gap-2 rounded-md border border-gray-300 px-3 py-2 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name={`${entityType}-report-type-${entityId}`}
                  value={level}
                  checked={reportDetailLevel === level}
                  onChange={() => setReportDetailLevel(level)}
                  className="mt-1"
                />
                <span className="block text-sm font-semibold text-gray-800">
                  {level === 'summary' ? 'Summarized' : 'Detailed'}
                </span>
              </label>
            ))}
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
  );
};

export default ContributionReportModal;

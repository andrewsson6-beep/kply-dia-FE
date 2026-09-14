import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../layout/Header';
import Modal from '../ui/Modal';
import CommunityForm from '../forms/CommunityForm';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { domainApi } from '../../api/api.js';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { updateCommunityThunk } from '../../store/actions/communityActions.js';
import {
  generateCommunityContributionReportsPdf,
  generateContributionReportPdf,
} from '../../services/pdfHelper';
import { FaFilePdf } from 'react-icons/fa6';

// Community Details page (skeleton similar to Individual/Institution visit pages)
// Shows basic meta and totals; future: contributions at community level if API exists.
const CommunityDetails = () => {
  const { parishId, communityId } = useParams();
  const navigate = useNavigate();
  const headerOffset = useHeaderOffset();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportMode, setReportMode] = useState('families');
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

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const details = await domainApi.fetchCommunityDetails(
        Number(communityId)
      );
      setData(details);
    } catch (e) {
      setError(e.message || 'Failed to load community');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parishId, communityId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError('');
  };

  const openReportModal = mode => {
    setReportPeriod({ from: '', to: '' });
    setReportDetailLevel('summary');
    setReportError('');
    setReportMode(mode);
    setReportModalOpen(true);
  };

  const closeReportModal = () => setReportModalOpen(false);

  const generateReport = async mode => {
    if (!periodReady) return;
    setReportLoading(true);
    setReportError('');
    try {
      if (reportMode === 'families') {
        const reports = await domainApi.fetchCommunityContributionReports({
          community_id: Number(communityId),
          from_year: Number(reportPeriod.from),
          to_year: Number(reportPeriod.to),
        });
        generateCommunityContributionReportsPdf(reports, {
          mode,
          detailLevel: reportDetailLevel,
        });
      } else {
        const report = await domainApi.fetchContributionReport({
          entity_type: 'community',
          entity_id: Number(communityId),
          from_year: Number(reportPeriod.from),
          to_year: Number(reportPeriod.to),
        });
        generateContributionReportPdf(report, {
          mode,
          detailLevel: reportDetailLevel,
        });
      }
      closeReportModal();
    } catch (reportErr) {
      setReportError(reportErr.message || 'Failed to generate report');
    } finally {
      setReportLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
  };

  const handleUpdateCommunity = async formData => {
    setUpdating(true);
    setError('');
    try {
      const payload = {
        com_id: Number(communityId),
        com_name: formData.name.trim(),
        com_par_id: Number(parishId),
        com_updated_by: user?.id || 0,
      };

      const action = await dispatch(
        updateCommunityThunk({
          parentType: 'parish',
          parentId: Number(parishId),
          payload,
        })
      );

      if (updateCommunityThunk.fulfilled.match(action)) {
        // Refresh the community data
        await load();
        setIsEditing(false);
        // Could show success message here if needed
      } else {
        setError(action.payload || 'Failed to update community');
      }
    } catch (err) {
      setError(err.message || 'Failed to update community');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ paddingTop: headerOffset }}>
      <Header
        onSelect={() => {}}
        headerInfo={{ title: 'Community Details', subtitle: 'Overview' }}
      />
      <div className="p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-fit rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            &larr; Back
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openReportModal('families')}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <FaFilePdf className="h-5 w-5" aria-hidden="true" />
              Download family reports
            </button>
            <button
              type="button"
              onClick={() => openReportModal('community')}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <FaFilePdf className="h-5 w-5" aria-hidden="true" />
              Community report
            </button>
            <button
              onClick={() =>
                navigate(
                  `/parish/list/${parishId}/community/${communityId}/visit`
                )
              }
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View Families
            </button>

            <button
              onClick={handleEditClick}
              disabled={isEditing}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                isEditing
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              {isEditing ? 'Editing...' : 'Edit Community'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            {isEditing ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Edit Community
                </h3>
                <CommunityForm
                  initialData={{
                    id: data.id,
                    name: data.name,
                  }}
                  isEdit={true}
                  onSubmit={handleUpdateCommunity}
                  onCancel={handleCancelEdit}
                  parentType="parish"
                  parentId={parishId}
                  parishName={`Parish #${parishId}`}
                  className="max-w-2xl"
                />
                {updating && (
                  <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    Updating community...
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-lg font-semibold text-blue-700">
                  {data.name}
                </div>
                <div className="mt-1 text-sm text-gray-700">
                  Code: <span className="font-mono">{data.code || '-'}</span>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Parish ID:</span>{' '}
                    {data.parishId}
                  </div>
                  {/* Uncomment if you want to show Forane ID */}
                  {/* <div>
                    <span className="text-gray-500">Forane ID:</span> {data.foraneId ?? '-'}
                  </div> */}
                  <div>
                    <span className="text-gray-500">Total:</span>{' '}
                    {data.totalAmount}
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : null}
      </div>
      {reportModalOpen && (
        <Modal
          isOpen={reportModalOpen}
          onClose={closeReportModal}
          title={
            reportMode === 'families'
              ? 'Export Family Contribution Reports'
              : 'Export Community Contribution Report'
          }
          size="sm"
          footer={
            <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={closeReportModal}
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
              <span className="font-semibold text-gray-800">
                {data?.name || `Community #${communityId}`}
              </span>
              .
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
            {reportMode === 'community' && (
              <div>
                <span className="text-xs font-semibold text-gray-600">
                  Report Type
                </span>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['summary', 'detail'].map(level => (
                    <label
                      key={level}
                      className="flex items-start gap-2 rounded-md border border-gray-300 px-3 py-2 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name={`community-report-type-${communityId}`}
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
            )}
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

export default CommunityDetails;

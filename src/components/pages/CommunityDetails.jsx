import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../layout/Header';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { domainApi } from '../../api/api.js';

// Community Details page (skeleton similar to Individual/Institution visit pages)
// Shows basic meta and totals; future: contributions at community level if API exists.
const CommunityDetails = () => {
  const { parishId, communityId } = useParams();
  const navigate = useNavigate();
  const headerOffset = useHeaderOffset();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

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

  return (
    <div style={{ paddingTop: headerOffset }}>
      <Header
        onSelect={() => {}}
        headerInfo={{ title: 'Community Details', subtitle: 'Overview' }}
      />
      <div className="p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            &larr; Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate(
                  `/parish/list/${parishId}/community/${communityId}/visit`
                )
              }
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              View Families
            </button>
            {/* Placeholder actions mirroring other detail pages */}
            <button
              onClick={() => {
                /* future: edit community */
              }}
              className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm"
            >
              Edit Community
            </button>
            <button
              onClick={() => {
                /* future: delete community */
              }}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Delete Community
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

            {/* Future: contributions/summary per community */}
            <div className="text-sm text-gray-500">
              More community actions and details coming soon.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CommunityDetails;

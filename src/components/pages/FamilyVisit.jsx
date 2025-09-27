import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../layout/Header';
import Modal from '../ui/Modal';
import ContributionForm from '../forms/ContributionForm';
import FamilyForm from '../forms/FamilyForm';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { domainApi } from '../../api/api.js';
import { useToast } from '../ui/useToast.js';
import { generateReceiptPdf } from '../../services/pdfHelper.ts';

const FamilyVisit = () => {
  const { familyId, communityId } = useParams();
  const navigate = useNavigate();
  const headerOffset = useHeaderOffset();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showEditFamily, setShowEditFamily] = useState(false);
  const [communityName, setCommunityName] = useState('');

  const loadDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await domainApi.fetchFamilyDetails(Number(familyId));
      setData(resp);
    } catch (e) {
      setError(e.message || 'Failed to load family');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyId]);

  useEffect(() => {
    let alive = true;
    const loadCommunityName = async () => {
      if (!communityId) return;
      try {
        const details = await domainApi.fetchCommunityDetails(
          Number(communityId)
        );
        if (alive)
          setCommunityName(details?.name || `Community #${communityId}`);
      } catch {
        if (alive) setCommunityName(`Community #${communityId}`);
      }
    };
    loadCommunityName();
    return () => {
      alive = false;
    };
  }, [communityId]);

  const rows = useMemo(() => data?.contributions || [], [data]);

  const toInputDate = raw => {
    const s = String(raw || '');
    const m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      const pad = n => (n < 10 ? `0${n}` : `${n}`);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    const today = new Date();
    const pad = n => (n < 10 ? `0${n}` : `${n}`);
    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  };

  const formatINR = n => `Rs. ${Number(n || 0).toLocaleString('en-IN')}`;
  const toDMY = s => {
    const raw = String(s || '');
    const m = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      const pad = x => (x < 10 ? `0${x}` : x);
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    }
    return raw;
  };

  const onAddSubmit = async ({ amount, notes, date }) => {
    try {
      await domainApi.addFamilyContribution({
        fcon_fam_id: Number(familyId),
        fcon_amount: Number(amount || 0),
        fcon_purpose: notes || '',
        fcon_date: date,
      });
      showToast('Contribution added successfully', { type: 'success' });
      setShowAdd(false);
      await loadDetails();
    } catch (e) {
      showToast(e.message || 'Failed to add contribution', { type: 'error' });
    }
  };

  const onEditSubmit = async ({ amount, notes, date }) => {
    if (!editing) return;
    try {
      await domainApi.updateFamilyContribution({
        fcon_id: editing.id,
        fcon_amount: Number(amount || 0),
        fcon_purpose: notes || '',
        fcon_date: date,
      });
      showToast('Contribution updated successfully', { type: 'success' });
      setEditing(null);
      await loadDetails();
    } catch (e) {
      showToast(e.message || 'Failed to update contribution', {
        type: 'error',
      });
    }
  };

  const printSummary = () => {
    if (!data) return;
    const sum = (data.contributions || []).reduce((acc, r) => {
      const n =
        typeof r.amount === 'number'
          ? r.amount
          : Number(String(r.amount).replace(/[^0-9.]/g, '')) || 0;
      return acc + n;
    }, 0);
    const total =
      data.totalAmountRaw && data.totalAmountRaw > 0
        ? data.totalAmountRaw
        : sum;
    const payload = {
      id: data.id,
      title: data.houseName,
      subtitleLabel: 'Family Head',
      subtitleValue: data.headName || '',
      fields: [
        { label: 'Phone', value: data.phoneNumber || '' },
        { label: 'Code', value: data.code || '' },
      ],
      totalValue: total,
      contributionsTitle: 'Contributions',
      contributions: (data.contributions || []).map(r => ({
        date: r.date,
        amount: r.amount ?? 0,
      })),
    };
    generateReceiptPdf(payload, { mode: 'print' });
  };

  return (
    <div style={{ paddingTop: headerOffset }}>
      <Header
        onSelect={() => {}}
        headerInfo={{ title: 'Family Details', subtitle: 'Visit' }}
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
              onClick={() => setShowAdd(true)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              Add Contribution
            </button>
            <button
              onClick={printSummary}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
            >
              Print Summary
            </button>
            <button
              onClick={() => setShowEditFamily(true)}
              className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm"
            >
              Edit Family
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
                {data.houseName}
              </div>
              <div className="mt-1 text-sm text-gray-700">
                Head: {data.headName}
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Phone:</span>{' '}
                  {data.phoneNumber || '-'}
                </div>
                <div>
                  <span className="text-gray-500">Code:</span>{' '}
                  {data.code || '-'}
                </div>
                <div>
                  <span className="text-gray-500">Total:</span>{' '}
                  {data.totalAmount}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-base font-semibold">Contributions</div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Purpose</th>
                      <th className="py-2 pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.id} className="border-t border-gray-100">
                        <td className="py-2 pr-4">{toDMY(r.date)}</td>
                        <td className="py-2 pr-4">{formatINR(r.amount)}</td>
                        <td className="py-2 pr-4">{r.purpose || '-'}</td>
                        <td className="py-2 pr-4">
                          <button
                            className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                            onClick={() => setEditing(r)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-gray-500"
                        >
                          No contributions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Add Contribution Drawer */}
      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Contribution"
        size="sm"
        variant="side"
        closeOnBackdrop={false}
      >
        <ContributionForm
          onSubmit={onAddSubmit}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>

      {/* Edit Contribution Drawer */}
      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Contribution"
        size="sm"
        variant="side"
        closeOnBackdrop={false}
      >
        {editing && (
          <ContributionForm
            isEdit
            initialData={{
              amount: editing.fcon_amount,
              notes: editing.fcon_purpose,
              date: toInputDate(editing.fcon_date),
            }}
            onSubmit={onEditSubmit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Edit Family Drawer */}
      <Modal
        isOpen={showEditFamily}
        onClose={() => setShowEditFamily(false)}
        title={data ? `Edit: ${data.houseName}` : 'Edit Family'}
        size="lg"
        variant="side"
        closeOnBackdrop={false}
      >
        {data && (
          <FamilyForm
            isEdit
            initialData={{
              familyName: data.houseName || '',
              familyHead: data.headName || '',
              community: communityName || '',
              contactNumber: data.phoneNumber || '',
              totalAmount: data.totalAmountRaw ?? 0,
            }}
            onSubmit={async form => {
              try {
                await domainApi.updateFamily({
                  id: data.id,
                  familyName: (form.familyName || '').trim(),
                  familyHead: (form.familyHead || '').trim(),
                  contactNumber: (form.contactNumber || '').trim(),
                  totalAmount: form.totalAmount,
                });
                showToast('Family updated successfully', { type: 'success' });
                setShowEditFamily(false);
                await loadDetails();
              } catch (e) {
                showToast(e.message || 'Failed to update family', {
                  type: 'error',
                });
              }
            }}
            onCancel={() => setShowEditFamily(false)}
            communityOptions={communityName ? [communityName] : []}
          />
        )}
      </Modal>
    </div>
  );
};

export default FamilyVisit;

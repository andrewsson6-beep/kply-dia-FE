import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import Modal from '../ui/Modal';
import ContributionForm from '../forms/ContributionForm';
import { domainApi } from '../../api/api.js';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useToast } from '../ui/useToast.js';
import { generateReceiptPdf } from '../../services/pdfHelper.ts';
import IndividualForm from '../forms/IndividualForm';

const IndividualVisit = () => {
  const { individualId } = useParams();
  const navigate = useNavigate();
  const headerOffset = useHeaderOffset();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const loadDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await domainApi.fetchIndividualDetails(Number(individualId));
      setData(resp);
    } catch (e) {
      setError(e.message || 'Failed to load individual');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [individualId]);

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null); // contribution row
  const [showEditIndividual, setShowEditIndividual] = useState(false);

  const onAddSubmit = async ({ amount, notes }) => {
    try {
      await domainApi.addIndividualContribution({
        icon_ind_id: Number(individualId),
        icon_amount: Number(amount || 0),
        icon_purpose: notes || '',
      });
      showToast('Contribution added successfully', { type: 'success' });
      setShowAdd(false);
      await loadDetails();
    } catch (e) {
      showToast(e.message || 'Failed to add contribution', { type: 'error' });
    }
  };

  const onEditSubmit = async ({ amount, notes }) => {
    if (!editing) return;
    try {
      await domainApi.updateIndividualContribution({
        icon_id: editing.icon_id,
        icon_amount: Number(amount || 0),
        icon_date: new Date().toISOString(),
        icon_purpose: notes || '',
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

  const openEditIndividual = () => {
    setShowEditIndividual(true);
  };

  const initialIndividualFormData = () => {
    if (!data) return null;
    // Split address into houseName and place
    const address = data.ind_address || '';
    const parts = address
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const place = parts.length ? parts[parts.length - 1] : '';
    const houseName = parts.length ? parts.slice(0, -1).join(', ') : address;
    return {
      id: data.ind_id,
      individualName: data.ind_full_name || '',
      houseName,
      place,
      contactNumber: data.ind_phone_number || '',
      email: data.ind_email || '',
      totalAmountRaw: data.ind_total_contribution_amount || 0,
    };
  };

  const onSubmitEditIndividual = async form => {
    try {
      await domainApi.updateIndividual({
        ind_id: form.id,
        ind_full_name: (form.individualName || '').trim(),
        ind_phone_number: (form.contactNumber || '').trim(),
        ind_email: (form.email || '').trim(),
        ind_address: [form.houseName, form.place].filter(Boolean).join(', '),
      });
      showToast('Individual updated successfully', { type: 'success' });
      setShowEditIndividual(false);
      await loadDetails();
    } catch (e) {
      showToast(e.message || 'Failed to update individual', { type: 'error' });
    }
  };

  const printSummary = () => {
    if (!data) return;
    const payload = {
      id: data.ind_id,
      title: data.ind_full_name,
      subtitleLabel: 'House / Place',
      subtitleValue: data.ind_address,
      fields: [
        { label: 'Phone', value: data.ind_phone_number || '' },
        { label: 'Email', value: data.ind_email || '' },
        { label: 'Code', value: data.ind_code || '' },
        { label: 'Unique No', value: data.ind_unique_no || '' },
      ],
      totalValue: data.ind_total_contribution_amount,
      contributionsTitle: 'Contributions',
      contributions: (data.contributions || []).map(r => ({
        date: r.icon_date,
        amount: r.icon_amount,
      })),
    };
    generateReceiptPdf(payload, { mode: 'print' });
  };

  const rows = useMemo(() => data?.contributions || [], [data]);

  return (
    <div style={{ paddingTop: headerOffset }}>
      <Header
        onSelect={() => {}}
        headerInfo={{ title: 'Individual Details', subtitle: 'Visit' }}
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
              className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm"
              onClick={openEditIndividual}
            >
              Edit Individual
            </button>
            <button
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
              onClick={() =>
                showToast('Delete Individual not implemented', {
                  type: 'warning',
                })
              }
            >
              Delete Individual
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
                {data.ind_full_name}
              </div>
              <div className="mt-1 text-sm text-gray-700">
                {data.ind_address}
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Phone:</span>{' '}
                  {data.ind_phone_number || '-'}
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>{' '}
                  {data.ind_email || '-'}
                </div>
                <div>
                  <span className="text-gray-500">Total:</span> Rs.{' '}
                  {Number(
                    data.ind_total_contribution_amount || 0
                  ).toLocaleString('en-IN')}
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
                      <tr key={r.icon_id} className="border-t border-gray-100">
                        <td className="py-2 pr-4">{r.icon_date}</td>
                        <td className="py-2 pr-4">
                          Rs.{' '}
                          {Number(r.icon_amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 pr-4">{r.icon_purpose || '-'}</td>
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
              amount: editing.icon_amount,
              notes: editing.icon_purpose,
              year: new Date(editing.icon_date).getFullYear(),
            }}
            onSubmit={onEditSubmit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Edit Individual Drawer */}
      <Modal
        isOpen={showEditIndividual}
        onClose={() => setShowEditIndividual(false)}
        title={data ? `Edit: ${data.ind_full_name}` : 'Edit Individual'}
        size="lg"
        variant="side"
        closeOnBackdrop={false}
      >
        {data && (
          <IndividualForm
            isEdit
            initialData={initialIndividualFormData()}
            onSubmit={onSubmitEditIndividual}
            onCancel={() => setShowEditIndividual(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default IndividualVisit;

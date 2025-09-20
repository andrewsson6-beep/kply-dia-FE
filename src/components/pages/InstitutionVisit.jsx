import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../layout/Header';
import Modal from '../ui/Modal';
import ContributionForm from '../forms/ContributionForm';
import InstitutionForm from '../forms/InstitutionForm';
import { generateReceiptPdf } from '../../services/pdfHelper.ts';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { domainApi } from '../../api/api.js';
import { useToast } from '../ui/useToast.js';

const InstitutionVisit = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const headerOffset = useHeaderOffset();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEditInstitution, setShowEditInstitution] = useState(false);
  const [editing, setEditing] = useState(null); // editing contribution row

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

  const loadDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await domainApi.fetchInstitutionDetails(
        Number(institutionId)
      );
      setData(resp);
    } catch (e) {
      setError(e.message || 'Failed to load institution');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionId]);

  const rows = useMemo(() => data?.contributions || [], [data]);
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
      await domainApi.addInstitutionContribution({
        incon_ins_id: Number(institutionId),
        incon_amount: Number(amount || 0),
        incon_purpose: notes || '',
        incon_date: date, // send date-only; backend sets time
      });
      showToast('Contribution added successfully', { type: 'success' });
      setShowAdd(false);
      await loadDetails();
    } catch (e) {
      showToast(e.message || 'Failed to add contribution', { type: 'error' });
    }
  };

  const onEditSubmit = async ({ amount, notes, date }) => {
    console.log('date', date);
    if (!editing) return;
    try {
      await domainApi.updateInstitutionContribution({
        incon_id: editing.incon_id,
        incon_amount: Number(amount || 0),
        incon_purpose: notes || '',
        incon_date: date, // send date-only; backend sets time
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

  const initialInstitutionFormData = () => {
    if (!data) return null;
    const address = data.ins_address || '';
    const parts = address
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const place = parts.length ? parts[parts.length - 1] : '';
    return {
      id: data.ins_id,
      institutionName: data.ins_name || '',
      place,
      managerName: data.ins_head_name || '',
      managerContact: data.ins_phone || '',
      principalName: '',
      principalContact: '',
      administratorName: '',
      administratorContact: '',
      totalAmount: data.ins_total_contribution_amount || 0,
    };
  };

  const onSubmitEditInstitution = async form => {
    try {
      await domainApi.updateInstitution({
        ins_id: form.id,
        ins_name: (form.institutionName || '').trim(),
        ins_phone: (form.managerContact || '').trim(),
        ins_email: '',
        ins_address: [form.place].filter(Boolean).join(', '),
        ins_type: '',
        ins_website: '',
        ins_head_name: (form.managerName || '').trim(),
        ins_total_contribution_amount: Number(form.totalAmount || 0),
      });
      showToast('Institution updated successfully', { type: 'success' });
      setShowEditInstitution(false);
      await loadDetails();
    } catch (e) {
      showToast(e.message || 'Failed to update institution', { type: 'error' });
    }
  };

  const printSummary = () => {
    if (!data) return;
    const payload = {
      id: data.ins_id,
      title: data.ins_name,
      subtitleLabel: 'Address',
      subtitleValue: data.ins_address,
      fields: [
        { label: 'Phone', value: data.ins_phone || '' },
        { label: 'Email', value: data.ins_email || '' },
        { label: 'Type', value: data.ins_type || '' },
        { label: 'Head', value: data.ins_head_name || '' },
      ],
      totalValue: data.ins_total_contribution_amount,
      contributionsTitle: 'Contributions',
      contributions: (data.contributions || []).map(r => ({
        date: r.incon_date,
        amount: r.incon_amount ?? 0,
      })),
    };
    generateReceiptPdf(payload, { mode: 'print' });
  };

  return (
    <>
      <div style={{ paddingTop: headerOffset }}>
        <Header
          onSelect={() => {}}
          headerInfo={{ title: 'Institution Details', subtitle: 'Visit' }}
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
                onClick={() => setShowEditInstitution(true)}
                className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm"
              >
                Edit Institution
              </button>
              <button
                onClick={() => {
                  /* TODO: integrate delete API */
                }}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
              >
                Delete Institution
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
          ) : error ? null : data ? (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-lg font-semibold text-blue-700">
                  {data.ins_name}
                </div>
                <div className="mt-1 text-sm text-gray-700">
                  {data.ins_address}
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Phone:</span>{' '}
                    {data.ins_phone || '-'}
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>{' '}
                    {data.ins_email || '-'}
                  </div>
                  <div>
                    <span className="text-gray-500">Total:</span>{' '}
                    {formatINR(data.ins_total_contribution_amount)}
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
                        <tr
                          key={r.incon_id}
                          className="border-t border-gray-100"
                        >
                          <td className="py-2 pr-4">{toDMY(r.incon_date)}</td>
                          <td className="py-2 pr-4">
                            {formatINR(r.incon_amount)}
                          </td>
                          <td className="py-2 pr-4">
                            {r.incon_purpose || '-'}
                          </td>
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
              amount: editing.incon_amount,
              notes: editing.incon_purpose,
              date: toInputDate(editing.incon_date),
            }}
            onSubmit={onEditSubmit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Edit Institution Drawer */}
      <Modal
        isOpen={showEditInstitution}
        onClose={() => setShowEditInstitution(false)}
        title={data ? `Edit: ${data.ins_name}` : 'Edit Institution'}
        size="lg"
        variant="side"
        closeOnBackdrop={false}
      >
        {data && (
          <InstitutionForm
            isEdit
            initialData={initialInstitutionFormData()}
            onSubmit={onSubmitEditInstitution}
            onCancel={() => setShowEditInstitution(false)}
          />
        )}
      </Modal>
    </>
  );
};

export default InstitutionVisit;

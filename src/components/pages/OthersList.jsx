import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import IndividualCard from '../ui/IndividualCard';
import Modal from '../ui/Modal';
import IndividualForm from '../forms/IndividualForm';
import ContributionForm from '../forms/ContributionForm';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import {
  fetchIndividualsThunk,
  addIndividualThunk,
  addIndividualContributionThunk,
  updateIndividualThunk,
} from '../../store/actions/individualActions.js';
import { useToast } from '../ui/useToast.js';
import { useNavigate } from 'react-router-dom';

const OthersList = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const headerOffset = useHeaderOffset();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const {
    items: individuals,
    loading,
    error,
    loaded,
  } = useAppSelector(state => state.individual);

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(fetchIndividualsThunk());
    }
  }, [loaded, loading, dispatch]);

  // Top-right add modal state
  const [showAdd, setShowAdd] = useState(false);
  const [editingIndividual, setEditingIndividual] = useState(null);
  const [deletingIndividual, setDeletingIndividual] = useState(null);
  const [contributionFor, setContributionFor] = useState(null); // id

  // Filtering by selectedLetter (if implemented in Header) - placeholder
  const filtered = individuals.filter(i =>
    selectedLetter
      ? i.individualName?.toUpperCase().startsWith(selectedLetter)
      : true
  );

  const openAddContribution = id => {
    setContributionFor(id);
  };

  const submitContribution = async data => {
    // Map contribution form to API payload
    const payload = {
      icon_ind_id: contributionFor,
      icon_amount: Number(data.amount || 0),
      icon_purpose: data.notes || '',
    };
    const action = await dispatch(addIndividualContributionThunk(payload));
    if (action && action.meta && action.meta.requestStatus === 'fulfilled') {
      showToast('Contribution added successfully', { type: 'success' });
      // Refresh list to reflect updated totals
      dispatch(fetchIndividualsThunk());
      setContributionFor(null);
    } else {
      const msg = action?.payload || 'Failed to add contribution';
      showToast(msg, { type: 'error' });
    }
  };

  const submitNew = async data => {
    // Map UI form data to API contract
    const payload = {
      ind_full_name: (data.individualName || '').trim(),
      ind_phone_number: (data.contactNumber || '').trim(),
      ind_email: (data.email || '').trim(),
      ind_address: [data.houseName, data.place].filter(Boolean).join(', '),
      ind_total_contribution_amount: Number(data.totalAmount || 0),
    };
    const action = await dispatch(addIndividualThunk(payload));
    if (action && action.meta && action.meta.requestStatus === 'fulfilled') {
      showToast('Individual added successfully', { type: 'success' });
      setShowAdd(false);
    } else {
      const msg = action?.payload || 'Failed to add individual';
      showToast(msg, { type: 'error' });
    }
  };

  const openEdit = id => {
    const person = individuals.find(i => i.id === id);
    if (person) setEditingIndividual(person);
  };

  const submitEdit = async data => {
    // data from IndividualForm
    const payload = {
      ind_id: data.id,
      ind_full_name: (data.individualName || '').trim(),
      ind_phone_number: (data.contactNumber || '').trim(),
      ind_email: (data.email || '').trim(),
      ind_address: [data.houseName, data.place].filter(Boolean).join(', '),
    };
    const action = await dispatch(updateIndividualThunk(payload));
    if (action && action.meta && action.meta.requestStatus === 'fulfilled') {
      showToast('Individual updated successfully', { type: 'success' });
      setEditingIndividual(null);
      dispatch(fetchIndividualsThunk());
    } else {
      const msg = action?.payload || 'Failed to update individual';
      showToast(msg, { type: 'error' });
    }
  };

  const openDelete = id => {
    const person = individuals.find(i => i.id === id);
    if (person) setDeletingIndividual(person);
  };

  const confirmDelete = () => {
    // TODO: integrate delete API when available
    setDeletingIndividual(null);
  };

  return (
    <div style={{ paddingTop: headerOffset }}>
      <Header
        selectedLetter={selectedLetter}
        onSelect={ltr => setSelectedLetter(ltr)}
      />

      {/* Header offset handled by parent padding; remove mt-16 */}
      <div className="p-4 md:p-6">
        {filtered.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer text-sm"
              onClick={() => window.history.back()}
            >
              &larr; Back
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            >
              + Add Individual
            </button>
          </div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filtered.map(i => (
              <IndividualCard
                key={i.id}
                {...i}
                onAddContribution={openAddContribution}
                onVisit={id => navigate(`/others/individual/${id}/visit`)}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md">
              No individuals found. Add the first individual to get started.
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            >
              + Add Individual
            </button>
            <button
              className="mt-4 text-xs text-gray-500 hover:text-gray-700 underline"
              onClick={() => window.history.back()}
            >
              &larr; Back
            </button>
          </div>
        )}
        {loading && (
          <div className="flex justify-center py-10">
            <span className="h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Add Individual Side Drawer */}
      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Individual"
        size="lg"
        variant="side"
        contentPointer
        closeOnBackdrop={false}
      >
        <IndividualForm
          onSubmit={submitNew}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>

      {/* Edit Individual Side Drawer */}
      <Modal
        isOpen={!!editingIndividual}
        onClose={() => setEditingIndividual(null)}
        title={
          editingIndividual
            ? `Edit: ${editingIndividual.individualName}`
            : 'Edit Individual'
        }
        size="lg"
        variant="side"
        contentPointer
        closeOnBackdrop={false}
      >
        {editingIndividual && (
          <IndividualForm
            initialData={editingIndividual}
            isEdit
            onSubmit={submitEdit}
            onCancel={() => setEditingIndividual(null)}
          />
        )}
      </Modal>

      {/* Add Contribution Side Drawer */}
      <Modal
        isOpen={contributionFor !== null}
        onClose={() => setContributionFor(null)}
        title="Add Contribution"
        size="sm"
        variant="side"
        contentPointer
      >
        {contributionFor !== null && (
          <ContributionForm
            familyId={contributionFor} // reuse prop name
            onSubmit={submitContribution}
            onCancel={() => setContributionFor(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Center Modal */}
      <Modal
        isOpen={!!deletingIndividual}
        onClose={() => setDeletingIndividual(null)}
        title="Confirm Delete"
        size="sm"
        variant="center"
        contentPointer
      >
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete{' '}
          <span className="font-semibold">
            {deletingIndividual?.individualName}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setDeletingIndividual(null)}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default OthersList;

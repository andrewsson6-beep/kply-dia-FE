import React, { useEffect, useState } from 'react';
import InstitutionCard from '../ui/InstitutionCard';
import Header from '../layout/Header';
import Modal from '../ui/Modal';
import InstitutionForm from '../forms/InstitutionForm';
import ContributionForm from '../forms/ContributionForm';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useNavigate } from 'react-router-dom';
import { domainApi } from '../../api/api.js';
import { useToast } from '../ui/useToast.js';

function InstitutionList() {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const headerOffset = useHeaderOffset();
  const navigate = useNavigate();

  // Local sample data (would come from API)
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const loadInstitutions = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await domainApi.fetchInstitutions();
      setInstitutions(list);
    } catch (e) {
      setError(e.message || 'Failed to load institutions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  // Modal states
  const [contributionFor, setContributionFor] = useState(null); // id
  const [editingInstitution, setEditingInstitution] = useState(null); // object
  const [deletingInstitution, setDeletingInstitution] = useState(null); // object

  const handleVisitInstitution = id => {
    navigate(`/institution/${id}/visit`);
  };

  // Contribution flow
  const openAddContribution = id => {
    setContributionFor(id);
  };
  const submitContribution = async () => {
    // TODO: integrate institution contribution API when available
    showToast('Institution contribution API not integrated yet', {
      type: 'info',
    });
    setContributionFor(null);
  };

  // Edit flow
  const openEdit = id => {
    const inst = institutions.find(i => i.id === id);
    if (inst) setEditingInstitution(inst);
  };
  const submitEdit = () => {
    // TODO: integrate institution update API when available
    showToast('Edit Institution not implemented', { type: 'info' });
    setEditingInstitution(null);
  };

  // Delete flow
  const openDelete = id => {
    const inst = institutions.find(i => i.id === id);
    if (inst) setDeletingInstitution(inst);
  };
  const confirmDelete = () => {
    if (deletingInstitution) {
      setInstitutions(prev =>
        prev.filter(i => i.id !== deletingInstitution.id)
      );
      console.log('Deleted institution', deletingInstitution.id);
    }
    setDeletingInstitution(null);
  };

  return (
    <div style={{ paddingTop: headerOffset }}>
      <Header
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
      />
      {/* Content wrapper: add enough top padding to clear fixed header height */}
      {/* Header offset handled by outer wrapper padding */}
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}
        {loading && (
          <div className="flex justify-center py-10">
            <span className="h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="grid grid-cols-1 gap-8">
          {institutions.map(i => (
            <InstitutionCard
              key={i.id}
              {...i}
              onVisit={() => handleVisitInstitution(i.id)}
              onAddContribution={openAddContribution}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      </div>

      {/* Contribution Side Modal */}
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

      {/* Edit Side Modal */}
      <Modal
        isOpen={!!editingInstitution}
        onClose={() => setEditingInstitution(null)}
        title={
          editingInstitution
            ? `Edit: ${editingInstitution.institutionName}`
            : 'Edit Institution'
        }
        size="lg"
        variant="side"
        contentPointer
        closeOnBackdrop={false}
      >
        {editingInstitution && (
          <InstitutionForm
            initialData={editingInstitution}
            isEdit
            onSubmit={submitEdit}
            onCancel={() => setEditingInstitution(null)}
          />
        )}
      </Modal>

      {/* Delete Center Modal */}
      <Modal
        isOpen={!!deletingInstitution}
        onClose={() => setDeletingInstitution(null)}
        title="Confirm Delete"
        size="sm"
        variant="center"
        contentPointer
      >
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete{' '}
          <span className="font-semibold">
            {deletingInstitution?.institutionName}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setDeletingInstitution(null)}
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
}

export default InstitutionList;

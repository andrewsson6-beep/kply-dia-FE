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
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSearchChange = searchValue => {
    setSearchTerm(searchValue);
  };

  // Header configuration
  const headerInfo = {
    title: 'Institution Management',
    subtitle: 'Manage and view all institutions',
  };

  // Enhanced filtering logic
  const filteredInstitutions = institutions.filter(institution => {
    // Apply letter filter
    const letterMatch = selectedLetter
      ? (institution.institutionName || '')
          .toUpperCase()
          .startsWith(selectedLetter)
      : true;

    // Apply search filter
    const searchMatch = searchTerm.trim()
      ? (institution.institutionName || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim()) ||
        (institution.place || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim()) ||
        (institution.contactPerson || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim())
      : true;

    return letterMatch && searchMatch;
  });

  return (
    <div style={{ paddingTop: headerOffset }}>
      <Header
        headerInfo={headerInfo}
        showFilter={true}
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />
      {/* Content wrapper: add enough top padding to clear fixed header height */}
      {/* Header offset handled by outer wrapper padding */}
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {(selectedLetter || searchTerm.trim()) && (
          <div className="mb-4 flex flex-wrap gap-2 text-sm">
            {selectedLetter && (
              <div className="text-gray-600">
                Filtering by letter:{' '}
                <span className="font-semibold text-blue-600">
                  {selectedLetter}
                </span>
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="ml-2 text-blue-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            )}
            {searchTerm.trim() && (
              <div className="text-gray-600">
                Searching for:{' '}
                <span className="font-semibold text-green-600">
                  "{searchTerm.trim()}"
                </span>
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-green-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            )}
            {(selectedLetter || searchTerm.trim()) && (
              <button
                onClick={() => {
                  setSelectedLetter(null);
                  setSearchTerm('');
                }}
                className="text-red-500 hover:underline font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
        {loading && (
          <div className="flex justify-center py-10">
            <span className="h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="grid grid-cols-1 gap-8">
          {filteredInstitutions.length > 0 ? (
            filteredInstitutions.map(i => (
              <InstitutionCard
                key={i.id}
                {...i}
                onVisit={() => handleVisitInstitution(i.id)}
                onAddContribution={openAddContribution}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-24">
              {selectedLetter || searchTerm.trim() ? (
                <div>
                  <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md">
                    No institutions match your current filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedLetter(null);
                      setSearchTerm('');
                    }}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md">
                    No institutions yet. Add the first institution to get
                    started.
                  </p>
                  <button
                    onClick={() => navigate('/institution/add')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  >
                    + Add Institution
                  </button>
                </div>
              )}
            </div>
          )}
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

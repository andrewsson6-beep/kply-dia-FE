import React, { useEffect, useMemo, useState } from 'react';
import FamilyCard from '../ui/FamilyCard';
import Header from '../layout/Header';
import Modal from '../ui/Modal';
import FamilyForm from '../forms/FamilyForm';
import ContributionForm from '../forms/ContributionForm';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks.js';
import { domainApi } from '../../api/api.js';
import {
  addContributionThunk,
  addFamilyThunk,
  deleteFamilyThunk,
  updateFamilyThunk,
} from '../../store/actions/familyActions.js';

function FamilyList() {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const headerOffset = useHeaderOffset();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { communityId, parishId, foraneId } = useParams();
  const cid = Number(communityId);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [communityName, setCommunityName] = useState('');

  const [contributionFor, setContributionFor] = useState(null); // family id | null
  const [editingFamily, setEditingFamily] = useState(null); // family object | null
  const [deletingFamily, setDeletingFamily] = useState(null); // family object | null
  const [showAdd, setShowAdd] = useState(false); // add family drawer
  const communityOptions = Array.from(
    new Set(families.map(f => f.community).filter(Boolean))
  );

  const handleAddContribution = id => setContributionFor(id);

  const handleSearchChange = searchValue => {
    setSearchTerm(searchValue);
  };

  const handleVisit = id => {
    if (parishId) {
      navigate(`/parish/list/${parishId}/community/${cid}/family/${id}/visit`);
    } else if (foraneId) {
      navigate(`/forane/list/${foraneId}/community/${cid}/family/${id}/visit`);
    } else {
      // Fallback: try parish-based path
      navigate(`/parish/list/0/community/${cid}/family/${id}/visit`);
    }
  };

  const handleSubmitContribution = data => {
    dispatch(
      addContributionThunk({
        communityId: cid,
        familyId: contributionFor,
        amount: Number(data.amount || 0),
        notes: data.notes || '',
        date: data.date,
      })
    );
    setContributionFor(null);
  };

  const openEdit = id => {
    const fam = families.find(f => f.id === id);
    if (fam) setEditingFamily(fam);
  };

  const submitEdit = data => {
    dispatch(updateFamilyThunk({ communityId: cid, data }));
    // Optimistically update local list (mock update)
    setFamilies(prev =>
      prev.map(f => (f.id === data.id ? { ...f, ...data } : f))
    );
    setEditingFamily(null);
  };

  const openDelete = id => {
    const fam = families.find(f => f.id === id);
    if (fam) setDeletingFamily(fam);
  };

  const confirmDelete = () => {
    if (deletingFamily)
      dispatch(deleteFamilyThunk({ communityId: cid, id: deletingFamily.id }));
    // Optimistically update local list (mock delete)
    setFamilies(prev => prev.filter(f => f.id !== deletingFamily?.id));
    setDeletingFamily(null);
  };

  const submitAdd = data => {
    dispatch(addFamilyThunk({ communityId: cid, data })).finally(() => {
      // Refresh from backend so the newly created family appears
      reloadFromCommunityDetails();
    });
    setShowAdd(false);
  };

  const formatINR = n => `Rs. ${Number(n || 0).toLocaleString('en-IN')}`;
  const reloadFromCommunityDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const details = await domainApi.fetchCommunityDetails(cid);
      setCommunityName(details?.name || `Community #${cid}`);
      const fams = Array.isArray(details?.families) ? details.families : [];
      const mapped = fams.map(row => ({
        id: row.fam_id,
        familyName: row.fam_house_name,
        community: details?.name || `Community #${cid}`,
        familyHead: row.fam_head_name,
        contactNumber: row.fam_phone_number,
        totalAmount: formatINR(row.fam_total_contribution_amount || 0),
      }));
      setFamilies(mapped);
    } catch (e) {
      setError(e.message || 'Failed to load families');
    } finally {
      setLoading(false);
    }
  };

  // Initial load from community-details (families + name)
  useEffect(() => {
    reloadFromCommunityDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const filteredFamilies = useMemo(() => {
    let result = families;

    // Apply letter filter
    if (selectedLetter) {
      result = result.filter(f =>
        (f.familyName || '').toUpperCase().startsWith(selectedLetter)
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(
        f =>
          (f.familyName || '').toLowerCase().includes(search) ||
          (f.familyHead || '').toLowerCase().includes(search) ||
          (f.contactNumber || '').toLowerCase().includes(search)
      );
    }

    return result;
  }, [families, selectedLetter, searchTerm]);

  // Derive header info (we currently don't have community name; show IDs)
  const headerInfo = {
    title: 'Family Management',
    subtitle: communityName
      ? `Families in ${communityName}`
      : `Families in Community #${cid}`,
  };

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

      {/* Header offset handled by parent padding; remove mt-16 */}
      <div className="p-4 md:p-6">
        {(filteredFamilies.length > 0 ||
          (families.length > 0 && (selectedLetter || searchTerm.trim()))) && (
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
              + Add Family
            </button>
          </div>
        )}
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
        {filteredFamilies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredFamilies.map(f => (
              <FamilyCard
                key={f.id}
                id={f.id}
                familyName={f.familyName}
                community={communityName || f.community}
                familyHead={f.familyHead}
                contactNumber={f.contactNumber}
                totalAmount={f.totalAmount}
                onDelete={openDelete}
                onEdit={openEdit}
                onAddContribution={handleAddContribution}
                onVisit={handleVisit}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24">
            {selectedLetter || searchTerm.trim() ? (
              <div>
                <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md">
                  No families match your current filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedLetter(null);
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm mb-4"
                >
                  Clear All Filters
                </button>
                <br />
                <button
                  onClick={() => setShowAdd(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                >
                  + Add Family
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md">
                  No families yet. Create the first family to get started.
                </p>
                <button
                  onClick={() => setShowAdd(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                >
                  + Add Family
                </button>
              </div>
            )}
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

      {/* Contribution Modal */}
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
            familyId={contributionFor}
            onSubmit={data => handleSubmitContribution(data)}
            onCancel={() => setContributionFor(null)}
          />
        )}
      </Modal>

      {/* Edit Modal (Family Form) */}
      <Modal
        isOpen={!!editingFamily}
        onClose={() => setEditingFamily(null)}
        title={
          editingFamily ? `Edit: ${editingFamily.familyName}` : 'Edit Family'
        }
        size="lg"
        closeOnBackdrop={false}
        variant="side"
        contentPointer
      >
        {editingFamily && (
          <FamilyForm
            initialData={editingFamily}
            isEdit
            onSubmit={submitEdit}
            onCancel={() => setEditingFamily(null)}
            communityOptions={communityOptions}
          />
        )}
      </Modal>

      {/* Add Family Side Drawer */}
      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Family"
        size="lg"
        variant="side"
        contentPointer
        closeOnBackdrop={false}
      >
        <FamilyForm
          onSubmit={submitAdd}
          onCancel={() => setShowAdd(false)}
          communityOptions={communityOptions}
          communityContext={communityName || `Community #${cid}`}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingFamily}
        onClose={() => setDeletingFamily(null)}
        title="Confirm Delete"
        size="sm"
        variant="center"
        contentPointer
      >
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{deletingFamily?.familyName}</span>?
          This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setDeletingFamily(null)}
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

export default FamilyList;

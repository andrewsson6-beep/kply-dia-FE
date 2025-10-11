import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../layout/Header';
import ChurchCard from '../ui/ChurchCard';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchParishesByForaneThunk } from '../../store/actions/parishActions.js';
import {
  fetchForanesThunk,
  updateForaneThunk,
  deleteForaneThunk,
} from '../../store/actions/foraneActions.js';
import { SkeletonStack } from '../ui/Skeletons.jsx';
import Modal from '../ui/Modal';
import { useToast } from '../ui/useToast.js';

const ForaneParishList = () => {
  const { foraneId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const headerOffset = useHeaderOffset();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const foraneState = useAppSelector(state => state.forane);
  const parishForaneState = useAppSelector(
    state =>
      state.parish.byForane[Number(foraneId)] || {
        items: [],
        loading: false,
        error: null,
        loaded: false,
      }
  );
  const { items, loading, error } = parishForaneState;

  // Always fetch fresh forane data on every visit
  useEffect(() => {
    dispatch(fetchForanesThunk());
  }, [dispatch]);

  // Always fetch fresh parishes for this forane on every visit
  useEffect(() => {
    const fid = Number(foraneId);
    if (fid) {
      dispatch(fetchParishesByForaneThunk(fid));
    }
  }, [foraneId, dispatch]);

  const foraneNameById = useMemo(() => {
    const map = new Map();
    (foraneState.nameOptions || foraneState.options || []).forEach(opt =>
      map.set(opt.id, `${opt.name}, ${opt.location}`)
    );
    return map;
  }, [foraneState.nameOptions, foraneState.options]);

  const currentForaneName =
    foraneNameById.get(Number(foraneId)) || `Forane #${foraneId}`;

  // Local UI state for actions (UI only for now)
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    vicarName: '',
    contactNumber: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Derive the current forane object for pre-filling the edit form (best-effort)
  const currentForane = useMemo(() => {
    const fid = Number(foraneId);
    const item = (foraneState.items || []).find(f => f.id === fid);
    if (item) return item;
    const opt = (foraneState.nameOptions || []).find(o => o.id === fid);
    if (opt)
      return {
        id: opt.id,
        churchName: opt.name,
        place: opt.location,
      };
    return null;
  }, [foraneId, foraneState.items, foraneState.nameOptions]);

  useEffect(() => {
    if (currentForane) {
      setEditForm({
        name: currentForane.churchName || '',
        location: currentForane.place || '',
        vicarName: currentForane.vicarName || '',
        contactNumber: currentForane.contactNumber || '',
      });
    }
  }, [currentForane]);

  const handleVisitParish = parishId => {
    // Navigate to parish community list. Preserve a back target to this forane's list.
    navigate(`/parish/list/${parishId}/community/list`, {
      state: { backTo: `/forane/list/${foraneId}/community/list` },
    });
  };

  const handleBack = () => {
    // Prefer explicit 'from' state, else go to Forane list; avoid navigating to self.
    const from = location.state?.from;
    if (from) return navigate(from);
    return navigate('/forane/list');
  };

  const handleSearchChange = searchValue => {
    setSearchTerm(searchValue);
  };

  const filteredItems = useMemo(() => {
    let result = items;

    // Apply letter filter
    if (selectedLetter) {
      const ltr = String(selectedLetter).toUpperCase();
      result = result.filter(c =>
        (c.churchName || '').toUpperCase().startsWith(ltr)
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(
        c =>
          (c.churchName || '').toLowerCase().includes(search) ||
          (c.place || '').toLowerCase().includes(search) ||
          (c.vicarName || '').toLowerCase().includes(search)
      );
    }

    return result;
  }, [items, selectedLetter, searchTerm]);

  return (
    <div className="p-4 sm:p-6" style={{ paddingTop: headerOffset }}>
      <Header
        headerInfo={{
          title: 'Parish Management',
          subtitle: `Parishes under ${currentForaneName}`,
        }}
        showFilter={true}
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr);
          console.log('Selected letter:', ltr);
        }}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer text-sm"
            onClick={handleBack}
          >
            &larr; Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm"
            >
              Edit Forane
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Delete Forane
            </button>
          </div>
        </div>

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

        <div className="space-y-6">
          {loading ? (
            <SkeletonStack variant="church" count={3} />
          ) : filteredItems.length > 0 ? (
            filteredItems.map((c, index) => (
              <ChurchCard
                key={c.id}
                id={index + 1}
                churchName={c.churchName}
                place={c.place}
                vicarName={c.vicarName}
                contactNumber={c.contactNumber}
                totalAmount={c.totalAmount}
                imageUrl={c.imageUrl}
                forane={foraneNameById.get(c.foraneId) || ''}
                onVisitParish={() => handleVisitParish(c.id)}
                className="max-w-4xl mx-auto"
                visitLabel="VISIT PARISH"
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              {selectedLetter || searchTerm.trim() ? (
                <div>
                  <p>No parishes match your current filters.</p>
                  <button
                    onClick={() => {
                      setSelectedLetter(null);
                      setSearchTerm('');
                    }}
                    className="mt-2 text-blue-500 hover:underline"
                  >
                    Clear all filters to see all parishes
                  </button>
                </div>
              ) : (
                'No parishes present for this Forane.'
              )}
            </div>
          )}
        </div>
      </div>
      {/* Edit Forane - side drawer (UI only) */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Forane"
        size="md"
        variant="side"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Forane Name
              </label>
              <input
                value={editForm.name}
                onChange={e =>
                  setEditForm(prev => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-md border p-2 text-sm border-gray-300 bg-gray-50 focus:border-blue-400"
                placeholder="St. Peter's Forane Church"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Location
              </label>
              <input
                value={editForm.location}
                onChange={e =>
                  setEditForm(prev => ({ ...prev, location: e.target.value }))
                }
                className="w-full rounded-md border p-2 text-sm border-gray-300 bg-gray-50 focus:border-blue-400"
                placeholder="Mundakayam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Vicar Name
              </label>
              <input
                value={editForm.vicarName}
                onChange={e =>
                  setEditForm(prev => ({ ...prev, vicarName: e.target.value }))
                }
                className="w-full rounded-md border p-2 text-sm border-gray-300 bg-gray-50 focus:border-blue-400"
                placeholder="Rev. John Mathew"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Contact Number
              </label>
              <input
                value={editForm.contactNumber}
                onChange={e =>
                  setEditForm(prev => ({
                    ...prev,
                    contactNumber: e.target.value,
                  }))
                }
                className="w-full rounded-md border p-2 text-sm border-gray-300 bg-gray-50 focus:border-blue-400"
                placeholder="+91-9876543210"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-md bg-gray-500 text-white text-sm hover:bg-gray-600 disabled:opacity-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!currentForane) return setIsEditing(false);
                setSaving(true);
                try {
                  const action = await dispatch(
                    updateForaneThunk({
                      for_id: Number(foraneId),
                      for_name: editForm.name.trim(),
                      for_location: editForm.location.trim(),
                      for_vicar_name: editForm.vicarName.trim(),
                      for_contact_number: editForm.contactNumber.trim(),
                    })
                  );
                  if (updateForaneThunk.fulfilled.match(action)) {
                    showToast('Forane updated successfully', {
                      type: 'success',
                    });
                    // Reload lists for fresh data
                    dispatch(fetchForanesThunk());
                    dispatch(fetchParishesByForaneThunk(Number(foraneId)));
                    setIsEditing(false);
                  } else {
                    showToast(action.payload || 'Failed to update forane', {
                      type: 'error',
                    });
                  }
                } catch (e) {
                  showToast(e.message || 'Failed to update forane', {
                    type: 'error',
                  });
                } finally {
                  setSaving(false);
                }
              }}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {saving && (
            <p className="text-xs text-gray-500">Updating forane...</p>
          )}
        </div>
      </Modal>

      {/* Delete Forane Confirmation (UI only) */}
      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete Forane"
        size="sm"
        variant="center"
      >
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete this forane? This action cannot be
          undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => !deleting && setConfirmDelete(false)}
            disabled={deleting}
            className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (deleting) return;
              setDeleting(true);
              try {
                const action = await dispatch(
                  deleteForaneThunk(Number(foraneId))
                );
                if (deleteForaneThunk.fulfilled.match(action)) {
                  showToast('Forane deleted successfully', {
                    type: 'success',
                  });
                  setConfirmDelete(false);
                  // Refresh forane list and go back to forane list page
                  dispatch(fetchForanesThunk());
                  navigate('/forane/list');
                } else {
                  showToast(action.payload || 'Failed to delete forane', {
                    type: 'error',
                  });
                }
              } catch (e) {
                showToast(e.message || 'Failed to delete forane', {
                  type: 'error',
                });
              } finally {
                setDeleting(false);
              }
            }}
            disabled={deleting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-center gap-2"
          >
            {deleting && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ForaneParishList;

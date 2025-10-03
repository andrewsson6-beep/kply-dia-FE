import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CommunityCard from '../ui/CommunityCard';
import Header from '../layout/Header';
import Modal from '../ui/Modal';
import CommunityForm from '../forms/CommunityForm';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import {
  addCommunityThunk,
  fetchCommunitiesThunk,
} from '../../store/actions/communityActions.js';
import { fetchParishesThunk } from '../../store/actions/parishActions.js';
import { SkeletonGrid } from '../ui/Skeletons.jsx';

const CommunityList = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const headerOffset = useHeaderOffset();

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const [showAdd, setShowAdd] = useState(false);

  const { parishId, foraneId } = useParams();
  const inForaneContext = Boolean(foraneId) && !parishId;

  const goToCommunityDetails = id => {
    if (parishId) {
      navigate(`/parish/list/${parishId}/community/${id}/details`);
    } else if (foraneId) {
      // Optional future: /forane/.../community/:id/details
      navigate(`/forane/list/${foraneId}/community/${id}/visit`);
    }
  };

  const goToFamilies = id => {
    if (parishId) {
      navigate(`/parish/list/${parishId}/community/${id}/visit`);
    } else if (foraneId) {
      navigate(`/forane/list/${foraneId}/community/${id}/visit`);
    }
  };

  const handleBack = () => {
    // Prefer an explicit back target if provided (e.g., coming from ForaneParishList)
    const backTo = location.state?.backTo;
    if (backTo) return navigate(backTo);
    if (inForaneContext) navigate('/forane/list');
    else navigate('/parish/list');
  };

  const parentType = inForaneContext ? 'forane' : 'parish';
  const parentId = inForaneContext ? Number(foraneId) : Number(parishId);
  const key = `${parentType}:${parentId}`;
  const communityState = useAppSelector(
    state =>
      state.community.byParent[key] || {
        items: [],
        loading: false,
        error: null,
      }
  );
  const { items, loading, error } = communityState;
  const parishState = useAppSelector(state => state.parish);
  const parishName = useAppSelector(state => {
    if (!parishId) return null;
    const id = Number(parishId);
    const found = state.parish.items.find(p => p.id === id);
    return found ? found.churchName : null;
  });

  const handleSearchChange = searchValue => {
    setSearchTerm(searchValue);
  };

  useEffect(() => {
    if (
      parentId &&
      !communityState.loaded &&
      !loading &&
      !communityState.error
    ) {
      dispatch(fetchCommunitiesThunk({ parentType, parentId }));
    }
  }, [
    parentId,
    parentType,
    communityState.loaded,
    communityState.error,
    loading,
    dispatch,
  ]);

  // Listen for community-changed events (e.g., deletion) to refresh list
  useEffect(() => {
    const handler = e => {
      if (e?.detail?.parishId === parentId) {
        dispatch(fetchCommunitiesThunk({ parentType, parentId }));
      }
    };
    window.addEventListener('community-changed', handler);
    return () => window.removeEventListener('community-changed', handler);
  }, [dispatch, parentType, parentId]);

  // Ensure parishes are loaded so we can show parish name in the form
  useEffect(() => {
    if (!inForaneContext && !parishState.loaded && !parishState.loading) {
      dispatch(fetchParishesThunk());
    }
  }, [inForaneContext, parishState.loaded, parishState.loading, dispatch]);

  const filtered = useMemo(() => {
    let result = items;

    // Apply letter filter
    if (selectedLetter) {
      result = result.filter(c =>
        (c.name || '').toUpperCase().startsWith(selectedLetter)
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(
        c =>
          (c.name || '').toLowerCase().includes(search) ||
          (c.number || '').toString().toLowerCase().includes(search)
      );
    }

    return result;
  }, [items, selectedLetter, searchTerm]);

  const handleAddCommunity = data => {
    dispatch(
      addCommunityThunk({
        parentType,
        parentId,
        // API expects { com_par_id, com_name }
        data: { com_par_id: parentId, com_name: data.name?.trim() },
      })
    );
    setShowAdd(false);
  };

  return (
    <div
      className="bg-gray-100 min-h-full p-4"
      style={{ paddingTop: headerOffset }}
    >
      <Header
        headerInfo={{
          title: 'Community Management',
          subtitle: parishName
            ? `Communities in ${parishName}`
            : `Communities in Parish #${parishId}`,
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

      {/* Removed hard-coded mt-20; header offset handled by container padding */}
      <div className="max-w-7xl mx-auto">
        {/* Top bar with back + add button when list non-empty or when there are items but filters are applied */}
        {(filtered.length > 0 ||
          (items.length > 0 && (selectedLetter || searchTerm.trim()))) && (
          <div className="flex items-center justify-between mb-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer text-sm"
              onClick={handleBack}
            >
              &larr; Back
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            >
              + Add Community
            </button>
          </div>
        )}
        {error && (
          <div className="mb-4 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded flex items-center justify-between gap-3">
            <span className="text-red-600">{error}</span>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() =>
                  dispatch(fetchCommunitiesThunk({ parentType, parentId }))
                }
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Retry
              </button>
            </div>
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
        {loading ? (
          <SkeletonGrid
            variant="community"
            count={8}
            columns="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filtered.map(c => (
              <CommunityCard
                key={c.id}
                number={c.number}
                name={c.name}
                onView={() => goToCommunityDetails(c.id)}
                onViewFamilies={() => goToFamilies(c.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24">
            {selectedLetter || searchTerm.trim() ? (
              <div>
                <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md">
                  No communities match your current filters.
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
                  + Add Community
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md">
                  No communities yet. Create the first community to get started.
                </p>
                <button
                  onClick={() => setShowAdd(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                >
                  + Add Community
                </button>
              </div>
            )}
            <button
              className="mt-4 text-xs text-gray-500 hover:text-gray-700 underline"
              onClick={handleBack}
            >
              &larr; Back
            </button>
          </div>
        )}
        {/* loading handled by skeleton */}
      </div>

      {/* Add Community Side Drawer */}
      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Community"
        size="md"
        variant="side"
        contentPointer
        closeOnBackdrop={false}
      >
        <CommunityForm
          onSubmit={handleAddCommunity}
          onCancel={() => setShowAdd(false)}
          parentType={parentType}
          parentId={parentId}
          parishName={parishName}
        />
      </Modal>
    </div>
  );
};

export default CommunityList;

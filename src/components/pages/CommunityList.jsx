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

const CommunityList = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const headerOffset = useHeaderOffset();

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const [showAdd, setShowAdd] = useState(false);

  const { parishId, foraneId } = useParams();
  const inForaneContext = Boolean(foraneId) && !parishId;

  const handleCommunityVisit = id => {
    console.log('Visiting community:', id);
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

  useEffect(() => {
    if (parentId && !communityState.loaded && !loading) {
      dispatch(fetchCommunitiesThunk({ parentType, parentId }));
    }
  }, [parentId, parentType, communityState.loaded, loading, dispatch]);

  const filtered = useMemo(
    () =>
      items.filter(c =>
        selectedLetter ? c.name.toUpperCase().startsWith(selectedLetter) : true
      ),
    [items, selectedLetter]
  );

  const handleAddCommunity = data => {
    dispatch(
      addCommunityThunk({
        parentType,
        parentId,
        data: { name: data.name, number: data.number },
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
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr);
          console.log('Selected letter:', ltr);
        }}
      />

      {/* Removed hard-coded mt-20; header offset handled by container padding */}
      <div className="max-w-7xl mx-auto">
        {/* Top bar with back + add button when list non-empty */}
        {filtered.length > 0 && (
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
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filtered.map(c => (
              <CommunityCard
                key={c.id}
                number={c.number}
                name={c.name}
                onClick={() => handleCommunityVisit(c.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md">
              No communities yet. Create the first community to get started.
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            >
              + Add Community
            </button>
            <button
              className="mt-4 text-xs text-gray-500 hover:text-gray-700 underline"
              onClick={handleBack}
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
        />
      </Modal>
    </div>
  );
};

export default CommunityList;

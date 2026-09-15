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
import useYearFilter from '../../hooks/useYearFilter.js';
import CardListLoader from '../ui/CardListLoader';

const CommunityList = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedYear, setSelectedYear } = useYearFilter();
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
          emptyMessage: null,
      }
  );
        const { items, loading, error, emptyMessage } = communityState;
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
    if (parentId) {
      dispatch(fetchCommunitiesThunk({
        parentType,
        parentId,
        year: selectedYear || undefined,
      }));
    }
  }, [
    parentId,
    parentType,
    selectedYear,
    dispatch,
  ]);

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
      className="min-h-full bg-slate-50 p-4 sm:p-6"
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
        showYearPicker={true}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        yearLoading={loading}
      />

      <main className="mx-auto max-w-[1440px]">
        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              onClick={handleBack}
            >
              <span aria-hidden="true">&larr;</span> Back
            </button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Community directory
              </p>
              <p className="mt-0.5 text-sm font-medium text-slate-700">
                {filtered.length} of {items.length} communities shown
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <span className="text-lg leading-none" aria-hidden="true">+</span>
            Add community
          </button>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
              Communities
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Select a community to view its details or manage families.
            </p>
          </div>
          {(selectedLetter || searchTerm.trim()) && (
            <button
              onClick={() => {
                setSelectedLetter(null);
                setSearchTerm('');
              }}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Clear filters
            </button>
          )}
        </div>
        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm">
            <span className="text-red-700">{error}</span>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() =>
                  dispatch(fetchCommunitiesThunk({ parentType, parentId }))
                }
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {(selectedLetter || searchTerm.trim()) && (
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
            {selectedLetter && (
              <div className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 font-medium text-blue-700">
                Letter: <span className="font-bold">{selectedLetter}</span>
              </div>
            )}
            {searchTerm.trim() && (
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
                Search: <span className="font-bold">{searchTerm.trim()}</span>
              </div>
            )}
          </div>
        )}
        {loading ? (
          <CardListLoader variant="community" count={8} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            {emptyMessage ? (
              <div>
                <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md">
                  {emptyMessage}
                </p>
                <button
                  onClick={() => setSelectedYear(null)}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  View all years
                </button>
              </div>
            ) : selectedLetter || searchTerm.trim() ? (
              <div>
                <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md">
                  No communities match your current filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedLetter(null);
                    setSearchTerm('');
                  }}
                  className="mb-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
                <br />
                <button
                  onClick={() => setShowAdd(true)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  + Add Community
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md">
                  {emptyMessage ||
                    'No communities yet. Create the first community to get started.'}
                </p>
                <button
                  onClick={() => setShowAdd(true)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
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
      </main>

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

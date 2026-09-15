import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../layout/Header';
import ChurchCard from '../ui/ChurchCard';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchParishesByForaneThunk } from '../../store/actions/parishActions.js';
import { fetchForanesThunk } from '../../store/actions/foraneActions.js';
import useYearFilter from '../../hooks/useYearFilter.js';
import CardListLoader from '../ui/CardListLoader';

const ForaneParishList = () => {
  const { foraneId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const headerOffset = useHeaderOffset();
  const dispatch = useAppDispatch();

  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedYear, setSelectedYear } = useYearFilter();

  const foraneState = useAppSelector(state => state.forane);
  const parishForaneState = useAppSelector(
    state =>
      state.parish.byForane[Number(foraneId)] || {
        items: [],
        loading: false,
        error: null,
        emptyMessage: null,
        loaded: false,
      }
  );
  const { items, loading, error, emptyMessage } = parishForaneState;

  // Always fetch fresh forane data on every visit
  useEffect(() => {
    dispatch(fetchForanesThunk());
  }, [dispatch]);

  // Always fetch fresh parishes for this forane on every visit
  useEffect(() => {
    const fid = Number(foraneId);
    if (fid) {
      dispatch(fetchParishesByForaneThunk({ foraneId: fid, year: selectedYear || undefined }));
    }
  }, [foraneId, selectedYear, dispatch]);

  const foraneNameById = useMemo(() => {
    const map = new Map();
    (foraneState.nameOptions || foraneState.options || []).forEach(opt =>
      map.set(opt.id, `${opt.name}, ${opt.location}`)
    );
    return map;
  }, [foraneState.nameOptions, foraneState.options]);

  const currentForaneName =
    foraneNameById.get(Number(foraneId)) || `Forane #${foraneId}`;

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
        showYearPicker={true}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        yearLoading={loading}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer text-sm"
            onClick={handleBack}
          >
            &larr; Back
          </button>
          {/* <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            Forane Parishes
            {loading && (
              <span className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            )}
          </h1> */}
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
          {loading ? <CardListLoader count={4} /> : filteredItems.map((c, index) => (
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
              reportEntityType="parish"
              reportEntityId={c.id}
              onVisitParish={() => handleVisitParish(c.id)}
              className="max-w-4xl mx-auto"
              visitLabel="VISIT PARISH"
            />
          ))}
          {!loading && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              {emptyMessage ? (
                <div>
                  <p className="mb-6 text-sm text-gray-500 sm:text-base">
                    {emptyMessage}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setSelectedYear(null)}
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      View all years
                    </button>
                    <button
                      onClick={() => navigate('/parish/add')}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      + Add Parish
                    </button>
                  </div>
                </div>
              ) : selectedLetter || searchTerm.trim() ? (
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
                <div>
                  <p className="mb-6">No parishes present for this Forane.</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setSelectedYear(null)}
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      View all years
                    </button>
                    <button
                      onClick={() => navigate('/parish/add')}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      + Add Parish
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForaneParishList;

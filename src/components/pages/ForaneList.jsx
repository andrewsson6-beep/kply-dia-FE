import React, { useEffect, useMemo, useState } from 'react';
import ChurchCard from '../ui/ChurchCard';
import Header from '../layout/Header';
import { useNavigate } from 'react-router-dom';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchForanesThunk } from '../../store/actions/foraneActions.js';
import { SkeletonStack } from '../ui/Skeletons.jsx';

const ForaneList = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const headerOffset = useHeaderOffset();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(state => state.forane);

  // Always fetch fresh forane data on every visit
  useEffect(() => {
    dispatch(fetchForanesThunk());
  }, [dispatch]);

  const filtered = useMemo(() => {
    let result = items;

    // Apply letter filter
    if (selectedLetter) {
      result = result.filter(c =>
        c.churchName.toUpperCase().startsWith(selectedLetter)
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(
        c =>
          c.churchName.toLowerCase().includes(search) ||
          c.place.toLowerCase().includes(search) ||
          c.vicarName.toLowerCase().includes(search)
      );
    }

    return result;
  }, [selectedLetter, searchTerm, items]);

  const handleVisitForane = id => {
    // Navigate to forane-specific parish list and provide a return target
    navigate(`/forane/list/${id}/community/list`, {
      state: { from: '/forane/list' },
    });
  };

  const handleSearchChange = searchValue => {
    setSearchTerm(searchValue);
  };

  return (
    <div className="p-4 sm:p-6" style={{ paddingTop: headerOffset }}>
      <Header
        headerInfo={{
          title: 'Forane Management',
          subtitle: 'Browse and manage all foranes',
        }}
        showFilter={true}
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">Forane List</h1>
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

      <div className="space-y-6 mt-2">
        {loading ? (
          <SkeletonStack variant="church" count={3} />
        ) : filtered.length > 0 ? (
          filtered.map(c => (
            <ChurchCard
              key={c.id}
              id={c.id}
              churchName={c.churchName}
              place={c.place}
              vicarName={c.vicarName}
              contactNumber={c.contactNumber}
              totalAmount={c.totalAmount}
              onVisitParish={() => handleVisitForane(c.id)}
              visitLabel="VISIT FORANE"
              className="max-w-4xl mx-auto"
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            {selectedLetter || searchTerm.trim() ? (
              <div>
                <p>No foranes match your current filters.</p>
                <button
                  onClick={() => {
                    setSelectedLetter(null);
                    setSearchTerm('');
                  }}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Clear all filters to see all foranes
                </button>
              </div>
            ) : (
              'No foranes found.'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForaneList;

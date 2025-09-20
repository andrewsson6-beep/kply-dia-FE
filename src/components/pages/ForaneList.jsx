import React, { useEffect, useMemo, useState } from 'react';
import ChurchCard from '../ui/ChurchCard';
import Header from '../layout/Header';
import { useNavigate } from 'react-router-dom';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchForanesThunk } from '../../store/actions/foraneActions.js';

const ForaneList = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const navigate = useNavigate();
  const headerOffset = useHeaderOffset();
  const dispatch = useAppDispatch();
  const { items, loading, error, loaded } = useAppSelector(
    state => state.forane
  );

  useEffect(() => {
    if (!loaded && !loading) dispatch(fetchForanesThunk());
  }, [loaded, loading, dispatch]);

  const filtered = useMemo(() => {
    if (!selectedLetter) return items;
    return items.filter(c =>
      c.churchName.toUpperCase().startsWith(selectedLetter)
    );
  }, [selectedLetter, items]);

  const handleVisitForane = id => {
    // Navigate to forane-specific parish list and provide a return target
    navigate(`/forane/list/${id}/community/list`, {
      state: { from: '/forane/list' },
    });
  };

  return (
    <div className="p-4 sm:p-6" style={{ paddingTop: headerOffset }}>
      <Header
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
      />

      <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
        Forane List
        {loading && (
          <span className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        )}
      </h1>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {selectedLetter && (
        <div className="mb-4 text-sm text-gray-600">
          Filtering by:{' '}
          <span className="font-semibold text-blue-600">{selectedLetter}</span>
          <button
            onClick={() => setSelectedLetter(null)}
            className="ml-3 text-blue-500 hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      <div className="space-y-6 mt-2">
        {filtered.map(c => (
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
        ))}
        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No churches match that letter.
          </div>
        )}
      </div>
    </div>
  );
};

export default ForaneList;

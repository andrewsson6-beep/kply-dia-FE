import React, { useEffect, useMemo, useState } from 'react';
import ChurchCard from '../ui/ChurchCard';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchParishesThunk, deleteParishThunk } from '../../store/actions/parishActions.js';
import { fetchForanesThunk } from '../../store/actions/foraneActions.js';
import { useToast } from '../ui/useToast.js';
import { SkeletonStack } from '../ui/Skeletons.jsx';

const ParishList = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const headerOffset = useHeaderOffset();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(state => state.parish);
  const { nameOptions } = useAppSelector(state => state.forane);
  const { showToast } = useToast();

  // Always fetch fresh parish data on every visit
  useEffect(() => {
    dispatch(fetchParishesThunk());
  }, [dispatch]);

  // Always fetch forane options for mapping names
  useEffect(() => {
    dispatch(fetchForanesThunk());
  }, [dispatch]);

  // const foraneNameById = useMemo(() => {
  //   const map = new Map();
  //   (nameOptions || []).forEach(opt => map.set(opt.id, opt.name)); // opt also has location
  //   return map;
  // }, [nameOptions]);

  const handleVisitParish = parishId => {
    navigate(`/parish/list/${parishId}/community/list`);
  };

  const handleDeleteParish = parishId => async () => {
    const action = await dispatch(deleteParishThunk(parishId));
    if (deleteParishThunk.fulfilled.match(action)) {
      showToast('Parish deleted successfully', { type: 'success' });
      // Optionally refetch to ensure consistency
      dispatch(fetchParishesThunk());
      // Notify any listeners (future) that a parish was removed
      window.dispatchEvent(
        new CustomEvent('parish-changed', {
          detail: { parishId, type: 'deleted' },
        })
      );
    } else {
      showToast(action.payload || 'Failed to delete parish', {
        type: 'error',
      });
    }
  };

  const handleSearchChange = searchValue => {
    setSearchTerm(searchValue);
  };

  const filteredItems = useMemo(() => {
    let result = items;

    // Apply letter filter
    if (selectedLetter) {
      result = result.filter(c =>
        (c.churchName || '').toUpperCase().startsWith(selectedLetter)
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

  const foraneNameById = useMemo(() => {
    const map = new Map();
    (nameOptions || []).forEach(opt =>
      map.set(opt.id, `${opt.name}, ${opt.location}`)
    );
    return map;
  }, [nameOptions]);

  return (
    <div className="p-4 sm:p-6" style={{ paddingTop: headerOffset }}>
      <Header
        headerInfo={{
          title: 'Parish Management',
          subtitle: 'Browse and manage all parishes',
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
              onDeleteParish={handleDeleteParish(c.id)}
              className="max-w-4xl mx-auto"
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
              'No parishes found.'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParishList;

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../layout/Header';
import ChurchCard from '../ui/ChurchCard';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchParishesByForaneThunk } from '../../store/actions/parishActions.js';
import { fetchForanesThunk } from '../../store/actions/foraneActions.js';

const ForaneParishList = () => {
  const { foraneId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const headerOffset = useHeaderOffset();
  const dispatch = useAppDispatch();

  const [selectedLetter, setSelectedLetter] = useState(null);

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
  const { items, loading, error, loaded } = parishForaneState;

  useEffect(() => {
    if (!foraneState.loaded && !foraneState.loading) {
      dispatch(fetchForanesThunk());
    }
  }, [foraneState.loaded, foraneState.loading, dispatch]);

  useEffect(() => {
    const fid = Number(foraneId);
    if (fid && !loaded && !loading) {
      dispatch(fetchParishesByForaneThunk(fid));
    }
  }, [foraneId, loaded, loading, dispatch]);

  const foraneNameById = useMemo(() => {
    const map = new Map();
    (foraneState.nameOptions || foraneState.options || []).forEach(opt =>
      map.set(opt.id, `${opt.name}, ${opt.location}`)
    );
    return map;
  }, [foraneState.nameOptions, foraneState.options]);

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

  const filteredItems = useMemo(() => {
    if (!selectedLetter) return items;
    const ltr = String(selectedLetter).toUpperCase();
    return items.filter(c =>
      (c.churchName || '').toUpperCase().startsWith(ltr)
    );
  }, [items, selectedLetter]);

  return (
    <div className="p-4 sm:p-6" style={{ paddingTop: headerOffset }}>
      <Header
        showFilter
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr);
          console.log('Selected letter:', ltr);
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer text-sm"
            onClick={handleBack}
          >
            &larr; Back
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {filteredItems.map((c, index) => (
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
          ))}

          {loading && (
            <div className="flex justify-center py-10">
              <span className="h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!loading && filteredItems.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              {selectedLetter
                ? 'No parishes match that letter.'
                : 'No parishes present for this Forane.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForaneParishList;

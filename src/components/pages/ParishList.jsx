import React, { useEffect, useMemo } from 'react';
import ChurchCard from '../ui/ChurchCard';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchParishesThunk } from '../../store/actions/parishActions.js';
import { fetchForanesThunk } from '../../store/actions/foraneActions.js';

const ParishList = () => {
  const navigate = useNavigate();
  const headerOffset = useHeaderOffset();
  const dispatch = useAppDispatch();
  const { items, loading, error, loaded } = useAppSelector(
    state => state.parish
  );
  const {
    nameOptions,
    loaded: foraneLoaded,
    loading: foraneLoading,
  } = useAppSelector(state => state.forane);

  useEffect(() => {
    if (!loaded && !loading) dispatch(fetchParishesThunk());
  }, [loaded, loading, dispatch]);

  // Ensure forane options are available for mapping names
  useEffect(() => {
    if (!foraneLoaded && !foraneLoading) dispatch(fetchForanesThunk());
  }, [foraneLoaded, foraneLoading, dispatch]);

  // const foraneNameById = useMemo(() => {
  //   const map = new Map();
  //   (nameOptions || []).forEach(opt => map.set(opt.id, opt.name)); // opt also has location
  //   return map;
  // }, [nameOptions]);

  const handleVisitParish = parishId => {
    navigate(`/parish/list/${parishId}/community/list`);
  };

  const foraneNameById = useMemo(() => {
    const map = new Map();
    (nameOptions || []).forEach(opt =>
      map.set(opt.id, `${opt.name}, ${opt.location}`)
    );
    return map;
  }, [nameOptions]);

  return (
    <div className="p-4 sm:p-6" style={{ paddingTop: headerOffset }}>
      <Header onSelect={letter => console.log('Selected letter:', letter)} />

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}
      <div className="space-y-6">
        {items.map((c, index) => (
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
          />
        ))}
        {loading && (
          <div className="flex justify-center py-10">
            <span className="h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParishList;

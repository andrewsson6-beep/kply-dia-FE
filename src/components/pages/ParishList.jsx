import React, { useEffect } from 'react';
import ChurchCard from '../ui/ChurchCard';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import useHeaderOffset from '../../hooks/useHeaderOffset';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchParishesThunk } from '../../store/actions/parishActions.js';

const ParishList = () => {
  const navigate = useNavigate();
  const headerOffset = useHeaderOffset();
  const dispatch = useAppDispatch();
  const { items, loading, error, loaded } = useAppSelector(
    state => state.parish
  );

  useEffect(() => {
    if (!loaded && !loading) dispatch(fetchParishesThunk());
  }, [loaded, loading, dispatch]);

  const handleVisitParish = parishId => {
    navigate(`/parish/list/${parishId}/community/list`);
  };

  return (
    <div className="p-4 sm:p-6" style={{ paddingTop: headerOffset }}>
      <Header onSelect={letter => console.log('Selected letter:', letter)} />

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}
      <div className="space-y-6">
        {items.map(c => (
          <ChurchCard
            key={c.id}
            id={c.id}
            churchName={c.churchName}
            place={c.place}
            vicarName={c.vicarName}
            contactNumber={c.contactNumber}
            totalAmount={c.totalAmount}
            imageUrl={c.imageUrl}
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

import React, { useEffect, useMemo, useState } from 'react';
import ChurchForm from '../forms/ChurchForm';
import Header from '../layout/Header';
import { useAppDispatch } from '../../store/hooks.js';
import { fetchForanesThunk } from '../../store/actions/foraneActions.js';
import {
  addParishThunk,
  fetchParishesThunk,
} from '../../store/actions/parishActions.js';
import { useNavigate } from 'react-router-dom';
import useYearFilter from '../../hooks/useYearFilter.js';

const AddParish = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedYear } = useYearFilter();
  const [nameOptions, setNameOptions] = useState([]);
  const [foraneLoading, setForaneLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Options are kept in local state (not read from the shared store) so that
  // foranes cached from another page/year are never shown before this
  // year-filtered request completes.
  useEffect(() => {
    let active = true;
    setForaneLoading(true);
    setNameOptions([]);
    const request = dispatch(fetchForanesThunk(selectedYear || undefined));
    request.then(action => {
      if (!active) return;
      if (fetchForanesThunk.fulfilled.match(action)) {
        setNameOptions(action.payload?.options || []);
      } else {
        setError(action.payload || 'Failed to load foranes');
      }
      setForaneLoading(false);
    });
    return () => {
      active = false;
      request.abort();
    };
  }, [dispatch, selectedYear]);

  const foraneOptions = useMemo(
    () =>
      (nameOptions || []).map(o => ({
        label: `${o.name}${o.location ? `, ${o.location}` : ''}`,
        value: String(o.id),
      })),
    [nameOptions]
  );

  const handleSubmit = async formData => {
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      // ChurchForm gives 'forane' as the selected value; ensure it's numeric id
      const payload = {
        par_for_id: Number(formData.forane),
        par_code: formData.code || '', // if you later add a code field
        par_name: formData.churchName,
        par_location: formData.place,
        par_vicar_name: formData.vicarName,
        // par_total_contribution_amount removed per requirements
      };
      const action = await dispatch(addParishThunk(payload));
      if (addParishThunk.fulfilled.match(action)) {
        setSuccess('Parish added successfully');
        dispatch(fetchParishesThunk());
        setTimeout(() => navigate('/parish/list', { replace: true }), 600);
      } else if (addParishThunk.rejected.match(action)) {
        setError(action.payload || 'Failed to add parish');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/parish/list');
  };

  return (
    <div className="p-6 flex justify-center items-start w-full">
      <Header
        headerInfo={{
          title: 'Parish Management',
          subtitle: 'Add a new parish',
        }}
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
      />
      <div className="max-w-4xl w-full mx-auto mt-24">
        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
            {success}
          </div>
        )}
        <ChurchForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          className="max-w-4xl mx-auto"
          showForaneField={true}
          foraneOptions={foraneOptions}
          foraneLoading={foraneLoading}
        />
        {submitting && (
          <div className="mt-4 text-xs text-gray-500">Submitting...</div>
        )}
      </div>
    </div>
  );
};

export default AddParish;

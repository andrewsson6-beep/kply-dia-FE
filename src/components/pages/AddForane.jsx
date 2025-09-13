import React, { useState } from 'react';
import ForaneForm from '../forms/ForaneForm.jsx';
import Header from '../layout/Header';
import { useAppDispatch } from '../../store/hooks.js';
import {
  addForaneThunk,
  fetchForanesThunk,
} from '../../store/actions/foraneActions.js';
import { useNavigate } from 'react-router-dom';

const AddForane = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async payload => {
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const action = await dispatch(addForaneThunk(payload));
      if (addForaneThunk.fulfilled.match(action)) {
        setSuccess('Forane added successfully');
        // Refresh list cache
        dispatch(fetchForanesThunk());
        setTimeout(() => navigate('/forane/list', { replace: true }), 600);
      } else if (addForaneThunk.rejected.match(action)) {
        setError(action.payload || 'Failed to add forane');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/forane/list');
  };

  return (
    <div className="p-6 flex justify-center items-start w-full">
      <Header
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
      />
      <div className="max-w-3xl w-full mx-auto mt-24">
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
        <ForaneForm onSubmit={handleSubmit} onCancel={handleCancel} />
        {submitting && (
          <div className="mt-4 text-xs text-gray-500">Submitting...</div>
        )}
      </div>
    </div>
  );
};

export default AddForane;

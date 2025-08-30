import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstitutionForm from '../forms/InstitutionForm';
import Header from '../layout/Header';

function AddInstitution() {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const navigate = useNavigate();

  const handleCreate = data => {
    console.log('Create institution:', data);
    // TODO: integrate API call then navigate
    // Reset flow: navigate to list or clear form. Here we navigate to list.
    navigate('/institution/list');
  };

  const handleCancel = () => {
    navigate(-1); // go back
  };

  return (
    <div>
      <Header
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
      />

      <div className="pt-32 px-4 pb-10 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">
          {/** Page Title */}
          Add Institution
        </h1>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
          <InstitutionForm onSubmit={handleCreate} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}

export default AddInstitution;

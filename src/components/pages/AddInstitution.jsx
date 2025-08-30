import React, { useState } from 'react';
import InstitutionForm from '../forms/InstitutionForm';
import Header from '../layout/Header';

function AddInstitution() {
  const [selectedLetter, setSelectedLetter] = useState(null);

  return (
    <div>
      <Header
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
      />

      <div className="mt-20">
        <InstitutionForm />
      </div>
    </div>
  );
}

export default AddInstitution;

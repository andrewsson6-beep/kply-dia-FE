import React, { useState } from 'react';
import ChurchForm from '../forms/ChurchForm';
import Header from '../layout/Header';

const AddForane = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);

  const handleSubmit = data => {
    console.log('Form submitted:', data);
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="p-6 flex justify-center items-center w-full h-screen">
      <Header
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
      />

      <ChurchForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
};

export default AddForane;

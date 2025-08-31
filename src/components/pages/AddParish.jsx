import React, { useState } from 'react';
import ChurchForm from '../forms/ChurchForm';
import Header from '../layout/Header';

const AddParish = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);

  const foraneOptions = [
    { label: 'Mundakkayam Forane', value: 'mundakkayam' },
    { label: 'Kochi Forane', value: 'kochi' },
    { label: 'Thrissur Forane', value: 'thrissur' },
  ];

  const handleSubmit = formData => {
    // TODO: handle form submission logic here
    console.log('Form submitted:', formData);
  };

  // Add handleCancel function
  const handleCancel = () => {
    // TODO: handle cancel logic here
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
        showForaneField={true}
        foraneOptions={foraneOptions}
      />
    </div>
  );
};

export default AddParish;

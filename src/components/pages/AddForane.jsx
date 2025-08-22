import React from 'react';
import ChurchForm from '../forms/ChurchForm';

const AddForane = () => {
  const handleSubmit = data => {
    console.log('Form submitted:', data);
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  const foraneOptions = [
    { label: 'Mundakkayam Forane', value: 'mundakkayam' },
    { label: 'Kochi Forane', value: 'kochi' },
    { label: 'Thrissur Forane', value: 'thrissur' },
  ];

  return (
    <div className="p-6">
      <ChurchForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        className="max-w-4xl mx-auto"
      />

      <ChurchForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showForaneField={true}
        foraneOptions={foraneOptions}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
};

export default AddForane;

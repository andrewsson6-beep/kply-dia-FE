import React from 'react';
import FamilyForm from '../forms/FamilyForm';

function AddFamily() {
  const handleSubmit = data => {
    console.log('Form submitted:', data);
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="px-2 sm:px-24 flex flex-col justify-center items-center min-h-full py-8">
      <FamilyForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}

export default AddFamily;

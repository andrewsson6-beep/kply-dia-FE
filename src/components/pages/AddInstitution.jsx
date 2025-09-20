import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstitutionForm from '../forms/InstitutionForm';
import Header from '../layout/Header';
import { domainApi } from '../../api/api.js';
import { useToast } from '../ui/useToast.js';

function AddInstitution() {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const navigate = useNavigate();

  const { showToast } = useToast();

  const handleCreate = async data => {
    try {
      const payload = {
        ins_name: data.institutionName || '',
        ins_type: '',
        ins_address: [data.place].filter(Boolean).join(', '),
        ins_phone: data.managerContact || '',
        ins_email: '',
        ins_website: '',
        ins_head_name: data.managerName || '',
        ins_total_contribution_amount: Number(data.totalAmount || 0),
      };
      await domainApi.addInstitution(payload);
      showToast('Institution added successfully', { type: 'success' });
      navigate('/institution/list');
    } catch (e) {
      showToast(e.message || 'Failed to add institution', { type: 'error' });
    }
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

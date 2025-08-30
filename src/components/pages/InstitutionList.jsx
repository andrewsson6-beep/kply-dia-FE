import React, { useState } from 'react';
import InstitutionCard from '../ui/InstitutionCard';
import Header from '../layout/Header';
import Modal from '../ui/Modal';
import InstitutionForm from '../forms/InstitutionForm';

function InstitutionList() {
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Local sample data (would come from API)
  const [institutions, setInstitutions] = useState([
    {
      id: 1,
      institutionName: 'Marian College',
      place: 'Kuttikanam',
      managerName: 'Rev Fr Boby Alex Mannamplackal',
      managerContact: '1234567890',
      principalName: 'Prof Dr Ajimon George',
      principalContact: '1234567890',
      administratorName: 'Rev Fr Thomas Abraham',
      administratorContact: '1234567890',
      totalAmount: '2023400',
      imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...',
    },
    {
      id: 2,
      institutionName: 'St. Joseph Institute',
      place: 'City Center',
      managerName: 'Rev Fr John Doe',
      managerContact: '9876543210',
      principalName: 'Dr Maria Paul',
      principalContact: '9876543210',
      administratorName: 'Rev Fr Antony',
      administratorContact: '9876543210',
      totalAmount: '1523400',
      imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...',
    },
  ]);

  // Modal states
  const [contributionFor, setContributionFor] = useState(null); // id
  const [contributionAmount, setContributionAmount] = useState('');
  const [editingInstitution, setEditingInstitution] = useState(null); // object
  const [deletingInstitution, setDeletingInstitution] = useState(null); // object

  const handleVisitInstitution = id => {
    console.log('Visit Institution clicked', id);
  };

  // Contribution flow
  const openAddContribution = id => {
    setContributionFor(id);
    setContributionAmount('');
  };
  const submitContribution = () => {
    console.log('Add contribution', {
      id: contributionFor,
      amount: contributionAmount,
    });
    // TODO: integrate API
    setContributionFor(null);
  };

  // Edit flow
  const openEdit = id => {
    const inst = institutions.find(i => i.id === id);
    if (inst) setEditingInstitution(inst);
  };
  const submitEdit = data => {
    console.log('Update institution', data);
    setInstitutions(prev =>
      prev.map(i => (i.id === data.id ? { ...i, ...data } : i))
    );
    setEditingInstitution(null);
  };

  // Delete flow
  const openDelete = id => {
    const inst = institutions.find(i => i.id === id);
    if (inst) setDeletingInstitution(inst);
  };
  const confirmDelete = () => {
    if (deletingInstitution) {
      setInstitutions(prev =>
        prev.filter(i => i.id !== deletingInstitution.id)
      );
      console.log('Deleted institution', deletingInstitution.id);
    }
    setDeletingInstitution(null);
  };

  return (
    <>
      <Header
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
      />
      {/* Content wrapper: add enough top padding to clear fixed header height */}
      <div className="max-w-7xl mx-auto px-4 pt-32 space-y-10">
        <div className="grid grid-cols-1 gap-8">
          {institutions.map(i => (
            <InstitutionCard
              key={i.id}
              {...i}
              totalAmount={`Rs. ${Intl.NumberFormat('en-IN').format(Number(i.totalAmount))}`}
              onVisit={() => handleVisitInstitution(i.id)}
              onAddContribution={openAddContribution}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      </div>

      {/* Contribution Side Modal */}
      <Modal
        isOpen={contributionFor !== null}
        onClose={() => setContributionFor(null)}
        title="Add Contribution"
        size="sm"
        variant="side"
        contentPointer
        footer={
          <>
            <button
              onClick={() => setContributionFor(null)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={submitContribution}
              disabled={!contributionAmount.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Add
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Amount
            <input
              type="number"
              value={contributionAmount}
              onChange={e => setContributionAmount(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm"
              placeholder="Enter amount"
              min={0}
            />
          </label>
        </div>
      </Modal>

      {/* Edit Side Modal */}
      <Modal
        isOpen={!!editingInstitution}
        onClose={() => setEditingInstitution(null)}
        title={
          editingInstitution
            ? `Edit: ${editingInstitution.institutionName}`
            : 'Edit Institution'
        }
        size="lg"
        variant="side"
        contentPointer
        closeOnBackdrop={false}
      >
        {editingInstitution && (
          <InstitutionForm
            initialData={editingInstitution}
            isEdit
            onSubmit={submitEdit}
            onCancel={() => setEditingInstitution(null)}
          />
        )}
      </Modal>

      {/* Delete Center Modal */}
      <Modal
        isOpen={!!deletingInstitution}
        onClose={() => setDeletingInstitution(null)}
        title="Confirm Delete"
        size="sm"
        variant="center"
        contentPointer
      >
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete{' '}
          <span className="font-semibold">
            {deletingInstitution?.institutionName}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setDeletingInstitution(null)}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}

export default InstitutionList;

import React, { useState } from 'react';
import FamilyCard from '../ui/FamilyCard';
import Header from '../layout/Header';
import Modal from '../ui/Modal';
import FamilyForm from '../forms/FamilyForm';

function FamilyList() {
  const [selectedLetter, setSelectedLetter] = useState(null);

  const families = [
    {
      id: 1,
      familyName: 'The Johnsons',
      community: "St. Mary's",
      familyHead: 'Michael Johnson',
      contactNumber: '123-456-7890',
      totalAmount: 'Rs. 50,000',
    },
    {
      id: 2,
      familyName: 'The Smiths',
      community: 'St. Thomas',
      familyHead: 'Sarah Smith',
      contactNumber: '987-654-3210',
      totalAmount: 'Rs. 65,300',
    },
    {
      id: 3,
      familyName: 'The Browns',
      community: 'Holy Family',
      familyHead: 'David Brown',
      contactNumber: '555-123-0000',
      totalAmount: 'Rs. 42,780',
    },
    {
      id: 4,
      familyName: 'The Wilsons',
      community: 'Sacred Heart',
      familyHead: 'Emily Wilson',
      contactNumber: '444-222-1111',
      totalAmount: 'Rs. 71,920',
    },
  ];

  const [contributionFor, setContributionFor] = useState(null); // family id | null
  const [contributionAmount, setContributionAmount] = useState('');
  const [editingFamily, setEditingFamily] = useState(null); // family object | null
  const [deletingFamily, setDeletingFamily] = useState(null); // family object | null

  const handleAddContribution = id => {
    setContributionFor(id);
    setContributionAmount('');
  };

  const handleSubmitContribution = () => {
    console.log('Submit contribution', {
      familyId: contributionFor,
      amount: contributionAmount,
    });
    // TODO: integrate API call
    setContributionFor(null);
  };

  const openEdit = id => {
    const fam = families.find(f => f.id === id);
    if (fam) setEditingFamily(fam);
  };

  const submitEdit = data => {
    console.log('Update family', data);
    // TODO: integrate API call / state update
    setEditingFamily(null);
  };

  const openDelete = id => {
    const fam = families.find(f => f.id === id);
    if (fam) setDeletingFamily(fam);
  };

  const confirmDelete = () => {
    if (deletingFamily) {
      console.log('Delete family', deletingFamily.id);
      // TODO: integrate deletion
    }
    setDeletingFamily(null);
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

      <div className="p-4 md:p-6 mt-16">
        <button
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          onClick={() => window.history.back()}
        >
          &larr; Back
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {families.map(f => (
            <FamilyCard
              key={f.id}
              id={f.id}
              familyName={f.familyName}
              community={f.community}
              familyHead={f.familyHead}
              contactNumber={f.contactNumber}
              totalAmount={f.totalAmount}
              onDelete={openDelete}
              onEdit={openEdit}
              onAddContribution={handleAddContribution}
            />
          ))}
        </div>
      </div>

      {/* Contribution Modal */}
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
              onClick={handleSubmitContribution}
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

      {/* Edit Modal (Family Form) */}
      <Modal
        isOpen={!!editingFamily}
        onClose={() => setEditingFamily(null)}
        title={
          editingFamily ? `Edit: ${editingFamily.familyName}` : 'Edit Family'
        }
        size="lg"
        closeOnBackdrop={false}
        variant="side"
        contentPointer
      >
        {editingFamily && (
          <FamilyForm
            initialData={editingFamily}
            isEdit
            onSubmit={submitEdit}
            onCancel={() => setEditingFamily(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingFamily}
        onClose={() => setDeletingFamily(null)}
        title="Confirm Delete"
        size="sm"
        variant="center"
        contentPointer
      >
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{deletingFamily?.familyName}</span>?
          This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setDeletingFamily(null)}
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
    </div>
  );
}

export default FamilyList;

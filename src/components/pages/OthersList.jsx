import React, { useState } from 'react';
import Header from '../layout/Header';
import IndividualCard from '../ui/IndividualCard';
import Modal from '../ui/Modal';
import IndividualForm from '../forms/IndividualForm';

const OthersList = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [individuals, setIndividuals] = useState([
    {
      id: 1,
      individualName: 'Alice Johnson',
      houseName: 'Rose Villa',
      place: 'Kottayam',
      contactNumber: '9876543210',
      totalAmount: 'Rs. 10,500',
    },
    {
      id: 2,
      individualName: 'Boby Mathew',
      houseName: 'Green Meadows',
      place: 'Ernakulam',
      contactNumber: '9123456780',
      totalAmount: 'Rs. 7,200',
    },
  ]);

  // Top-right add modal state
  const [showAdd, setShowAdd] = useState(false);
  const [editingIndividual, setEditingIndividual] = useState(null);
  const [deletingIndividual, setDeletingIndividual] = useState(null);
  const [contributionFor, setContributionFor] = useState(null); // id
  const [contributionAmount, setContributionAmount] = useState('');

  // Filtering by selectedLetter (if implemented in Header) - placeholder
  const filtered = individuals.filter(i =>
    selectedLetter
      ? i.individualName?.toUpperCase().startsWith(selectedLetter)
      : true
  );

  const openAddContribution = id => {
    setContributionFor(id);
    setContributionAmount('');
  };

  const submitContribution = () => {
    if (!contributionFor || !contributionAmount.trim()) return;
    // (placeholder) update totalAmount by adding numeric amount
    setIndividuals(prev =>
      prev.map(i => {
        if (i.id === contributionFor) {
          const existing =
            parseInt(String(i.totalAmount).replace(/\D/g, ''), 10) || 0;
          const add = parseInt(contributionAmount, 10) || 0;
          return {
            ...i,
            totalAmount:
              'Rs. ' + new Intl.NumberFormat('en-IN').format(existing + add),
          };
        }
        return i;
      })
    );
    setContributionFor(null);
  };

  const submitNew = data => {
    const nextId = individuals.length
      ? Math.max(...individuals.map(i => i.id)) + 1
      : 1;
    setIndividuals(prev => [
      ...prev,
      { ...data, id: nextId, totalAmount: 'Rs. 0' },
    ]);
    setShowAdd(false);
  };

  const openEdit = id => {
    const person = individuals.find(i => i.id === id);
    if (person) setEditingIndividual(person);
  };

  const submitEdit = data => {
    setIndividuals(prev =>
      prev.map(i => (i.id === data.id ? { ...i, ...data } : i))
    );
    setEditingIndividual(null);
  };

  const openDelete = id => {
    const person = individuals.find(i => i.id === id);
    if (person) setDeletingIndividual(person);
  };

  const confirmDelete = () => {
    if (deletingIndividual) {
      setIndividuals(prev => prev.filter(i => i.id !== deletingIndividual.id));
    }
    setDeletingIndividual(null);
  };

  return (
    <div>
      <Header
        selectedLetter={selectedLetter}
        onSelect={ltr => setSelectedLetter(ltr)}
      />

      <div className="p-4 md:p-6 mt-16">
        <div className="flex items-center justify-between mb-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer text-sm"
            onClick={() => window.history.back()}
          >
            &larr; Back
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          >
            + Add New Individual
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filtered.map(i => (
            <IndividualCard
              key={i.id}
              {...i}
              onAddContribution={openAddContribution}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              No individuals found.
            </div>
          )}
        </div>
      </div>

      {/* Add Individual Side Drawer */}
      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Individual"
        size="lg"
        variant="side"
        contentPointer
        closeOnBackdrop={false}
      >
        <IndividualForm
          onSubmit={submitNew}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>

      {/* Edit Individual Side Drawer */}
      <Modal
        isOpen={!!editingIndividual}
        onClose={() => setEditingIndividual(null)}
        title={
          editingIndividual
            ? `Edit: ${editingIndividual.individualName}`
            : 'Edit Individual'
        }
        size="lg"
        variant="side"
        contentPointer
        closeOnBackdrop={false}
      >
        {editingIndividual && (
          <IndividualForm
            initialData={editingIndividual}
            isEdit
            onSubmit={submitEdit}
            onCancel={() => setEditingIndividual(null)}
          />
        )}
      </Modal>

      {/* Add Contribution Side Drawer */}
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

      {/* Delete Confirmation Center Modal */}
      <Modal
        isOpen={!!deletingIndividual}
        onClose={() => setDeletingIndividual(null)}
        title="Confirm Delete"
        size="sm"
        variant="center"
        contentPointer
      >
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete{' '}
          <span className="font-semibold">
            {deletingIndividual?.individualName}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setDeletingIndividual(null)}
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
};

export default OthersList;

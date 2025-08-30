import React, { useState } from 'react';
import FamilyCard from '../ui/FamilyCard';
import Header from '../layout/Header';

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
              onDelete={() => console.log('Delete clicked', f.id)}
              onEdit={() => console.log('Edit clicked', f.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FamilyList;

import React, { useState, useMemo } from 'react';
import ChurchCard from '../ui/ChurchCard';
import Header from '../layout/Header';

const ForaneList = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);

  const churches = useMemo(
    () => [
      {
        id: 1,
        churchName: 'Our Lady of Dolours Church',
        place: 'Mundakkayam',
        vicarName: 'Rev. Fr. James Muthanattu',
        contactNumber: '9633104090',
        totalAmount: 'Rs. 12,00,692',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnacSXF9M0AX7bnQVOMKA8HjSHIiPRF1NA9g&s',
      },
      {
        id: 2,
        churchName: "St. Mary's Cathedral",
        place: 'Kochi',
        vicarName: 'Rev. Fr. John Doe',
        contactNumber: '9876543210',
        totalAmount: 'Rs. 15,00,000',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnacSXF9M0AX7bnQVOMKA8HjSHIiPRF1NA9g&s',
      },
      {
        id: 3,
        churchName: 'Holy Cross Church',
        place: 'Thrissur',
        vicarName: 'Rev. Fr. Michael',
        contactNumber: '9999888777',
        totalAmount: 'Rs. 8,50,000',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnacSXF9M0AX7bnQVOMKA8HjSHIiPRF1NA9g&s',
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (!selectedLetter) return churches;
    return churches.filter(c =>
      c.churchName.toUpperCase().startsWith(selectedLetter)
    );
  }, [selectedLetter, churches]);

  return (
    <div className="pt-28 p-6">
      <Header
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
      />

      <h1 className="text-2xl font-bold text-gray-800 mb-4">Forane List</h1>

      {selectedLetter && (
        <div className="mb-4 text-sm text-gray-600">
          Filtering by:{' '}
          <span className="font-semibold text-blue-600">{selectedLetter}</span>
          <button
            onClick={() => setSelectedLetter(null)}
            className="ml-3 text-blue-500 hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      <div className="space-y-6">
        {filtered.map(c => (
          <ChurchCard
            key={c.id}
            id={c.id}
            churchName={c.churchName}
            place={c.place}
            vicarName={c.vicarName}
            contactNumber={c.contactNumber}
            totalAmount={c.totalAmount}
            imageUrl={c.imageUrl}
            onVisitParish={() => console.log('Visit Parish clicked', c.id)}
            className="max-w-4xl mx-auto"
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No churches match that letter.
          </div>
        )}
      </div>
    </div>
  );
};

export default ForaneList;

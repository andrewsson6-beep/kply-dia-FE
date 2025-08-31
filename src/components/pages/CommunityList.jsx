import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityCard from '../ui/CommunityCard';
import Header from '../layout/Header';

const CommunityList = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);

  const navigate = useNavigate();

  const saintsData = [
    { id: 1, number: 1, name: 'St Bartholomew' },
    { id: 2, number: 2, name: 'St Evaparasiamma' },
    { id: 3, number: 3, name: 'St Thomas' },
    { id: 4, number: 4, name: 'St Alphonsa' },
    { id: 5, number: 5, name: 'St Bartholomew' },
    { id: 6, number: 6, name: 'St Bartholomew' },
    { id: 7, number: 7, name: 'St Bartholomew' },
    { id: 8, number: 8, name: 'St Bartholomew' },
    { id: 9, number: 9, name: 'St Bartholomew' },
    { id: 10, number: 10, name: 'St Bartholomew' },
    { id: 11, number: 11, name: 'St Bartholomew' },
    { id: 12, number: 12, name: 'St Bartholomew' },
    { id: 13, number: 13, name: 'St Bartholomew' },
  ];

  const handleCommunityVisit = id => {
    console.log('Visiting community:', id);
    const parishId = window.location.pathname.split('/')[3];
    navigate(`/parish/list/${parishId}/community/${id}/visit`);
  };

  const handleBack = () => {
    navigate('/parish/list/');
  };

  return (
    <div className="bg-gray-100 min-h-full p-4">
      <Header
        selectedLetter={selectedLetter}
        onSelect={ltr => {
          setSelectedLetter(ltr); // ltr will be null when toggled off
          console.log('Selected letter:', ltr);
        }}
      />

      <div className="max-w-7xl mx-auto mt-20">
        <button
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          onClick={handleBack}
        >
          &larr; Back
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {saintsData.map(saint => (
            <CommunityCard
              key={saint.id}
              number={saint.number}
              name={saint.name}
              onClick={() => handleCommunityVisit(saint.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityList;

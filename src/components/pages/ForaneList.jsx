import React from 'react';

import ChurchCard from '../ui/ChurchCard';

const ForaneList = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Forane List</h1>

      <div className="space-y-6">
        <ChurchCard
          id={1}
          churchName="Our Lady of Dolours Church"
          place="Mundakkayam"
          vicarName="Rev. Fr. James Muthanattu"
          contactNumber="9633104090"
          totalAmount="Rs. 12,00,692"
          imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnacSXF9M0AX7bnQVOMKA8HjSHIiPRF1NA9g&s"
          onVisitParish={() => console.log('Visit Parish clicked')}
          className="max-w-4xl mx-auto"
        />

        <ChurchCard
          id={2}
          churchName="St. Mary's Cathedral"
          place="Kochi"
          vicarName="Rev. Fr. John Doe"
          contactNumber="9876543210"
          totalAmount="Rs. 15,00,000"
          imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnacSXF9M0AX7bnQVOMKA8HjSHIiPRF1NA9g&s"
          onVisitParish={() => console.log('Visit Parish clicked')}
          className="max-w-4xl mx-auto"
        />

        <ChurchCard
          id={3}
          churchName="Holy Cross Church"
          place="Thrissur"
          vicarName="Rev. Fr. Michael"
          contactNumber="9999888777"
          totalAmount="Rs. 8,50,000"
          imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnacSXF9M0AX7bnQVOMKA8HjSHIiPRF1NA9g&s"
          onVisitParish={() => console.log('Visit Parish clicked')}
          className="max-w-4xl mx-auto"
        />
      </div>
    </div>
  );
};

export default ForaneList;

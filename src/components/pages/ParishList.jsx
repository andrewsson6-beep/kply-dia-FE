import React from 'react';
import ChurchCard from '../ui/ChurchCard';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import useHeaderOffset from '../../hooks/useHeaderOffset';

const ParishList = () => {
  const navigate = useNavigate();
  const headerOffset = useHeaderOffset();

  const handleVisitParish = parishId => {
    navigate(`/parish/list/${parishId}/community/list`);
  };

  return (
    <div className="p-4 sm:p-6" style={{ paddingTop: headerOffset }}>
      <Header onSelect={letter => console.log('Selected letter:', letter)} />

      <div className="space-y-6">
        <ChurchCard
          id={1}
          churchName="Our Lady of Dolours Church"
          place="Mundakkayam"
          vicarName="Rev. Fr. James Muthanattu"
          contactNumber="9633104090"
          totalAmount="Rs. 12,00,692"
          imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnacSXF9M0AX7bnQVOMKA8HjSHIiPRF1NA9g&s"
          onVisitParish={() => handleVisitParish(1)}
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
          onVisitParish={() => handleVisitParish(2)}
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
          onVisitParish={() => handleVisitParish(3)}
          className="max-w-4xl mx-auto"
        />
      </div>
    </div>
  );
};

export default ParishList;

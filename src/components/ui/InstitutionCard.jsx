import React from 'react';

// Renamed ChurchCard -> InstitutionCard for clarity/consistency
const InstitutionCard = ({
  id,
  institutionName,
  place,
  managerName,
  managerContact,
  principalName,
  principalContact,
  administratorName,
  administratorContact,
  totalAmount,
  imageUrl,
  onVisit,
  height = 'auto',
  width = '100%',
  className = '',
}) => {
  const cardStyle = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0, // Allows flex items to shrink below their content size
  };

  return (
    <div className={`overflow-hidden w-full ${className}`} style={cardStyle}>
      <div className="flex flex-col sm:flex-row shadow-lg sm:shadow-none sm:items-stretch h-full p-3 sm:p-4 gap-3">
        {/* Image */}
        <div className="w-full h-56 rounded-2xl sm:shadow-lg sm:w-2/5 md:w-1/3 relative flex-shrink-0 overflow-hidden">
          <img
            src={imageUrl}
            alt={institutionName}
            className="w-full h-full object-cover"
          />
          {id && (
            <div className="absolute top-3 left-3 bg-blue-500/90 backdrop-blur text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold shadow">
              {id}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 rounded-2xl shadow-lg p-4 overflow-hidden min-w-0 bg-white/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full border-2 border-blue-400 rounded-2xl p-3 bg-white/70">
            {/* Left Column */}
            <div className="space-y-2 flex flex-col ">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Institution Name
                </label>
                <div className="bg-gray-100  rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm break-words overflow-hidden">
                  {institutionName}
                </div>
              </div>

              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Manager Name
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {managerName}
                </div>
              </div>

              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Principal Name
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {principalName}
                </div>
              </div>

              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Administrator Name
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {administratorName}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2 flex flex-col  ">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Place
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {place}
                </div>
              </div>

              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Manager Contact Number
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {managerContact}
                </div>
              </div>

              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Principal Contact Number
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {principalContact}
                </div>
              </div>

              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Administrator Contact Number
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {administratorContact}
                </div>
              </div>

              {/* Mobile: Show Total Amount here (second-to-last) */}
              <div className="flex-shrink-0 sm:hidden">
                <label className="text-blue-500 font-medium text-xs mb-1 block">
                  Total Amount
                </label>
                <div className="bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-xs w-full text-center break-words">
                  {totalAmount}
                </div>
              </div>

              {/* Desktop: Show Total Amount here */}
              <div className="hidden sm:flex flex-1 items-end">
                <div className="w-full">
                  <label className="text-blue-500 font-medium text-sm mb-1 block">
                    Total Amount
                  </label>
                  <div className="bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-sm w-full text-center break-words">
                    {totalAmount}
                  </div>
                </div>
              </div>

              {/* Mobile: Show button here (last item) */}
              <div className="flex-shrink-0 sm:hidden">
                <button
                  onClick={onVisit}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-xs"
                >
                  VISIT INSTITUTION
                </button>
              </div>
            </div>

            {/* Desktop: Button spans full width at bottom */}
            <div className="hidden sm:block sm:col-span-2">
              <button
                onClick={onVisit}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-sm mt-2"
              >
                VISIT INSTITUTION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionCard;

// Example usage:
/*
import ChurchCard from './ChurchCard';

const ExampleUsage = () => {
  const handleVisitParish = () => {
    console.log('Visit Parish clicked');
    // Handle navigation or modal opening
  };

  return (
    <div className="space-y-4 p-4">
      <ChurchCard
        id={1}
        churchName="Our Lady of Dolours Church"
        place="Mundakkayam"
        vicarName="Rev. Fr. James Muthanattu"
        contactNumber="9633104090"
        totalAmount="Rs. 12,00,692"
        imageUrl="/path/to/church-image.jpg"
        onVisitParish={handleVisitParish}
        className="max-w-4xl mx-auto"
      />
      
      <ChurchCard
        id={2}
        churchName="St. Mary's Cathedral"
        place="Kochi"
        vicarName="Rev. Fr. John Doe"
        contactNumber="9876543210"
        totalAmount="Rs. 15,00,000"
        imageUrl="/path/to/church-image.jpg"
        onVisitParish={handleVisitParish}
        height="300px"
        width="600px"
        className="mx-auto"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ChurchCard
          id={3}
          churchName="Holy Cross Church"
          place="Thrissur"
          vicarName="Rev. Fr. Michael"
          contactNumber="9999888777"
          totalAmount="Rs. 8,50,000"
          imageUrl="/path/to/church-image.jpg"
          onVisitParish={handleVisitParish}
          height="350px"
        />
      </div>
    </div>
  );
};
*/

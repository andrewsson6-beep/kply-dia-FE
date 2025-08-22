import React from 'react';

const ChurchCard = ({
  id,
  churchName,
  place,
  vicarName,
  contactNumber,
  totalAmount,
  imageUrl,
  onVisitParish,
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
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full ${className}`}
      style={cardStyle}
    >
      <div className="flex flex-col sm:flex-row h-full p-3 sm:p-4 gap-3 sm:gap-4">
        {/* Church Image */}
        <div className="w-full sm:w-2/5 md:w-1/3 relative flex-shrink-0">
          <div className="h-32 sm:h-48 md:h-full min-h-[120px] sm:min-h-[200px]">
            <img
              src={imageUrl}
              alt={churchName}
              className="w-full h-full object-cover rounded"
            />
            {id && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-blue-400 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">
                {id}
              </div>
            )}
          </div>
        </div>

        {/* Church Details */}
        <div className="flex-1 p-3 sm:p-4 border-2 border-blue-400 rounded-xl overflow-hidden min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 h-full">
            {/* Left Column */}
            <div className="space-y-2 flex flex-col">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Church Name
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm break-words overflow-hidden">
                  {churchName}
                </div>
              </div>

              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Place
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {place}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2 flex flex-col">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Vicar Name
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {vicarName}
                </div>
              </div>

              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Contact Number
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {contactNumber}
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
                  onClick={onVisitParish}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-xs"
                >
                  VISIT PARISH
                </button>
              </div>
            </div>

            {/* Desktop: Button spans full width at bottom */}
            <div className="hidden sm:block sm:col-span-2">
              <button
                onClick={onVisitParish}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-sm mt-2"
              >
                VISIT PARISH
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurchCard;

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

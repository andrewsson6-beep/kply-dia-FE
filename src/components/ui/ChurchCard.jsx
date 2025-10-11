import React from 'react';

const ChurchCard = ({
  id,
  churchName,
  place,
  vicarName,
  contactNumber,
  totalAmount,
  onVisitParish,
  height = 'auto',
  width = '100%',
  className = '',
  forane, // optional new prop if available
  visitLabel = 'VISIT PARISH', // new customizable label
}) => {
  const cardStyle = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0, // Allows flex items to shrink below their content size
  };
  const handleKeyDown = e => {
    if ((e.key === 'Enter' || e.key === ' ') && onVisitParish) {
      e.preventDefault();
      onVisitParish();
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full ${onVisitParish ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''} ${className}`}
      style={cardStyle}
      onClick={onVisitParish}
      onKeyDown={handleKeyDown}
      role={onVisitParish ? 'button' : undefined}
      tabIndex={onVisitParish ? 0 : undefined}
      aria-label={onVisitParish ? `Visit parish ${churchName}` : undefined}
    >
      <div className="flex flex-col h-full p-3 sm:p-4">
        {/* Church Details */}
        <div className="relative flex-1 p-3 sm:p-4 border-2 border-blue-400 rounded-xl overflow-hidden min-w-0">
          {id && (
            <div className="absolute top-2 left-2">
              <div className="bg-blue-500 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">
                {id}
              </div>
            </div>
          )}
          <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 h-full">
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

              {forane ? (
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Forane
                  </label>
                  <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                    {forane}
                  </div>
                </div>
              ) : null}

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
              <div className="flex-shrink-0 sm:hidden flex gap-2 mt-1">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onVisitParish && onVisitParish();
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-[10px] cursor-pointer"
                >
                  {visitLabel}
                </button>
              </div>

              {/* Desktop: Button spans full width at bottom */}
              <div className="hidden sm:flex sm:col-span-2 items-center gap-3 mt-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onVisitParish && onVisitParish();
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-sm cursor-pointer"
                >
                  {visitLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurchCard;

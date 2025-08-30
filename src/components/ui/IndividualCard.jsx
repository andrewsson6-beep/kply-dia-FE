import React from 'react';

/*
  IndividualCard
  Props:
    id, individualName, houseName, place, contactNumber, totalAmount
    onAddContribution(id)
    onEdit(id)
    onDelete(id)
*/
const IndividualCard = ({
  id,
  individualName,
  houseName,
  place,
  contactNumber,
  totalAmount = 'Rs. 0',
  onAddContribution,
  onEdit,
  onDelete,
  height = 'auto',
  width = '100%',
  className = '',
}) => {
  const style = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0,
  };
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full ${className}`}
      style={style}
    >
      <div className="flex flex-col sm:flex-row h-full p-3 sm:p-4 gap-3 sm:gap-4">
        <div className="flex-1 p-3 sm:p-4 border-2 border-blue-400 rounded-xl overflow-hidden min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 h-full">
            {/* Left Column */}
            <div className="space-y-2 flex flex-col">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Name
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm break-words">
                  {individualName}
                </div>
              </div>
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  House Name
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words">
                  {houseName}
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-2 flex flex-col">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Place
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words">
                  {place}
                </div>
              </div>
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Contact Number
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words">
                  {contactNumber}
                </div>
              </div>
              {/* Mobile Total Amount */}
              <div className="flex-shrink-0 sm:hidden">
                <label className="text-blue-500 font-medium text-xs mb-1 block">
                  Total Amount
                </label>
                <div className="bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-xs w-full text-center break-words">
                  {totalAmount}
                </div>
              </div>
              {/* Desktop Total Amount */}
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
              {/* Mobile Actions */}
              <div className="flex-shrink-0 sm:hidden flex gap-2">
                <button
                  onClick={() => onAddContribution(id)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-md cursor-pointer transition-all duration-200 ease-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-[10px]"
                >
                  ADD CONTRIBUTION
                </button>
                <button
                  onClick={() => onEdit(id)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Edit individual"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 00.707-.293l11.414-11.414a1 1 0 000-1.414L16.414 4.293a1 1 0 00-1.414 0L3.586 15.707A1 1 0 003.293 16.414V20z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Delete individual"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* Desktop Actions */}
            <div className="hidden sm:flex sm:col-span-2 items-center justify-between gap-3 mt-2">
              <button
                onClick={() => onAddContribution(id)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-all duration-200 ease-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              >
                ADD CONTRIBUTION
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(id)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Edit individual"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 00.707-.293l11.414-11.414a1 1 0 000-1.414L16.414 4.293a1 1 0 00-1.414 0L3.586 15.707A1 1 0 003.293 16.414V20z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Delete individual"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualCard;

import React, { useState } from 'react';
import Modal from './Modal';
import { generateReceiptPdf } from '../../services/pdfHelper';

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
  onAddContribution,
  onVisit,
  onEdit,
  onDelete,
  height = 'auto',
  width = '100%',
  className = '',
  generatedBy,
}) => {
  const cardStyle = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0,
  };
  const [open, setOpen] = useState(false);

  const payload = () => ({
    id,
    title: institutionName,
    subtitleLabel: 'Place',
    subtitleValue: place,
    fields: [
      {
        label: 'Manager / Administrator',
        value: managerName || administratorName || '-',
      },
      { label: 'Manager Contact', value: managerContact || '-' },
      { label: 'Principal Name', value: principalName || '-' },
      { label: 'Principal Contact', value: principalContact || '-' },
      { label: 'Administrator Name', value: administratorName || '-' },
      { label: 'Administrator Contact', value: administratorContact || '-' },
    ],
    totalValue: totalAmount,
    generatedBy,
    generatedAt: new Date(),
  });

  const download = () => {
    generateReceiptPdf(payload(), { mode: 'download' });
    setOpen(false);
  };
  const print = () => {
    generateReceiptPdf(payload(), { mode: 'print' });
    setOpen(false);
  };

  return (
    <div
      className={`group overflow-hidden w-full ${className}`}
      style={cardStyle}
    >
      <div className="flex flex-col shadow-lg sm:shadow-none sm:items-stretch h-full p-3 sm:p-4 gap-3">
        {/* Details */}
        <div className="relative flex-1 rounded-2xl shadow-lg p-4 overflow-hidden min-w-0 bg-white/80">
          {id && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold shadow">
                {id}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full border-2 border-blue-400 rounded-2xl p-3 bg-white/70 pt-6 sm:pt-8">
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
              <div className="flex-shrink-0 sm:hidden">
                <label className="text-blue-500 font-medium text-xs mb-1 block">
                  Total Amount
                </label>
                <div className="bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-xs w-full text-center break-words">
                  {totalAmount}
                </div>
              </div>
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
              <div className="flex-shrink-0 sm:hidden mt-1 flex gap-2">
                <button
                  onClick={() => setOpen(true)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-md cursor-pointer transition-all text-[10px] shadow hover:shadow-lg"
                >
                  RECEIPT
                </button>
              </div>
            </div>
            {/* Desktop: Actions */}
            <div className="hidden sm:flex sm:col-span-2 items-center justify-between gap-3 mt-2">
              <button
                onClick={() => onVisit && onVisit(id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-all duration-200 ease-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              >
                VISIT INSTITUTION
              </button>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 ease-out transform translate-y-1 group-hover:translate-y-0">
                <button
                  onClick={() => onAddContribution && onAddContribution(id)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Add contribution"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onEdit && onEdit(id)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Edit institution"
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
                  onClick={() => onDelete && onDelete(id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Delete institution"
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
                <button
                  onClick={() => setOpen(true)}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Receipt options"
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
                      d="M6 9V4h12v5M6 14h12v6H6v-6z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Receipt Actions"
          footer={
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <button
                onClick={download}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-all"
              >
                Download PDF
              </button>
              <button
                onClick={print}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-all"
              >
                Print Now
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition-all"
              >
                Cancel
              </button>
            </div>
          }
        >
          <p className="text-sm text-gray-600">
            Choose how you want the receipt for{' '}
            <span className="font-semibold text-gray-800">
              {institutionName}
            </span>
            .
          </p>
        </Modal>
      )}
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

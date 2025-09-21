import React from 'react';
import { generateFamilyReceiptPdf } from '../../services/pdfHelper';
import Modal from './Modal';

interface FamilyCardProps {
  id: number | string;
  familyName: string;
  community: string;
  familyHead: string;
  contactNumber: string;
  totalAmount: string | number;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
  onAddContribution: (id: number | string) => void;
  onVisit?: (id: number | string) => void;
  height?: string;
  width?: string;
  className?: string;
  // optional metadata for receipt
  generatedBy?: string;
}

const FamilyCard: React.FC<FamilyCardProps> = ({
  id,
  familyName,
  community,
  familyHead,
  contactNumber,
  totalAmount,
  onEdit,
  onDelete,
  onAddContribution,
  onVisit,
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

  const [receiptModalOpen, setReceiptModalOpen] = React.useState(false);
  const openReceiptModal = () => setReceiptModalOpen(true);
  const closeReceiptModal = () => setReceiptModalOpen(false);

  const buildPayload = () => ({
    id,
    familyName,
    community,
    familyHead,
    contactNumber,
    totalAmount,
    generatedBy,
    generatedAt: new Date(),
    parish: 'Mundakayam', //TODO: make it dynamic on API integration
  });

  const handleDownload = () => {
    generateFamilyReceiptPdf(buildPayload(), { mode: 'download' });
    closeReceiptModal();
  };
  const handlePrint = () => {
    generateFamilyReceiptPdf(buildPayload(), { mode: 'print' });
    closeReceiptModal();
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full ${className}`}
      style={cardStyle}
    >
      <div className="flex flex-col sm:flex-row h-full p-3 sm:p-4 gap-3 sm:gap-4">
        <div className="flex-1 p-3 sm:p-4 border-2 border-blue-400 rounded-xl overflow-hidden min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 h-full">
            {/* Left Column */}
            <div className="space-y-2 flex flex-col">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Family Name
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm break-words overflow-hidden">
                  {familyName}
                </div>
              </div>
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Family Head
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {familyHead}
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-2 flex flex-col">
              <div className="flex-shrink-0">
                <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                  Community
                </label>
                <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm break-words overflow-hidden">
                  {community}
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
              {/* Mobile Total */}
              <div className="flex-shrink-0 sm:hidden">
                <label className="text-blue-500 font-medium text-xs mb-1 block">
                  Total Amount
                </label>
                <div className="bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-xs w-full text-center break-words">
                  {totalAmount}
                </div>
              </div>
              {/* Desktop Total */}
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
              {/* Mobile action buttons */}
              <div className="flex-shrink-0 sm:hidden flex gap-2">
                <button
                  onClick={() => onVisit && onVisit(id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-md cursor-pointer transition-all duration-200 ease-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-[10px]"
                >
                  VISIT FAMILY
                </button>
                <button
                  onClick={() => onAddContribution(id)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Add contribution"
                  title="Add contribution"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onEdit(id)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Edit family"
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
                  aria-label="Delete family"
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
                <button
                  onClick={openReceiptModal}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Receipt options"
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
                      d="M6 9V4h12v5M6 14h12v6H6v-6z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* Desktop actions */}
            <div className="hidden sm:flex sm:col-span-2 items-center justify-between gap-3 mt-2">
              <button
                onClick={() => onVisit && onVisit(id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-all duration-200 ease-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              >
                VISIT FAMILY
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => onAddContribution(id)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Add contribution"
                  title="Add contribution"
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
                  onClick={() => onEdit(id)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Edit family"
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
                  aria-label="Delete family"
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
                  onClick={openReceiptModal}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
      {receiptModalOpen && (
        <Modal
          isOpen={receiptModalOpen}
          onClose={closeReceiptModal}
          title="Receipt Actions"
          footer={
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow hover:shadow-md transition-all cursor-pointer"
              >
                Download PDF
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow hover:shadow-md transition-all cursor-pointer"
              >
                Print Now
              </button>
              <button
                onClick={closeReceiptModal}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          }
        >
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Choose how you want to obtain the receipt for{' '}
              <span className="font-semibold text-gray-800">{familyName}</span>.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium text-gray-700">Download PDF</span>{' '}
                saves the file locally.
              </li>
              <li>
                <span className="font-medium text-gray-700">Print Now</span>{' '}
                opens system print dialog directly.
              </li>
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FamilyCard;

// Example usage:
/*
import FamilyCard from './FamilyCard';

const ExampleUsage = () => {
  const handleVisitParish = () => {
    console.log('Visit Parish clicked');
    // Handle navigation or modal opening
  };

  return (
    <div className="space-y-4 p-4">
      <FamilyCard
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
      
      <FamilyCard
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
        <FamilyCard
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

import React, { useState } from 'react';
import Modal from './Modal';
import { generateReceiptPdf } from '../../services/pdfHelper';

const ChurchCard = ({
  id,
  churchName,
  place,
  vicarName,
  contactNumber,
  totalAmount,
  onVisitParish,
  onDeleteParish,
  height = 'auto',
  width = '100%',
  className = '',
  generatedBy,
  forane, // optional new prop if available
  visitLabel = 'VISIT PARISH', // new customizable label
}) => {
  const cardStyle = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0, // Allows flex items to shrink below their content size
  };
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const handleKeyDown = e => {
    if ((e.key === 'Enter' || e.key === ' ') && onVisitParish) {
      e.preventDefault();
      onVisitParish();
    }
  };
  const buildPayload = () => ({
    id,
    title: churchName,
    subtitleLabel: 'Place',
    subtitleValue: place,
    fields: [
      { label: 'Forane', value: forane || '-' },
      { label: 'Vicar Name', value: vicarName },
      { label: 'Vicar Contact', value: contactNumber },
    ],
    totalValue: totalAmount,
    generatedBy,
    generatedAt: new Date(),
  });
  const download = () => {
    generateReceiptPdf(buildPayload(), { mode: 'download' });
    setOpen(false);
  };
  const print = () => {
    generateReceiptPdf(buildPayload(), { mode: 'print' });
    setOpen(false);
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
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setOpen(true);
                  }}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                {onDeleteParish && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setShowDelete(true);
                    }}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label="Delete parish"
                    title="Delete parish"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m1 0V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
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
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setOpen(true);
                  }}
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
                {onDeleteParish && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setShowDelete(true);
                    }}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label="Delete parish"
                    title="Delete parish"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m1 0V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
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
            <span className="font-semibold text-gray-800">{churchName}</span>.
          </p>
        </Modal>
      )}
      {showDelete && (
        <Modal
          isOpen={showDelete}
            onClose={() => (deleting ? null : setShowDelete(false))}
          title="Delete Parish"
          size="sm"
          variant="center"
          contentPointer
          closeOnBackdrop={!deleting}
        >
          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to permanently delete this parish? This action
            cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              disabled={deleting}
              onClick={() => !deleting && setShowDelete(false)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              disabled={deleting}
              onClick={async e => {
                e.stopPropagation();
                if (!onDeleteParish || deleting) return;
                setDeleting(true);
                try {
                  await onDeleteParish();
                } finally {
                  setDeleting(false);
                  setShowDelete(false);
                }
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-center gap-2"
            >
              {deleting && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Delete
            </button>
          </div>
        </Modal>
      )}
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

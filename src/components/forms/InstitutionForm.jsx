import React, { useState } from 'react';

const InstitutionForm = ({
  onSubmit,
  height = 'auto',
  width = '100%',
  className = '',
}) => {
  const [formData, setFormData] = useState({
    institutionName: '',
    place: '',
    managerName: '',
    managerContact: '',
    principalName: '',
    principalContact: '',
    administratorName: '',
    administratorContact: '',
    totalAmount: '',
    imageFile: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const cardStyle = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0,
  };

  return (
    <div className={`overflow-hidden w-full ${className}`} style={cardStyle}>
      <div>
        <div className="flex flex-col sm:flex-row shadow-lg sm:shadow-none sm:items-center h-full p-3 sm:p-4 gap-1 sm:gap-0.5">
          {/* Image Upload Section */}
          <div className="w-full h-[14.5625rem] rounded-2xl sm:shadow-lg sm:w-2/5 md:w-1/3 relative flex-shrink-0">
            <div className="h-full p-4">
              <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center relative overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-gray-400 mb-2">
                      <svg
                        className="mx-auto h-8 w-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Click to upload image
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1 rounded-2xl shadow-lg p-4 overflow-hidden min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 h-full border-2 border-blue-400 rounded-2xl p-2 bg-white bg-opacity-80">
              {/* Left Column */}
              <div className="space-y-2 flex flex-col">
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter institution name"
                  />
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter manager name"
                  />
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Principal Name
                  </label>
                  <input
                    type="text"
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter principal name"
                  />
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Administrator Name
                  </label>
                  <input
                    type="text"
                    name="administratorName"
                    value={formData.administratorName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter administrator name"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2 flex flex-col">
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Place
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter place"
                  />
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Manager Contact Number
                  </label>
                  <input
                    type="tel"
                    name="managerContact"
                    value={formData.managerContact}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter manager contact"
                  />
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Principal Contact Number
                  </label>
                  <input
                    type="tel"
                    name="principalContact"
                    value={formData.principalContact}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter principal contact"
                  />
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Administrator Contact Number
                  </label>
                  <input
                    type="tel"
                    name="administratorContact"
                    value={formData.administratorContact}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter administrator contact"
                  />
                </div>

                {/* Mobile: Show Total Amount here (second-to-last) */}
                <div className="flex-shrink-0 sm:hidden">
                  <label className="text-blue-500 font-medium text-xs mb-1 block">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className="w-full bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-xs text-center"
                    placeholder="Enter amount"
                  />
                </div>

                {/* Desktop: Show Total Amount here */}
                <div className="hidden sm:flex flex-1 items-end">
                  <div className="w-full">
                    <label className="text-blue-500 font-medium text-sm mb-1 block">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleInputChange}
                      className="w-full bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-sm text-center"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                {/* Mobile: Show submit button here (last item) */}
                <div className="flex-shrink-0 sm:hidden">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-xs"
                  >
                    ADD INSTITUTION
                  </button>
                </div>
              </div>

              {/* Desktop: Submit button spans full width at bottom */}
              <div className="hidden sm:block sm:col-span-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-sm mt-2"
                >
                  ADD PARISH
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionForm;

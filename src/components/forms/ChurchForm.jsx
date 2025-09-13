import React, { useState, useEffect } from 'react';

const ChurchForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  height = 'auto',
  width = '100%',
  className = '',
  isEdit = false,
  showForaneField = false,
  foraneOptions = [],
}) => {
  const [formData, setFormData] = useState({
    churchName: initialData.churchName || '',
    place: initialData.place || '',
    vicarName: initialData.vicarName || '',
    contactNumber: initialData.contactNumber || '',
    totalAmount: initialData.totalAmount || '',
    forane: initialData.forane || '',
    ...initialData,
  });
  const [errors, setErrors] = useState({});

  // Sync with new initialData in edit mode
  useEffect(() => {
    if (isEdit) {
      setFormData(prev => ({
        ...prev,
        churchName: initialData.churchName || '',
        place: initialData.place || '',
        vicarName: initialData.vicarName || '',
        contactNumber: initialData.contactNumber || '',
        totalAmount: initialData.totalAmount || '',
        forane: initialData.forane || '',
      }));
    }
  }, [initialData, isEdit]);

  const cardStyle = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0,
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.churchName.trim())
      newErrors.churchName = 'Church name is required';
    if (!formData.place.trim()) newErrors.place = 'Place is required';
    if (!formData.vicarName.trim())
      newErrors.vicarName = 'Vicar name is required';
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = 'Contact number is required';
    if (!formData.totalAmount.trim())
      newErrors.totalAmount = 'Total amount is required';

    // Validate forane if field is shown
    if (showForaneField && !formData.forane.trim()) {
      newErrors.forane = 'Forane selection is required';
    }

    // Validate contact number (basic validation)
    if (
      formData.contactNumber &&
      !/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))
    ) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit && onSubmit(formData);
    }
  };

  const handleCancel = () => {
    if (!isEdit) {
      setFormData({
        churchName: '',
        place: '',
        vicarName: '',
        contactNumber: '',
        totalAmount: '',
        forane: '',
      });
      setErrors({});
    }
    onCancel && onCancel();
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full ${className}`}
      style={cardStyle}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col h-full p-3 sm:p-4 gap-3 sm:gap-4">
          {/* Form Fields */}
          <div className="p-3 sm:p-4 border-2 border-blue-400 rounded-xl overflow-hidden min-w-0 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 flex-1">
              {/* Left Column */}
              <div className="space-y-2 flex flex-col">
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Church Name*
                  </label>
                  <input
                    type="text"
                    name="churchName"
                    value={formData.churchName}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm border ${
                      errors.churchName
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-blue-400'
                    } focus:outline-none focus:bg-white transition-colors`}
                    placeholder="Enter church name"
                  />
                  {errors.churchName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.churchName}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Place*
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${
                      errors.place
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-blue-400'
                    } focus:outline-none focus:bg-white transition-colors`}
                    placeholder="Enter place"
                  />
                  {errors.place && (
                    <p className="text-red-500 text-xs mt-1">{errors.place}</p>
                  )}
                </div>

                {/* Forane Field - Optional */}
                {showForaneField && (
                  <div className="flex-shrink-0">
                    <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                      Select Forane*
                    </label>
                    <select
                      name="forane"
                      value={formData.forane}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${
                        errors.forane
                          ? 'border-red-400 bg-red-50'
                          : 'border-transparent focus:border-blue-400'
                      } focus:outline-none focus:bg-white transition-colors`}
                    >
                      <option value="">Select a forane</option>
                      {foraneOptions.map((forane, index) => (
                        <option key={index} value={forane.value || forane}>
                          {forane.label || forane}
                        </option>
                      ))}
                    </select>
                    {errors.forane && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.forane}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-2 flex flex-col">
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Vicar Name*
                  </label>
                  <input
                    type="text"
                    name="vicarName"
                    value={formData.vicarName}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${
                      errors.vicarName
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-blue-400'
                    } focus:outline-none focus:bg-white transition-colors`}
                    placeholder="Enter vicar name"
                  />
                  {errors.vicarName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.vicarName}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Contact Number*
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${
                      errors.contactNumber
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-blue-400'
                    } focus:outline-none focus:bg-white transition-colors`}
                    placeholder="Enter contact number"
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                {/* Mobile: Show Total Amount here (second-to-last) */}
                <div className="flex-shrink-0 sm:hidden">
                  <label className="text-blue-500 font-medium text-xs mb-1 block">
                    Total Amount*
                  </label>
                  <input
                    type="text"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className={`w-full bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-xs text-center ${
                      errors.totalAmount
                        ? 'border-red-400 bg-red-50'
                        : 'focus:border-green-500'
                    } focus:outline-none transition-colors`}
                    placeholder="Rs. 0"
                  />
                  {errors.totalAmount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.totalAmount}
                    </p>
                  )}
                </div>

                {/* Desktop: Show Total Amount here */}
                <div className="hidden sm:flex flex-1 items-end">
                  <div className="w-full">
                    <label className="text-blue-500 font-medium text-sm mb-1 block">
                      Total Amount*
                    </label>
                    <input
                      type="text"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleInputChange}
                      className={`w-full bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-sm text-center ${
                        errors.totalAmount
                          ? 'border-red-400 bg-red-50'
                          : 'focus:border-green-500'
                      } focus:outline-none transition-colors`}
                      placeholder="Rs. 0"
                    />
                    {errors.totalAmount && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.totalAmount}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons - Mobile */}
              <div className="sm:hidden col-span-1 flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-xs"
                >
                  {isEdit ? 'UPDATE' : 'ADD'} CHURCH
                </button>
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            <div className="hidden sm:flex gap-4 mt-4 flex-shrink-0">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
              >
                {isEdit ? 'UPDATE' : 'ADD'} CHURCH
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChurchForm;

// Example usage:
/*
import ChurchForm from '../forms/ChurchForm';

const ExampleUsage = () => {
  const foraneOptions = [
    { label: 'Mundakkayam Forane', value: 'mundakkayam' },
    { label: 'Kochi Forane', value: 'kochi' },
    { label: 'Thrissur Forane', value: 'thrissur' }
  ];

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    const apiFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        apiFormData.append('image', formData[key]);
      } else if (key !== 'image') {
        apiFormData.append(key, formData[key]);
      }
    });
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="p-6">
      <ChurchForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showForaneField={true}
        foraneOptions={foraneOptions}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
};
*/

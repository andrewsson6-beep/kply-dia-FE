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
    image: initialData.image || null,
    forane: initialData.forane || '',
    ...initialData,
  });

  const [imagePreview, setImagePreview] = useState(initialData.imageUrl || '');
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
        image: initialData.image || null,
        forane: initialData.forane || '',
      }));
      if (initialData.imageUrl) setImagePreview(initialData.imageUrl);
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

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file',
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB',
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous image errors
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: '',
        }));
      }
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
    if (!formData.image && !imagePreview)
      newErrors.image = 'Church image is required';

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
        image: null,
        forane: '',
      });
      setImagePreview('');
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
        <div className="flex flex-col sm:flex-row h-full p-3 sm:p-4 gap-3 sm:gap-4">
          {/* Image Upload Section */}
          <div className="w-full sm:w-2/5 md:w-1/3 relative flex-shrink-0">
            <div className="h-32 sm:h-48 md:h-full min-h-[120px] sm:min-h-[200px]">
              <div
                className={`w-full h-full border-2 border-dashed rounded relative overflow-hidden ${
                  errors.image
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Church preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay for re-upload */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <label className="cursor-pointer bg-white text-gray-800 px-3 py-2 rounded-md text-xs sm:text-sm font-medium shadow-lg hover:bg-gray-100 transition-colors">
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <label className="cursor-pointer text-center text-gray-500 hover:text-gray-700 transition-colors">
                      <svg
                        className="mx-auto h-8 w-8 sm:h-12 sm:w-12 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <p className="text-xs sm:text-sm font-medium">
                        Add Image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click to upload
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1 p-3 sm:p-4 border-2 border-blue-400 rounded-xl overflow-hidden min-w-0 flex flex-col">
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

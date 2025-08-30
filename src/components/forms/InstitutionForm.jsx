import React, { useState, useEffect } from 'react';

const InstitutionForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  isEdit = false,
  height = 'auto',
  width = '100%',
  className = '',
}) => {
  const [formData, setFormData] = useState({
    institutionName: initialData.institutionName || '',
    place: initialData.place || '',
    managerName: initialData.managerName || '',
    managerContact: initialData.managerContact || '',
    principalName: initialData.principalName || '',
    principalContact: initialData.principalContact || '',
    administratorName: initialData.administratorName || '',
    administratorContact: initialData.administratorContact || '',
    totalAmount: initialData.totalAmount || '',
    imageFile: null, // expect new upload; existing image shown via imagePreview
  });

  const [imagePreview, setImagePreview] = useState(
    initialData.imageUrl || null
  );
  // Update form if initialData changes in edit mode
  useEffect(() => {
    if (isEdit) {
      setFormData(prev => ({
        ...prev,
        institutionName: initialData.institutionName || '',
        place: initialData.place || '',
        managerName: initialData.managerName || '',
        managerContact: initialData.managerContact || '',
        principalName: initialData.principalName || '',
        principalContact: initialData.principalContact || '',
        administratorName: initialData.administratorName || '',
        administratorContact: initialData.administratorContact || '',
        totalAmount: initialData.totalAmount || '',
      }));
      if (initialData.imageUrl) setImagePreview(initialData.imageUrl);
    }
  }, [initialData, isEdit]);
  const [errors, setErrors] = useState({});

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          imageFile: 'Please select a valid image file',
        }));
        return;
      }

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          imageFile: 'Image size must be under 5MB',
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        imageFile: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = ev => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);

      // Clear previous image error
      if (errors.imageFile) {
        setErrors(prev => ({ ...prev, imageFile: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required text fields
    if (!formData.institutionName.trim())
      newErrors.institutionName = 'Institution name is required';
    if (!formData.place.trim()) newErrors.place = 'Place is required';
    if (!formData.managerName.trim())
      newErrors.managerName = 'Manager name is required';
    if (!formData.principalName.trim())
      newErrors.principalName = 'Principal name is required';
    if (!formData.administratorName.trim())
      newErrors.administratorName = 'Administrator name is required';
    if (!formData.managerContact.trim())
      newErrors.managerContact = 'Manager contact is required';
    if (!formData.principalContact.trim())
      newErrors.principalContact = 'Principal contact is required';
    if (!formData.administratorContact.trim())
      newErrors.administratorContact = 'Administrator contact is required';
    if (!formData.totalAmount.toString().trim())
      newErrors.totalAmount = 'Total amount is required';
    if (!formData.imageFile && !imagePreview)
      newErrors.imageFile = 'Institution image is required';

    // Phone validations (10 digits after stripping non-digits)
    const phoneFields = [
      'managerContact',
      'principalContact',
      'administratorContact',
    ];
    phoneFields.forEach(field => {
      if (
        formData[field] &&
        !/^[0-9]{10}$/.test(formData[field].replace(/\D/g, ''))
      ) {
        newErrors[field] = 'Enter a valid 10-digit number';
      }
    });

    // Amount numeric positive
    if (formData.totalAmount) {
      const num = Number(formData.totalAmount);
      if (Number.isNaN(num) || num < 0) {
        newErrors.totalAmount = 'Enter a valid non-negative number';
      }
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
      setImagePreview(null);
      setErrors({});
    }
    onCancel && onCancel();
  };

  const cardStyle = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0,
  };

  return (
    <div className={`overflow-hidden w-full ${className}`} style={cardStyle}>
      <form onSubmit={handleSubmit} className="h-full">
        <div className="flex flex-col sm:flex-row shadow-lg sm:shadow-none sm:items-center h-full p-3 sm:p-4 gap-1 sm:gap-0.5">
          {/* Image Upload Section */}
          <div className="w-full h-[14.5625rem] rounded-2xl sm:shadow-lg sm:w-2/5 md:w-1/3 relative flex-shrink-0">
            <div className="h-full p-4">
              <div
                className={`w-full h-full bg-gray-100 border-2 border-dashed rounded flex flex-col items-center justify-center relative overflow-hidden ${errors.imageFile ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              >
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
              {errors.imageFile && (
                <p className="text-red-500 text-xs mt-1">{errors.imageFile}</p>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1 rounded-2xl shadow-lg p-4 overflow-hidden min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 h-full border-2 border-blue-400 rounded-2xl p-2 bg-white bg-opacity-80">
              {/* Left Column */}
              <div className="space-y-2 flex flex-col">
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Institution Name*
                  </label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm border ${errors.institutionName ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'} focus:outline-none`}
                    placeholder="Enter institution name"
                  />
                  {errors.institutionName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.institutionName}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Manager Name*
                  </label>
                  <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${errors.managerName ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'} focus:outline-none`}
                    placeholder="Enter manager name"
                  />
                  {errors.managerName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.managerName}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Principal Name*
                  </label>
                  <input
                    type="text"
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${errors.principalName ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'} focus:outline-none`}
                    placeholder="Enter principal name"
                  />
                  {errors.principalName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.principalName}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Administrator Name*
                  </label>
                  <input
                    type="text"
                    name="administratorName"
                    value={formData.administratorName}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${errors.administratorName ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'} focus:outline-none`}
                    placeholder="Enter administrator name"
                  />
                  {errors.administratorName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.administratorName}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2 flex flex-col">
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Place*
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${errors.place ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'} focus:outline-none`}
                    placeholder="Enter place"
                  />
                  {errors.place && (
                    <p className="text-red-500 text-xs mt-1">{errors.place}</p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Manager Contact Number*
                  </label>
                  <input
                    type="tel"
                    name="managerContact"
                    value={formData.managerContact}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${errors.managerContact ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'} focus:outline-none`}
                    placeholder="Enter manager contact"
                  />
                  {errors.managerContact && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.managerContact}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Principal Contact Number*
                  </label>
                  <input
                    type="tel"
                    name="principalContact"
                    value={formData.principalContact}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${errors.principalContact ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'} focus:outline-none`}
                    placeholder="Enter principal contact"
                  />
                  {errors.principalContact && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.principalContact}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Administrator Contact Number*
                  </label>
                  <input
                    type="tel"
                    name="administratorContact"
                    value={formData.administratorContact}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${errors.administratorContact ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'} focus:outline-none`}
                    placeholder="Enter administrator contact"
                  />
                  {errors.administratorContact && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.administratorContact}
                    </p>
                  )}
                </div>

                {/* Mobile: Show Total Amount here (second-to-last) */}
                <div className="flex-shrink-0 sm:hidden">
                  <label className="text-blue-500 font-medium text-xs mb-1 block">
                    Total Amount*
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className={`w-full bg-green-100 border-2 rounded-md p-2 text-green-700 font-bold text-xs text-center ${errors.totalAmount ? 'border-red-400 bg-red-50 text-red-600' : 'border-green-400'}`}
                    placeholder="Enter amount"
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
                      type="number"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleInputChange}
                      className={`w-full bg-green-100 border-2 rounded-md p-2 text-green-700 font-bold text-sm text-center ${errors.totalAmount ? 'border-red-400 bg-red-50 text-red-600' : 'border-green-400'}`}
                      placeholder="Enter amount"
                    />
                    {errors.totalAmount && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.totalAmount}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mobile: Show submit button here (last item) */}
                <div className="flex-shrink-0 sm:hidden flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-xs"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-xs"
                  >
                    {isEdit ? 'UPDATE' : 'ADD'} INSTITUTION
                  </button>
                </div>
              </div>

              {/* Desktop: Submit button spans full width at bottom */}
              <div className="hidden sm:flex sm:col-span-2 gap-4 mt-2">
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
                  {isEdit ? 'UPDATE' : 'ADD'} INSTITUTION
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InstitutionForm;

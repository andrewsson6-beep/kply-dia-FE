import React, { useState } from 'react';

/*
  FamilyForm
  Props:
    initialData?: {
      familyName?: string;
      familyHead?: string;
      community?: string;
      contactNumber?: string;
      totalAmount?: string | number;
    }
    onSubmit?: (data) => void;
    onCancel?: () => void;
    isEdit?: boolean;           // Controls button label (UPDATE vs ADD)
    height?: string;            // Optional explicit height for outer card
    width?: string;             // Optional explicit width for outer card
    className?: string;         // Additional wrapper classes

  Behavior:
    - Prefills fields with initialData when provided (edit mode)
    - Validates required fields & basic 10-digit contact number
    - Calls onSubmit with raw formData object when valid
    - Calls onCancel when CANCEL pressed

  Notes:
    - Mirrors visual structure & responsive layout pattern from FamilyCard / ChurchForm
*/

const FamilyForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isEdit = false,
  height = 'auto',
  width = '100%',
  className = '',
  communityOptions = [], // kept for backward compat; hidden in create flow with context
  // context for create mode to lock community selection
  communityContext,
}) => {
  const [formData, setFormData] = useState({
    familyName: initialData.familyName || '',
    familyHead: initialData.familyHead || '',
    community: initialData.community || communityContext || '',
    contactNumber: initialData.contactNumber || '',
    // totalAmount removed per requirements
  });

  const [errors, setErrors] = useState({});

  const cardStyle = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0,
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.familyName.trim())
      newErrors.familyName = 'Family name is required';
    if (!formData.familyHead.trim())
      newErrors.familyHead = 'Family head is required';
    if (!isEdit && communityContext) {
      // In create mode with context, community is fixed; no validation needed
    } else if (!formData.community.trim()) {
      newErrors.community = 'Community is required';
    }
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = 'Contact number is required';
    // Total amount validation removed per requirements

    // Basic phone number validation (allow digits, spaces, dashes, parentheses but must result in 10 digits)
    if (
      formData.contactNumber &&
      !/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))
    ) {
      newErrors.contactNumber = 'Enter a valid 10-digit number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      // Ensure totalAmount is never sent in payload
      const { totalAmount: _omit, ...payload } = formData;
      onSubmit && onSubmit(payload);
    }
  };

  const handleCancel = () => {
    if (!isEdit) {
      setFormData({
        familyName: '',
        familyHead: '',
        community: '',
        contactNumber: '',
        // totalAmount removed per requirements
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
      <form onSubmit={handleSubmit} className="h-full">
        <div className="flex flex-col sm:flex-row h-full p-3 sm:p-4 gap-3 sm:gap-4">
          {/* Form Fields Container (mirrors FamilyCard layout, minus image section) */}
          <div className="flex-1 p-3 sm:p-4 border-2 border-blue-400 rounded-xl overflow-hidden min-w-0 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 flex-1">
              {/* Left Column */}
              <div className="space-y-2 flex flex-col">
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Family Name*
                  </label>
                  <input
                    type="text"
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm border ${
                      errors.familyName
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-blue-400'
                    } focus:outline-none focus:bg-white transition-colors`}
                    placeholder="Enter family name"
                  />
                  {errors.familyName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.familyName}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Family Head*
                  </label>
                  <input
                    type="text"
                    name="familyHead"
                    value={formData.familyHead}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${
                      errors.familyHead
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-blue-400'
                    } focus:outline-none focus:bg-white transition-colors`}
                    placeholder="Enter family head"
                  />
                  {errors.familyHead && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.familyHead}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2 flex flex-col">
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Community{!communityContext ? '*' : ''}
                  </label>
                  {communityContext ? (
                    <input
                      type="text"
                      readOnly
                      value={formData.community}
                      className="w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border border-transparent focus:outline-none"
                    />
                  ) : (
                    <select
                      name="community"
                      value={formData.community}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-100 rounded-md p-2 pr-8 text-gray-800 text-xs sm:text-sm border ${
                        errors.community
                          ? 'border-red-400 bg-red-50'
                          : 'border-transparent focus:border-blue-400'
                      } focus:outline-none focus:bg-white transition-colors appearance-none`}
                    >
                      <option value="">Select community</option>
                      {(() => {
                        const normalized = communityOptions.map(opt =>
                          typeof opt === 'string'
                            ? { value: opt, label: opt }
                            : {
                                value: opt.value,
                                label: opt.label || opt.value,
                              }
                        );
                        if (
                          formData.community &&
                          !normalized.some(o => o.value === formData.community)
                        ) {
                          normalized.push({
                            value: formData.community,
                            label: formData.community,
                          });
                        }
                        return normalized.map(o => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ));
                      })()}
                    </select>
                  )}
                  {errors.community && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.community}
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

                {/* Total Amount fields removed per requirements */}

                {/* Mobile Actions */}
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
                    {isEdit ? 'UPDATE' : 'ADD'} FAMILY
                  </button>
                </div>
              </div>

              {/* Desktop Actions */}
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
                  {isEdit ? 'UPDATE' : 'ADD'} FAMILY
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FamilyForm;

// Example usage:
/*
import FamilyForm from '../forms/FamilyForm';

const Example = () => {
  const handleSubmit = (data) => {
    console.log('Submitted family data:', data);
  };

  const handleCancel = () => {
    console.log('Cancelled');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <FamilyForm onSubmit={handleSubmit} onCancel={handleCancel} />
      <div className="mt-8">
        <FamilyForm
          initialData={{
            familyName: 'The Johnsons',
            familyHead: 'Michael Johnson',
            community: "St. Mary's",
            contactNumber: '1234567890',
            totalAmount: 'Rs. 50,000',
          }}
          isEdit
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};
*/

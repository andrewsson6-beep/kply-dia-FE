import React, { useState, useEffect } from 'react';

/*
  CommunityForm
  Props:
    initialData?: { id?, number?, name? }
    onSubmit?: (data) => void
    onCancel?: () => void
    isEdit?: boolean (controls labels)
    height?, width?, className? (styling overrides)

  Behavior:
    - Validates required fields (name)
    - Number is optional; if omitted parent may auto-generate
    - Controlled form mirroring structure used by IndividualForm/FamilyForm for consistency
*/

const CommunityForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isEdit = false,
  height = 'auto',
  width = '100%',
  className = '',
}) => {
  const [formData, setFormData] = useState({
    id: initialData.id,
    number: initialData.number || '',
    name: initialData.name || '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      id: initialData.id,
      number: initialData.number || '',
      name: initialData.name || '',
    });
  }, [initialData]);

  const cardStyle = {
    ...(height !== 'auto' && { height }),
    ...(width !== '100%' && { width }),
    minWidth: 0,
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Community name is required';
    if (formData.number && !/^\d+$/.test(formData.number))
      newErrors.number = 'Number must be digits only';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      onSubmit && onSubmit(formData);
    }
  };

  const handleCancel = () => {
    if (!isEdit) {
      setFormData({ number: '', name: '' });
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
          <div className="flex-1 p-3 sm:p-4 border-2 border-blue-400 rounded-xl overflow-hidden min-w-0 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 flex-1">
              {/* Left Column */}
              <div className="space-y-2 flex flex-col">
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Community Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm border ${
                      errors.number
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-blue-400'
                    } focus:outline-none focus:bg-white transition-colors`}
                    placeholder="Auto / Enter number"
                  />
                  {errors.number && (
                    <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2 flex flex-col">
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Community Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${
                      errors.name
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-blue-400'
                    } focus:outline-none focus:bg-white transition-colors`}
                    placeholder="Enter community name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

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
                    {isEdit ? 'UPDATE' : 'ADD'} COMMUNITY
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
                  {isEdit ? 'UPDATE' : 'ADD'} COMMUNITY
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommunityForm;

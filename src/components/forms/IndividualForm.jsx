import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks.js';
import {
  addIndividualThunk,
  fetchIndividualsThunk,
  updateIndividualThunk,
} from '../../store/actions/individualActions.js';
import { useToast } from '../ui/useToast.js';

/*
  IndividualForm
  Props:
    initialData?: { id?, individualName?, houseName?, place?, contactNumber? }
    onSubmit?: (data) => void
    onCancel?: () => void
    isEdit?: boolean (controls labels)
    height?, width?, className? (styling)

  Behavior:
    - Controlled local state with validation
    - Required fields: individualName, houseName, place, contactNumber
    - Phone validation: 10 digits (digits only after stripping non-digits)
*/
const IndividualForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isEdit = false,
  height = 'auto',
  width = '100%',
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(() => ({
    id: initialData?.id,
    individualName: initialData?.individualName || '',
    houseName: initialData?.houseName || '',
    place: initialData?.place || '',
    contactNumber: initialData?.contactNumber || '',
    email: initialData?.email || '',
    totalAmount: initialData?.totalAmountRaw || '',
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const initialKey = initialData ? initialData.id : null;
  useEffect(() => {
    // Only reset form when editing target changes
    if (isEdit && initialData) {
      setFormData({
        id: initialData.id,
        individualName: initialData.individualName || '',
        houseName: initialData.houseName || '',
        place: initialData.place || '',
        contactNumber: initialData.contactNumber || '',
        email: initialData.email || '',
        totalAmount: initialData.totalAmountRaw || '',
      });
    }
  }, [isEdit, initialKey, initialData]);

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
    if (!formData.individualName.trim())
      newErrors.individualName = 'Name is required';
    if (!formData.houseName.trim())
      newErrors.houseName = 'House name is required';
    if (!formData.place.trim()) newErrors.place = 'Place is required';
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = 'Contact number is required';
    if (
      formData.contactNumber &&
      !/^[0-9]{10}$/.test(formData.contactNumber.replace(/\D/g, ''))
    ) {
      newErrors.contactNumber = 'Enter a valid 10-digit number';
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!isEdit) {
      if (String(formData.totalAmount).trim() === '') {
        newErrors.totalAmount = 'Total amount is required';
      } else if (Number.isNaN(Number(formData.totalAmount))) {
        newErrors.totalAmount = 'Enter a valid number';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      if (onSubmit) {
        onSubmit(formData);
        return;
      }
      // Default behavior: call API based on mode
      setSubmitError('');
      setSubmitSuccess('');
      setSubmitting(true);
      try {
        if (isEdit) {
          const payload = {
            ind_id: formData.id,
            ind_full_name: formData.individualName.trim(),
            ind_phone_number: formData.contactNumber.trim(),
            ind_email: formData.email.trim(),
            ind_address: [formData.houseName, formData.place]
              .filter(Boolean)
              .join(', '),
          };
          const action = await dispatch(updateIndividualThunk(payload));
          if (updateIndividualThunk.fulfilled.match(action)) {
            showToast('Individual updated successfully', { type: 'success' });
            setSubmitSuccess('Individual updated successfully');
            dispatch(fetchIndividualsThunk());
          } else {
            const msg = action.payload || 'Failed to update individual';
            setSubmitError(msg);
            showToast(msg, { type: 'error' });
          }
        } else {
          const payload = {
            ind_full_name: formData.individualName.trim(),
            ind_phone_number: formData.contactNumber.trim(),
            ind_email: formData.email.trim(),
            ind_address: [formData.houseName, formData.place]
              .filter(Boolean)
              .join(', '),
            ind_total_contribution_amount: Number(formData.totalAmount),
          };
          const action = await dispatch(addIndividualThunk(payload));
          if (addIndividualThunk.fulfilled.match(action)) {
            showToast('Individual added successfully', { type: 'success' });
            setSubmitSuccess('Individual added successfully');
            dispatch(fetchIndividualsThunk());
            setFormData({
              individualName: '',
              houseName: '',
              place: '',
              contactNumber: '',
              email: '',
              totalAmount: '',
            });
          } else if (addIndividualThunk.rejected.match(action)) {
            const msg = action.payload || 'Failed to add individual';
            setSubmitError(msg);
            showToast(msg, { type: 'error' });
          }
        }
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    if (!isEdit) {
      setFormData({
        individualName: '',
        houseName: '',
        place: '',
        contactNumber: '',
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
          <div className="flex-1 p-3 sm:p-4 border-2 border-blue-400 rounded-xl overflow-hidden min-w-0 flex flex-col">
            {submitError && (
              <div className="mb-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="mb-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
                {submitSuccess}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 flex-1">
              {/* Left Column */}
              <div className="space-y-2 flex flex-col">
                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Name*
                  </label>
                  <input
                    type="text"
                    name="individualName"
                    value={formData.individualName}
                    onChange={handleChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 font-medium text-xs sm:text-sm border ${
                      errors.individualName
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-blue-400'
                    } focus:outline-none focus:bg-white transition-colors`}
                    placeholder="Enter name"
                  />
                  {errors.individualName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.individualName}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    House Name*
                  </label>
                  <input
                    type="text"
                    name="houseName"
                    value={formData.houseName}
                    onChange={handleChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${
                      errors.houseName
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-blue-400'
                    } focus:outline-none focus:bg-white transition-colors`}
                    placeholder="Enter house name"
                  />
                  {errors.houseName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.houseName}
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
                    onChange={handleChange}
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

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Contact Number*
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
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

                <div className="flex-shrink-0">
                  <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-gray-100 rounded-md p-2 text-gray-800 text-xs sm:text-sm border ${
                      errors.email
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-blue-400'
                    } focus:outline-none focus:bg-white transition-colors`}
                    placeholder="name@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {!isEdit && (
                  <div className="flex-shrink-0">
                    <label className="text-blue-500 font-medium text-xs sm:text-sm mb-1 block">
                      Total Amount*
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      className={`w-full bg-green-100 border-2 border-green-400 rounded-md p-2 text-green-700 font-bold text-xs text-center ${
                        errors.totalAmount
                          ? 'border-red-400 bg-red-50 text-red-700'
                          : 'focus:border-green-500'
                      } focus:outline-none transition-colors`}
                      placeholder="0.00"
                    />
                    {errors.totalAmount && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.totalAmount}
                      </p>
                    )}
                  </div>
                )}

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
                    {submitting
                      ? 'SUBMITTING...'
                      : `${isEdit ? 'UPDATE' : 'ADD'} INDIVIDUAL`}
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
                  {submitting
                    ? 'SUBMITTING...'
                    : `${isEdit ? 'UPDATE' : 'ADD'} INDIVIDUAL`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IndividualForm;

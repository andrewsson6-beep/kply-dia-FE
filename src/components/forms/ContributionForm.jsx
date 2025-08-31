import React, { useState } from 'react';

/*
  ContributionForm
  Props:
    onSubmit: (data) => void          // Called with { amount: number, notes: string, year: number }
    onCancel: () => void              // Called when user cancels
    initialData?: { amount?: number|string, notes?: string, year?: number|string }
    familyId?: string | number        // Optional context (not used internally except echoing back)
    isEdit?: boolean                  // Controls button label

  Behavior:
  - Validates amount > 0 & year (4-digit, within acceptable range)
    - Notes optional
    - Resets on non-edit cancel
*/

const ContributionForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  familyId,
  isEdit = false,
}) => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    amount: initialData.amount || '',
    notes: initialData.notes || '',
    year: initialData.year || currentYear,
  });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (formData.amount === '' || isNaN(Number(formData.amount))) {
      newErrors.amount = 'Amount is required';
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    // Year validation: 4 digits and reasonable range
    const yrNum = Number(formData.year);
    if (!formData.year || isNaN(yrNum)) {
      newErrors.year = 'Year is required';
    } else if (!/^\d{4}$/.test(String(formData.year))) {
      newErrors.year = 'Enter 4-digit year';
    } else if (yrNum < 1900 || yrNum > currentYear + 1) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit &&
      onSubmit({
        familyId,
        amount: Number(formData.amount),
        notes: formData.notes.trim(),
        year: Number(formData.year),
      });
  };

  const handleCancel = () => {
    if (!isEdit) {
      setFormData({ amount: '', notes: '', year: currentYear });
      setErrors({});
    }
    onCancel && onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount*
            <input
              type="number"
              name="amount"
              min={0}
              value={formData.amount}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 ${
                errors.amount ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter amount"
              required
            />
          </label>
          {errors.amount && (
            <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Year*
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 ${
                errors.year ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              placeholder={currentYear.toString()}
              required
            />
          </label>
          {errors.year && (
            <p className="text-xs text-red-500 mt-1">{errors.year}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Notes
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 resize-y"
              placeholder="Optional notes / purpose"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={
            !formData.amount || Number(formData.amount) <= 0 || errors.year
          }
        >
          {isEdit ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default ContributionForm;

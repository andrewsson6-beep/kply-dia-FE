import React, { useState } from 'react';

/*
  ContributionForm
  Props:
    onSubmit: (data) => void          // Called with { amount: number, notes: string, date: string(YYYY-MM-DD) }
    onCancel: () => void              // Called when user cancels
    initialData?: { amount?: number|string, notes?: string, date?: string }
    familyId?: string | number        // Optional context (not used internally except echoing back)
    isEdit?: boolean                  // Controls button label

  Behavior:
  - Validates amount > 0 & date provided (YYYY-MM-DD)
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
  const todayInput = () => {
    const d = new Date();
    const pad = n => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const [formData, setFormData] = useState({
    amount: initialData.amount || '',
    notes: initialData.notes || '',
    date: initialData.date || todayInput(),
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
    // Date validation: require YYYY-MM-DD
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(String(formData.date))) {
      newErrors.date = 'Invalid date';
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
        date: formData.date,
      });
  };

  const handleCancel = () => {
    if (!isEdit) {
      setFormData({ amount: '', notes: '', date: todayInput() });
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
            Date*
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 ${
                errors.date ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
          </label>
          {errors.date && (
            <p className="text-xs text-red-500 mt-1">{errors.date}</p>
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
            !formData.amount || Number(formData.amount) <= 0 || errors.date
          }
        >
          {isEdit ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default ContributionForm;

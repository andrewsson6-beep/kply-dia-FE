import React, { useState } from 'react';

/*
  InstitutionForm
  Props:
    initialData?: Institution object
    isEdit?: boolean
    onSubmit: (data) => void
    onCancel: () => void
*/

const empty = {
  institutionName: '',
  place: '',
  managerName: '',
  managerContact: '',
  principalName: '',
  principalContact: '',
  administratorName: '',
  administratorContact: '',
  totalAmount: '',
};

const InstitutionForm = ({
  initialData,
  isEdit = false,
  onSubmit = () => {}, // safe no-op defaults to avoid runtime errors if omitted
  onCancel = () => {},
}) => {
  const [form, setForm] = useState(initialData || empty);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.institutionName.trim()) e.institutionName = 'Required';
    if (!form.place.trim()) e.place = 'Required';
    if (!form.managerName.trim()) e.managerName = 'Required';
    if (!/^\d{7,15}$/.test(form.managerContact))
      e.managerContact = '7-15 digits';
    if (!form.principalName.trim()) e.principalName = 'Required';
    if (!/^\d{7,15}$/.test(form.principalContact))
      e.principalContact = '7-15 digits';
    if (!form.administratorName.trim()) e.administratorName = 'Required';
    if (!/^\d{7,15}$/.test(form.administratorContact))
      e.administratorContact = '7-15 digits';
    if (!form.totalAmount.toString().trim()) e.totalAmount = 'Required';
    return e;
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(er => ({ ...er, [field]: undefined }));
  };

  // Image upload removed as it's no longer required

  const handleSubmit = e => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    setSubmitting(true);
    try {
      if (typeof onSubmit === 'function') {
        onSubmit({
          ...form,
          id: initialData?.id,
        });
      } else {
        console.warn('InstitutionForm: onSubmit prop is not a function');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = base =>
    `w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm ${base}`;

  const label =
    'text-xs font-medium text-gray-700 flex items-center justify-between';
  const errCls = 'text-[10px] text-red-500 ml-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>
            <span>Institution Name</span>
            {errors.institutionName && (
              <span className={errCls}>{errors.institutionName}</span>
            )}
          </label>
          <input
            value={form.institutionName}
            onChange={e => handleChange('institutionName', e.target.value)}
            className={inputCls('')}
            placeholder="Institution Name"
          />
        </div>
        <div>
          <label className={label}>
            <span>Place</span>
            {errors.place && <span className={errCls}>{errors.place}</span>}
          </label>
          <input
            value={form.place}
            onChange={e => handleChange('place', e.target.value)}
            className={inputCls('')}
            placeholder="Place"
          />
        </div>
        <div>
          <label className={label}>
            <span>Manager Name</span>
            {errors.managerName && (
              <span className={errCls}>{errors.managerName}</span>
            )}
          </label>
          <input
            value={form.managerName}
            onChange={e => handleChange('managerName', e.target.value)}
            className={inputCls('')}
            placeholder="Manager Name"
          />
        </div>
        <div>
          <label className={label}>
            <span>Manager Contact</span>
            {errors.managerContact && (
              <span className={errCls}>{errors.managerContact}</span>
            )}
          </label>
          <input
            value={form.managerContact}
            onChange={e => handleChange('managerContact', e.target.value)}
            className={inputCls('')}
            placeholder="Digits only"
          />
        </div>
        <div>
          <label className={label}>
            <span>Principal Name</span>
            {errors.principalName && (
              <span className={errCls}>{errors.principalName}</span>
            )}
          </label>
          <input
            value={form.principalName}
            onChange={e => handleChange('principalName', e.target.value)}
            className={inputCls('')}
            placeholder="Principal Name"
          />
        </div>
        <div>
          <label className={label}>
            <span>Principal Contact</span>
            {errors.principalContact && (
              <span className={errCls}>{errors.principalContact}</span>
            )}
          </label>
          <input
            value={form.principalContact}
            onChange={e => handleChange('principalContact', e.target.value)}
            className={inputCls('')}
            placeholder="Digits only"
          />
        </div>
        <div>
          <label className={label}>
            <span>Administrator Name</span>
            {errors.administratorName && (
              <span className={errCls}>{errors.administratorName}</span>
            )}
          </label>
          <input
            value={form.administratorName}
            onChange={e => handleChange('administratorName', e.target.value)}
            className={inputCls('')}
            placeholder="Administrator Name"
          />
        </div>
        <div>
          <label className={label}>
            <span>Administrator Contact</span>
            {errors.administratorContact && (
              <span className={errCls}>{errors.administratorContact}</span>
            )}
          </label>
          <input
            value={form.administratorContact}
            onChange={e => handleChange('administratorContact', e.target.value)}
            className={inputCls('')}
            placeholder="Digits only"
          />
        </div>
        <div>
          <label className={label}>
            <span>Total Amount</span>
            {errors.totalAmount && (
              <span className={errCls}>{errors.totalAmount}</span>
            )}
          </label>
          <input
            value={form.totalAmount}
            onChange={e => handleChange('totalAmount', e.target.value)}
            className={inputCls('')}
            placeholder="Eg: Rs. 10,000"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md text-sm shadow cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default InstitutionForm;

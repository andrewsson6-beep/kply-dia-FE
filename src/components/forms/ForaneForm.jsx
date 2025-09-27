import React, { useMemo, useState } from 'react';

// Utility to generate forane code from name and location
const generateForaneCode = (name, location) => {
  const slug = s =>
    (s || '')
      .toString()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, '-')
      .toUpperCase();
  const n = slug(name);
  const l = slug(location);
  if (!n && !l) return '';
  return `${l ? l : 'FORANE'}-${n ? n : '0001'}`;
};

const ForaneForm = ({ onSubmit, onCancel, className = '' }) => {
  const [form, setForm] = useState({
    for_name: '',
    for_location: '',
    for_vicar_name: '',
    for_contact_number: '',
  });
  const [errors, setErrors] = useState({});
  const for_code = useMemo(
    () => generateForaneCode(form.for_name, form.for_location),
    [form.for_name, form.for_location]
  );

  const onChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.for_name.trim()) e.for_name = 'Name is required';
    if (!form.for_location.trim()) e.for_location = 'Location is required';
    if (!form.for_vicar_name.trim())
      e.for_vicar_name = 'Vicar name is required';
    if (!form.for_contact_number.trim())
      e.for_contact_number = 'Contact is required';
    if (!for_code) e.for_code = 'Code cannot be empty';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = e => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      for_code,
      for_name: form.for_name.trim(),
      for_location: form.for_location.trim(),
      for_vicar_name: form.for_vicar_name.trim(),
      for_contact_number: form.for_contact_number.trim(),
    };
    onSubmit && onSubmit(payload);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full ${className}`}
    >
      <form onSubmit={submit} className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              Forane Name*
            </label>
            <input
              name="for_name"
              value={form.for_name}
              onChange={onChange}
              className={`w-full rounded-md border p-2 text-sm ${errors.for_name ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-blue-400'}`}
              placeholder="St. Peter's Forane Church"
            />
            {errors.for_name && (
              <p className="text-xs text-red-600 mt-1">{errors.for_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              Location*
            </label>
            <input
              name="for_location"
              value={form.for_location}
              onChange={onChange}
              className={`w-full rounded-md border p-2 text-sm ${errors.for_location ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-blue-400'}`}
              placeholder="Mundakayam"
            />
            {errors.for_location && (
              <p className="text-xs text-red-600 mt-1">{errors.for_location}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              Vicar Name*
            </label>
            <input
              name="for_vicar_name"
              value={form.for_vicar_name}
              onChange={onChange}
              className={`w-full rounded-md border p-2 text-sm ${errors.for_vicar_name ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-blue-400'}`}
              placeholder="Rev. John Mathew"
            />
            {errors.for_vicar_name && (
              <p className="text-xs text-red-600 mt-1">
                {errors.for_vicar_name}
              </p>
            )}
          </div>
          {/* Total Contribution Amount field removed per requirements */}
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              Contact Number*
            </label>
            <input
              name="for_contact_number"
              value={form.for_contact_number}
              onChange={onChange}
              className={`w-full rounded-md border p-2 text-sm ${errors.for_contact_number ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-blue-400'}`}
              placeholder="+91-9876543210"
            />
            {errors.for_contact_number && (
              <p className="text-xs text-red-600 mt-1">
                {errors.for_contact_number}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              Forane Code (auto)
            </label>
            <input
              value={for_code}
              readOnly
              className="w-full rounded-md border p-2 text-sm bg-gray-100 border-gray-300"
            />
            {errors.for_code && (
              <p className="text-xs text-red-600 mt-1">{errors.for_code}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-500 text-white text-sm hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Add Forane
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForaneForm;

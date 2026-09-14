import React, { useEffect, useRef, useState } from 'react';

const YearPicker = ({ selectedYear = null, onChange, loading = false }) => {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState(false);
  const [customYear, setCustomYear] = useState(selectedYear || '');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = event => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    setCustomYear(selectedYear || '');
  }, [selectedYear]);

  const handleCustomYearChange = event => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 4);
    setCustomYear(value);
    if (value.length === 4 && !loading) onChange?.(Number(value));
  };

  const selectYear = year => {
    setCustomYear(year || '');
    if (loading) return;
    onChange?.(year);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <label htmlFor="year-picker-button" className="text-xs font-semibold text-gray-600">
          Year
        </label>
        <button
          id="year-picker-button"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-busy={loading}
          disabled={loading}
          onClick={() => setOpen(value => !value)}
          className={`inline-flex min-w-[112px] items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedYear ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
        >
          <span>{selectedYear || 'All years'}</span>
          {loading ? (
            <span
              aria-label="Loading"
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"
            />
          ) : (
            <span aria-hidden="true" className="text-xs">&#9662;</span>
          )}
        </button>
      </div>

      {open && (
        <div
          role="listbox"
          aria-label="Filter by year"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg"
        >
          <button
            type="button"
            role="option"
            aria-selected={!selectedYear}
              onClick={() => selectYear(null)}
              disabled={loading}
            className="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
          >
            All years
          </button>
          <div className="my-1 border-t border-gray-100" />
          <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Select year
          </p>
          {[currentYear - 1, currentYear, currentYear + 1].map(year => (
            <button
              key={year}
              type="button"
              role="option"
              aria-selected={selectedYear === year}
              onClick={() => selectYear(year)}
              disabled={loading}
              className="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
            >
              {year}
            </button>
          ))}
          <div className="my-1 border-t border-gray-100" />
          <label className="block px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Another year
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="YYYY"
              value={customYear}
              onChange={handleCustomYearChange}
              disabled={loading}
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default YearPicker;
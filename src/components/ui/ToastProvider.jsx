import React, { useCallback, useMemo, useState } from 'react';
import { ToastContext } from './toastContext.js';

let idSeq = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, { type = 'info', duration = 3000 } = {}) => {
      const id = idSeq++;
      setToasts(prev => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => remove(id), duration);
      }
      return id;
    },
    [remove]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toasts container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={[
              'min-w-[240px] max-w-[360px] px-4 py-3 rounded-md shadow-lg border text-sm text-white flex items-start gap-2',
              t.type === 'success' && 'bg-green-600 border-green-700',
              t.type === 'error' && 'bg-red-600 border-red-700',
              t.type === 'info' && 'bg-blue-600 border-blue-700',
              t.type === 'warning' && 'bg-yellow-600 border-yellow-700',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="flex-1">{t.message}</span>
            <button
              aria-label="Close"
              className="ml-2 text-white/80 hover:text-white"
              onClick={() => remove(t.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

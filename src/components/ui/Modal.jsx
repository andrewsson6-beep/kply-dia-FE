import React, { useEffect } from 'react';

/*
  Reusable Modal Component
  Props:
    isOpen: boolean
    onClose: () => void
    title?: string | ReactNode
    children: ReactNode (modal body)
    footer?: ReactNode (custom footer; if omitted caller handles actions inside children)
    size?: 'sm' | 'md' | 'lg' | 'xl' (ignored for side variant width handling)
    closeOnBackdrop?: boolean (default true)
    variant?: 'center' | 'side'  (side = right drawer full height)
    contentPointer?: boolean (adds cursor-pointer to body area)
*/

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  variant = 'center',
  contentPointer = false,
}) => {
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
      // trigger animation frame for side variant
      requestAnimationFrame(() => setMounted(true));
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
      setMounted(false);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const centered = variant === 'center';
  return (
    <div
      className={`fixed inset-0 z-50 flex ${centered ? 'items-start sm:items-center justify-center px-2 py-6' : 'items-stretch justify-end'} bg-black/30 backdrop-blur-xs`}
      aria-modal="true"
      role="dialog"
    >
      {/* Panel */}
      <div
        className={[
          centered
            ? `relative z-10 w-full ${sizeClasses[size]} mx-auto max-h-full bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col`
            : `relative z-10 h-full w-full sm:w-[420px] md:w-[520px] bg-white shadow-xl border-l border-gray-200 flex flex-col transform transition-transform duration-300 ease-out ${mounted ? 'translate-x-0' : 'translate-x-full'}`,
        ].join(' ')}
      >
        <div
          className={`flex items-start justify-between ${centered ? 'rounded-t-2xl' : ''} px-4 sm:px-6 py-3 border-b border-gray-200`}
        >
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 pr-4 truncate">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors duration-150"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          className={`px-4 sm:px-6 py-4 overflow-y-auto flex-1 ${contentPointer ? 'cursor-pointer' : ''}`}
        >
          {children}
        </div>
        {footer && (
          <div
            className={`px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50 ${centered ? 'rounded-b-2xl' : ''} flex flex-col sm:flex-row gap-2 sm:gap-3`}
          >
            {footer}
          </div>
        )}
      </div>
      {/* Backdrop (click area) */}
      {closeOnBackdrop && (
        <button
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 w-full h-full cursor-default z-0"
          onClick={e => {
            if (e.target === e.currentTarget) onClose();
          }}
        />
      )}
    </div>
  );
};

export default Modal;

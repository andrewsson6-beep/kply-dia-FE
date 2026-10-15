import React from 'react';
import Modal from './Modal';

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  message,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={() => !isDeleting && onClose()}
    title="Confirm Delete"
    size="sm"
    variant="center"
    closeOnBackdrop={!isDeleting}
  >
    <p className="text-sm text-gray-700 mb-4">{message}</p>
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        type="button"
        onClick={onClose}
        disabled={isDeleting}
        className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md text-sm"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isDeleting}
        className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md text-sm"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  </Modal>
);

export default DeleteConfirmModal;

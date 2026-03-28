import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#0a1911] rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-gray-200 dark:border-[#1f4d3a] animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-gray-900 dark:text-green-400 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f4d3a] rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

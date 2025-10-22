import React from "react";

export default function BasicModal2({ open, handleClose, onConfirm}) {
  if (!open) return null;
  const handleMoveToTrash = () => {
    onConfirm();
    handleClose();
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="pt-8 px-8 pb-6">
          <h2 className="text-2xl font-normal leading-7 text-gray-900 mb-2">
            Delete from contacts?
          </h2>
          <p className="text-sm leading-5 text-gray-600 font-normal">
            This contact will be permanently deleted from this account after 30 days.
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button
            onClick={handleClose}
            className="text-blue-600 text-sm font-medium px-6 py-2 rounded hover:bg-blue-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleMoveToTrash}
            className="text-blue-600 text-sm font-medium px-6 py-2 rounded hover:bg-blue-50 transition-colors"
          >
            Move to trash
          </button>
        </div>
      </div>
    </div>
  );
}
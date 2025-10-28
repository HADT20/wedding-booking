const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 px-5 py-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold active:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-700 text-white py-3 rounded-xl font-semibold active:bg-green-800 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;


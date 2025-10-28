import { useState } from 'react';

const BookingForm = ({ booking, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(() => {
    if (booking) {
      const date = new Date(booking.shootingDateTime);
      return {
        customerName: booking.customerName,
        phone: booking.phone,
        address: booking.address,
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5),
        price: booking.price?.toString() || '',
        deposit: booking.deposit?.toString() || '',
        notes: booking.notes || '',
        isFullyPaid: booking.isFullyPaid || false
      };
    }
    return {
      customerName: '',
      phone: '',
      address: '',
      date: '',
      time: '',
      price: '',
      deposit: '',
      notes: '',
      isFullyPaid: false
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const shootingDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
    
    const bookingData = {
      customerName: formData.customerName,
      phone: formData.phone,
      address: formData.address,
      shootingDateTime,
      price: parseFloat(formData.price) || 0,
      deposit: parseFloat(formData.deposit) || 0,
      notes: formData.notes,
      isFullyPaid: formData.isFullyPaid
    };

    onSubmit(bookingData);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 px-4 py-5 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold">{booking ? 'Sửa lịch hẹn' : 'Thêm lịch hẹn mới'}</h2>
            <p className="text-sm text-green-100">
              {booking ? 'Cập nhật thông tin khách hàng' : 'Điền thông tin khách hàng'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên khách hàng *
          </label>
          <input
            type="text"
            required
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Nhập tên khách hàng"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa điểm chụp *
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Nhập địa điểm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày chụp *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giờ chụp *
            </label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá dịch vụ (VNĐ)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đã cọc (VNĐ)
            </label>
            <input
              type="number"
              value={formData.deposit}
              onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFullyPaid}
              onChange={(e) => setFormData({ ...formData, isFullyPaid: e.target.checked })}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">Đã thanh toán đủ</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ghi chú
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows="3"
            placeholder="Nhập ghi chú (nếu có)"
          />
        </div>

        <div className="flex gap-3 pt-4 pb-20">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold active:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex-1 bg-green-700 text-white py-3 rounded-lg font-semibold active:bg-green-800 transition-colors"
          >
            {booking ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;


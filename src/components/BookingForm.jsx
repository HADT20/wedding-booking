import { useState } from 'react';
import { SAFE_AREA_PADDING } from '../utils/constants';
import { useDisplaySize } from '../contexts/DisplaySizeContext';
import { getSizeClasses } from '../utils/displaySizeClasses';
import { getVietnamDate, toVietnamDate } from '../utils/dateUtils';

const BookingForm = ({ booking, onSubmit, onCancel }) => {
  const { displaySize } = useDisplaySize();
  const size = getSizeClasses(displaySize);
  const [formData, setFormData] = useState(() => {
    if (booking) {
      const date = toVietnamDate(booking.shootingDateTime);
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
    // Nếu là booking mới, điền sẵn ngày giờ hiện tại (giờ Việt Nam)
    const now = getVietnamDate();
    return {
      customerName: '',
      phone: '',
      address: '',
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
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
      {/* Header - Modern Design */}
      <div className="px-3 pt-safe" style={SAFE_AREA_PADDING}>
        <div className={`bg-gradient-to-r from-green-600 to-green-500 ${size.headerRounded} text-white shadow-lg mt-2 relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          <div className={`relative ${size.headerPadding} flex items-center ${size.gap}`}>
            <button
              onClick={onCancel}
              className={`${size.avatarSM} hover:bg-white/20 ${size.buttonRounded} transition-all active:scale-95 flex items-center justify-center`}
            >
              <svg className={size.iconBase} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h2 className={`${size.headerTitle} font-bold`}>{booking ? 'Sửa lịch hẹn' : 'Thêm lịch hẹn mới'}</h2>
              <p className={`${size.headerSubtitle} text-green-50`}>
                {booking ? 'Cập nhật thông tin khách hàng' : 'Điền thông tin khách hàng'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form - Modern Card Design */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {/* Tên khách hàng */}
        <div>
          <label className={`block ${size.textSM} font-semibold text-gray-700 mb-2`}>
            Tên khách hàng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className={`w-full ${size.inputPadding} bg-white border-2 border-gray-200 ${size.inputRounded} ${size.textBase} focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none`}
            placeholder="Nhập tên khách hàng"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className={`block ${size.textSM} font-semibold text-gray-700 mb-2`}>
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full ${size.inputPadding} bg-white border-2 border-gray-200 ${size.inputRounded} ${size.textBase} focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none`}
            placeholder="Nhập số điện thoại"
          />
        </div>

        {/* Địa điểm chụp */}
        <div>
          <label className={`block ${size.textSM} font-semibold text-gray-700 mb-2`}>
            Địa điểm chụp <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`w-full ${size.inputPadding} bg-white border-2 border-gray-200 ${size.inputRounded} ${size.textBase} focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none`}
            placeholder="Nhập địa điểm"
          />
        </div>

        {/* Ghi chú */}
        <div>
          <label className={`block ${size.textSM} font-semibold text-gray-700 mb-2`}>
            Ghi chú
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className={`w-full ${size.inputPadding} bg-white border-2 border-gray-200 ${size.inputRounded} ${size.textBase} focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none resize-none`}
            rows="3"
            placeholder="Nhập ghi chú (nếu có)"
          />
        </div>

        {/* Ngày và Giờ chụp */}
        <div className={`grid grid-cols-2 ${size.gap}`}>
          <div>
            <label className={`block ${size.textSM} font-semibold text-gray-700 mb-2`}>
              Ngày chụp <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full ${size.inputPadding} bg-white border-2 border-gray-200 ${size.inputRounded} ${size.textBase} focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none`}
            />
          </div>

          <div>
            <label className={`block ${size.textSM} font-semibold text-gray-700 mb-2`}>
              Giờ chụp <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className={`w-full ${size.inputPadding} bg-white border-2 border-gray-200 ${size.inputRounded} ${size.textBase} focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none`}
            />
          </div>
        </div>

        {/* Giá dịch vụ và Đã cọc */}
        <div className={`grid grid-cols-2 ${size.gap}`}>
          <div>
            <label className={`block ${size.textSM} font-semibold text-gray-700 mb-2`}>
              Giá dịch vụ (VNĐ)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`w-full ${size.inputPadding} bg-white border-2 border-gray-200 ${size.inputRounded} ${size.textBase} focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none`}
              placeholder="0"
            />
          </div>

          <div>
            <label className={`block ${size.textSM} font-semibold text-gray-700 mb-2`}>
              Đã cọc (VNĐ)
            </label>
            <input
              type="number"
              value={formData.deposit}
              onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              className={`w-full ${size.inputPadding} bg-white border-2 border-gray-200 ${size.inputRounded} ${size.textBase} focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none`}
              placeholder="0"
            />
          </div>
        </div>

        {/* Checkbox Đã thanh toán đủ */}
        <div className={`bg-white border-2 border-gray-200 ${size.cardRounded} ${size.cardPadding}`}>
          <label className={`flex items-center ${size.gap} cursor-pointer`}>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={formData.isFullyPaid}
                onChange={(e) => setFormData({ ...formData, isFullyPaid: e.target.checked })}
                className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
              />
            </div>
            <span className={`${size.textBase} font-semibold text-gray-700`}>Đã thanh toán đủ</span>
          </label>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className={`sticky bottom-0 left-0 right-0 bg-gray-50 pt-4 pb-6 -mx-3 px-3 border-t border-gray-200`}>
          <div className={`flex ${size.gap}`}>
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 bg-white border-2 border-gray-300 text-gray-700 ${size.buttonPadding} ${size.buttonRounded} ${size.buttonText} font-bold hover:bg-gray-50 active:bg-gray-100 transition-all shadow-sm`}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white ${size.buttonPadding} ${size.buttonRounded} ${size.buttonText} font-bold hover:from-green-700 hover:to-green-600 active:scale-95 transition-all shadow-md`}
            >
              {booking ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;


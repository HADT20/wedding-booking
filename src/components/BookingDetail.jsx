import { useState } from 'react';
import { formatDateTimeWithLunar } from '../utils/dateUtils';
import ConfirmDialog from './ConfirmDialog';

const BookingDetail = ({ booking, onBack, onEdit, onDelete, onComplete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  if (!booking) return null;

  const handleEdit = () => {
    onEdit(booking);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(booking.id);
    setShowDeleteConfirm(false);
    onBack();
  };

  const handleComplete = () => {
    setShowCompleteConfirm(true);
  };

  const confirmComplete = () => {
    onComplete(booking.id);
    setShowCompleteConfirm(false);
    onBack();
  };

  // Tính toán
  const price = booking.price || 0;
  const deposit = booking.deposit || 0;
  const remaining = price - deposit;
  const depositPercent = price > 0 ? Math.round((deposit / price) * 100) : 0;

  // Kiểm tra trạng thái
  const bookingDate = new Date(booking.shootingDateTime);
  const now = new Date();
  const isPast = bookingDate < now;
  const daysUntil = Math.ceil((bookingDate - now) / (1000 * 60 * 60 * 24));

  const getStatusBadge = () => {
    if (isPast) {
      return (
        <div className="w-full bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl px-4 py-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <div className="text-sm font-bold text-white">Đã hoàn thành</div>
                <div className="text-xs text-white/80">Lịch hẹn đã kết thúc</div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (daysUntil <= 7) {
      return (
        <div className="w-full bg-gradient-to-r from-red-600 to-red-500 rounded-xl px-4 py-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-sm font-bold text-white">Gấp - Sắp đến hạn</div>
                <div className="text-xs text-white/80">Cần chuẩn bị ngay</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{daysUntil}</div>
              <div className="text-xs text-white/80">ngày nữa</div>
            </div>
          </div>
        </div>
      );
    } else if (daysUntil <= 30) {
      return (
        <div className="w-full bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl px-4 py-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <div className="text-sm font-bold text-white">Sắp đến</div>
                <div className="text-xs text-white/80">Chuẩn bị trước</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{daysUntil}</div>
              <div className="text-xs text-white/80">ngày nữa</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl px-4 py-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <div className="text-sm font-bold text-white">Còn xa</div>
                <div className="text-xs text-white/80">Chưa cần vội</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{daysUntil}</div>
              <div className="text-xs text-white/80">ngày nữa</div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 text-white px-4 py-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-white/20 rounded-lg active:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Chi tiết lịch hẹn</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Customer Name Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-2xl font-bold text-gray-900">{booking.customerName}</h2>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-4 space-y-4">
            {/* Phone */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Số điện thoại</div>
              <a href={`tel:${booking.phone}`} className="text-base font-semibold text-blue-600">
                {booking.phone}
              </a>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* Date Time */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Ngày giờ chụp</div>
              <div className="text-base font-semibold text-gray-900">
                {formatDateTimeWithLunar(booking.shootingDateTime)}
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* Address */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Địa chỉ chụp</div>
              <div className="text-base text-gray-900">{booking.address}</div>
            </div>

            <div className="h-px bg-gray-200 my-1"></div>

            {/* Payment */}
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Giá thành</span>
                <span className="text-lg font-bold text-gray-900">
                  {price.toLocaleString('vi-VN')}đ
                </span>
              </div>

              {/* Hiển thị chi tiết thanh toán hoặc badge đã thanh toán đủ */}
              {booking.isFullyPaid ? (
                <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl px-4 py-3 flex items-center justify-center gap-2 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-base font-bold text-white">Đã thanh toán đủ</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Đã cọc</span>
                    <span className="text-lg font-bold text-blue-600">
                      {deposit.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {price > 0 && (
                    <div className="pt-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Đã thanh toán</span>
                        <span className="font-semibold">{depositPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${depositPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-gray-200"></div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-base font-semibold text-gray-900">Còn lại</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {remaining.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Status Bar - Dưới thanh toán */}
            <div className="mt-4">
              {getStatusBadge()}
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ghi chú</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pb-20">
          <button
            onClick={handleEdit}
            className="flex-1 bg-green-700 text-white py-3.5 rounded-xl font-semibold active:bg-green-800 transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-sm">Sửa</span>
          </button>
          {!booking.isCompleted && (
            <button
              onClick={handleComplete}
              className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-semibold active:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Hoàn thành</span>
            </button>
          )}
          <button
            onClick={handleDelete}
            className="flex-1 bg-white text-red-600 py-3.5 rounded-xl font-semibold border-2 border-red-600 active:bg-red-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-sm">Xóa</span>
          </button>
        </div>
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Xác nhận xóa"
        message="Bạn có chắc muốn xóa lịch hẹn này?"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showCompleteConfirm}
        title="Xác nhận hoàn thành"
        message="Đánh dấu lịch hẹn này là đã hoàn thành?"
        onConfirm={confirmComplete}
        onCancel={() => setShowCompleteConfirm(false)}
      />
    </div>
  );
};

export default BookingDetail;


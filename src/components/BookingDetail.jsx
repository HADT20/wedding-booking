import { useState } from 'react';
import { formatDateTimeWithLunar } from '../utils/dateUtils';
import { SAFE_AREA_PADDING } from '../utils/constants';
import { useDisplaySize } from '../contexts/DisplaySizeContext';
import { getSizeClasses } from '../utils/displaySizeClasses';
import ConfirmDialog from './ConfirmDialog';

const BookingDetail = ({ booking, onBack, onEdit, onDelete, onComplete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const { displaySize } = useDisplaySize();
  const size = getSizeClasses(displaySize);
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
        <div className={`w-full bg-gradient-to-r from-gray-600 to-gray-500 ${size.cardRounded} ${size.cardPadding.includes('p-4') ? 'px-2.5 py-2' : 'px-2 py-1.5'} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${size.gapSM}`}>
              <div className={`${size.avatarSM} bg-white/20 rounded-full flex items-center justify-center`}>
                <svg className={`${size.iconBase} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className={`${size.textSM} font-bold text-white`}>Đã hoàn thành</div>
                <div className={`${size.textXS} text-white/90`}>Lịch hẹn đã kết thúc</div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (daysUntil <= 7) {
      return (
        <div className={`w-full bg-gradient-to-r from-orange-600 to-orange-500 ${size.cardRounded} ${size.cardPadding.includes('p-4') ? 'px-2.5 py-2' : 'px-2 py-1.5'} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${size.gapSM}`}>
              <div className={`${size.avatarSM} bg-white/20 rounded-full flex items-center justify-center`}>
                <svg className={`${size.iconBase} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className={`${size.textSM} font-bold text-white`}>Sắp đến</div>
                <div className={`${size.textXS} text-white/90`}>Chuẩn bị trước</div>
              </div>
            </div>
            <div className={`text-right bg-white/20 ${size.buttonRounded} ${size.cardPadding.includes('p-4') ? 'px-2 py-1' : 'px-1.5 py-0.5'}`}>
              <div className={`${size.textBase} font-bold text-white leading-none`}>{daysUntil}</div>
              <div className={`${size.textXS} text-white/90 font-medium`}>ngày nữa</div>
            </div>
          </div>
        </div>
      );
    } else if (daysUntil <= 30) {
      return (
        <div className={`w-full bg-gradient-to-r from-orange-600 to-orange-500 ${size.cardRounded} ${size.cardPadding.includes('p-4') ? 'px-2.5 py-2' : 'px-2 py-1.5'} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${size.gapSM}`}>
              <div className={`${size.avatarSM} bg-white/20 rounded-full flex items-center justify-center`}>
                <svg className={`${size.iconBase} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className={`${size.textSM} font-bold text-white`}>Sắp đến</div>
                <div className={`${size.textXS} text-white/90`}>Chuẩn bị trước</div>
              </div>
            </div>
            <div className={`text-right bg-white/20 ${size.buttonRounded} ${size.cardPadding.includes('p-4') ? 'px-2 py-1' : 'px-1.5 py-0.5'}`}>
              <div className={`${size.textBase} font-bold text-white leading-none`}>{daysUntil}</div>
              <div className={`${size.textXS} text-white/90 font-medium`}>ngày nữa</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 ${size.cardRounded} ${size.cardPadding.includes('p-4') ? 'px-2.5 py-2' : 'px-2 py-1.5'} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${size.gapSM}`}>
              <div className={`${size.avatarSM} bg-white/20 rounded-full flex items-center justify-center`}>
                <svg className={`${size.iconBase} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className={`${size.textSM} font-bold text-white`}>Còn xa</div>
                <div className={`${size.textXS} text-white/90`}>Chưa cần vội</div>
              </div>
            </div>
            <div className={`text-right bg-white/20 ${size.buttonRounded} ${size.cardPadding.includes('p-4') ? 'px-2 py-1' : 'px-1.5 py-0.5'}`}>
              <div className={`${size.textBase} font-bold text-white leading-none`}>{daysUntil}</div>
              <div className={`${size.textXS} text-white/90 font-medium`}>ngày nữa</div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 relative">
      {/* Content - Compact & Centered */}
      <div
        className={`flex-1 overflow-y-auto ${size.cardPadding} flex justify-center`}
        style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
      >
        <div className={`w-full max-w-md ${size.containerSpacing}`}>
        {/* Info Card - Gộp tất cả thông tin */}
        <div className={`bg-white ${size.cardRounded} shadow-sm border border-gray-100`}>
          <div className={`${size.cardPadding} ${size.cardSpacing}`}>
            {/* Customer Name */}
            <div className={`flex items-center ${size.gap}`}>
              <div className={`${size.avatarSM} bg-gradient-to-br from-green-500 to-green-600 ${size.cardRounded} flex items-center justify-center flex-shrink-0`}>
                <svg className={`${size.iconSM} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`${size.textXS} text-gray-500 font-medium`}>Khách hàng</div>
                <h2 className={`${size.textLG} font-bold text-gray-900`}>{booking.customerName}</h2>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* Phone */}
            <div className={`flex items-center ${size.gap}`}>
              <div className={`${size.avatarSM} bg-blue-50 ${size.cardRounded} flex items-center justify-center flex-shrink-0`}>
                <svg className={`${size.iconSM} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`${size.textXS} text-gray-500 font-medium`}>Số điện thoại</div>
                <a href={`tel:${booking.phone}`} className={`${size.textSM} font-semibold text-blue-600 hover:text-blue-700`}>
                  {booking.phone}
                </a>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* Date Time */}
            <div className={`flex items-center ${size.gap}`}>
              <div className={`${size.avatarSM} bg-purple-50 ${size.cardRounded} flex items-center justify-center flex-shrink-0`}>
                <svg className={`${size.iconSM} text-purple-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`${size.textXS} text-gray-500 font-medium`}>Ngày giờ chụp</div>
                <div className={`${size.textSM} font-semibold text-gray-900`}>
                  {formatDateTimeWithLunar(booking.shootingDateTime)}
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* Address */}
            <div className={`flex items-center ${size.gap}`}>
              <div className={`${size.avatarSM} bg-orange-50 ${size.cardRounded} flex items-center justify-center flex-shrink-0`}>
                <svg className={`${size.iconSM} text-orange-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`${size.textXS} text-gray-500 font-medium`}>Địa chỉ chụp</div>
                <div className={`${size.textSM} text-gray-900 leading-snug`}>{booking.address}</div>
              </div>
            </div>

            {/* Notes - Compact with Expand/Collapse */}
            {booking.notes && (
              <>
                <div className="h-px bg-gray-100"></div>
                <div className={`bg-amber-50 border-l-3 border-amber-400 ${size.cardRounded} ${size.cardPadding.includes('p-4') ? 'p-2.5' : 'p-2'}`}>
                  <div className={`flex items-center ${size.gapSM} mb-1.5`}>
                    <svg className={`${size.iconSM} text-amber-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span className={`${size.textXS} font-bold text-amber-800 uppercase tracking-wide`}>Ghi chú</span>
                  </div>
                  <div className="relative">
                    <div
                      className={`${size.textSM} text-gray-700 leading-snug transition-all duration-300 ${
                        !isNotesExpanded && booking.notes.length > 100 ? 'line-clamp-2' : ''
                      }`}
                    >
                      {booking.notes}
                    </div>
                    {booking.notes.length > 100 && (
                      <button
                        onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                        className={`mt-1 ${size.textXS} font-semibold text-amber-700 hover:text-amber-900 flex items-center ${size.gapSM} transition-colors duration-200`}
                      >
                        <span>{isNotesExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
                        <svg
                          className={`w-3 h-3 transition-transform duration-300 ${isNotesExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="h-px bg-gray-100"></div>

            {/* Payment Section - Compact */}
            <div className={`bg-gradient-to-br from-green-50 to-emerald-50 ${size.cardRounded} ${size.cardPadding} ${size.cardSpacing}`}>
              <div className={`flex items-center ${size.gapSM}`}>
                <div className={`${size.iconBase} bg-green-600 rounded flex items-center justify-center`}>
                  <svg className={`${size.iconXS} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className={`${size.textXS} font-bold text-green-800 uppercase tracking-wide`}>Thanh toán</span>
              </div>

              <div className="flex justify-between items-center">
                <span className={`${size.textXS} text-gray-600 font-medium`}>Giá thành</span>
                <span className={`${size.textBase} font-bold text-gray-900`}>
                  {price.toLocaleString('vi-VN')}đ
                </span>
              </div>

              {/* Hiển thị chi tiết thanh toán hoặc badge đã thanh toán đủ */}
              {booking.isFullyPaid ? (
                <div className={`bg-gradient-to-r from-green-600 to-green-500 ${size.cardRounded} ${size.cardPadding} flex items-center justify-center ${size.gapSM} shadow-sm`}>
                  <svg className={`${size.iconBase} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`${size.textSM} font-bold text-white`}>Đã thanh toán đủ</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className={`${size.textXS} text-gray-600 font-medium`}>Đã cọc</span>
                    <span className={`${size.textBase} font-bold text-blue-600`}>
                      {deposit.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {price > 0 && (
                    <div>
                      <div className={`flex justify-between ${size.textXS} text-gray-600 font-medium mb-1`}>
                        <span>Đã thanh toán</span>
                        <span className="font-bold">{depositPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${depositPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-green-200"></div>

                  <div className="flex justify-between items-center">
                    <span className={`${size.textSM} font-bold text-gray-900`}>Còn lại</span>
                    <span className={`${size.textLG} font-bold text-orange-600`}>
                      {remaining.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Status Bar - Compact */}
        <div>
          {getStatusBadge()}
        </div>

        {/* Action Buttons - Compact */}
        <div className={`grid grid-cols-2 ${size.gapSM} pb-20 pt-0.5`}>
          <button
            onClick={handleEdit}
            className={`bg-gradient-to-r from-green-600 to-green-500 text-white ${size.buttonPadding} ${size.buttonRounded} font-bold active:from-green-700 active:to-green-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center ${size.gapSM}`}
          >
            <svg className={size.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className={size.buttonText}>Sửa</span>
          </button>
          {!booking.isCompleted && (
            <button
              onClick={handleComplete}
              className={`bg-gradient-to-r from-blue-600 to-blue-500 text-white ${size.buttonPadding} ${size.buttonRounded} font-bold active:from-blue-700 active:to-blue-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center ${size.gapSM}`}
            >
              <svg className={size.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={size.buttonText}>Hoàn thành</span>
            </button>
          )}
          <button
            onClick={handleDelete}
            className={`bg-white text-red-600 ${size.buttonPadding} ${size.buttonRounded} font-bold border-2 border-red-500 active:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center ${size.gapSM}`}
          >
            <svg className={size.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className={size.buttonText}>Xóa</span>
          </button>
          <button
            onClick={onBack}
            className={`bg-white text-gray-700 ${size.buttonPadding} ${size.buttonRounded} font-bold border-2 border-gray-300 active:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center ${size.gapSM}`}
          >
            <svg className={size.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className={size.buttonText}>Quay lại</span>
          </button>
        </div>
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


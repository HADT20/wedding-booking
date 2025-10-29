import { useState, useEffect } from 'react';
import { formatDateTimeWithLunar } from '../utils/dateUtils';
import { SAFE_AREA_PADDING } from '../utils/constants';
import { useDisplaySize } from '../contexts/DisplaySizeContext';
import { getSizeClasses } from '../utils/displaySizeClasses';
import BookingDetail from './BookingDetail';
import BookingForm from './BookingForm';

const BookingList = ({ bookings, onEdit, onDelete, onAdd, onComplete, onViewChange }) => {
  const [editingBooking, setEditingBooking] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('active'); // 'active' or 'completed'
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const { displaySize } = useDisplaySize();
  const size = getSizeClasses(displaySize);

  // Notify parent when view changes
  useEffect(() => {
    if (onViewChange) {
      onViewChange(!!selectedBooking || !!editingBooking || isAddingNew);
    }
  }, [selectedBooking, editingBooking, isAddingNew, onViewChange]);

  const handleFormSubmit = (bookingData) => {
    if (editingBooking) {
      // Khi edit, không thay đổi isCompleted
      onEdit(editingBooking.id, bookingData);
      setEditingBooking(null);
    } else if (isAddingNew) {
      // Khi thêm mới, set isCompleted = false
      onAdd({ ...bookingData, isCompleted: false });
      setIsAddingNew(false);
    }
  };

  const handleFormCancel = () => {
    setEditingBooking(null);
    setIsAddingNew(false);
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setSelectedBooking(null); // Close detail view
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleCardClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch hẹn này?')) {
      onDelete(id);
    }
  };

  // Filter bookings by status and search query
  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    const statusMatch = filter === 'completed'
      ? booking.isCompleted === true
      : !booking.isCompleted;

    // Filter by search query
    if (!searchQuery.trim()) {
      return statusMatch;
    }

    const query = searchQuery.toLowerCase().trim();
    const customerName = (booking.customerName || '').toLowerCase();
    const phone = (booking.phone || '').toLowerCase();
    const address = (booking.address || '').toLowerCase();

    const searchMatch = customerName.includes(query) ||
                       phone.includes(query) ||
                       address.includes(query);

    return statusMatch && searchMatch;
  });

  // Show form if adding new or editing
  if (isAddingNew || editingBooking) {
    return (
      <BookingForm
        booking={editingBooking}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  // Show detail view if booking is selected
  if (selectedBooking) {
    return (
      <BookingDetail
        booking={selectedBooking}
        onBack={() => setSelectedBooking(null)}
        onEdit={handleEdit}
        onDelete={onDelete}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {/* Page Header */}
      <div className="px-3 pt-safe" style={SAFE_AREA_PADDING}>
        <div className={`bg-gradient-to-r from-green-600 to-teal-500 ${size.headerRounded} ${size.headerPadding} text-white shadow-md mt-2`}>
          <h2 className={`${size.headerTitle} font-bold mb-0.5`}>Danh sách</h2>
          <p className={`${size.headerSubtitle} text-green-50`}>Quản lý lịch hẹn</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`bg-white border-b border-gray-200 px-3 ${size.cardPadding.includes('p-4') ? 'py-3' : 'py-2'}`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, SĐT, địa chỉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 ${size.containerRounded} ${size.textSM} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
          />
          <svg
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${size.iconLG} text-gray-400`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg className={`${size.iconBase} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={`bg-white border-b border-gray-200 px-3 flex ${size.gap}`}>
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 ${size.buttonPadding} ${size.buttonText} font-semibold transition-colors relative ${
            filter === 'active'
              ? 'text-green-700'
              : 'text-gray-500'
          }`}
        >
          Đang hoạt động
          {filter === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-700"></div>
          )}
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 ${size.buttonPadding} ${size.buttonText} font-semibold transition-colors relative ${
            filter === 'completed'
              ? 'text-green-700'
              : 'text-gray-500'
          }`}
        >
          Đã hoàn thành
          {filter === 'completed' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-700"></div>
          )}
        </button>
      </div>

      {/* Danh sách - Compact */}
      <div className={`flex-1 overflow-y-auto ${size.containerPadding} ${size.containerSpacing} pb-20`}>
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className={`${size.avatarLG} bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
              <svg className={`${size.iconLG} text-gray-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {searchQuery ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                )}
              </svg>
            </div>
            <p className={`${size.textSM} font-medium text-gray-500`}>
              {searchQuery
                ? 'Không tìm thấy kết quả'
                : filter === 'completed'
                  ? 'Chưa có lịch hẹn đã hoàn thành'
                  : 'Chưa có lịch hẹn nào'}
            </p>
            <p className={`${size.textXS} mt-1`}>
              {filter === 'active' && 'Nhấn "Thêm mới" để tạo lịch hẹn đầu tiên'}
            </p>
          </div>
        ) : (
          filteredBookings
            .sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id))
            .map((booking) => (
              <div
                key={booking.id}
                className={`bg-white border border-gray-200 ${size.containerRounded} shadow-sm hover:shadow-md transition-all overflow-hidden`}
              >
                {/* Clickable area - Compact */}
                <div
                  onClick={() => handleCardClick(booking)}
                  className={`${size.cardPadding} cursor-pointer active:bg-gray-50`}
                >
                  <div className={`flex justify-between items-start ${size.gapSM}`}>
                    <h3 className={`font-bold text-gray-900 ${size.textBase}`}>
                      {booking.customerName}
                    </h3>
                    <div className={`flex items-center ${size.gapSM}`}>
                      {booking.isCompleted && (
                        <span className={`px-1.5 py-0.5 bg-red-50 border border-red-200 rounded ${size.textXS} font-semibold text-red-600 whitespace-nowrap`}>
                          Hoàn thành
                        </span>
                      )}
                      <div className="text-gray-300">
                        <svg className={size.iconBase} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                <div className={size.cardSpacing}>
                  <div className={`${size.cardSpacing} ${size.textSM} text-gray-600`}>
                    <p className={`flex items-center ${size.gapSM}`}>
                      <svg className={`${size.iconSM} text-gray-400 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="truncate">{booking.phone}</span>
                    </p>
                    <p className={`flex items-center ${size.gapSM}`}>
                      <svg className={`${size.iconSM} text-gray-400 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{booking.address}</span>
                    </p>
                    <div className="text-green-600 font-medium">
                      <p className={`flex items-center ${size.gapSM}`}>
                        <svg className={`${size.iconSM} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={size.textXS}>{formatDateTimeWithLunar(booking.shootingDateTime)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Thanh toán - Compact */}
                  {(booking.price || 0) > 0 && (
                    <div className="pt-1.5 border-t border-gray-100">
                      {booking.isFullyPaid ? (
                        <div className={`bg-green-50 border border-green-200 ${size.cardRounded} ${size.cardPadding.includes('p-4') ? 'p-2' : 'p-1.5'}`}>
                          <div className={`flex items-center justify-center ${size.gapSM}`}>
                            <svg className={`${size.iconSM} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className={`${size.textSM} font-bold text-green-700`}>Đã thanh toán đủ</span>
                          </div>
                        </div>
                      ) : (
                        <div className={`flex ${size.gapSM}`}>
                          <div className={`flex-1 bg-blue-50 border border-blue-200 ${size.cardRounded} ${size.cardPadding.includes('p-4') ? 'p-2' : 'p-1.5'}`}>
                            <div className={`flex items-center gap-1 mb-0.5`}>
                              <svg className={`${size.iconXS} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="text-[9px] text-gray-600 font-medium">Đã thu</div>
                            </div>
                            <div className={`${size.textSM} font-bold text-blue-700`}>
                              {(booking.deposit / 1000).toFixed(0)}K
                            </div>
                          </div>
                          <div className={`flex-1 bg-orange-50 border border-orange-200 ${size.cardRounded} ${size.cardPadding.includes('p-4') ? 'p-2' : 'p-1.5'}`}>
                            <div className={`flex items-center gap-1 mb-0.5`}>
                              <svg className={`${size.iconXS} text-orange-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              <div className="text-[9px] text-gray-600 font-medium">Còn lại</div>
                            </div>
                            <div className={`${size.textSM} font-bold text-orange-700`}>
                              {(((booking.price || 0) - (booking.deposit || 0)) / 1000).toFixed(0)}K
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Floating Add Button - Compact */}
      <button
        onClick={handleAddNew}
        className={`fixed bottom-24 right-4 ${size.avatarBase} bg-green-700 text-white rounded-full shadow-lg active:bg-green-800 transition-all flex items-center justify-center z-20 hover:scale-110`}
        style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
      >
        <svg className={size.iconLG} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default BookingList;


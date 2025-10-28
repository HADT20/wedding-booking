import { useState } from 'react';
import { formatDateTimeWithLunar } from '../utils/dateUtils';
import BookingDetail from './BookingDetail';
import BookingForm from './BookingForm';

const BookingList = ({ bookings, onEdit, onDelete, onAdd, onComplete }) => {
  const [editingBooking, setEditingBooking] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('active'); // 'active' or 'completed'

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

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'completed') {
      return booking.isCompleted === true;
    } else {
      return !booking.isCompleted;
    }
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
      <div className="bg-gradient-to-r from-green-800 to-green-700 px-4 py-5 text-white">
        <h2 className="text-xl font-bold mb-1">Danh sách</h2>
        <p className="text-sm text-green-100">Quản lý lịch hẹn</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 flex gap-2">
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
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
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
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

      {/* Danh sách */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-500">
              {filter === 'completed' ? 'Chưa có lịch hẹn đã hoàn thành' : 'Chưa có lịch hẹn nào'}
            </p>
            <p className="text-sm mt-1">
              {filter === 'active' && 'Nhấn "Thêm mới" để tạo lịch hẹn đầu tiên'}
            </p>
          </div>
        ) : (
          filteredBookings
            .sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id))
            .map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Clickable area */}
                <div
                  onClick={() => handleCardClick(booking)}
                  className="p-4 cursor-pointer active:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 text-base">
                      {booking.customerName}
                    </h3>
                    <div className="flex items-center gap-2">
                      {booking.isCompleted && (
                        <span className="px-2 py-1 bg-red-50 border border-red-200 rounded-md text-xs font-semibold text-red-600 whitespace-nowrap">
                          Đã hoàn thành
                        </span>
                      )}
                      <div className="text-gray-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                <div className="space-y-2.5">
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{booking.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{booking.address}</span>
                    </p>
                    <div className="text-green-600 font-medium">
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDateTimeWithLunar(booking.shootingDateTime)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Thanh toán */}
                  {(booking.price || 0) > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      {booking.isFullyPaid ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-2.5">
                          <div className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-bold text-green-700">Đã thanh toán đủ</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="text-[10px] text-gray-600 font-medium">Đã thu</div>
                            </div>
                            <div className="text-base font-bold text-blue-700">
                              {(booking.deposit || 0).toLocaleString('vi-VN')}đ
                            </div>
                          </div>
                          <div className="flex-1 bg-orange-50 border border-orange-200 rounded-xl p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              <div className="text-[10px] text-gray-600 font-medium">Còn lại</div>
                            </div>
                            <div className="text-base font-bold text-orange-700">
                              {((booking.price || 0) - (booking.deposit || 0)).toLocaleString('vi-VN')}đ
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {booking.notes && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span className="flex-1">{booking.notes}</span>
                      </p>
                    </div>
                  )}
                </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleAddNew}
        className="fixed bottom-20 right-6 w-14 h-14 bg-green-700 text-white rounded-full shadow-lg active:bg-green-800 transition-all flex items-center justify-center z-20 hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default BookingList;


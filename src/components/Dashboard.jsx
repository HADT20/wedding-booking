import { useState } from 'react';
import { formatDateTimeWithLunar } from '../utils/dateUtils';
import BookingDetail from './BookingDetail';
import BookingForm from './BookingForm';

const Dashboard = ({ bookings, onEdit, onDelete, onComplete }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  // Tính toán thống kê
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Lọc booking đang hoạt động (chưa hoàn thành)
  const activeBookings = bookings.filter(b => !b.isCompleted);

  // Tổng số khách (tính tất cả, bao gồm cả đã hoàn thành)
  const totalBookings = bookings.length;

  // Sắp đến (trong vòng 30 ngày, chưa hoàn thành)
  const upcomingBookings = activeBookings.filter(booking => {
    const bookingDate = new Date(booking.shootingDateTime);
    return bookingDate >= now && bookingDate <= thirtyDaysFromNow;
  }).length;

  // Đã hoàn thành (đánh dấu isCompleted)
  const completedBookings = bookings.filter(b => b.isCompleted === true).length;

  // Tương lai (sau 30 ngày, chưa hoàn thành)
  const futureBookings = activeBookings.filter(booking => {
    const bookingDate = new Date(booking.shootingDateTime);
    return bookingDate > thirtyDaysFromNow;
  }).length;

  // Lịch hẹn sắp đến (top 5, chỉ lấy chưa hoàn thành)
  const upcomingList = activeBookings
    .filter(booking => {
      const bookingDate = new Date(booking.shootingDateTime);
      return bookingDate >= now;
    })
    .sort((a, b) => new Date(a.shootingDateTime) - new Date(b.shootingDateTime))
    .slice(0, 5);

  // Tính số ngày còn lại
  const getDaysRemaining = (dateTimeString) => {
    const bookingDate = new Date(dateTimeString);
    const diffTime = bookingDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Lọc booking đã hoàn thành
  const completedBookingsList = bookings.filter(b => b.isCompleted === true);

  // Tính toán tài chính (chỉ tính booking đang hoạt động)
  const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.price || 0), 0);

  // Tổng tiền đã thu = Tiền cọc (chưa thanh toán đủ) + Toàn bộ giá (đã thanh toán đủ) + Toàn bộ giá (đã hoàn thành)
  const totalDeposit = activeBookings.reduce((sum, b) => {
    if (b.isFullyPaid) {
      // Nếu đã thanh toán đủ, tính toàn bộ giá thành
      return sum + (b.price || 0);
    } else {
      // Nếu chưa thanh toán đủ, chỉ tính tiền cọc
      return sum + (b.deposit || 0);
    }
  }, 0) + completedBookingsList.reduce((sum, b) => sum + (b.price || 0), 0); // Cộng thêm tất cả booking đã hoàn thành

  const totalRemaining = totalRevenue - totalDeposit;

  // Tài chính cho booking sắp đến (chưa hoàn thành)
  const upcomingRevenue = activeBookings
    .filter(booking => {
      const bookingDate = new Date(booking.shootingDateTime);
      return bookingDate >= now && bookingDate <= thirtyDaysFromNow;
    })
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const upcomingRemaining = activeBookings
    .filter(booking => {
      const bookingDate = new Date(booking.shootingDateTime);
      return bookingDate >= now && bookingDate <= thirtyDaysFromNow;
    })
    .reduce((sum, b) => sum + ((b.price || 0) - (b.deposit || 0)), 0);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleBackFromDetail = () => {
    setSelectedBooking(null);
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setSelectedBooking(null);
  };

  const handleFormSubmit = (bookingData) => {
    if (editingBooking) {
      onEdit(editingBooking.id, bookingData);
    }
    setEditingBooking(null);
  };

  const handleFormCancel = () => {
    setEditingBooking(null);
  };

  // Nếu đang hiển thị form edit
  if (editingBooking) {
    return (
      <BookingForm
        booking={editingBooking}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  // Nếu đang xem chi tiết booking
  if (selectedBooking) {
    return (
      <BookingDetail
        booking={selectedBooking}
        onBack={handleBackFromDetail}
        onEdit={handleEdit}
        onDelete={onDelete}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="space-y-4">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 px-4 py-5 text-white">
          <h2 className="text-xl font-bold mb-1">Dashboard</h2>
          <p className="text-sm text-green-100">Tổng quan lịch chụp ảnh cưới</p>
        </div>

        <div className="px-4 space-y-4">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tổng số khách */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalBookings}</div>
            </div>
            <div className="text-xs text-gray-500 font-medium">Tổng số khách</div>
          </div>

          {/* Sắp đến */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-orange-600">{upcomingBookings}</div>
            </div>
            <div className="text-xs text-gray-500 font-medium">Sắp đến (≤30 ngày)</div>
          </div>

          {/* Đã hoàn thành */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-green-600">{completedBookings}</div>
            </div>
            <div className="text-xs text-gray-500 font-medium">Đã hoàn thành</div>
          </div>

          {/* Tổng tiền đã thu */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl p-3.5 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xl font-bold text-white">{totalDeposit.toLocaleString('vi-VN')}đ</div>
            </div>
            <div className="text-xs text-white/90 font-medium">Tổng tiền đã thu</div>
          </div>
        </div>

        {/* Upcoming Bookings List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3.5">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Lịch hẹn sắp đến</span>
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {upcomingList.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-sm">Không có lịch hẹn sắp đến</p>
              </div>
            ) : (
              upcomingList.map((booking) => {
                const daysRemaining = getDaysRemaining(booking.shootingDateTime);
                return (
                  <div
                    key={booking.id}
                    onClick={() => handleBookingClick(booking)}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2 text-base">
                          {booking.customerName}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1.5">
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
                          <div className="text-orange-600 font-medium">
                            <p className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{formatDateTimeWithLunar(booking.shootingDateTime)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className={`
                          px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap
                          ${daysRemaining <= 7
                            ? 'bg-red-500 text-white'
                            : daysRemaining <= 14
                            ? 'bg-orange-500 text-white'
                            : 'bg-blue-500 text-white'
                          }
                        `}>
                          {daysRemaining === 0
                            ? 'Hôm nay'
                            : daysRemaining === 1
                            ? '1 ngày'
                            : `${daysRemaining} ngày`
                          }
                        </div>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 flex items-start gap-2">
                          <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span className="flex-1">{booking.notes}</span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


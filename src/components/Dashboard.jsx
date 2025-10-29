import { useState, useEffect } from 'react';
import { formatDateTimeWithLunar, getVietnamDate, toVietnamDate } from '../utils/dateUtils';
import { SAFE_AREA_PADDING } from '../utils/constants';
import { useDisplaySize } from '../contexts/DisplaySizeContext';
import { getSizeClasses } from '../utils/displaySizeClasses';
import BookingDetail from './BookingDetail';
import BookingForm from './BookingForm';

const Dashboard = ({ bookings, onEdit, onDelete, onComplete, onViewChange }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showRevenueFilter, setShowRevenueFilter] = useState(false);
  const [revenueFilter, setRevenueFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { displaySize } = useDisplaySize();
  const size = getSizeClasses(displaySize);

  // Calculate stats
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(booking => booking.status === 'completed').length;
  
  // Calculate upcoming bookings (within next 30 days)
  const today = getVietnamDate();
  const upcomingBookings = bookings.filter(booking => {
    if (booking.status === 'completed') return false;
    const shootingDate = toVietnamDate(booking.shootingDateTime);
    const diffTime = shootingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  }).length;

  // Calculate filtered revenue
  const getFilteredBookings = () => {
    if (revenueFilter === 'all') {
      return bookings;
    }
    
    return bookings.filter(booking => {
      const shootingDate = toVietnamDate(booking.shootingDateTime);
      
      if (revenueFilter === 'month') {
        return shootingDate.getMonth() + 1 === selectedMonth && 
               shootingDate.getFullYear() === selectedYear;
      } else if (revenueFilter === 'year') {
        return shootingDate.getFullYear() === selectedYear;
      }
      
      return true;
    });
  };

  const filteredBookings = getFilteredBookings();
  const totalDeposit = filteredBookings.reduce((sum, booking) => {
    // Nếu đã thanh toán đủ, tính toàn bộ giá trị
    if (booking.isFullyPaid) {
      return sum + (booking.price || 0);
    }
    // Nếu chưa thanh toán đủ, chỉ tính tiền cọc
    return sum + (booking.deposit || 0);
  }, 0);

  // Get upcoming bookings for display (sorted by shooting date)
  const upcomingBookingsList = bookings
    .filter(booking => {
      if (booking.status === 'completed') return false;
      const shootingDate = toVietnamDate(booking.shootingDateTime);
      const diffTime = shootingDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0;
    })
    .sort((a, b) => new Date(a.shootingDateTime) - new Date(b.shootingDateTime))
    .slice(0, 5);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleBackFromDetail = () => {
    setSelectedBooking(null);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(null);
    setEditingBooking(booking);
  };

  const handleFormSubmit = (bookingData) => {
    onEdit(editingBooking.id, bookingData);
    setEditingBooking(null);
  };

  const handleFormCancel = () => {
    setEditingBooking(null);
  };

  // Show booking form if editing
  if (editingBooking) {
    return (
      <BookingForm
        booking={editingBooking}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  // Show booking detail if selected
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

  // Main dashboard view
  return (
    <>
      <div className="h-full overflow-y-auto bg-gray-50 pb-20">
        <div className={size.containerSpacing}>
          {/* Page Header - Dynamic */}
          <div className="px-3 pt-safe" style={SAFE_AREA_PADDING}>
            <div className={`bg-gradient-to-r from-green-600 to-teal-500 ${size.headerRounded} ${size.headerPadding} text-white shadow-md mt-2`}>
              <h2 className={`${size.headerTitle} font-bold mb-0.5`}>Dashboard</h2>
              <p className={`${size.headerSubtitle} text-green-50`}>Tổng quan lịch chụp ảnh cưới</p>
            </div>
          </div>

          <div className={`px-3 ${size.containerSpacing}`}>
            {/* Stats Cards - Dynamic Layout */}
            <div className={`grid grid-cols-2 ${size.gap}`}>
              {/* Khách hàng */}
              <div className={`relative bg-white ${size.cardRounded} overflow-hidden shadow-sm border border-gray-100`}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-green-600"></div>
                <div className={`${size.cardPadding} flex flex-col items-center justify-center text-center`}>
                  <div className={`${size.statsLabel} text-gray-500 font-medium mb-1 uppercase tracking-wide`}>Khách hàng</div>
                  <div className={`${size.statsNumber} font-bold text-gray-900`}>{totalBookings}</div>
                </div>
              </div>

              {/* Sắp đến ngày hẹn */}
              <div className={`relative bg-white ${size.cardRounded} overflow-hidden shadow-sm border border-gray-100`}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600"></div>
                <div className={`${size.cardPadding} flex flex-col items-center justify-center text-center`}>
                  <div className={`${size.statsLabel} text-gray-500 font-medium mb-1 uppercase tracking-wide`}>Sắp đến</div>
                  <div className={`${size.statsNumber} font-bold text-red-600`}>{upcomingBookings}</div>
                </div>
              </div>

              {/* Hoàn thành */}
              <div className={`relative bg-white ${size.cardRounded} overflow-hidden shadow-sm border border-gray-100`}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-orange-600"></div>
                <div className={`${size.cardPadding} flex flex-col items-center justify-center text-center`}>
                  <div className={`${size.statsLabel} text-gray-500 font-medium mb-1 uppercase tracking-wide`}>Hoàn thành</div>
                  <div className={`${size.statsNumber} font-bold text-orange-600`}>{completedBookings}</div>
                </div>
              </div>

              {/* Doanh thu */}
              <div
                onClick={() => setShowRevenueFilter(true)}
                className={`relative bg-white ${size.cardRounded} overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow active:scale-95`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-yellow-600"></div>
                <div className={`${size.cardPadding} flex flex-col items-center justify-center text-center`}>
                  <div className={`${size.statsLabel} text-gray-500 font-medium mb-1 uppercase tracking-wide`}>Doanh thu</div>
                  <div className={`${size.statsNumber} font-bold text-teal-600`}>
                    {(totalDeposit / 1000000).toFixed(1)}M
                  </div>
                  {revenueFilter !== 'all' && (
                    <div className="text-[10px] text-gray-500 mt-1">
                      {revenueFilter === 'month' 
                        ? `Tháng ${selectedMonth}/${selectedYear}`
                        : `Năm ${selectedYear}`
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Bookings List - Dynamic */}
            <div className={`bg-white ${size.containerRounded} shadow-sm border border-gray-100 overflow-hidden`}>
              <div className={`bg-gradient-to-r from-orange-500 to-orange-400 px-3 ${size.cardPadding.includes('p-4') ? 'py-3' : 'py-2.5'}`}>
                <div className="flex items-center justify-between">
                  <div className={`font-bold text-white flex items-center ${size.gapSM} ${size.textSM}`}>
                    <svg className={size.iconBase} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Sắp đến
                  </div>
                  <div className="text-white font-bold text-right">
                    <div className={size.textSM}>
                      {upcomingBookings}
                    </div>
                    <div className="text-xs opacity-90">
                      ngày nữa
                    </div>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {upcomingBookingsList.length === 0 ? (
                  <div className={`text-center ${size.cardPadding} text-gray-500`}>
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className={size.textSM}>Không có lịch hẹn sắp tới</p>
                  </div>
                ) : (
                  upcomingBookingsList.map(booking => {
                    const shootingDate = toVietnamDate(booking.shootingDateTime);
                    const diffTime = shootingDate.getTime() - today.getTime();
                    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div
                        key={booking.id}
                        onClick={() => handleBookingClick(booking)}
                        className={`${size.cardPadding} hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100`}
                      >
                        <div className={`flex items-start justify-between ${size.gap}`}>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-gray-900 mb-1.5 ${size.textBase} truncate`}>
                              {booking.customerName}
                            </h4>
                            <div className={`${size.textSM} text-gray-600 space-y-1`}>
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
                              <div className="text-orange-600 font-medium">
                                <p className={`flex items-center ${size.gapSM}`}>
                                  <svg className={`${size.iconSM} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className={size.textXS}>{formatDateTimeWithLunar(booking.shootingDateTime)}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 flex items-center justify-center">
                            <div className={`
                              px-2 py-1 rounded-md ${size.textXS} font-bold whitespace-nowrap text-center
                              ${daysRemaining <= 7
                                ? 'bg-red-500 text-white'
                                : daysRemaining <= 14
                                ? 'bg-orange-500 text-white'
                                : 'bg-green-500 text-white'
                              }
                            `}>
                              {daysRemaining === 0
                                ? 'Hôm nay'
                                : daysRemaining === 1
                                ? '1 ngày'
                                : `${daysRemaining}d`
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Filter Modal */}
      {showRevenueFilter && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setShowRevenueFilter(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 rounded-t-xl">
              <h3 className="text-lg font-bold text-white">Bộ lọc doanh thu</h3>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Filter Type Buttons */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Loại bộ lọc</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setRevenueFilter('all')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      revenueFilter === 'all'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setRevenueFilter('month')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      revenueFilter === 'month'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tháng
                  </button>
                  <button
                    onClick={() => setRevenueFilter('year')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      revenueFilter === 'year'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Năm
                  </button>
                </div>
              </div>

              {/* Month/Year Selectors */}
              {revenueFilter !== 'all' && (
                <div className="space-y-4">
                  {revenueFilter === 'month' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tháng</label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Tháng {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Năm</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() - 2 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              )}

              {/* Revenue Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Doanh thu</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {(totalDeposit / 1000000).toFixed(1)}M VNĐ
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {revenueFilter === 'all'
                      ? 'Tất cả thời gian'
                      : revenueFilter === 'month'
                      ? `Tháng ${selectedMonth}/${selectedYear}`
                      : `Năm ${selectedYear}`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 rounded-b-xl">
              <button
                onClick={() => setShowRevenueFilter(false)}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

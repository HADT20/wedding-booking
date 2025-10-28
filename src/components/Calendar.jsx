import { useState, useEffect, useRef } from 'react';
import {
  getMonthName,
  getDaysInMonth,
  getFirstDayOfMonth,
  getWeekDays,
  isSameDay,
  isToday,
  formatTime
} from '../utils/dateUtils';
import BookingDetail from './BookingDetail';
import BookingForm from './BookingForm';

const Calendar = ({ bookings, onEdit, onDelete, onComplete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const monthScrollRef = useRef(null);
  const currentMonthRef = useRef(null);
  const [editingBooking, setEditingBooking] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const weekDays = getWeekDays();

  // Lấy bookings cho một ngày cụ thể (chỉ lấy chưa hoàn thành)
  const getBookingsForDate = (day) => {
    const date = new Date(year, month, day);
    return bookings.filter(booking =>
      !booking.isCompleted && isSameDay(new Date(booking.shootingDateTime), date)
    );
  };

  // Chuyển Tháng
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  // Tạo mảng các ngày trong Tháng
  const days = [];
  
  // Thêm các ô trống cho những ngày của Tháng trước
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Thêm các ngày trong Tháng
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const handleDayClick = (day) => {
    if (day) {
      const date = new Date(year, month, day);
      setSelectedDate(date);
    }
  };

  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate.getDate()) : [];

  // Tạo danh sách 12 Tháng
  const months = Array.from({ length: 12 }, (_, i) => i);

  const handleMonthClick = (monthIndex) => {
    setCurrentDate(new Date(year, monthIndex, 1));
    setSelectedDate(null);
  };

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

  // Auto scroll to current month on mount
  useEffect(() => {
    if (currentMonthRef.current && monthScrollRef.current) {
      const container = monthScrollRef.current;
      const button = currentMonthRef.current;
      const containerWidth = container.offsetWidth;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;

      // Scroll to center the current month button
      container.scrollTo({
        left: buttonLeft - (containerWidth / 2) + (buttonWidth / 2),
        behavior: 'smooth'
      });
    }
  }, []);

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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 px-4 py-3 text-white">
        <h2 className="text-lg font-bold mb-0.5">Lịch</h2>
        <p className="text-xs text-green-100">Xem lịch hẹn theo tháng</p>
      </div>

      {/* Month selector - horizontal scroll */}
      <div className="bg-white border-b border-gray-200">
        <div ref={monthScrollRef} className="overflow-x-auto scrollbar-hide px-3 py-2">
          <div className="flex gap-2 items-center">
            {months.map((monthIndex) => {
              const isCurrentMonth = monthIndex === currentMonth && year === currentYear;
              const isSelectedMonth = monthIndex === month;

              return (
                <button
                  key={monthIndex}
                  ref={isCurrentMonth ? currentMonthRef : null}
                  onClick={() => handleMonthClick(monthIndex)}
                  className={`
                    px-3 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex-shrink-0 w-[82px]
                    ${isSelectedMonth && isCurrentMonth
                      ? 'bg-green-700 text-white shadow-md ring-2 ring-green-400'
                      : isSelectedMonth
                      ? 'bg-green-700 text-white shadow-md'
                      : isCurrentMonth
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  Tháng {monthIndex + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600 px-2 py-1.5">
          {weekDays.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-y-auto p-1.5 bg-white flex-shrink-0">
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const date = new Date(year, month, day);
            const dayBookings = getBookingsForDate(day);
            const hasBookings = dayBookings.length > 0;
            const today = isToday(date);
            const selected = selectedDate && isSameDay(date, selectedDate);

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`
                  aspect-square p-1 rounded-lg transition-all relative border
                  ${today && !hasBookings ? 'bg-green-50 border-green-600 text-green-700 shadow-md' : ''}
                  ${today && hasBookings ? 'bg-gradient-to-br from-green-50 to-orange-50 border-green-600 text-gray-900 shadow-md' : ''}
                  ${!today && hasBookings ? 'bg-orange-100 border-orange-500 text-gray-900 shadow-sm' : ''}
                  ${!today && !hasBookings ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : ''}
                  ${selected ? 'ring-2 ring-blue-500' : ''}
                  active:scale-95
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className={`text-sm font-medium ${hasBookings ? 'mb-1' : ''}`}>
                    {day}
                  </span>
                  {hasBookings && (
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                      <div className={`
                        text-xs font-bold px-1.5 py-0.5 rounded-full
                        ${today ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'}
                      `}>
                        {dayBookings.length}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <div className="border-t border-gray-200 bg-gray-50 p-3 flex-1 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-3 text-base">
            Lịch hẹn ngày {selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
          </h3>

          {selectedBookings.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Không có lịch hẹn nào trong ngày này
            </p>
          ) : (
            <div className="space-y-2.5">
              {selectedBookings
                .sort((a, b) => new Date(a.shootingDateTime) - new Date(b.shootingDateTime))
                .map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => handleBookingClick(booking)}
                    className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="font-semibold text-gray-900 text-base">
                        {booking.customerName}
                      </h4>
                      <span className="text-sm text-green-700 font-semibold">
                        {formatTime(booking.shootingDateTime)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📞 {booking.phone}</p>
                      <p>📍 {booking.address}</p>
                      {booking.notes && (
                        <p className="text-gray-500 italic mt-1.5">💬 {booking.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;


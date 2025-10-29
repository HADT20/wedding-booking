import { useState, useEffect, useRef } from 'react';
import {
  getMonthName,
  getDaysInMonth,
  getFirstDayOfMonth,
  getWeekDays,
  isSameDay,
  isToday,
  formatTime,
  getVietnamDate,
  toVietnamDate
} from '../utils/dateUtils';
import { SAFE_AREA_PADDING } from '../utils/constants';
import { useDisplaySize } from '../contexts/DisplaySizeContext';
import { getSizeClasses } from '../utils/displaySizeClasses';
import BookingDetail from './BookingDetail';
import BookingForm from './BookingForm';

const Calendar = ({ bookings, onEdit, onDelete, onComplete, onViewChange }) => {
  const [currentDate, setCurrentDate] = useState(getVietnamDate());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const monthScrollRef = useRef(null);
  const currentMonthRef = useRef(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const { displaySize } = useDisplaySize();
  const size = getSizeClasses(displaySize);
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const calendarRef = useRef(null);

  // Notify parent when view changes
  useEffect(() => {
    if (onViewChange) {
      onViewChange(!!selectedBooking || !!editingBooking);
    }
  }, [selectedBooking, editingBooking, onViewChange]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = getVietnamDate();
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

  // Minimum swipe distance (in px)
  const minSwipeDistance = 30;
  const maxCalendarHeight = 450; // Maximum height of calendar section

  const onTouchStart = (e) => {
    const scrollTop = e.currentTarget.scrollTop;

    // Only allow swipe down when at the top of the list
    if (scrollTop === 0 || isCalendarCollapsed) {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientY);
      setIsDragging(true);
    }
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;

    const currentTouch = e.targetTouches[0].clientY;
    setTouchEnd(currentTouch);

    const distance = currentTouch - touchStart;
    const scrollTop = e.currentTarget.scrollTop;

    // Update drag offset for visual feedback only
    if (isCalendarCollapsed && distance > 0) {
      setDragOffset(Math.min(distance * 0.5, maxCalendarHeight * 0.5)); // Reduced sensitivity
    } else if (!isCalendarCollapsed && distance < 0 && scrollTop === 0) {
      setDragOffset(Math.max(distance * 0.5, -maxCalendarHeight * 0.5)); // Reduced sensitivity
    } else {
      setDragOffset(0);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && !isCalendarCollapsed) {
      setIsCalendarCollapsed(true);
    }
    if (isDownSwipe && isCalendarCollapsed) {
      setIsCalendarCollapsed(false);
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
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
    <div className="h-full flex flex-col bg-gray-50" style={{
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
    }}>
      {/* Page Header - Compact */}
      <div className="px-3 pt-safe relative z-20" style={SAFE_AREA_PADDING}>
        <div className={`bg-gradient-to-r from-green-600 to-teal-500 ${size.headerRounded} px-3 py-2 text-white shadow-md mt-2 flex items-center justify-between`}>
          <h2 className={`${size.textBase} font-bold`}>Lịch</h2>
          <button
            onClick={() => setIsCalendarCollapsed(!isCalendarCollapsed)}
            className="p-1 hover:bg-white/20 rounded-lg transition-all"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isCalendarCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Section - Collapsible */}
      <div
        ref={calendarRef}
        className={`bg-white border-b border-gray-200 overflow-hidden flex-shrink-0 ${
          isDragging ? '' : 'transition-all duration-500 ease-out'
        }`}
        style={{
          maxHeight: isDragging
            ? `${Math.max(0, isCalendarCollapsed ? dragOffset : maxCalendarHeight + dragOffset)}px`
            : isCalendarCollapsed ? '0px' : `${maxCalendarHeight}px`,
          opacity: isDragging
            ? Math.max(0, Math.min(1, isCalendarCollapsed ? dragOffset / maxCalendarHeight : 1 + dragOffset / maxCalendarHeight))
            : isCalendarCollapsed ? 0 : 1,
        }}
      >
        {/* Month selector - Compact */}
        <div className="py-1.5">
          <div ref={monthScrollRef} className="overflow-x-auto scrollbar-hide px-3">
            <div className="flex gap-1.5">
              {months.map((monthIndex) => {
                const isCurrentMonth = monthIndex === currentMonth && year === currentYear;
                const isSelectedMonth = monthIndex === month;

                return (
                  <button
                    key={monthIndex}
                    ref={isCurrentMonth ? currentMonthRef : null}
                    onClick={() => handleMonthClick(monthIndex)}
                    className={`
                      px-2 py-1 rounded-lg font-medium text-[10px] whitespace-nowrap transition-all flex-shrink-0
                      ${isSelectedMonth && isCurrentMonth
                        ? 'bg-green-700 text-white shadow-md ring-2 ring-green-400'
                        : isSelectedMonth
                        ? 'bg-green-700 text-white shadow-md'
                        : isCurrentMonth
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    style={{ width: 'calc((100vw - 32px) / 4 - 4.5px)' }}
                  >
                    T{monthIndex + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weekday headers - Compact */}
          <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-semibold text-gray-600 px-3 py-1 mt-1">
            {weekDays.map((day) => (
              <div key={day}>
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar grid - Compact */}
        <div className="px-3 pb-3">
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="w-9 h-9" />;
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
                    w-9 h-9 p-0.5 rounded-lg transition-all relative border-2
                    ${today && !hasBookings ? 'bg-green-50 border-green-600 text-green-700 shadow-sm' : ''}
                    ${today && hasBookings ? 'bg-gradient-to-br from-green-50 to-orange-50 border-green-600 text-gray-900 shadow-sm' : ''}
                    ${!today && hasBookings ? 'bg-orange-100 border-orange-500 text-gray-900 shadow-sm' : ''}
                    ${!today && !hasBookings ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300' : ''}
                    ${selected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                    active:scale-95
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <span className={`text-[10px] font-semibold ${hasBookings ? 'mb-0.5' : ''}`}>
                      {day}
                    </span>
                    {hasBookings && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                        <div className={`
                          text-[7px] font-bold px-0.5 py-0 rounded-full leading-tight
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
      </div>

      {/* Selected date details - Compact with Swipe Support */}
      {selectedDate && (
        <div
          className={`booking-list-container bg-gray-50 ${size.cardPadding} flex-1 overflow-y-auto pb-20 mt-6 ${
            isDragging ? 'select-none' : ''
          }`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            touchAction: isDragging ? 'none' : 'auto'
          }}
        >
          <h3 className={`font-semibold text-gray-900 ${size.gapSM} ${size.textBase} mb-3`}>
            Lịch hẹn ngày {selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
          </h3>

          {selectedBookings.length === 0 ? (
            <p className={`${size.textSM} text-gray-500 text-center py-3`}>
              Không có lịch hẹn nào trong ngày này
            </p>
          ) : (
            <div className={size.containerSpacing}>
              {selectedBookings
                .sort((a, b) => new Date(a.shootingDateTime) - new Date(b.shootingDateTime))
                .map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => handleBookingClick(booking)}
                    className={`bg-white border border-gray-200 ${size.cardRounded} ${size.cardPadding} shadow-sm cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors`}
                  >
                    <div className={`flex justify-between items-start ${size.gapSM}`}>
                      <h4 className={`font-semibold text-gray-900 ${size.textBase}`}>
                        {booking.customerName}
                      </h4>
                      <span className={`${size.textSM} text-green-700 font-semibold`}>
                        {formatTime(booking.shootingDateTime)}
                      </span>
                    </div>
                    <div className={`${size.textSM} text-gray-600 ${size.cardSpacing}`}>
                      <p>📞 {booking.phone}</p>
                      <p>📍 {booking.address}</p>
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


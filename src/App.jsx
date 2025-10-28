import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import BookingList from './components/BookingList';
import Calendar from './components/Calendar';
import { getBookings, addBooking, updateBooking, deleteBooking } from './utils/supabaseStorage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bookings khi app khởi động
  useEffect(() => {
    loadBookings();
  }, []);

  // Hàm load bookings từ Supabase
  const loadBookings = async () => {
    setLoading(true);
    const loadedBookings = await getBookings();
    setBookings(loadedBookings);
    setLoading(false);
  };

  // Thêm booking mới
  const handleAddBooking = async (bookingData) => {
    const newBooking = await addBooking(bookingData);
    if (newBooking) {
      setBookings([...bookings, newBooking]);
    }
  };

  // Cập nhật booking
  const handleUpdateBooking = async (id, updatedData) => {
    const updated = await updateBooking(id, updatedData);
    if (updated) {
      setBookings(bookings.map(b => b.id === id ? updated : b));
    }
  };

  // Xóa booking
  const handleDeleteBooking = async (id) => {
    const success = await deleteBooking(id);
    if (success) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  // Đánh dấu hoàn thành
  const handleCompleteBooking = async (id) => {
    const updated = await updateBooking(id, { isCompleted: true });
    if (updated) {
      setBookings(bookings.map(b => b.id === id ? updated : b));
    }
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' ? (
          <Dashboard
            bookings={bookings}
            onEdit={handleUpdateBooking}
            onDelete={handleDeleteBooking}
            onComplete={handleCompleteBooking}
          />
        ) : activeTab === 'list' ? (
          <BookingList
            bookings={bookings}
            onAdd={handleAddBooking}
            onEdit={handleUpdateBooking}
            onDelete={handleDeleteBooking}
            onComplete={handleCompleteBooking}
          />
        ) : (
          <Calendar
            bookings={bookings}
            onEdit={handleUpdateBooking}
            onDelete={handleDeleteBooking}
            onComplete={handleCompleteBooking}
          />
        )}
      </main>

      {/* Tab Navigation - Bottom */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="flex">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`
              flex-1 py-2.5 px-2 font-medium text-center transition-all
              ${activeTab === 'dashboard'
                ? 'text-green-700'
                : 'text-gray-400'
              }
            `}
          >
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div className="text-xs font-medium">Tổng quan</div>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`
              flex-1 py-2.5 px-2 font-medium text-center transition-all
              ${activeTab === 'list'
                ? 'text-green-700'
                : 'text-gray-400'
              }
            `}
          >
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'list' ? 2.5 : 2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <div className="text-xs font-medium">Danh sách</div>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`
              flex-1 py-2.5 px-2 font-medium text-center transition-all
              ${activeTab === 'calendar'
                ? 'text-green-700'
                : 'text-gray-400'
              }
            `}
          >
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'calendar' ? 2.5 : 2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-xs font-medium">Lịch</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

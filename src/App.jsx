import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import BookingList from './components/BookingList';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getBookings, addBooking, updateBooking, deleteBooking } from './utils/supabaseStorage';

// Main App Component (wrapped with AuthProvider)
const AppContent = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hideBottomNav, setHideBottomNav] = useState(false);

  // Load bookings khi app khởi động và user đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

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

  // Hiển thị loading khi đang kiểm tra authentication
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
          <p className="text-gray-600 font-medium">Đang khởi tạo...</p>
        </div>
      </div>
    );
  }

  // Hiển thị trang login nếu chưa đăng nhập
  if (!isAuthenticated) {
    return <Login />;
  }

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
            onViewChange={setHideBottomNav}
          />
        ) : activeTab === 'list' ? (
          <BookingList
            bookings={bookings}
            onAdd={handleAddBooking}
            onEdit={handleUpdateBooking}
            onDelete={handleDeleteBooking}
            onComplete={handleCompleteBooking}
            onViewChange={setHideBottomNav}
          />
        ) : activeTab === 'calendar' ? (
          <Calendar
            bookings={bookings}
            onEdit={handleUpdateBooking}
            onDelete={handleDeleteBooking}
            onComplete={handleCompleteBooking}
            onViewChange={setHideBottomNav}
          />
        ) : (
          <Settings />
        )}
      </main>

      {/* Tab Navigation - Compact Bottom Bar */}
      {!hideBottomNav && (
        <nav className="bg-white border-t border-gray-200 shadow-lg pb-safe">
        <div className="flex pb-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`
              flex-1 py-2 px-1 font-medium text-center transition-all
              ${activeTab === 'dashboard'
                ? 'text-green-700'
                : 'text-gray-400'
              }
            `}
          >
            <svg className="w-5 h-5 mx-auto mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div className="text-[10px] font-medium">Tổng quan</div>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`
              flex-1 py-2 px-1 font-medium text-center transition-all
              ${activeTab === 'list'
                ? 'text-green-700'
                : 'text-gray-400'
              }
            `}
          >
            <svg className="w-5 h-5 mx-auto mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'list' ? 2.5 : 2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <div className="text-[10px] font-medium">Danh sách</div>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`
              flex-1 py-2 px-1 font-medium text-center transition-all
              ${activeTab === 'calendar'
                ? 'text-green-700'
                : 'text-gray-400'
              }
            `}
          >
            <svg className="w-5 h-5 mx-auto mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'calendar' ? 2.5 : 2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-[10px] font-medium">Lịch</div>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`
              flex-1 py-2 px-1 font-medium text-center transition-all
              ${activeTab === 'settings'
                ? 'text-green-700'
                : 'text-gray-400'
              }
            `}
          >
            <svg className="w-5 h-5 mx-auto mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'settings' ? 2.5 : 2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'settings' ? 2.5 : 2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="text-[10px] font-medium">Cài đặt</div>
          </button>
        </div>
      </nav>
      )}
    </div>
  );
}

// Wrapper component với AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

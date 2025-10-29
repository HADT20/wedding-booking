import { useState } from 'react';
import { SAFE_AREA_PADDING } from '../utils/constants';
import { useDisplaySize } from '../contexts/DisplaySizeContext';
import { getSizeClasses } from '../utils/displaySizeClasses';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { displaySize, setDisplaySize } = useDisplaySize();
  const { user, logout, changePassword } = useAuth();
  const size = getSizeClasses(displaySize);

  // State cho modal đổi mật khẩu
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // State cho modal đăng xuất
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displaySizes = [
    { value: 'small', label: 'Nhỏ' },
    { value: 'medium', label: 'Vừa' },
    { value: 'large', label: 'Lớn' },
  ];

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    setPasswordLoading(true);

    try {
      const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);

      if (result.success) {
        setPasswordSuccess(true);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowChangePassword(false);
          setPasswordSuccess(false);
        }, 2000);
      } else {
        setPasswordError(result.error);
      }
    } catch (err) {
      setPasswordError('Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 pb-20">
      <div className={size.containerSpacing}>
        {/* Page Header */}
        <div className="px-4 pt-safe" style={SAFE_AREA_PADDING}>
          <div className={`bg-gradient-to-r from-green-600 to-teal-500 ${size.headerRounded} ${size.headerPadding} text-white shadow-md mt-2`}>
            <h2 className={`${size.headerTitle} font-bold mb-1`}>Cài đặt</h2>
            <p className={`${size.headerSubtitle} text-green-50`}>Quản lý thông tin và cài đặt ứng dụng</p>
          </div>
        </div>

        <div className={`px-4 ${size.containerSpacing}`}>
          {/* Tài khoản & Bảo mật */}
          <div className={`bg-white ${size.containerRounded} shadow-sm border border-gray-100 overflow-hidden`}>
            <div className={`${size.cardPadding} border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100`}>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-bold text-gray-900 ${size.textBase}`}>Tài khoản & Bảo mật</h3>
                  <p className={`${size.textXS} text-gray-500 mt-0.5`}>Quản lý thông tin đăng nhập</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              <div className={`${size.cardPadding}`}>
                <div className={`flex items-center ${size.gap}`}>
                  <div className={`${size.avatarBase} bg-green-50 ${size.containerRounded} flex items-center justify-center`}>
                    <svg className={`${size.iconSM} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className={`${size.textSM} font-semibold text-gray-900`}>Tên đăng nhập</div>
                    <div className={`${size.textXS} text-gray-500 mt-0.5`}>{user?.username}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowChangePassword(true)}
                className={`w-full ${size.cardPadding} flex items-center justify-between hover:bg-blue-50 transition-colors active:bg-blue-100 group`}
              >
                <div className={`flex items-center ${size.gap}`}>
                  <div className={`${size.avatarBase} bg-blue-50 group-hover:bg-blue-100 ${size.containerRounded} flex items-center justify-center transition-colors`}>
                    <svg className={`${size.iconSM} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className={`${size.textSM} font-semibold text-gray-900 group-hover:text-blue-700`}>Đổi mật khẩu</div>
                    <div className={`${size.textXS} text-gray-500 group-hover:text-blue-600 mt-0.5`}>Thay đổi mật khẩu đăng nhập</div>
                  </div>
                </div>
                <svg className={`${size.iconSM} text-gray-400 group-hover:text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={`w-full ${size.cardPadding} flex items-center justify-between hover:bg-red-50 transition-colors active:bg-red-100 group`}
              >
                <div className={`flex items-center ${size.gap}`}>
                  <div className={`${size.avatarBase} bg-red-50 group-hover:bg-red-100 ${size.containerRounded} flex items-center justify-center transition-colors`}>
                    <svg className={`${size.iconSM} text-red-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className={`${size.textSM} font-semibold text-red-600 group-hover:text-red-700`}>Đăng xuất</div>
                    <div className={`${size.textXS} text-red-500 group-hover:text-red-600 mt-0.5`}>Thoát khỏi ứng dụng</div>
                  </div>
                </div>
                <svg className={`${size.iconSM} text-red-400 group-hover:text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Giao diện */}
          <div className={`bg-white ${size.containerRounded} shadow-sm border border-gray-100 overflow-hidden`}>
            <div className={`${size.cardPadding} border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100`}>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-bold text-gray-900 ${size.textBase}`}>Giao diện</h3>
                  <p className={`${size.textXS} text-gray-500 mt-0.5`}>Tùy chỉnh kích thước hiển thị</p>
                </div>
              </div>
            </div>
            <div className={size.cardPadding}>
              <div className={`grid grid-cols-3 ${size.gap}`}>
                {displaySizes.map((sizeOption) => (
                  <label
                    key={sizeOption.value}
                    className={`
                      flex flex-col items-center justify-center p-3 ${size.containerRounded} border-2 transition-all cursor-pointer
                      ${displaySize === sizeOption.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="displaySize"
                      value={sizeOption.value}
                      checked={displaySize === sizeOption.value}
                      onChange={(e) => setDisplaySize(e.target.value)}
                      className="sr-only"
                    />

                    {/* Custom Radio Button */}
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mb-2
                      ${displaySize === sizeOption.value
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300 bg-white'
                      }
                    `}>
                      {displaySize === sizeOption.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>

                    {/* Label */}
                    <div className={`${size.textSM} font-semibold text-center ${displaySize === sizeOption.value ? 'text-purple-700' : 'text-gray-900'}`}>
                      {sizeOption.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Quản lý dữ liệu */}
          <div className={`bg-white ${size.containerRounded} shadow-sm border border-gray-100 overflow-hidden`}>
            <div className={`${size.cardPadding} border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100`}>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-bold text-gray-900 ${size.textBase}`}>Quản lý dữ liệu</h3>
                  <p className={`${size.textXS} text-gray-500 mt-0.5`}>Sao lưu và khôi phục dữ liệu</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              <button className={`w-full ${size.cardPadding} flex items-center justify-between hover:bg-orange-50 transition-colors active:bg-orange-100 group`}>
                <div className={`flex items-center ${size.gap}`}>
                  <div className={`${size.avatarBase} bg-orange-50 group-hover:bg-orange-100 ${size.containerRounded} flex items-center justify-center transition-colors`}>
                    <svg className={`${size.iconSM} text-orange-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className={`${size.textSM} font-semibold text-gray-900 group-hover:text-orange-700`}>Xuất dữ liệu</div>
                    <div className={`${size.textXS} text-gray-500 group-hover:text-orange-600 mt-0.5`}>Sao lưu dữ liệu ra file</div>
                  </div>
                </div>
                <svg className={`${size.iconSM} text-gray-400 group-hover:text-orange-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className={`w-full ${size.cardPadding} flex items-center justify-between hover:bg-teal-50 transition-colors active:bg-teal-100 group`}>
                <div className={`flex items-center ${size.gap}`}>
                  <div className={`${size.avatarBase} bg-teal-50 group-hover:bg-teal-100 ${size.containerRounded} flex items-center justify-center transition-colors`}>
                    <svg className={`${size.iconSM} text-teal-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className={`${size.textSM} font-semibold text-gray-900 group-hover:text-teal-700`}>Nhập dữ liệu</div>
                    <div className={`${size.textXS} text-gray-500 group-hover:text-teal-600 mt-0.5`}>Khôi phục từ file sao lưu</div>
                  </div>
                </div>
                <svg className={`${size.iconSM} text-gray-400 group-hover:text-teal-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Thông tin & Hỗ trợ */}
          <div className={`bg-white ${size.containerRounded} shadow-sm border border-gray-100 overflow-hidden`}>
            <div className={`${size.cardPadding} border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100`}>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-bold text-gray-900 ${size.textBase}`}>Thông tin & Hỗ trợ</h3>
                  <p className={`${size.textXS} text-gray-500 mt-0.5`}>Phiên bản và hướng dẫn</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              <div className={`${size.cardPadding}`}>
                <div className={`flex items-center ${size.gap}`}>
                  <div className={`${size.avatarBase} bg-green-50 ${size.containerRounded} flex items-center justify-center`}>
                    <svg className={`${size.iconSM} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className={`${size.textSM} font-semibold text-gray-900`}>Phiên bản</div>
                    <div className={`${size.textXS} text-gray-500 mt-0.5`}>v1.0.0 - Ổn định</div>
                  </div>
                </div>
              </div>
              <button className={`w-full ${size.cardPadding} flex items-center justify-between hover:bg-blue-50 transition-colors active:bg-blue-100 group`}>
                <div className={`flex items-center ${size.gap}`}>
                  <div className={`${size.avatarBase} bg-blue-50 group-hover:bg-blue-100 ${size.containerRounded} flex items-center justify-center transition-colors`}>
                    <svg className={`${size.iconSM} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className={`${size.textSM} font-semibold text-gray-900 group-hover:text-blue-700`}>Hướng dẫn sử dụng</div>
                    <div className={`${size.textXS} text-gray-500 group-hover:text-blue-600 mt-0.5`}>Xem cách sử dụng ứng dụng</div>
                  </div>
                </div>
                <svg className={`${size.iconSM} text-gray-400 group-hover:text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer info */}
          <div className={`text-center py-8 px-4`}>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center justify-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className={`font-bold text-gray-900 ${size.textSM}`}>Wedding Booking</h4>
                  <p className={`${size.textXS} text-gray-600`}>Quản lý lịch chụp ảnh cưới</p>
                </div>
              </div>
              <div className={`${size.textXS} text-gray-500 space-y-1`}>
                <p>© 2025 - Phát triển bởi Đinh Trung Hà</p>
                <p>Phiên bản 1.0.0 - Cập nhật mới nhất</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      {showChangePassword && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setShowChangePassword(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-xl">
              <h3 className="text-lg font-bold text-white">Đổi mật khẩu</h3>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu hiện tại"
                  disabled={passwordLoading}
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu mới"
                  disabled={passwordLoading}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={passwordLoading}
                />
              </div>

              {/* Success Message */}
              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-green-700">Đổi mật khẩu thành công!</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-700">{passwordError}</p>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
                  disabled={passwordLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {passwordLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    'Đổi mật khẩu'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận đăng xuất */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 rounded-t-xl">
              <h3 className="text-lg font-bold text-white">Xác nhận đăng xuất</h3>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-1">Bạn có chắc chắn muốn đăng xuất?</p>
                  <p className="text-gray-500 text-sm">Bạn sẽ cần đăng nhập lại để sử dụng ứng dụng.</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;


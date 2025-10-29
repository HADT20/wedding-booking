import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra authentication khi app khởi động
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const savedAuth = localStorage.getItem('wedding_app_auth');
    const rememberMe = localStorage.getItem('wedding_app_remember');
    
    if (savedAuth && rememberMe === 'true') {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUser(authData.user);
    }
    setLoading(false);
  };

  const login = async (username, password, rememberMe = false) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get stored password or use default
    const storedPassword = localStorage.getItem('wedding_app_password') || 'admin';
    
    if (username === 'Admin' && password === storedPassword) {
      const userData = {
        username: 'Admin',
        loginTime: new Date().toISOString()
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      
      // Save auth state
      const authData = {
        user: userData,
        timestamp: Date.now()
      };
      
      localStorage.setItem('wedding_app_auth', JSON.stringify(authData));
      localStorage.setItem('wedding_app_remember', rememberMe.toString());
      
      return { success: true };
    } else {
      return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('wedding_app_auth');
    localStorage.removeItem('wedding_app_remember');
  };

  const changePassword = async (currentPassword, newPassword) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const storedPassword = localStorage.getItem('wedding_app_password') || 'admin';
    
    if (currentPassword !== storedPassword) {
      return { success: false, error: 'Mật khẩu hiện tại không đúng' };
    }
    
    if (newPassword.length < 4) {
      return { success: false, error: 'Mật khẩu mới phải có ít nhất 4 ký tự' };
    }
    
    // Save new password
    localStorage.setItem('wedding_app_password', newPassword);
    
    return { success: true };
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

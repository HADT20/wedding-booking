import { createContext, useContext, useState, useEffect } from 'react';

const DisplaySizeContext = createContext();

export const useDisplaySize = () => {
  const context = useContext(DisplaySizeContext);
  if (!context) {
    throw new Error('useDisplaySize must be used within DisplaySizeProvider');
  }
  return context;
};

export const DisplaySizeProvider = ({ children }) => {
  const [displaySize, setDisplaySize] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('displaySize');
    return saved || 'small'; // default: small (hiện tại)
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('displaySize', displaySize);
  }, [displaySize]);

  const value = {
    displaySize,
    setDisplaySize,
    isSmall: displaySize === 'small',
    isMedium: displaySize === 'medium',
    isLarge: displaySize === 'large',
  };

  return (
    <DisplaySizeContext.Provider value={value}>
      {children}
    </DisplaySizeContext.Provider>
  );
};


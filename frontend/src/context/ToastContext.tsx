import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    // If there's already a toast, remove it first
    if (toast?.isVisible) {
      setToast(null);
      // Wait for the previous toast to be removed
      setTimeout(() => {
        setToast({ message, type, isVisible: true });
      }, 300);
    } else {
      setToast({ message, type, isVisible: true });
    }
  }, [toast]);

  const hideToast = useCallback(() => {
    setToast(prev => prev ? { ...prev, isVisible: false } : null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast?.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}; 
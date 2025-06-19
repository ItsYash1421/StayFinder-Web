type ToastType = 'success' | 'error' | 'info' | 'warning';

export const showToast = (message: string, type: ToastType = 'info') => {
  // For now, we'll just use console.log
  // In a real app, you would use a toast library like react-toastify
  console.log(`[${type.toUpperCase()}] ${message}`);
}; 
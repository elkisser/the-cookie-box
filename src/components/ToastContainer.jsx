import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-20 sm:bottom-24 right-0 sm:left-4 z-[100] space-y-2 w-full sm:w-auto px-2 sm:px-0">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          className="transform transition-all duration-300 ease-out animate-slideIn"
          style={{ 
            animation: `slideIn 0.3s ease-out forwards, fadeOut 0.3s ease-out ${toast.duration - 300}ms forwards`,
            zIndex: 1000 + index
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
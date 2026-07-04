import React, { useEffect } from 'react';
import { CheckIcon, WarningIcon, AlertIcon, InfoIcon, CloseIcon } from './Icons';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckIcon className="w-5 h-5 text-white" />;
      case 'error':
        return <AlertIcon className="w-5 h-5 text-white" />;
      case 'warning':
        return <WarningIcon className="w-5 h-5 text-slate-900" />;
      case 'info':
      default:
        return <InfoIcon className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className={`toast-notification ${toast.type} animate-slide-in`}>
      <div className="toast-icon-wrapper">
        {getIcon()}
      </div>
      <div className="toast-content">
        {toast.message}
      </div>
      <button className="toast-close-btn" onClick={() => onClose(toast.id)}>
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container-fixed">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

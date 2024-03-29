import React, { useEffect, useState } from "react";

interface ToastProps {
  show: boolean;
  message: string;
  autoClose?: number;
}

const Toast: React.FC<ToastProps> = ({ show, message, autoClose = 5000 }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-green-600 shadow-sm hover:bg-green-700">
      {message}
    </div>
  );
};

export default Toast;

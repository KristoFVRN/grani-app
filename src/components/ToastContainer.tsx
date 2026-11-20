import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, clearNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((msg, idx) => (
        <div
          key={idx}
          className="pointer-events-auto bg-[#4e1984] text-[#f7f8ea] px-4 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{msg}</span>
          </div>
          <button
            onClick={() => clearNotification(idx)}
            className="text-white/60 hover:text-white shrink-0 p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

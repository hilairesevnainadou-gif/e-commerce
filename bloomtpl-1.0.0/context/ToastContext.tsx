"use client";

import { CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { createContext, useCallback, useContext, useState } from "react";

interface ToastData {
  id: string;
  message: string;
  linkHref?: string;
  linkLabel?: string;
}

interface ToastContextProps {
  showToast: (message: string, linkHref?: string, linkLabel?: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, linkHref?: string, linkLabel?: string) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, linkHref, linkLabel }]);
      setTimeout(() => dismissToast(id), 4500);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 shadow-lg animate-in slide-in-from-top-2 fade-in duration-300"
          >
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm text-green-900 leading-relaxed">
              {toast.message}
              {toast.linkHref && (
                <>
                  {" "}
                  <Link
                    href={toast.linkHref}
                    className="font-medium underline hover:no-underline"
                    onClick={() => dismissToast(toast.id)}
                  >
                    {toast.linkLabel || "Voir"}
                  </Link>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Fermer la notification"
              className="text-green-700 hover:text-green-900 shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

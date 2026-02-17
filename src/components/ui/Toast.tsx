"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { globalToast, type Toast as ToastType, type ToastType as ToastVariant } from "@/hooks/useToast";

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-600" />,
  error: <XCircle className="h-5 w-5 text-red-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
  info: <Info className="h-5 w-5 text-primary" />,
};

const bgColors: Record<ToastVariant, string> = {
  success: "border-l-green-500",
  error: "border-l-red-500",
  warning: "border-l-yellow-500",
  info: "border-l-primary",
};

interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-start gap-3 p-4
        bg-white border border-gray-200 rounded-lg
        border-l-4 ${bgColors[toast.type]}
        shadow-lg
        animate-in slide-in-from-right fade-in duration-300
      `}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-medium text-gray-900">{toast.title}</p>
        )}
        <p className={`text-sm ${toast.title ? "text-gray-500" : "text-gray-900"}`}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

const positionStyles: Record<NonNullable<ToastContainerProps["position"]>, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

export function ToastContainer({ position = "top-right" }: ToastContainerProps) {
  const toasts = useSyncExternalStore(
    globalToast.subscribe,
    globalToast.getSnapshot,
    () => []
  );

  if (toasts.length === 0) return null;

  const content = (
    <div
      className={`fixed z-[100] flex flex-col gap-2 w-full max-w-sm ${positionStyles[position]}`}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={globalToast.dismiss} />
      ))}
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return null;
}

// Local toast container for use with useToast hook
interface LocalToastContainerProps extends ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function LocalToastContainer({
  toasts,
  onDismiss,
  position = "top-right",
}: LocalToastContainerProps) {
  if (toasts.length === 0) return null;

  const content = (
    <div
      className={`fixed z-[100] flex flex-col gap-2 w-full max-w-sm ${positionStyles[position]}`}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return null;
}

export { globalToast as toast };
export default ToastContainer;

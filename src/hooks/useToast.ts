"use client";

import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastOptions {
  title?: string;
  duration?: number;
}

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: ToastType, message: string, options: ToastOptions = {}) => {
      const id = `toast-${++toastIdCounter}`;
      const { title, duration = 5000 } = options;

      const toast: Toast = {
        id,
        type,
        message,
        title,
        duration,
      };

      setToasts((prev) => [...prev, toast]);

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = {
    success: (message: string, options?: ToastOptions) =>
      addToast("success", message, options),
    error: (message: string, options?: ToastOptions) =>
      addToast("error", message, options),
    warning: (message: string, options?: ToastOptions) =>
      addToast("warning", message, options),
    info: (message: string, options?: ToastOptions) =>
      addToast("info", message, options),
  };

  return {
    toasts,
    toast,
    dismiss,
    dismissAll,
  };
}

// Global toast state for use outside of React components
type ToastListener = (toasts: Toast[]) => void;
let listeners: ToastListener[] = [];
let globalToasts: Toast[] = [];

function emitChange() {
  for (const listener of listeners) {
    listener(globalToasts);
  }
}

export const globalToast = {
  success: (message: string, options: ToastOptions = {}) => {
    const id = `toast-${++toastIdCounter}`;
    const { title, duration = 5000 } = options;
    const toast: Toast = { id, type: "success", message, title, duration };
    globalToasts = [...globalToasts, toast];
    emitChange();
    if (duration > 0) {
      setTimeout(() => globalToast.dismiss(id), duration);
    }
    return id;
  },
  error: (message: string, options: ToastOptions = {}) => {
    const id = `toast-${++toastIdCounter}`;
    const { title, duration = 5000 } = options;
    const toast: Toast = { id, type: "error", message, title, duration };
    globalToasts = [...globalToasts, toast];
    emitChange();
    if (duration > 0) {
      setTimeout(() => globalToast.dismiss(id), duration);
    }
    return id;
  },
  warning: (message: string, options: ToastOptions = {}) => {
    const id = `toast-${++toastIdCounter}`;
    const { title, duration = 5000 } = options;
    const toast: Toast = { id, type: "warning", message, title, duration };
    globalToasts = [...globalToasts, toast];
    emitChange();
    if (duration > 0) {
      setTimeout(() => globalToast.dismiss(id), duration);
    }
    return id;
  },
  info: (message: string, options: ToastOptions = {}) => {
    const id = `toast-${++toastIdCounter}`;
    const { title, duration = 5000 } = options;
    const toast: Toast = { id, type: "info", message, title, duration };
    globalToasts = [...globalToasts, toast];
    emitChange();
    if (duration > 0) {
      setTimeout(() => globalToast.dismiss(id), duration);
    }
    return id;
  },
  dismiss: (id: string) => {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    emitChange();
  },
  dismissAll: () => {
    globalToasts = [];
    emitChange();
  },
  subscribe: (listener: ToastListener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot: () => globalToasts,
};

export default useToast;

// src/components/ui/Toast.tsx
"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const color =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div
      className={`${color} text-white px-6 py-3 rounded shadow-lg fixed top-6 left-1/2 transform -translate-x-1/2 z-50 text-lg animate-fade-in`}
    >
      {message}
    </div>
  );
}

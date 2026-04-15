"use client";

import { createContext, useContext, useState } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

type SnackbarType = "success" | "error" | "info";

interface Snackbar {
  message: string;
  type: SnackbarType;
}

const SnackbarContext = createContext<any>(null);

// 🔥 GLOBAL FUNCTION
let globalShowSnackbar:
  | ((msg: string, type?: SnackbarType) => void)
  | null = null;

export function SnackbarProvider({ children }: any) {
  const [snackbar, setSnackbar] = useState<Snackbar | null>(null);

  const showSnackbar = (message: string, type: SnackbarType = "info") => {
    setSnackbar({ message, type });

    setTimeout(() => {
      setSnackbar(null);
    }, 3000);
  };

  globalShowSnackbar = showSnackbar;

  const getIcon = () => {
    if (!snackbar) return null;

    switch (snackbar.type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <XCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getColor = () => {
    if (!snackbar) return "";

    switch (snackbar.type) {
      case "success":
        return "from-green-500/80 to-green-700/80";
      case "error":
        return "from-red-500/80 to-red-700/80";
      default:
        return "from-[#0F766E]/80 to-[#115e59]/80";
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {/* 🔥 PREMIUM TOAST */}
      {snackbar && (
        <div
          className={`fixed top-5 right-5 z-[9999]
          flex items-center gap-3
          px-5 py-3 rounded-xl
          backdrop-blur-lg bg-gradient-to-r ${getColor()}
          border border-white/20 shadow-2xl text-white
          animate-slideIn`}
        >
          {/* ICON */}
          <div className="opacity-90">{getIcon()}</div>

          {/* MESSAGE */}
          <div className="text-sm font-medium">
            {snackbar.message}
          </div>
        </div>
      )}
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => useContext(SnackbarContext);

// 🔥 GLOBAL FUNCTION
export const toast = (msg: string, type: SnackbarType = "info") => {
  if (globalShowSnackbar) {
    globalShowSnackbar(msg, type);
  }
};
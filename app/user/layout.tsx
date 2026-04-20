"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [hasUserToken, setHasUserToken] = useState<boolean>(false);

  // ✅ Always re-check token on route change
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("userToken");
      setHasUserToken(!!token);
    };

    checkToken();

    // ✅ Listen for token updates across tabs/components
    window.addEventListener("storage", checkToken);

    return () => window.removeEventListener("storage", checkToken);
  }, [pathname]);

  // ✅ Handle sidebar width
  useEffect(() => {
    const setWidth = () => {
      const isMobile = window.innerWidth < 768;
      const width = hasUserToken ? (isMobile ? 0 : 60) : 0;

      document.documentElement.style.setProperty(
        "--sidebar-width",
        `${width}px`
      );
    };

    setWidth();
    window.addEventListener("resize", setWidth);

    return () => window.removeEventListener("resize", setWidth);
  }, [hasUserToken]);

  return (
    <div className="flex">
      {/* ✅ Sidebar updates instantly */}
      {hasUserToken && <Sidebar />}

      <div
        className="flex-1 min-h-screen bg-[#F8FAFC]"
        style={{
          marginLeft: hasUserToken ? "var(--sidebar-width)" : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}
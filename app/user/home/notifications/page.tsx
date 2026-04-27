"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Clock,
  Trash2,
  Home,
  MessageCircle,
  IndianRupee,
} from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE = "https://pgthikana.in/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  metadata?: any;
  notification_type?: string;
  isRent?: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("userToken")
      : null;

  // ─── STYLE HANDLER (🔥 MAIN FIX) ─────────────────────
  const getStyle = (type?: string, isRent?: boolean) => {
    if (isRent) {
      return {
        icon: <IndianRupee size={18} />,
        color: "text-orange-600",
        bg: "bg-orange-50",
      };
    }

    switch (type) {
      case "booking_created":
      case "booking_confirmed":
        return {
          icon: <Home size={18} />,
          color: "text-green-600",
          bg: "bg-green-50",
        };

      case "chat_message":
        return {
          icon: <MessageCircle size={18} />,
          color: "text-blue-600",
          bg: "bg-blue-50",
        };

      default:
        return {
          icon: <Bell size={18} />,
          color: "text-[#0F766E]",
          bg: "bg-[#E6F4F2]",
        };
    }
  };

  // ─── FETCH ALL ─────────────────────────────────────
  const loadAll = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchNotifications(),
        fetchUnreadCount(),
        fetchPendingRent(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    await fetch(`${API_BASE}/notifications/read-all`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setNotifications((prev) => prev.filter((n) => n.isRent));
    setUnreadCount(0);
  };

  const fetchNotifications = async () => {
    const res = await fetch(`${API_BASE}/notifications/unread`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) setNotifications(data.notifications || []);
  };

  const fetchUnreadCount = async () => {
    const res = await fetch(`${API_BASE}/notifications/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) setUnreadCount(data.unreadCount || 0);
  };

  const fetchPendingRent = async () => {
    const res = await fetch(`${API_BASE}/rent/user/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (data.success) {
      const rentNotifications = data.pendingRent.map((r: any) => ({
        id: `rent_${r.id}`,
        title: r.isOverdue ? "Rent Overdue 🚨" : "Upcoming Rent Due",
        message: `₹${r.rent_amount} for ${r.property_name}`,
        created_at: r.due_date,
        isRent: true,
      }));

      setNotifications((prev) => [...prev, ...rentNotifications]);
    }
  };

  const markAsRead = async (id: string) => {
    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const deleteNotification = async (id: string) => {
    await fetch(`${API_BASE}/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    loadAll();

    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (raw: string) => {
    const d = new Date(raw);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* HEADER */}
      <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-[#0D1B1E]">
            Notifications
          </h1>

          {unreadCount > 0 && (
            <span className="bg-[#0F766E] text-white text-[10px] px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="text-[#0F766E]" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          <button
            onClick={markAllRead}
            disabled={notifications.length === 0}
            className="text-xs font-semibold text-[#0F766E] hover:underline disabled:opacity-40"
          >
            Mark all read
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-2xl mx-auto p-4">
        {loading ? (
          <div className="text-center mt-20 text-gray-500">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center mt-20 text-gray-400">
            No notifications
          </div>
        ) : (
          notifications
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((n) => {
              const style = getStyle(
                n.notification_type,
                n.isRent
              );

              return (
                <div
                  key={n.id}
                  className={`rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition ${style.bg}`}
                >
                  <div className="flex gap-3">
                    <div className={style.color}>{style.icon}</div>

                    <div className="flex-1">
                      <p className={`font-semibold ${style.color}`}>
                        {n.title}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {n.message}
                      </p>

                      {/* 🔥 BOOKING CTA */}
                      {(n.notification_type ===
                        "booking_created" ||
                        n.notification_type ===
                          "booking_confirmed") && (
                        <button
                          onClick={() =>
                            router.push(
                              "/vendor/dashboard/bookings"
                            )
                          }
                          className="text-xs text-[#0F766E] mt-2 font-medium"
                        >
                          View Booking →
                        </button>
                      )}

                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <Clock size={12} />
                        {formatDate(n.created_at)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-green-600 text-xs"
                      >
                        Read
                      </button>

                      <button
                        onClick={() =>
                          deleteNotification(n.id)
                        }
                        className="text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
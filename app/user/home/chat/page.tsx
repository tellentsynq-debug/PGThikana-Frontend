"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { ArrowLeft } from "lucide-react";

const API_BASE = "https://pgthikana.in/api";

export default function ChatListPage() {
  const router = useRouter();

  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("userToken")
      : null;

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchConversations();
    connectSocket();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE}/room/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setConversations(data.conversations || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  /* ================= SOCKET ================= */
  const connectSocket = () => {
    const socket = io("https://pgthikana.in", {
      transports: ["websocket"],
      auth: { token },
    });

    socket.on("receiveMessage", (data: any) => {
      setConversations((prev) => {
        const updated = [...prev];

        for (let chat of updated) {
          if (
            String(chat.id) ===
            String(data.conversationId || data.conversation_id)
          ) {
            chat.lastMessage = data.message;
            chat.lastMessageTime =
              data.createdAt || data.created_at;

            if (data.senderId !== chat.user_id) {
              chat.unreadCount = (chat.unreadCount || 0) + 1;
            }
            break;
          }
        }

        return [...updated];
      });
    });

    return () => socket.disconnect();
  };

  /* ================= HELPERS ================= */
  const formatTime = (time?: string) => {
    if (!time) return "";
    try {
      return time.substring(11, 16);
    } catch {
      return "";
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* 🔥 HEADER */}
      <div className="sticky top-0 z-20 bg-teal-700 text-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-teal-700 text-white"
        >
          <ArrowLeft></ArrowLeft>
        </button>

        <h1 className="font-semibold text-lg">
          Chats
        </h1>
      </div>

      {/* 🔥 LIST */}
      <div className="max-w-4xl mx-auto px-3 py-4 space-y-3">

        {conversations.map((chat) => {
          const rawName =
  chat.vendorName ||
  chat.userName ||
  chat.name ||
  "";

const name =
  rawName && rawName !== "undefined" ? rawName : "User";
          const lastMessage = chat.lastMessage || "";
          const unread = chat.unreadCount || 0;
          const time = formatTime(chat.lastMessageTime);

          return (
            <div
              key={chat.id}
              onClick={() =>
                router.push(
  `/user/home/chat/details?conversationId=${chat.id}&name=${encodeURIComponent(name || "User")}`
)
              }
              className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition cursor-pointer"
            >

              {/* 🔥 AVATAR */}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-100 text-teal-700 text-[#0F766E] font-bold text-lg">
                {name.charAt(0).toUpperCase()}
              </div>

              {/* 🔥 TEXT */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">
                  {name}
                </p>

                <p className="text-sm text-gray-600 truncate">
                  {lastMessage}
                </p>
              </div>

              {/* 🔥 RIGHT */}
              <div className="flex flex-col items-end gap-1">

                <span
                  className={`text-xs ${
                    unread > 0
                      ? "text-teal-700 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {time}
                </span>

                {unread > 0 && (
                  <div className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unread}
                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}
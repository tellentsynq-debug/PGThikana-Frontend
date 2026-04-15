"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { toast } from "@/app/context/SnackbarContext";

type Chat = {
  id?: number;
  conversationId?: number;

  userName?: string;
  vendorName?: string;
  adminName?: string;

  userId?: number;
  user_id?: number;
  vendor_id?: number;
  admin_id?: number;

  // ✅ ADD THESE (YOU MISSED THESE)
  second_admin_id?: number;
  conversation_type?: string;

  lastMessage?: string;
  lastMessageTime?: string;
};
export default function ChatPage() {
  const router = useRouter();

  const [chats, setChats] = useState<Chat[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const [socket, setSocket] = useState<Socket | null>(null);

  // ✅ ADMIN STATE
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const [currentUserId, setCurrentUserId] = useState<number>(0);

useEffect(() => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) return;

  setCurrentUserId(Number(userId));

  fetchChats(token);
  fetchAdmins(token);

  return () => {
    socket?.disconnect();
  };
}, []);

  /* ---------------- FETCH ADMINS ---------------- */
  const fetchAdmins = async (token: string) => {
    try {
      const res = await fetch(
        "https://pgthikana.in/api/admin/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await res.text();
      let data = null;

      try {
        data = JSON.parse(text);
      } catch {
        toast("Invalid server response");
        return;
      }

      if (!res.ok) {
        toast(data?.message || "Failed to fetch admins");
        return;
      }

      setAdmins(Array.isArray(data?.admins) ? data.admins : []);
    } catch (err) {
      console.error("Admin fetch error:", err);
    }
  };

  /* ---------------- FETCH CHATS ---------------- */
  const fetchChats = async (token: string) => {
    try {
      const res = await fetch(
        "https://pgthikana.in/api/room/conversations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      const chatList = data.conversations || [];

      setChats(chatList);

      if (chatList.length > 0) {
        connectSocket(chatList, token);
      }

      chatList.forEach((chat: Chat) => {
        const convId = chat.conversationId ?? chat.id;

        let targetId = 0;

        if (chat.admin_id === currentUserId) {
          if (chat.vendor_id) targetId = chat.vendor_id;
          else if (chat.user_id) targetId = chat.user_id;
        } else {
          targetId = chat.admin_id ?? 0;
        }

        if (convId && targetId) {
          fetchUnreadCount(convId, targetId, token);
        }
      });
    } catch (err) {
      console.error("Fetch chats error:", err);
    }
  };

  /* ---------------- CREATE CONVERSATION ---------------- */
  const createConversation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (!selectedAdmin) {
        toast("Select an admin");
        return;
      }

      const res = await fetch(
        "https://pgthikana.in/api/room/conversation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipientId: selectedAdmin.id,
            recipientType: "admin", // ✅ FIXED
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast("Conversation created");
        fetchChats(token);
        setSelectedAdmin(null);
      } else {
        toast(data.message || "Failed");
      }
    } catch (err) {
      console.error(err);
      toast("Error creating conversation");
    }
  };

  /* ---------------- UNREAD COUNT ---------------- */
  const fetchUnreadCount = async (
    convId: number,
    userId: number,
    token: string
  ) => {
    try {
      const res = await fetch(
        `https://pgthikana.in/api/room/conversation/${convId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      const msgs = data.messages || [];

      const count = msgs.filter(
        (msg: any) => msg.is_read === 0 && msg.sender_id !== userId
      ).length;

      setUnreadCounts((prev) => ({
        ...prev,
        [convId]: count,
      }));
    } catch (e) {
      console.error("Unread error:", e);
    }
  };

  /* ---------------- SOCKET ---------------- */
  const connectSocket = (chatList: Chat[], token: string) => {
    const s = io("https://pgthikana.in", {
      transports: ["websocket"],
      auth: { token },
    });

    s.on("connect", () => {
      chatList.forEach((chat) => {
        const convId = chat.conversationId ?? chat.id;
        if (convId) {
          s.emit("joinConversation", convId.toString());
        }
      });
    });

    s.on("receiveMessage", (data: any) => {
      const convId = data.conversationId ?? data.conversation_id;
      const senderId = data.senderId ?? data.sender_id;

      let message = data.message || "";
      if (!message && data.fileUrl) message = "📎 File";

      setChats((prevChats) =>
        prevChats.map((chat) => {
          const chatId = chat.conversationId ?? chat.id;

          if (chatId?.toString() === convId?.toString()) {
            return {
              ...chat,
              lastMessage: message,
              lastMessageTime: data.createdAt ?? data.created_at,
            };
          }
          return chat;
        })
      );

      setUnreadCounts((prev) => ({
        ...prev,
        [convId]: (prev[convId] || 0) + 1,
      }));
    });

    setSocket(s);
  };

  /* ---------------- FORMAT TIME ---------------- */
  const formatTime = (time?: string) => {
    if (!time) return "";
    return time.substring(11, 16);
  };

  /* ---------------- NAVIGATION ---------------- */
  const openChat = (
    conversationId: number,
    userId: number,
    name: string
  ) => {
    router.push(
      `/super-admin/admin-chat/detail?conversationId=${conversationId}&userId=${userId}&name=${encodeURIComponent(
        name
      )}`
    );
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetchChats(token);
    fetchAdmins(token); // ✅ IMPORTANT

    return () => {
      socket?.disconnect();
    };
  }, []);

  const getAdminName = (adminId?: number) => {
  if (!adminId) return "Admin";

  const admin = admins.find((a) => a.id === adminId);
  return (
    admin?.name ||
    admin?.adminName ||
    `Admin ${adminId}`
  );
};

  /* ---------------- UI ---------------- */
  return (
    <div
      className="min-h-screen bg-[#F0F2F5]"
      style={{ marginLeft: "var(--sidebar-width)" }}
    >
      {/* HEADER */}
      <div className="bg-[#0F766E] text-white px-5 py-4 text-lg font-semibold shadow">
        Chats
      </div>

      {/* 🔥 ADMIN DROPDOWN */}
      <div className="px-4 pt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">
              Start new conversation
            </label>

            <select
              value={selectedAdmin?.id || ""}
              onChange={(e) => {
                const admin = admins.find(
                  (a) => a.id == e.target.value
                );
                setSelectedAdmin(admin);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none text-sm text-black bg-white"
            >
              <option value="">Select Admin</option>

              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name || admin.adminName || `Admin ${admin.id}`}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={createConversation}
            className="mt-5 bg-[#0F766E] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#0c6560] transition"
          >
            Create
          </button>
        </div>
      </div>

      {/* CHAT LIST */}
      <div className="px-3 py-3 space-y-2">
        {chats
  .filter((chat) => chat.conversation_type !== "vendor-admin") // ❌ remove vendor chats
  .map((chat, index) => {
let name = "";
let role = "";

// ✅ ADMIN ↔ ADMIN (includes SUPER ADMIN)
if (chat.conversation_type === "admin-admin") {
  const otherAdminId =
    chat.admin_id === currentUserId
      ? chat.second_admin_id
      : chat.admin_id;

  name =
    getAdminName(otherAdminId) ||
    `Admin ${otherAdminId}`;

  role = "ADMIN";
}

// ✅ ADMIN ↔ VENDOR / USER
else if (chat.conversation_type === "vendor-admin") {
  name = chat.vendorName || `Vendor ${chat.vendor_id}`;
  role = "VENDOR";
}
else if (chat.conversation_type === "user-admin") {
  name = chat.userName || `User ${chat.user_id}`;
  role = "USER";
}

// ✅ FINAL SAFETY
if (!name) {
  name = "Unknown";
  role = "";
}

        

          const conversationId =
            chat.conversationId ?? chat.id ?? 0;

          let targetId =
            chat.admin_id === currentUserId
              ? chat.vendor_id || chat.user_id || 0
              : chat.admin_id || 0;

          const unread = unreadCounts[conversationId] ?? 0;

          return (
            <div
              key={index}
              onClick={() =>
                openChat(conversationId, targetId, name)
              }
              className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm cursor-pointer hover:bg-[#f5f5f5]"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] font-bold text-lg">
                {name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-900">
                    {name} ({role})
                  </p>
                </div>

                <div className="flex justify-between mt-1">
                  <p className="text-gray-500 text-sm">
                    {chat.lastMessage || "No messages yet"}
                  </p>

                  {unread > 0 && (
                    <div className="bg-green-500 text-white text-xs px-2 rounded-full">
                      {unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
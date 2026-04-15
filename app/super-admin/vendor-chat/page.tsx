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
  lastMessage?: string;
  lastMessageTime?: string;
};

export default function ChatPage() {
  const router = useRouter();

  const [chats, setChats] = useState<Chat[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const [socket, setSocket] = useState<Socket | null>(null);
const [vendors, setVendors] = useState<any[]>([]);
const [selectedVendor, setSelectedVendor] = useState<any>(null);


const fetchVendors = async (token: string) => {
  try {
    const res = await fetch(
      "https://pgthikana.in/api/vendor/superadmin/all-vendors",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setVendors(data.vendors || []);
  } catch (err) {
    console.error("Vendor fetch error:", err);
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

      console.log("Chats:", chatList);

      setChats(chatList);

      // connect socket ONLY if chats exist
      if (chatList.length > 0) {
        connectSocket(chatList, token);
      }

      // fetch unread counts
      chatList.forEach((chat: Chat) => {
  const convId = chat.conversationId ?? chat.id;



  let targetId = 0;

  // 👉 if YOU are admin, pick the OTHER person
  if (chat.admin_id === currentUserId) {
    if (chat.vendor_id) {
      targetId = chat.vendor_id;
    } else if (chat.user_id) {
      targetId = chat.user_id;
    }
  }
  // 👉 if YOU are vendor/user (future safe)
  else if (chat.vendor_id === currentUserId || chat.user_id === currentUserId) {
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

const createConversation = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!selectedVendor) {
      toast("Select a vendor");
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
          recipientId: selectedVendor.id,
          recipientType: "vendor",
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      toast("Conversation created");
      fetchChats(token);
      setSelectedVendor(null);
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
      console.log("✅ Socket Connected");

      chatList.forEach((chat) => {
        const convId = chat.conversationId ?? chat.id;
        if (convId) {
          s.emit("joinConversation", convId.toString());
        }
      });
    });

    s.on("receiveMessage", (data: any) => {
      if (!data) return;

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

      setUnreadCounts((prev) => {
        const current = prev[convId] || 0;
        return {
          ...prev,
          [convId]:
            senderId !== undefined ? current + 1 : current,
        };
      });
    });

    s.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
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
  fetchVendors(token); // 🔥 ADD THIS
  return () => {
    socket?.disconnect();
  };
}, []);

const currentUserId = Number(localStorage.getItem("userId"));

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

      <div className="px-4 pt-4">
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center gap-3">

    {/* DROPDOWN */}
    <div className="flex-1">
      <label className="text-xs text-gray-500 mb-1 block">
        Start new conversation
      </label>

      <select
        value={selectedVendor?.id || ""}
        onChange={(e) => {
          const vendor = vendors.find(v => v.id == e.target.value);
          setSelectedVendor(vendor);
        }}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none text-sm text-black bg-white"
      >
        <option value="">Select Vendor</option>
        {vendors.map((vendor) => (
          <option key={vendor.id} value={vendor.id}>
            {vendor.name} ({vendor.email})
          </option>
        ))}
      </select>
    </div>

    {/* BUTTON */}
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
  .filter((chat) => {
    // ✅ only vendor conversations
    if (!chat.vendor_id) return false;

    // ✅ remove empty names
    if (!chat.vendorName || chat.vendorName.trim() === "") return false;

    return true;
  })
  .map((chat, index) => {
    let name = "";
let role = "";

// 👉 YOU are admin → show OTHER
if (chat.admin_id === currentUserId) {
  if (chat.vendor_id) {
    name = chat.vendorName || "Vendor";
    role = "VENDOR";
  } else if (chat.user_id) {
    name = chat.userName || "User";
    role = "USER";
  }
} else {
  name = chat.adminName || "Admin";
  role = "SUPER ADMIN";
}
          const message = chat.lastMessage ?? "";
          const time = formatTime(chat.lastMessageTime);

          const conversationId =
            chat.conversationId ?? chat.id ?? 0;


let targetId = 0;
let targetName = "";

// 👉 YOU are admin → show OTHER
if (chat.admin_id === currentUserId) {
  if (chat.vendor_id) {
    targetId = chat.vendor_id;
    targetName = chat.vendorName || "Vendor";
  } else if (chat.user_id) {
    targetId = chat.user_id;
    targetName = chat.userName || "User";
  }
}
// 👉 fallback (future safe)
else {
  targetId = chat.admin_id ?? 0;
  targetName = chat.adminName || "Admin";
}

          const unread =
            unreadCounts[conversationId] ?? 0;

          return (
            <div
              key={index}
             onClick={() =>
  openChat(conversationId, targetId, targetName)
}
              className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm cursor-pointer hover:bg-[#f5f5f5] transition"
            >
              {/* AVATAR */}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] font-bold text-lg">
                {name.charAt(0).toUpperCase()}
              </div>

              {/* CENTER CONTENT */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[15px] text-gray-900 truncate">
  {name}{" "}
  <span className="text-xs text-gray-500">
    ({role})
  </span>
</p>

                  <p className="text-[11px] text-gray-500">
                    {time}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <p className="text-[13px] text-gray-500 truncate max-w-[70%]">
                    {message || "No messages yet"}
                  </p>

                  {unread > 0 && (
                    <div className="ml-2 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-[#25D366] text-white text-[11px] font-semibold">
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
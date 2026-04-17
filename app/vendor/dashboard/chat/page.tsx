"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { toast } from "@/app/context/SnackbarContext";
import { ArrowLeft } from "lucide-react";


type Chat = {
  id?: number;
  conversationId?: number;
  userName?: string;
  userId?: number;
  user_id?: number;
  lastMessage?: string;
  lastMessageTime?: string;
};

export default function ChatPage() {
  const router = useRouter();

  const [chats, setChats] = useState<Chat[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const [socket, setSocket] = useState<Socket | null>(null);

  const TOKEN =
    typeof window !== "undefined" ? localStorage.getItem("vendorToken") : null;

    

  /* ---------------- FETCH CHATS ---------------- */
  const fetchChats = async () => {
    try {
      const res = await fetch(
        "https://pgthikana.in/api/room/conversations",
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const data = await res.json();
      const chatList = data.conversations || [];

      setChats(chatList);

      // connect socket AFTER chats
      connectSocket(chatList);

      // fetch unread counts
      chatList.forEach((chat: Chat) => {
        const convId = chat.conversationId ?? chat.id;
        const userId = chat.userId ?? chat.user_id;

        if (convId && userId) {
          fetchUnreadCount(convId, userId);
        }
      });
    } catch (err) {
      console.error("Fetch chats error:", err);
    }
  };

  /* ---------------- UNREAD COUNT ---------------- */
  const fetchUnreadCount = async (convId: number, userId: number) => {
    try {
      const res = await fetch(
        `https://pgthikana.in/api/room/conversation/${convId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const data = await res.json();
      const msgs = data.messages || [];

      const count = msgs.filter(
        (msg: any) =>
          msg.is_read === 0 && msg.sender_id !== userId
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
  const connectSocket = (chatList: Chat[]) => {
    const s = io("https://pgthikana.in", {
      transports: ["websocket"],
      auth: { token: TOKEN },
    });

    s.on("connect", () => {
      console.log("✅ Socket Connected");

      // join all conversations
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
              lastMessageTime:
                data.createdAt ?? data.created_at,
            };
          }
          return chat;
        })
      );

      // unread logic
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
    `/vendor/dashboard/chat/detail?conversationId=${conversationId}&userId=${userId}&name=${encodeURIComponent(name)}`
  );
};

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (!TOKEN) return;
    fetchChats();

    return () => {
      socket?.disconnect();
    };
  }, []);

  /* ---------------- UI ---------------- */
return (
  <div className="min-h-screen bg-[#F0F2F5]">
    
    {/* HEADER */}
   <div className="bg-[#0F766E] text-white px-5 py-4 flex items-center gap-3 shadow">

  {/* BACK BUTTON */}
  <button
    onClick={() => router.back()}
    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
  >
    <ArrowLeft size={18} />
  </button>

  <span className="text-lg font-semibold">
    Chats
  </span>

</div>

    {/* CHAT LIST */}
    <div className="px-3 py-3 space-y-2">
      {chats.map((chat, index) => {
        const name = chat.userName ?? "User";
        const message = chat.lastMessage ?? "";
        const time = formatTime(chat.lastMessageTime);

        const conversationId =
          chat.conversationId ?? chat.id ?? 0;

        const userId =
          chat.userId ?? chat.user_id ?? 0;

        const unread =
          unreadCounts[conversationId] ?? 0;

        return (
          <div
            key={index}
            onClick={() =>
              openChat(conversationId, userId, name)
            }
            className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm cursor-pointer hover:bg-[#f5f5f5] transition"
          >
            
            {/* AVATAR */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] font-bold text-lg">
              {name.charAt(0).toUpperCase()}
            </div>

            {/* CENTER CONTENT */}
            <div className="flex-1 min-w-0">
              
              {/* NAME + TIME */}
              <div className="flex justify-between items-center">
                <p className="font-semibold text-[15px] text-gray-900 truncate">
                  {name}
                </p>

                <p className="text-[11px] text-gray-500">
                  {time}
                </p>
              </div>

              {/* MESSAGE + UNREAD */}
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
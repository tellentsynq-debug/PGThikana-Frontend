"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { toast } from "@/app/context/SnackbarContext";
import { Suspense } from "react";

function ChatDetailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const conversationId = Number(params.get("conversationId"));
  const userId = Number(params.get("userId"));
  const name = params.get("name") || "User";
  const currentUserId = Number(localStorage.getItem("userId"));

  const TOKEN =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<any>(null);

  /* ---------------- FETCH MESSAGES ---------------- */
  const fetchMessages = async () => {
    const res = await fetch(
      `https://pgthikana.in/api/room/conversation/${conversationId}/messages`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
      }
    );

    const data = await res.json();
    const msgs = data.messages || [];

    setMessages(msgs);

    markAsRead();
    scrollToBottom();
  };

  /* ---------------- MARK AS READ ---------------- */
  const markAsRead = async () => {
    await fetch(
      `https://pgthikana.in/api/room/conversation/${conversationId}/read`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
      }
    );
  };

  /* ---------------- SOCKET ---------------- */
  const connectSocket = () => {
    const s = io("https://pgthikana.in", {
      transports: ["websocket"],
      auth: { token: TOKEN },
    });

    s.on("connect", () => {
      s.emit("joinConversation", conversationId.toString());
    });

    s.on("receiveMessage", (data: any) => {
  setMessages((prev) => {
    const exists = prev.some(
      (msg) =>
        (msg.id && msg.id === data.id) ||
        (msg.createdAt === data.createdAt &&
          msg.message === data.message)
    );

    if (exists) return prev;

    return [...prev, data];
  });

  setIsTyping(false);

  if ((data.senderId ?? data.sender_id) !== userId) {
    markAsRead();
  }

  scrollToBottom();
});

    s.on("userTyping", () => {
      setIsTyping(true);

      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    });

    s.on("userStoppedTyping", () => {
      setIsTyping(false);
    });

    setSocket(s);
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!input.trim() && !selectedFile) return;
    if (isSending) return;

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("message", input);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetch(
        `https://pgthikana.in/api/room/conversation/${conversationId}/send-message`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: formData,
        }
      );

      if (res.status === 201) {
        setInput("");
        setSelectedFile(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  /* ---------------- TYPING ---------------- */
  const handleTyping = (val: string) => {
    setInput(val);

    socket?.emit("typing", { conversationId });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket?.emit("stopTyping", { conversationId });
    }, 2000);
  };

  /* ---------------- SCROLL ---------------- */
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (!TOKEN) return;

    fetchMessages();
    connectSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);

  /* ---------------- MESSAGE UI ---------------- */
 const renderMessage = (msg: any, index: number) => {
  const sender = msg.senderId ?? msg.sender_id;
  const senderType = msg.sender_type ?? msg.senderType;

  const isMe =
    sender?.toString() === currentUserId.toString();

  const fileUrl = msg.fileUrl ?? msg.file_url;

  const isImage =
    fileUrl &&
    (fileUrl.endsWith(".jpg") ||
      fileUrl.endsWith(".png") ||
      fileUrl.endsWith(".jpeg"));

  // ✅ ROLE LOGIC (CLEAN)
  let senderName = "";
  let senderRole = "";

  if (senderType === "superadmin") {
    senderName = isMe ? "You" : "Super Admin";
    senderRole = "SUPER ADMIN";
  } else if (senderType === "vendor") {
    senderName = name;
    senderRole = "VENDOR";
  } else if (senderType === "user") {
    senderName = name;
    senderRole = "USER";
  }

  return (
    <div
      key={index}
      className={`flex ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
          isMe
            ? "bg-[#0F766E] text-white"
            : "bg-white text-black"
        }`}
      >
        {/* ✅ ROLE HEADER */}
        <div className="text-[10px] opacity-70 mb-1">
          {senderName} ({senderRole})
        </div>

        {/* IMAGE */}
        {fileUrl && isImage && (
          <img
            src={fileUrl}
            className="rounded mb-1 max-h-40"
          />
        )}

        {/* FILE */}
        {fileUrl && !isImage && (
          <a
            href={fileUrl}
            target="_blank"
            className="text-blue-500 underline"
          >
            Open File
          </a>
        )}

        {/* TEXT */}
        {msg.message && <div>{msg.message}</div>}
      </div>
    </div>
  );
};

  return (
<div
  className="h-screen flex flex-col bg-[#F0F2F5]"
  style={{ marginLeft: "var(--sidebar-width)" }}
>
      {/* HEADER */}
      <div className="bg-[#0F766E] text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}>←</button>

        <div className="w-8 h-8 rounded-full bg-white text-[#0F766E] flex items-center justify-center font-semibold">
          {name[0].toUpperCase()}
        </div>

        <div>
          <div className="text-sm font-semibold">{name}</div>
          {isTyping && (
            <div className="text-xs opacity-80">
              typing...
            </div>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map(renderMessage)}
        <div ref={scrollRef} />
      </div>

      {/* FILE PREVIEW */}
      {selectedFile && (
  <div className="mx-3 my-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-between">
    
    <div className="flex items-center gap-2 text-sm text-gray-800 font-medium truncate">
      📎
      <span className="truncate">{selectedFile.name}</span>
    </div>

    <button
      onClick={() => setSelectedFile(null)}
      className="text-gray-500 hover:text-red-500 transition"
    >
      ✕
    </button>

  </div>
)}
      {/* INPUT */}
      <div className="p-2 bg-white flex items-center gap-2">
       <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700">
  📎
  <input
    type="file"
    className="hidden"
    onChange={(e) =>
      setSelectedFile(e.target.files?.[0] || null)
    }
  />
</label>

        <input
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-full bg-white border border-gray-300 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none text-sm text-gray-900 placeholder-gray-400"
        />

        <button
          onClick={sendMessage}
          className="bg-[#0F766E] text-white px-4 py-2 rounded-full text-sm"
        >
          {isSending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatDetailPage />
    </Suspense>
  );
}
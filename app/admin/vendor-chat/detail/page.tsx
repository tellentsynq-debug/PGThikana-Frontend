"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { toast } from "@/app/context/SnackbarContext";

/* ================= WRAPPER (FIXES ERROR) ================= */
export default function Page() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatDetailPage />
    </Suspense>
  );
}

/* ================= MAIN COMPONENT ================= */
function ChatDetailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const conversationId = Number(params.get("conversationId"));
  const userId = Number(params.get("userId"));
  const name = params.get("name") || "User";

  const [currentUserId, setCurrentUserId] = useState(0);
  const [role, setRole] = useState<string | null>(null);
  const [TOKEN, setToken] = useState<string | null>(null);

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
    if (!TOKEN) return;

    const res = await fetch(
      `https://pgthikana.in/api/room/conversation/${conversationId}/messages`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
      }
    );

    const data = await res.json();
    setMessages(data.messages || []);

    markAsRead();
    scrollToBottom();
  };

  /* ---------------- MARK AS READ ---------------- */
  const markAsRead = async () => {
    if (!TOKEN) return;

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
    if (!TOKEN) return;

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
            msg.id === data.id ||
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
    if (isSending || !TOKEN) return;

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
          headers: { Authorization: `Bearer ${TOKEN}` },
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
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("adminToken");
    const userId = Number(localStorage.getItem("userId")) || 0;
    const role = localStorage.getItem("role");

    setToken(token);
    setCurrentUserId(userId);
    setRole(role);
  }, []);

  useEffect(() => {
    if (!TOKEN) return;

    fetchMessages();
    connectSocket();

    return () => {
      socket?.disconnect();
    };
  }, [TOKEN]);

  /* ---------------- MESSAGE UI ---------------- */
  const renderMessage = (msg: any, index: number) => {
    const sender = msg.senderId ?? msg.sender_id;
    const senderType = msg.sender_type ?? msg.senderType;

    const isMe = sender?.toString() === currentUserId.toString();

    const fileUrl = msg.fileUrl ?? msg.file_url;

    const isImage =
      fileUrl &&
      (fileUrl.endsWith(".jpg") ||
        fileUrl.endsWith(".png") ||
        fileUrl.endsWith(".jpeg"));

    let senderName = "";
    let senderRole = "";

    if (isMe) {
      senderName = "You";
      senderRole =
        role === "superadmin"
          ? "SUPER ADMIN"
          : role === "admin"
          ? "ADMIN"
          : "YOU";
    } else {
      switch (senderType) {
        case "vendor":
          senderRole = "VENDOR";
          senderName = name;
          break;
        case "user":
          senderRole = "USER";
          senderName = name;
          break;
        case "admin":
          senderRole = "ADMIN";
          senderName = name;
          break;
        case "superadmin":
          senderRole = "SUPER ADMIN";
          senderName = name;
          break;
        default:
          senderRole = "UNKNOWN";
          senderName = name;
      }
    }

    return (
      <div
        key={index}
        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
            isMe ? "bg-[#0F766E] text-white" : "bg-white text-black"
          }`}
        >
          <div className="text-[10px] opacity-70 mb-1">
            {senderName} ({senderRole})
          </div>

          {fileUrl && isImage && (
            <img src={fileUrl} className="rounded mb-1 max-h-40" />
          )}

          {fileUrl && !isImage && (
            <a href={fileUrl} target="_blank" className="text-blue-500 underline">
              Open File
            </a>
          )}

          {msg.message && <div>{msg.message}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#F0F2F5]">
      {/* HEADER */}
      <div className="bg-[#0F766E] text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}>←</button>

        <div className="w-8 h-8 rounded-full bg-white text-[#0F766E] flex items-center justify-center font-semibold">
          {name[0].toUpperCase()}
        </div>

        <div>
          <div className="text-sm font-semibold">{name}</div>
          {isTyping && <div className="text-xs opacity-80">typing...</div>}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map(renderMessage)}
        <div ref={scrollRef} />
      </div>

      {/* INPUT */}
      <div className="p-2 bg-white flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-full border"
        />

        <button
          onClick={sendMessage}
          className="bg-[#0F766E] text-white px-4 py-2 rounded-full"
        >
          {isSending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
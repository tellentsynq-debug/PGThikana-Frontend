"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

const API_BASE = "https://pgthikana.in/api";

export default function ChatScreen() {
  const router = useRouter();
  const [conversationId, setConversationId] = useState<string | null>(null);
const [name, setName] = useState("User");

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const convId = params.get("conversationId");
  const nameParam = params.get("name");

  setConversationId(convId);

  if (nameParam && nameParam !== "undefined") {
    setName(decodeURIComponent(nameParam));
  }
}, []);

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("userToken")
      : null;

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!conversationId) return;

    fetchMessages();
    const cleanup = connectSocket();

    return () => {
      cleanup && cleanup();
    };
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/room/conversation/${conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      setMessages(data.messages || []);
      setLoading(false);
      scrollToBottom();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  /* ================= SOCKET ================= */
  const connectSocket = () => {
    const socket = io("https://pgthikana.in", {
      transports: ["websocket"],
      auth: { token },
    });

    socket.on("connect", () => {
      socket.emit("joinRoom", conversationId);
    });

    socket.on("receiveMessage", (data: any) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    return () => socket.disconnect();
  };

  /* ================= SEND ================= */
  const sendMessage = async () => {
    if (!text.trim() && !file) return;

    setSending(true);

    try {
      const form = new FormData();
      form.append("message", text);

      if (file) form.append("file", file);

      const res = await fetch(
        `${API_BASE}/room/conversation/${conversationId}/send-message`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      if (res.ok) {
        setText("");
        setFile(null);
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    }

    setSending(false);
  };

  /* ================= HELPERS ================= */
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const isImage = (url: string) =>
    url?.match(/\.(jpg|jpeg|png|webp)$/);

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* 🔥 HEADER */}
      <div className="bg-teal-700 text-white px-4 py-3 flex items-center gap-3 shadow">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow"
        >
          ←
        </button>

        <div className="w-9 h-9 bg-white text-teal-700 rounded-full flex items-center justify-center font-bold">
          {name.charAt(0).toUpperCase()}
        </div>

        <p className="font-semibold text-lg">{name}</p>
      </div>

      {/* 🔥 MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {messages.map((msg, i) => {
          const isMe = msg.sender_type === "user";
          const fileUrl = msg.file_url;

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                  isMe
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-900 border"
                }`}
              >
                {msg.message && (
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                )}

                {fileUrl && (
                  <div className="mt-2">
                    {isImage(fileUrl) ? (
                      <img
                        src={fileUrl}
                        className="rounded-lg max-h-40 border"
                      />
                    ) : (
                      <a
                        href={fileUrl}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Open File
                      </a>
                    )}
                  </div>
                )}

                {isMe && (
                  <p className="text-[10px] mt-1 opacity-70 text-right">
                    {msg.is_read ? "✓✓" : "✓"}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div ref={scrollRef} />
      </div>

      {/* 🔥 FILE PREVIEW */}
      {file && (
        <div className="px-4 py-2 bg-white border flex justify-between items-center">
          <span className="text-sm text-gray-700">{file.name}</span>
          <button onClick={() => setFile(null)}>✕</button>
        </div>
      )}

      {/* 🔥 INPUT */}
      <div className="p-3 bg-white border-t flex items-center gap-2 shadow-md">

        <label className="cursor-pointer px-3 py-2 bg-gray-200 rounded-full text-sm hover:bg-gray-300">
          📎
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full 
                     bg-gray-200 text-gray-900 
                     placeholder:text-gray-500 
                     outline-none focus:ring-2 focus:ring-teal-500"
        />

        <button
          onClick={sendMessage}
          className="bg-teal-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-teal-700"
        >
          {sending ? "..." : "Send"}
        </button>

      </div>

    </div>
  );
}
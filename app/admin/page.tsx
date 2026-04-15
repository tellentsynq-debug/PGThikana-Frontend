'use client'

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
  // 🔥 CLEAR SUPER ADMIN TOKEN
  localStorage.removeItem("token");

  // (optional) also clear user if needed
  localStorage.removeItem("user");
}, []);

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 LOGIN FUNCTION
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://pgthikana.in/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        // ✅ STORE TOKEN
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ REDIRECT
        router.push("admin/property/"); // change if needed
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        flexDirection: "row",
        gap: "40px"
      }}
    >
      {/* LEFT SIDE */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px"
        }}
      >
        <img src="/pg_logo.png" style={{ height: "330px" }} />

        <h1
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#0D5F58"
          }}
        >
          PG Thikana
        </h1>
      </div>

      {/* LOGIN CARD */}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#0D5F58",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "10px",
            color: "white"
          }}
        >
          Admin Login
        </h1>

        {/* USERNAME */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "14px", opacity: 0.8, color: "white" }}>
            Username
          </label>
          <input
            name="username"
            placeholder="Enter your username"
            onChange={handleChange}
            value={form.username}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ffffff30",
              background: "#ffffff",
              color: "black",
              outline: "none"
            }}
          />
        </div>

        {/* PASSWORD */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "14px", opacity: 0.8, color: "white" }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={form.password}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ffffff30",
              background: "#ffffff",
              color: "black",
              outline: "none"
            }}
          />
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
            {error}
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontWeight: "600",
            backgroundColor: loading ? "#888" : "#043f3b",
            color: "white"
          }}
        >
          {loading ? "Logging in..." : "Login"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/app/context/SnackbarContext";

export default function TenantVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pan, setPan] = useState("");
  const [emergency, setEmergency] = useState("");
  const [relation, setRelation] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [aadharFront, setAadharFront] = useState<File | null>(null);
  const [aadharBack, setAadharBack] = useState<File | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("userToken")
      : null;

  // ================= OTP =================

  const sendOtp = async () => {
    if (emergency.length !== 10 || !relation) {
      toast("Enter valid number & relation");
      return;
    }

    const res = await fetch(
      "https://pgthikana.in/api/booking/emergency/send-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emergencyPhone: emergency,
        }),
      }
    );

    const data = await res.json();

    if (res.status === 200 && data.success) {
      setOtpSent(true);

      const otp = prompt("Enter OTP");
      if (otp) verifyOtp(otp);
    } else {
      toast(data.message || "Error");
    }
  };

  const verifyOtp = async (otp: string) => {
    const res = await fetch(
      "https://pgthikana.in/api/booking/emergency/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emergencyPhone: emergency,
          otp,
          emergencyRelation: relation,
        }),
      }
    );

    const data = await res.json();

    if (res.status === 200 && data.success) {
      setOtpVerified(true);
      toast("OTP Verified");
    } else {
      toast(data.message || "Verification failed");
    }
  };

  // ================= IMAGE =================

  const handleFile = (e: any, isFront: boolean) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isFront) setAadharFront(file);
    else setAadharBack(file);
  };

  // ================= SUBMIT =================

  const submitVerification = async () => {
    if (!otpVerified) {
      toast("Verify OTP first");
      return;
    }

    const formData = new FormData();

    formData.append("bookingId", bookingId || "");
    formData.append("profile[name]", name);
    formData.append("profile[email]", email);
    formData.append("profile[address]", address);
    formData.append("profile[pancard]", pan);
    formData.append("profile[emergencyNumber]", emergency);

    if (aadharFront)
      formData.append("profile[aadharFront]", aadharFront);

    if (aadharBack)
      formData.append("profile[aadharBack]", aadharBack);

    try {
      setSubmitting(true);

      const res = await fetch(
        "https://pgthikana.in/api/booking/verify",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.status === 200) {
        toast("Verification Submitted");

        setTimeout(() => {
          router.push("/user/home");
        }, 800);
      }
    } catch (err) {
      console.error(err);
      toast("Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] p-4">

      <div className="max-w-md mx-auto space-y-4">

        <h1 className="text-xl font-bold">Tenant Verification</h1>

        {/* PERSONAL */}
        <Section title="Personal Information">
          <Input value={name} setValue={setName} placeholder="Full Name" />
          <Input value={email} setValue={setEmail} placeholder="Email" />
          <Input value={address} setValue={setAddress} placeholder="Address" />
        </Section>

        {/* ID */}
        <Section title="Identity Information">
          <Input value={pan} setValue={setPan} placeholder="PAN Card" />

          <Input
            value={emergency}
            setValue={setEmergency}
            placeholder="Emergency Number"
            disabled={otpVerified}
          />

          <select
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            disabled={otpVerified}
            className="w-full p-3 rounded-lg bg-white border"
          >
            <option value="">Select Relation</option>
            <option value="mother">Mother</option>
            <option value="father">Father</option>
            <option value="friend">Friend</option>
          </select>

          <button
            onClick={sendOtp}
            disabled={otpSent}
            className="w-full bg-teal-600 text-white py-2 rounded-lg"
          >
            {otpSent ? "OTP Sent" : "Send OTP"}
          </button>
        </Section>

        {/* UPLOAD */}
        <Section title="Upload Aadhaar">
          <Upload label="Front" onChange={(e:any)=>handleFile(e,true)} file={aadharFront}/>
          <Upload label="Back" onChange={(e:any)=>handleFile(e,false)} file={aadharBack}/>
        </Section>

        {/* SUBMIT */}
        <button
          onClick={submitVerification}
          disabled={!otpVerified || submitting}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold"
        >
          Submit Verification
        </button>

      </div>
    </div>
  );
}

/* 🔹 COMPONENTS */

function Section({ title, children }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Input({ value, setValue, placeholder, disabled }: any) {
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full p-3 rounded-lg border"
    />
  );
}

function Upload({ label, onChange, file }: any) {
  return (
    <div>
      <input type="file" onChange={onChange} />
      {file && <p className="text-green-600 text-sm">Uploaded</p>}
    </div>
  );
}
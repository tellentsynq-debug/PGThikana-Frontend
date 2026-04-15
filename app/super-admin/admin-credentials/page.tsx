"use client"

import { ArrowRightCircle, Contact, LocateIcon, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/app/context/SnackbarContext";
import { Suspense } from "react";

function AdminCredentialPage(){

    const [form, setForm ] = useState({
        name:"",
        email:"",
        username:"",
        password:"",
        location:""
    });

    const [error, setError] = useState("");
    
    const router = useRouter();

    const [admins,setAdmins] = useState<any[]>([]);
    const [loadingAdmins, setLoadingAdmins] = useState(false);
    

    const searchParams = useSearchParams();
    const page = searchParams.get("page");

    const [loading, setLoading] = useState(false);
const blockAdmin = async (adminId: number) => {
  try {
    // 🔥 ASK REASON FROM SUPER ADMIN
    const reason = prompt("Enter reason for blocking this admin:");

    if (!reason || reason.trim() === "") {
      toast("Block reason is required");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://pgthikana.in/api/admin/block/${adminId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason, // ✅ dynamic now
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    toast("Admin blocked successfully");
    fetchAdmins();
  } catch (error: any) {
    toast(error.message);
  }
};

const unblockAdmin = async (adminId: number) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://pgthikana.in/api/admin/unblock/${adminId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: "Unblocked by super admin",
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    toast("Admin unblocked");
    fetchAdmins();
  } catch (error: any) {
    toast(error.message);
  }
};

const deleteAdmin = async (adminId: number) => {
  if (!confirm("Delete this admin?")) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://pgthikana.in/api/admin/remove/${adminId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: "Removed by super admin",
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    toast("Admin removed");
    fetchAdmins();
  } catch (error: any) {
    toast(error.message);
  }
};

const handleSubmit = async () => {
  try {
    // 🔴 1. Basic validation (VERY IMPORTANT)
    if (!form.name || !form.email || !form.username || !form.password || !form.location) {
      toast("Please fill all fields");
      return;
    }

    setLoading(true);

    // 🔴 2. Get token safely
    const token = localStorage.getItem("token");

    if (!token) {
      toast("User not authenticated");
      return;
    }

    // 🔴 3. API Call
    const res = await fetch("https://pgthikana.in/api/admin/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`, // ✅ FIXED
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    // 🔴 4. Parse response
    const data = await res.json();

    // 🔴 5. Handle API errors properly
    if (!res.ok) {
      console.error("API Error:", data);
      throw new Error(data.message || "Failed to create admin");
    }

    // ✅ SUCCESS
    toast("Admin Created Successfully!");

    // 🔴 6. Reset form
    setForm({
      name: "",
      email: "",
      username: "",
      password: "",
      location: "",
    });

  } catch (error: any) {
    console.error("Error:", error.message);
    toast(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


const fetchAdmins = async () => {
  try {
    setLoadingAdmins(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first");
      return;
    }

    const res = await fetch("https://pgthikana.in/api/admin/list", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();

    let data = null;

    try {
      data = JSON.parse(text);
    } catch {
      setError("Server returned invalid response");
      return;
    }

    if (!res.ok) {
      setError(data?.message || "Failed to fetch admins");
      return;
    }

    // ✅ SAFE SET
    setAdmins(Array.isArray(data?.admins) ? data.admins : []);

  } catch (err: any) {
    setError("Network error. Try again.");
  } finally {
    setLoadingAdmins(false);
  }
};

useEffect(() =>{
  fetchAdmins();
},[]);

    const handleChange = (e:any) => {//e is event
        setForm({
            ...form,//keep old values
            [e.target.name]: e.target.value//dynamic key update
        });
    }

    //e.target -> the input box
    //e.target.name -> which field, ex: email
    //e.target.value -> what user typed
    //... form keeps the old data
    //handle change update only the field use is typing in

    return (
        
        <div className="flex flex-col items-center w-full min-h-screen bg-white gap-5 pt-8 pb-10 ml-[var(--sidebar-width)] transition-[margin] duration-200 ease-in-out">

              <div className="bg-[#0D5F58] p-8 rounded-2xl w-[80%]">

            <h1
                style={{
                 fontSize:"30px",
                 marginTop:"20px",
                 fontWeight:"600",
                 marginBottom:"40px",
                 textAlign:"center"
                 
                }}>
                Create Admin</h1>


<div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
    width: "100%"
  }}
>
  {/* NAME */}
  <div style={{ flex: 1 }}>
    <h3 style={{ marginBottom: "5px" }}>Name</h3>
    <input
      name="name"
      placeholder="Enter admin's name"
      onChange={handleChange}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
          backgroundColor:"#ffff",
        color:"#000000"
      }}
    />
  </div>

  {/* EMAIL */}
  <div style={{ flex: 1 }}>
    <h3 style={{ marginBottom: "5px" }}>Email</h3>
    <input
      name="email"
      placeholder="Enter admin's email"
      onChange={handleChange}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
          backgroundColor:"#ffff",
        color:"#000000"
      }}
    />
  </div>
</div>

 <div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
    width: "100%"
  }}
>
  {/* USERNAME */}
  <div style={{ flex: 1 }}>
    <h3 style={{ marginBottom: "5px" }}>Username</h3>
    <input
      name="username"
      placeholder="Enter admin's username"
      onChange={handleChange}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor:"#ffff",
        color:"#000000"
      }}
    />
  </div>

  {/* PASSWORD */}
  <div style={{ flex: 1 }}>
    <h3 style={{ marginBottom: "5px" }}>Password</h3>
    <input
      name="password"
      type="password"
      placeholder="Choose a password"
      onChange={handleChange}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
          backgroundColor:"#ffff",
        color:"#000000"
      }}
    />
  </div>
</div>


            <div style={{
  display: "flex",
  alignItems: "center",
  gap: "20px",
  width: "100%"
}}>
    <div style={{flex:1}}>
  <h3 style={{ marginBottom:"5px", margin: 0 }}>Location</h3>

  <input
    name="location"
    placeholder="Select location"
    onChange={handleChange}
    style={{
      flex: 1,
      width:"100%",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "14px",
      border: "1px solid #ccc",
      marginBottom:"40px",
        backgroundColor:"#ffff",
        color:"#000000"
    }}
  />
</div>
</div>

   
            <div
            style={{
              display:"flex",
              justifyContent:"center"
            }}>
          <button 
  style={{
    background: "linear-gradient(135deg, #0D5F58, #138F85)",
    padding: "12px 20px",
    borderRadius: "10px",
    width: "220px",
    fontWeight: "700",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    transition: "all 0.25s ease",
  }}

  onClick={handleSubmit}
  disabled={loading}
  className="..."
>
  {loading? "Creating" : "Create Admin"}

</button>
        </div>


        </div>
           <div style={{
            flex:1,
            borderRadius:"16px",
            backgroundColor:"#0D5F58",
            padding:"24px",
            width:"80%",
            gap:"10px",
            display:"flex",
            alignItems:"center",
            flexDirection:"column"
        }}>


            <h1
                style={{
                    textAlign:"center",
                    fontSize:"30px",
                    fontWeight:"600",
                    
                }}>
                Admin Details</h1>
                
      {loadingAdmins ? (
  <p className="text-white">Loading admins...</p>
) : error ? (
  <div className="text-red-300 bg-red-500/10 px-4 py-2 rounded-lg">
    {error}
  </div>
) : admins.length === 0 ? (
  <p className="text-gray-300">No admins found</p>
) : (
  admins.map((admin) => (
    <div
      key={admin.id}
      className="flex justify-between items-center w-full p-5 rounded-2xl bg-gradient-to-r from-[#043f3b] to-[#065f59] shadow-xl cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="bg-teal-700 p-3 rounded-xl">
          <Contact size={20} color="white" />
        </div>

        <div>
          <p className="text-sm">{admin.name}</p>

          <div className="flex items-center gap-1">
            <LocateIcon size={12} color="gray" />
            <h4 className="text-xs">{admin.location}</h4>
          </div>
        </div>
      </div>
<div className="flex items-center gap-3">

  {/* STATUS BADGE */}
  <div
    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
    admin.is_blocked === 0
  ? "bg-green-500/20 text-green-300 border-green-400/30"
  : "bg-red-500/20 text-red-300 border-red-400/30"
    }`}
  >
    {admin.is_blocked === 0 ? "ACTIVE" : "BLOCKED"}
  </div>

  {/* ACTION BUTTON */}
  {admin.is_blocked === 0 ? (
    <button
      onClick={() => blockAdmin(admin.id)}
      className="px-3 py-1 text-xs font-medium rounded-md bg-red-500 hover:bg-red-600 active:scale-95 text-white transition-all duration-150"
    >
      Block
    </button>
  ) : (
    <button
      onClick={() => unblockAdmin(admin.id)}
      className="px-3 py-1 text-xs font-medium rounded-md bg-green-500 hover:bg-green-600 active:scale-95 text-white transition-all duration-150"
    >
      Unblock
    </button>
  )}

  {/* ARROW */}
  <ArrowRightCircle
  size={20}
  onClick={() =>
    router.push(`/super-admin/admin-credentials/${admin.id}`)
  }
  className="text-white opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-150 cursor-pointer"
/>

</div>
    </div>
  ))
)}




     </div>
        </div>
        
    )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminCredentialPage />
    </Suspense>
  );
}
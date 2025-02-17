// "use client"; // Required if using App Router

// import { useState } from "react";
// import { useRouter } from "next/navigation"; // Use 'next/router' if using Pages Router
// import { supabase } from "@/lib/supabaseClient";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

// //   const handleLogin = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");

// //     const { data, error } = await supabase.auth.signInWithPassword({ email, password });

// //     if (error) {
// //       setError(error.message);
// //     } else {
// //       // Check if user is an admin
// //       const { data: userData } = await supabase
// //         .from("users")
// //         .select("role")
// //         .eq("email", email)
// //         .single();

// //       if (userData?.role === "admin") {
// //         router.push("/dashboard");
// //       } else {
// //         setError("Access denied. Admins only.");
// //       }
// //     }
// //     setLoading(false);
// //   };

// const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
  
//     // Authenticate the user
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
  
//     if (error) {
//       setError(error.message);
//       setLoading(false);
//       return;
//     }
  
//     // Fetch user role from Supabase
//     const { data: userData, error: userError } = await supabase
//       .from("users")
//       .select("role")
//       .eq("email", email)
//       .single();
  
//     if (userError) {
//       setError("Failed to retrieve user role.");
//       setLoading(false);
//       return;
//     }
  
//     // Check if the user is an admin
//     if (userData?.role === "admin") {
//       router.push("/dashboard"); // Redirect to the admin panel
//     } else {
//       setError("Access denied. Admins only.");
//     }
  
//     setLoading(false);
//   };
  

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded shadow-md w-96">
//         <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
//         {error && <p className="text-red-500 text-center">{error}</p>}
//         <form onSubmit={handleLogin} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "../../lib/api"; 

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const { token } = await adminLogin(email, password);
      localStorage.setItem("adminToken", token); // ✅ Store token for authentication

      router.push("/dashboard"); // ✅ Redirect to Admin Dashboard after login
    } catch (err: any) {
      setError(err.message || "Failed to login");
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}

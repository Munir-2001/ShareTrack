// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// const API_URL = "http://localhost:5001/api/admin"; // ✅ Backend API

// interface User {
//   id: string;
//   username: string;
//   phone: string;
//   email: string;
//   balance: number;
//   total_lend_borrow_ratio: number;
//   timely_payment_score: number;
//   age: number;
//   gender: string;
//   marital_status: string;
//   education_level: string;
//   employment_status: string;
//   credit_score: number;
//   is_active: boolean;
//   role: string;
//   photo: string;
// }

// export default function ViewUserDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     async function fetchUser() {
//       try {
//         const res = await fetch(`${API_URL}/users/${id}`);
//         if (!res.ok) throw new Error("Failed to fetch user");
//         const data: User = await res.json();
//         setUser(data);
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUser();
//   }, [id]);

//   if (loading) return <p className="text-center text-gray-500">Loading user details...</p>;
//   if (!user) return <p className="text-center text-red-500">User not found.</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
//       {/* 🔙 Back Button */}
//       <button
//         onClick={() => router.push("/users")}
//         className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition"
//       >
//         ← Back to Users
//       </button>

//       {/* Profile Header */}
//       <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
//         <img
//           src={user.photo}
//           alt="User Profile"
//           className="w-24 h-24 rounded-full border border-gray-300"
//         />
//         <div>
//           <h2 className="text-3xl font-bold text-blue-900">{user.username}</h2>
//           <p className="text-gray-600">{user.email}</p>
//           <p className="text-gray-600">{user.phone}</p>
//         </div>
//       </div>

//       {/* User Details Form */}
//       <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
//         <h3 className="text-2xl font-semibold text-blue-800 mb-4">User Details</h3>

//         <div className="grid grid-cols-2 gap-6">
//           <div className="flex flex-col">
//             <label className="text-gray-600 font-medium">Balance</label>
//             <input
//               type="text"
//               value={`$${user.balance.toFixed(2)}`}
//               disabled
//               className="p-3 border rounded-lg bg-gray-100"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-600 font-medium">Credit Score</label>
//             <input
//               type="text"
//               value={user.credit_score}
//               disabled
//               className="p-3 border rounded-lg bg-gray-100"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-600 font-medium">Lend/Borrow Ratio</label>
//             <input
//               type="text"
//               value={user.total_lend_borrow_ratio.toFixed(2)}
//               disabled
//               className="p-3 border rounded-lg bg-gray-100"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-600 font-medium">Timely Payment Score</label>
//             <input
//               type="text"
//               value={`${user.timely_payment_score}%`}
//               disabled
//               className="p-3 border rounded-lg bg-gray-100"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-600 font-medium">Age</label>
//             <input
//               type="text"
//               value={user.age}
//               disabled
//               className="p-3 border rounded-lg bg-gray-100"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-600 font-medium">Gender</label>
//             <input
//               type="text"
//               value={user.gender === "1" ? "Male" : "Female"}
//               disabled
//               className="p-3 border rounded-lg bg-gray-100"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-600 font-medium">Marital Status</label>
//             <input
//               type="text"
//               value={user.marital_status === "1" ? "Married" : "Single"}
//               disabled
//               className="p-3 border rounded-lg bg-gray-100"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-600 font-medium">Education Level</label>
//             <input
//               type="text"
//               value={user.education_level}
//               disabled
//               className="p-3 border rounded-lg bg-gray-100"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-600 font-medium">Employment Status</label>
//             <input
//               type="text"
//               value={user.employment_status === "1" ? "Employed" : "Unemployed"}
//               disabled
//               className="p-3 border rounded-lg bg-gray-100"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-600 font-medium">Role</label>
//             <input
//               type="text"
//               value={user.role}
//               disabled
//               className="p-3 border rounded-lg bg-gray-100"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-600 font-medium">Account Status</label>
//             <input
//               type="text"
//               value={user.is_active ? "✅ Active" : "❌ Disabled"}
//               disabled
//               className="p-3 border rounded-lg bg-gray-100"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = "http://localhost:5001/api/admin"; // ✅ Backend API

interface User {
  id: string;
  username: string;
  phone: string;
  email: string;
  balance: number;
  total_lend_borrow_ratio: number;
  timely_payment_score: number;
  age: number;
  gender: string;
  marital_status: string;
  education_level: string;
  employment_status: string;
  credit_score: number;
  is_active: boolean;
  role: string;
  photo: string;
}

export default function ViewUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchUser() {
      try {
        const res = await fetch(`${API_URL}/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading user details...</p>;
  if (!user) return <p className="text-center text-red-500">User not found.</p>;

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      {/* 🔙 Back Button */}
      <button
        onClick={() => router.push("/users")}
        className="mb-6 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
      >
        ← Back to Users
      </button>

      {/* User Profile Header */}
      <div className="bg-white p-8 rounded-lg shadow-lg flex items-center gap-6">
        <img
          src={user.photo}
          alt="User Profile"
          className="w-28 h-28 rounded-full border border-gray-300 shadow-md"
        />
        <div>
          <h2 className="text-3xl font-bold text-blue-900">{user.username}</h2>
          <p className="text-gray-600 text-lg">{user.email}</p>
          <p className="text-gray-600 text-lg">{user.phone}</p>
        </div>
      </div>

      {/* User Details Section */}
      <div className="bg-white p-8 mt-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-blue-800 mb-4">User Details</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* ✅ Reusable Form Row */}
          {[
            { label: "Balance", value: `$${user.balance.toFixed(2)}` },
            { label: "Credit Score", value: user.credit_score.toString() },
            { label: "Lend/Borrow Ratio", value: user.total_lend_borrow_ratio.toFixed(2) },
            { label: "Timely Payment Score", value: `${user.timely_payment_score}%` },
            { label: "Age", value: user.age.toString() },
            { label: "Gender", value: user.gender === "1" ? "Male" : "Female" },
            { label: "Marital Status", value: user.marital_status === "1" ? "Married" : "Single" },
            { label: "Education Level", value: user.education_level },
            { label: "Employment Status", value: user.employment_status === "1" ? "Employed" : "Unemployed" },
            { label: "Role", value: user.role },
            { label: "Account Status", value: user.is_active ? "✅ Active" : "❌ Disabled" },
          ].map((field, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-gray-700 font-medium">{field.label}</label>
              <input
                type="text"
                value={field.value}
                disabled
                className="p-3 border rounded-lg bg-gray-100 text-gray-900 font-semibold"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

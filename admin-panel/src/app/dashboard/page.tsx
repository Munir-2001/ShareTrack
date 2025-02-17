// "use client"; // Required for App Router

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// interface User {
//     id: number;
//     username: string;
//     phone: string;
//     email: string;
//     balance: number;
//     created_at: string;
//     updated_at: string;
//     credit_score: number;
//     employment_status: number;
//     is_active:boolean;
// }

// export default function Dashboard() {
//     const [users, setUsers] = useState<User[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             const { data, error } = await supabase.from("users").select("*"); // Fetch all users
//             if (error) console.error("Error fetching users:", error);
//             else setUsers(data);
//             setLoading(false);
//         };

//         fetchUsers();
//     }, []);

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Users</h1>
//             {loading ? <p>Loading...</p> : (
//                 <table className="w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr className="bg-gray-200">
//                             <th className="border p-2">ID</th>
//                             <th className="border p-2">Username</th>
//                             <th className="border p-2">Phone</th>
//                             <th className="border p-2">Email</th>
//                             <th className="border p-2">Balance</th>
//                             <th className="border p-2">Credit Score</th>
//                             <th className="border p-2">Employment</th>
//                             <th className="border p-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.map((user) => (
//                             <tr key={user.id} className="border">
//                                 <td className="border p-2">{user.id}</td>
//                                 <td className="border p-2">{user.username}</td>
//                                 <td className="border p-2">{user.phone}</td>
//                                 <td className="border p-2">{user.email}</td>
//                                 <td className="border p-2">{user.balance}</td>
//                                 <td className="border p-2">{user.credit_score}</td>
//                                 <td className="border p-2">{user.employment_status ? "Employed" : "Unemployed"}</td>
//                                 <td className="border p-2">
//                                     {/* <button
//                     onClick={() => toggleUserStatus(user.id)}
//                     className="bg-blue-500 text-white px-3 py-1 rounded"
//                   >
//                     Toggle Active
//                   </button> */}

//                                     <button
//                                         onClick={() => toggleUserStatus(user.id, user.is_active)}
//                                         className={`px-3 py-1 rounded ${user.is_active ? "bg-red-500" : "bg-green-500"} text-white`}
//                                     >
//                                         {user.is_active ? "Disable" : "Enable"}
//                                     </button>

//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// }

// // // Function to toggle user status
// // const toggleUserStatus = async (userId: number) => {
// //   const { error } = await supabase
// //     .from("users")
// //     .update({ employment_status: 0 }) // Example: Disabling user
// //     .eq("id", userId);

// //   if (error) alert("Error toggling user status!");
// //   else window.location.reload(); // Refresh after update
// // };

// const toggleUserStatus = async (userId: number, isActive: boolean) => {
//     const { error } = await supabase
//         .from("users")
//         .update({ is_active: !isActive })
//         .eq("id", userId);

//     if (error) alert("Error toggling user status!");
//     else window.location.reload();
// };

"use client";
import { useEffect, useState } from "react";
import { fetchUsers, updateUserStatus } from "@/lib/api";
interface User {
    id: number;
    username: string;
    phone: string;
    email: string;
    balance: number;
    created_at: string;
    updated_at: string;
    credit_score: number;
    employment_status: number;
    is_active:boolean;
}
export default function DashboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data || []));
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    await updateUserStatus(userId, !currentStatus);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isActive: !currentStatus } : user
      )
    );
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">User Management</h1>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id} className="border">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.isActive ? "Active" : "Inactive"}</td>
              <td className="p-2">
                <button
                  onClick={() => toggleUserStatus(user.id, user.isActive)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

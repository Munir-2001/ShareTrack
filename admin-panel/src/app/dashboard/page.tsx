// "use client";
// import { useEffect, useState } from "react";
// import { fetchUsers, updateUserStatus } from "@/lib/api";
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
// export default function DashboardPage() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetchUsers().then((data) => setUsers(data || []));
//   }, []);

//   const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
//     await updateUserStatus(userId, !currentStatus);
//     setUsers((prevUsers) =>
//       prevUsers.map((user) =>
//         user.id === userId ? { ...user, isActive: !currentStatus } : user
//       )
//     );
//   };

//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold">User Management</h1>
//       <table className="w-full mt-4 border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border p-2">ID</th>
//             <th className="border p-2">Email</th>
//             <th className="border p-2">Status</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user: any) => (
//             <tr key={user.id} className="border">
//               <td className="p-2">{user.id}</td>
//               <td className="p-2">{user.email}</td>
//               <td className="p-2">{user.isActive ? "Active" : "Inactive"}</td>
//               <td className="p-2">
//                 <button
//                   onClick={() => toggleUserStatus(user.id, user.isActive)}
//                   className="bg-blue-500 text-white px-3 py-1 rounded"
//                 >
//                   {user.isActive ? "Deactivate" : "Activate"}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { fetchUsers, updateUserStatus } from "@/lib/api";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface User {
  id: number;
  email: string;
  is_active: boolean;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showUsers, setShowUsers] = useState(false); // Toggle User Management View
  const router = useRouter();

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data || []));
  }, []);

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    await updateUserStatus(userId.toString(), !currentStatus);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, is_active: !currentStatus } : user
      )
    );
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Admin Dashboard
      </h1>

      {/* Dashboard Tiles */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
          <p className="text-2xl font-bold text-blue-600">{users.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700">Reports Resolved</h2>
          <p className="text-2xl font-bold text-green-500">0</p> {/* Placeholder */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700">Pending Issues</h2>
          <p className="text-2xl font-bold text-red-500">0</p> {/* Placeholder */}
        </div>
      </div>

      {/* Empty Charts Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md h-52 flex items-center justify-center">
          <Chart options={{ labels: ["A", "B", "C"] }} series={[30, 40, 30]} type="pie" width="100%" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-52 flex items-center justify-center">
          <Chart options={{ xaxis: { categories: ["Jan", "Feb", "Mar"] } }} series={[{ data: [30, 50, 70] }]} type="bar" width="100%" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-52 flex items-center justify-center">
          <Chart options={{ labels: ["Active", "Inactive"] }} series={[60, 40]} type="donut" width="100%" />
        </div>
      </div>

      {/* User Management Tile */}
      {/* <div className="mt-10">
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          {showUsers ? "Hide User Management" : "View User Management"}
        </button>
      </div> */}
      {/* User Management Tile */}
      <div className="mt-10">
        <button
          onClick={() => router.push("/users")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          View User Management
        </button>
        </div>

      {/* User Management Table */}
      {showUsers && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border">
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    {user.is_active ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactive</span>
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className={`px-3 py-1 rounded text-white font-medium ${
                        user.is_active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import { fetchUsers, updateUserStatus } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  is_active: boolean;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function getUsers() {
      const data = await fetchUsers();
      if (data) {
        // ✅ Filter users with role = "user"
        setUsers(data.filter((user: User) => user.role === "user"));
      }
    }
    getUsers();
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
    <div className="p-5 bg-gray-200 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">User Management</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition duration-300"
        >
          🔙 Back to Dashboard
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search by username or email..."
        className="w-full p-3 mb-6 border-2 border-gray-500 rounded-lg shadow-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* User Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-400">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-700 text-white text-left">
              <th className="border p-3">ID</th>
              <th className="border p-3">Username</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Phone</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(
                (user) =>
                  user.username.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase())
              )
              .map((user) => (
                <tr
                  key={user.id}
                  className="border transition duration-300 hover:border-blue-500 hover:border-2 hover:bg-gray-100"
                >
                  <td className="p-3 text-gray-800">{user.id}</td>
                  <td className="p-3 text-gray-900 font-semibold">
                    {user.username}
                  </td>
                  <td className="p-3 text-gray-700">{user.email}</td>
                  <td className="p-3 text-gray-700">{user.phone}</td>
                  <td className="p-3">
                    {user.is_active ? (
                      <span className="text-green-600 font-semibold">
                        ✅ Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        ❌ Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ${user.is_active
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-green-500 hover:bg-green-700"
                        }`}
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => router.push(`/users/${user.id}`)}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

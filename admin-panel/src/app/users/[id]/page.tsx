

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = "http://localhost:5001/api/admin"; // ✅ Backend API

interface Friend {
  id: number;
  username: string;
}

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
  const params = useParams() as { id?: string };
  const id = params.id;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requestsSent, setRequestsSent] = useState<Friend[]>([]);
  const [requestsReceived, setRequestsReceived] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.warn("User ID is undefined!");
      return;
    }

    async function fetchUserDetails() {
      try {
        // ✅ Fetch User Details
        console.log(`Fetching user details for ID: ${id}`);
        const userRes = await fetch(`${API_URL}/users/${id}`);
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData: User = await userRes.json();
        setUser(userData);
        console.log("User Data:", userData);

        // ✅ Fetch Friends & Requests
        console.log(`Fetching friendships for ID: ${id}`);
        const friendsRes = await fetch(`${API_URL}/users/${id}/friends`);
        if (!friendsRes.ok) throw new Error("Failed to fetch friends");

        const friendsData = await friendsRes.json();
        console.log("Friends API Response:", friendsData); // ✅ Debugging log

        // ✅ Ensure data exists before setting state
        setFriends(friendsData?.friends || []);
        setRequestsSent(friendsData?.requestsSent || []);
        setRequestsReceived(friendsData?.requestsReceived || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
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
{/* Friends Section */}
<div className="bg-white p-8 mt-6 rounded-lg shadow-lg border-t-4 border-blue-500">
        <h3 className="text-2xl font-semibold text-blue-700 mb-4">Friends</h3>
        {friends.length === 0 ? (
          <p className="text-gray-500">No friends found.</p>
        ) : (
          <ul className="list-disc pl-5">
            {friends.map((friend) => (
              <li key={friend.id} className="text-blue-700 font-semibold">
                {friend.username} (ID: {friend.id})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Requests Sent & Received */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Friend Requests Sent */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-orange-500">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">Friend Requests Sent</h3>
          {requestsSent.length === 0 ? (
            <p className="text-gray-500">No requests sent.</p>
          ) : (
            <ul className="list-disc pl-5">
              {requestsSent.map((req) => (
                <li key={req.id} className="text-orange-600 font-semibold">
                  {req.username} (ID: {req.id})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Friend Requests Received */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-green-500">
          <h3 className="text-xl font-semibold text-green-600 mb-2">Friend Requests Received</h3>
          {requestsReceived.length === 0 ? (
            <p className="text-gray-500">No requests received.</p>
          ) : (
            <ul className="list-disc pl-5">
              {requestsReceived.map((req) => (
                <li key={req.id} className="text-green-600 font-semibold">
                  {req.username} (ID: {req.id})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
     
  );
}

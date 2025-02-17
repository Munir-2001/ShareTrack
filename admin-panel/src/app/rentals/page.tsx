"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api/admin";

// ✅ Define a Type for Rental Items
interface RentalItem {
  id: number;
  item_name: string;
  owner_id: number;
  status: string;
}

export default function RentalApprovalPage() {
  const [rentals, setRentals] = useState<RentalItem[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    async function fetchPendingRentals() {
      const res = await fetch(`${API_URL}/rentals/pending`);
      const data: RentalItem[] = await res.json();
      setRentals(data);
    }
    fetchPendingRentals();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">Rental Approvals</h1>

      {rentals.length === 0 ? (
        <p className="text-gray-600">No pending rentals</p>
      ) : (
        <table className="w-full bg-white border rounded-lg shadow-md">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-3">Item</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental.id} className="border">
                <td className="p-3">{rental.item_name}</td>
                <td className="p-3">{rental.owner_id}</td>
                <td className="p-3 text-yellow-500 font-semibold">{rental.status}</td>
                <td className="p-3 flex gap-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded">
                    Approve
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

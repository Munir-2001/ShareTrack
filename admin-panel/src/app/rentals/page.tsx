// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const API_URL = "http://localhost:5001/api/admin";

// interface RentalItem {
//   id: number;
//   item_name: string;
//   owner_name: string;
//   status: string;
// }

// export default function RentalApprovalPage() {
//   const [rentals, setRentals] = useState<RentalItem[]>([]);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [selectedRental, setSelectedRental] = useState<number | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchPendingRentals() {
//       const res = await fetch(`${API_URL}/rentals/pending`);
//       const data: RentalItem[] = await res.json();
//       setRentals(data);
//     }
//     fetchPendingRentals();
//   }, []);

//   const handleApprove = async (id: number) => {
//     try {
//       await fetch(`${API_URL}/rentals/${id}/approve`, { method: "PUT" });
//       setRentals((prev) => prev.filter((rental) => rental.id !== id));
//     } catch (error) {
//       console.error("Error approving rental:", error);
//     }
//   };

//   const handleReject = async () => {
//     if (!selectedRental || rejectionReason.trim() === "") {
//       alert("Please enter a reason for rejection.");
//       return;
//     }

//     try {
//       await fetch(`${API_URL}/rentals/${selectedRental}/reject`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reason: rejectionReason }),
//       });

//       setRentals((prev) => prev.filter((rental) => rental.id !== selectedRental));
//       setSelectedRental(null);
//       setRejectionReason("");
//     } catch (error) {
//       console.error("Error rejecting rental:", error);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
//       {/* Back Button */}
//       <button
//         onClick={() => router.push("/dashboard")}
//         className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition mb-4"
//       >
//         🔙 Back to Dashboard
//       </button>

//       <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Rental Approvals</h1>

//       {rentals.length === 0 ? (
//         <p className="text-gray-700 text-center text-lg">No pending rentals</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full bg-white border rounded-lg shadow-md">
//             <thead>
//               <tr className="bg-blue-800 text-gray-200 text-left">
//                 <th className="p-4">Item</th>
//                 <th className="p-4">Owner</th>
//                 <th className="p-4">Status</th>
//                 <th className="p-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rentals.map((rental) => (
//                 <tr key={rental.id} className="border hover:bg-gray-200 transition-all">
//                   <td className="p-4">{rental.item_name}</td>
//                   <td className="p-4">{rental.owner_name}</td>
//                   <td className="p-4 text-yellow-600 font-semibold">{rental.status}</td>
//                   <td className="p-4 flex gap-2">
//                     <button
//                       onClick={() => handleApprove(rental.id)}
//                       className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => setSelectedRental(rental.id)}
//                       className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Reject Popup */}
//       {selectedRental && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-bold mb-4 text-gray-900">Reject Rental</h2>
//             <textarea
//               className="w-full p-2 border rounded mb-3 text-gray-800"
//               placeholder="Enter rejection reason..."
//               value={rejectionReason}
//               onChange={(e) => setRejectionReason(e.target.value)}
//             ></textarea>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setSelectedRental(null)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleReject}
//                 className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
//               >
//                 Confirm Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5001/api/admin";

interface RentalItem {
  id: number;
  item_name: string;
  owner_name: string;
  owner_email: string;
  rental_price: number;
  location: string;
  status: string;
}

export default function RentalApprovalPage() {
  const [rentals, setRentals] = useState<RentalItem[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRental, setSelectedRental] = useState<number | null>(null);
  const router = useRouter();

  // ✅ Fetch Pending Rentals
  useEffect(() => {
    async function fetchPendingRentals() {
      try {
        const res = await fetch(`${API_URL}/rentals/pending`);
        const data: RentalItem[] = await res.json();
        setRentals(data);
      } catch (error) {
        console.log("Error fetching pending rentals:", error);
      }
    }
    fetchPendingRentals();
  }, []);

  // ✅ Approve Rental Item
  const handleApprove = async (id: number) => {
    try {
      await fetch(`${API_URL}/rentals/${id}/approve`, { method: "PUT" });
      setRentals((prev) => prev.filter((rental) => rental.id !== id));
    } catch (error) {
      console.log("Error approving rental:", error);
    }
  };

  // ✅ Reject Rental Item
  const handleReject = async () => {
    if (!selectedRental || rejectionReason.trim() === "") {
      alert("Please enter a reason for rejection.");
      return;
    }

    try {
      await fetch(`${API_URL}/rentals/${selectedRental}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      setRentals((prev) => prev.filter((rental) => rental.id !== selectedRental));
      setSelectedRental(null);
      setRejectionReason("");
    } catch (error) {
      console.log("Error rejecting rental:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      {/* 🔙 Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition mb-4"
      >
        🔙 Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Rental Approvals</h1>

      {rentals.length === 0 ? (
        <p className="text-gray-700 text-center text-lg">No pending rentals</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-800 text-gray-200 text-left">
                <th className="p-4">Item</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Email</th>
                <th className="p-4">Price</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.id} className="border hover:bg-gray-200 transition-all">
                  <td className="p-4 font-medium">{rental.item_name}</td>
                  <td className="p-4">{rental.owner_name}</td>
                  <td className="p-4 text-blue-700">{rental.owner_email}</td>
                  <td className="p-4 font-semibold text-green-600">${rental.rental_price}</td>
                  <td className="p-4">{rental.location}</td>
                  <td className="p-4 text-yellow-600 font-semibold">{rental.status}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleApprove(rental.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedRental(rental.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ❌ Reject Popup */}
      {selectedRental && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Reject Rental</h2>
            <textarea
              className="w-full p-2 border rounded mb-3 text-gray-800"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedRental(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

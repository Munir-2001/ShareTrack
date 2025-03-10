// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const API_URL = "http://localhost:5001/api/admin"; // Backend API

// interface Transaction {
//   id: number;
//   sender_username: string;
//   receiver_username: string;
//   amount: number;
//   status: string;
//   transaction_type: string | null;
//   created_at: string;
// }

// export default function TransactionsPage() {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const pageSize = 10; // Fixed 10 items per page
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchTransactions() {
//       try {
//         const res = await fetch(`${API_URL}/transactions`);
//         if (!res.ok) throw new Error("Failed to fetch transactions");
//         const data = await res.json();
//         setTransactions(data.transactions || []); // Store all transactions
//         setFilteredTransactions(data.transactions || []); // Initialize filtered transactions
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//       }
//     }

//     fetchTransactions();
//   }, []);

//   // Apply search filter
//   useEffect(() => {
//     const filtered = transactions.filter(
//       (tx) =>
//         tx.amount.toString().includes(search) ||
//         tx.sender_username.toLowerCase().includes(search.toLowerCase()) ||
//         tx.receiver_username.toLowerCase().includes(search.toLowerCase())||
//         tx.status.toLowerCase().includes(search.toLowerCase())
//     );
//     setFilteredTransactions(filtered);
//     setPage(1); // Reset to first page on search change
//   }, [search, transactions]);

//   // Paginated transactions for current page
//   const totalPages = Math.ceil(filteredTransactions.length / pageSize);
//   const paginatedTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* 🔙 Back Button */}
//       <button
//         onClick={() => router.push("/admin/dashboard")}
//         className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
//       >
//         ← Back to Dashboard
//       </button>

//       <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
//         💳 Transactions Overview
//       </h1>

//       {/* Search Bar */}
//       <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
//         <input
//           type="text"
//           placeholder="🔍 Search by amount, sender, or receiver..."
//           className="w-full p-3 border-2 border-gray-500 rounded-lg shadow-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Transactions Table */}
//       <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-400">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-blue-700 text-white text-left">
//               <th className="border p-3">ID</th>
//               <th className="border p-3">Sender</th>
//               <th className="border p-3">Receiver</th>
//               <th className="border p-3">Amount</th>
//               <th className="border p-3">Status</th>
//               <th className="border p-3">Date</th>
//               <th className="border p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedTransactions.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="text-center p-4 text-gray-500">
//                   No transactions found
//                 </td>
//               </tr>
//             ) : (
//               paginatedTransactions.map((tx) => (
//                 <tr key={tx.id} className="border transition duration-300 hover:bg-gray-100">
//                   <td className="p-3 text-black">{tx.id}</td>
//                   <td className="p-3 text-black">{tx.sender_username}</td>
//                   <td className="p-3 text-black">{tx.receiver_username}</td>
//                   <td className="p-3 font-semibold text-green-600">${tx.amount}</td>
//                   <td className="p-3">
//                     <span
//                       className={`font-semibold ${
//                         tx.status === "approved"
//                           ? "text-green-600"
//                           : tx.status === "repaid"
//                           ? "text-blue-600"
//                           : tx.status === "declined"
//                           ? "text-red-600"
//                           : "text-yellow-600"
//                       }`}
//                     >
//                       {tx.status}
//                     </span>
//                   </td>
//                   <td className="p-3 text-black">{new Date(tx.created_at).toLocaleDateString()}</td>
//                   <td className="p-3 flex gap-2">
//                     <button
//                       onClick={() => router.push(`/users/${tx.sender_username}`)}
//                       className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
//                     >
//                       Sender
//                     </button>
//                     <button
//                       onClick={() => router.push(`/users/${tx.receiver_username}`)}
//                       className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
//                     >
//                       Receiver
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="mt-6 flex justify-center gap-2">
//         {[...Array(totalPages)].map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setPage(index + 1)}
//             className={`px-4 py-2 border rounded ${
//               page === index + 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
//             } hover:bg-blue-700 transition`}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5001/api/admin"; // Backend API

interface Transaction {
  id: number;
  sender_username: string;
  receiver_username: string;
  amount: number;
  status: string;
  transaction_type: string | null;
  created_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10; // Fixed 10 items per page
  const router = useRouter();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch(`${API_URL}/transactions`);
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();
        setTransactions(data.transactions || []); // Store all transactions
        setFilteredTransactions(data.transactions || []); // Initialize filtered transactions
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchTransactions();
  }, []);

  // Apply search filter
  useEffect(() => {
    const filtered = transactions.filter(
      (tx) =>
        tx.amount.toString().includes(search) ||
        tx.sender_username.toLowerCase().includes(search.toLowerCase()) ||
        tx.receiver_username.toLowerCase().includes(search.toLowerCase())||
        tx.status.toLowerCase().includes(search.toLowerCase())

    );
    setFilteredTransactions(filtered);
    setPage(1); // Reset to first page on search change
  }, [search, transactions]);

  // Paginated transactions for current page
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* 🔙 Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        💳 Transactions Overview
      </h1>

      {/* Search Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="🔍 Search by amount, sender, or receiver..."
          className="w-full p-3 border-2 border-gray-500 rounded-lg shadow-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-400">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-700 text-white text-left">
              <th className="border p-3">ID</th>
              <th className="border p-3">Sender</th>
              <th className="border p-3">Receiver</th>
              <th className="border p-3">Amount</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Date</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="border transition duration-300 hover:bg-gray-100">
                  <td className="p-3 text-black">{tx.id}</td>
                  <td className="p-3 text-black">{tx.sender_username}</td>
                  <td className="p-3 text-black">{tx.receiver_username}</td>
                  <td className="p-3 font-semibold text-green-600">${tx.amount}</td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        tx.status === "approved"
                          ? "text-green-600"
                          : tx.status === "repaid"
                          ? "text-blue-600"
                          : tx.status === "declined"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3 text-black">{new Date(tx.created_at).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => router.push(`/users/${tx.sender_username}`)}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Sender
                    </button>
                    <button
                      onClick={() => router.push(`/users/${tx.receiver_username}`)}
                      className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Receiver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center gap-2">
        {/* Back Button */}
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 border rounded ${
            page <= 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
          } transition`}
        >
          ⬅ Back
        </button>

        {/* Page Number Buttons */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-4 py-2 border rounded ${
              page === index + 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-black hover:bg-gray-400"
            } transition`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 border rounded ${
            page >= totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
          } transition`}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

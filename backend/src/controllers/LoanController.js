const { supabase } = require("../config/db");

// ✅ Get all loans (both received & given)
// const getUserLoans = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     if (!userId) return res.status(400).json({ message: "User ID is required" });

//     const { data, error } = await supabase
//       .from("lending_details")
//       .select(`
//         transaction_id, 
//         repayment_date, 
//         transactions (
//           amount, 
//           sender_id, 
//           receiver_id, 
//           sender:sender_id(username), 
//           receiver:receiver_id(username)
//         )
//       `)
//       .or(`transactions.sender_id.eq.${userId}, transactions.receiver_id.eq.${userId}`);

//     if (error) throw error;

//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching loans", error: error.message });
//   }
// };

// const getUserLoans = async (req, res) => {
//     try {
//       const { userId } = req.body;
//       if (!userId) return res.status(400).json({ message: "User ID is required" });
  
//       // ✅ Fetch transactions related to the user
//       const { data: transactions, error: transactionError } = await supabase
//         .from("transactions")
//         .select("id, amount, sender_id, receiver_id")
//         .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
  
//       if (transactionError) throw transactionError;
//       if (!transactions.length) return res.status(200).json([]);
  
//       const transactionIds = transactions.map((t) => t.id);
  
//       // ✅ Fetch lending details for those transactions
//       const { data: lendingDetails, error: lendingError } = await supabase
//         .from("lending_details")
//         .select("transaction_id, repayment_date")
//         .in("transaction_id", transactionIds);
  
//       if (lendingError) throw lendingError;
  
//       // ✅ Fetch usernames
//       const userIds = [...new Set(transactions.flatMap(t => [t.sender_id, t.receiver_id]))];
//       const { data: users, error: usersError } = await supabase
//         .from("users")
//         .select("id, username")
//         .in("id", userIds);
  
//       if (usersError) throw usersError;
  
//       // ✅ Map usernames to user IDs
//       const userMap = users.reduce((acc, user) => {
//         acc[user.id] = user.username;
//         return acc;
//       }, {});
  
//       // ✅ Merge transactions with lending details
//       const loans = transactions.map((t) => ({
//         transaction_id: t.id,
//         amount: t.amount,
//         repayment_date:
//           lendingDetails.find((l) => l.transaction_id === t.id)?.repayment_date || null,
//         sender_username: userMap[t.sender_id] || "Unknown",
//         receiver_username: userMap[t.receiver_id] || "Unknown",
//       }));
  
//       res.status(200).json(loans);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching loans", error: error.message });
//     }
//   };
  
const getUserLoans = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { userId } = req.body;
    if (!userId) {
      console.error("Missing userId in request!");
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log("Fetching transactions for userId:", userId);

    // ✅ Fetch transactions related to the user
    const { data: transactions, error: transactionError } = await supabase
      .from("transactions")
      .select("id, amount, sender_id, receiver_id")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (transactionError) {
      console.error("Supabase error fetching transactions:", transactionError);
      throw transactionError;
    }

    if (!transactions.length) {
      console.log("No transactions found for user:", userId);
      return res.status(200).json([]);
    }

    console.log("Fetched transactions:", transactions);

    const transactionIds = transactions.map((t) => t.id);

    // ✅ Fetch lending details for those transactions
    const { data: lendingDetails, error: lendingError } = await supabase
      .from("lending_details")
      .select("transaction_id, repayment_date")
      .in("transaction_id", transactionIds);

    if (lendingError) {
      console.error("Supabase error fetching lending details:", lendingError);
      throw lendingError;
    }

    console.log("Fetched lending details:", lendingDetails);

    // ✅ Fetch usernames
    const userIds = [...new Set(transactions.flatMap(t => [t.sender_id, t.receiver_id]))];
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, username")
      .in("id", userIds);

    if (usersError) {
      console.error("Supabase error fetching users:", usersError);
      throw usersError;
    }

    console.log("Fetched users:", users);

    // ✅ Map usernames to user IDs
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user.username;
      return acc;
    }, {});

    // ✅ Merge transactions with lending details
    const loans = transactions.map((t) => ({
      transaction_id: t.id,
      amount: t.amount,
      repayment_date:
        lendingDetails.find((l) => l.transaction_id === t.id)?.repayment_date || null,
      sender_username: userMap[t.sender_id] || "Unknown",
      receiver_username: userMap[t.receiver_id] || "Unknown",
    }));

    console.log("Final loan data:", loans);
    res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error.message);
    res.status(500).json({ message: "Error fetching loans", error: error.message });
  }
};
debugger;
// ✅ Repay a loan
// const repayLoan = async (req, res) => {
//   try {
//     const { transactionId } = req.body;
//     if (!transactionId) return res.status(400).json({ message: "Transaction ID is required" });

//     // ✅ Update transaction status to "transferred"
//     const { error } = await supabase
//       .from("transactions")
//       .update({ status: "repaid" })
//       .eq("id", transactionId);

//     if (error) throw error;

//     res.status(200).json({ message: "Loan repaid successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error repaying loan", error: error.message });
//   }
// };
const repayLoan = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    // ✅ Fetch the transaction details
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("id, amount, sender_id, receiver_id")
      .eq("id", transactionId)
      .single(); // Fetch only one transaction

    if (transactionError || !transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const { amount, sender_id, receiver_id } = transaction;

    // ✅ Fetch the borrower (receiver) and lender (sender) details
    const { data: borrower, error: borrowerError } = await supabase
      .from("users")
      .select("id, balance")
      .eq("id", receiver_id)
      .single();

    const { data: lender, error: lenderError } = await supabase
      .from("users")
      .select("id, balance")
      .eq("id", sender_id)
      .single();

    if (borrowerError || lenderError || !borrower || !lender) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check if the borrower has enough balance
    if (borrower.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // ✅ Deduct the amount from the borrower and credit the lender
    const { error: updateBorrowerError } = await supabase
      .from("users")
      .update({ balance: borrower.balance - amount })
      .eq("id", receiver_id);

    const { error: updateLenderError } = await supabase
      .from("users")
      .update({ balance: lender.balance + amount })
      .eq("id", sender_id);

    if (updateBorrowerError || updateLenderError) {
      return res.status(500).json({ message: "Failed to update balances" });
    }

    // ✅ Mark the transaction as "repaid"
    const { error: updateTransactionError } = await supabase
      .from("transactions")
      .update({ status: "repaid" })
      .eq("id", transactionId);

    if (updateTransactionError) {
      return res.status(500).json({ message: "Failed to update transaction status" });
    }

    res.status(200).json({ message: "Loan repaid successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error repaying loan", error: error.message });
  }
};


module.exports = { getUserLoans, repayLoan };

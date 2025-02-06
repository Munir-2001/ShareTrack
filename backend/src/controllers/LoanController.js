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

// const repayLoan = async (req, res) => {
//   try {
//     const { transactionId } = req.body;

//     if (!transactionId) {
//       return res.status(400).json({ message: "Transaction ID is required" });
//     }

//     // ✅ Fetch the transaction details
//     const { data: transaction, error: transactionError } = await supabase
//       .from("transactions")
//       .select("id, amount, sender_id, receiver_id")
//       .eq("id", transactionId)
//       .single(); // Fetch only one transaction

//     if (transactionError || !transaction) {
//       return res.status(404).json({ message: "Transaction not found" });
//     }

//     const { amount, sender_id, receiver_id } = transaction;

//     // ✅ Fetch the borrower (receiver) and lender (sender) details
//     const { data: borrower, error: borrowerError } = await supabase
//       .from("users")
//       .select("id, balance")
//       .eq("id", receiver_id)
//       .single();

//     const { data: lender, error: lenderError } = await supabase
//       .from("users")
//       .select("id, balance")
//       .eq("id", sender_id)
//       .single();

//     if (borrowerError || lenderError || !borrower || !lender) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // ✅ Check if the borrower has enough balance
//     if (borrower.balance < amount) {
//       return res.status(400).json({ message: "Insufficient balance" });
//     }

//     // ✅ Deduct the amount from the borrower and credit the lender
//     const { error: updateBorrowerError } = await supabase
//       .from("users")
//       .update({ balance: borrower.balance - amount })
//       .eq("id", receiver_id);

//     const { error: updateLenderError } = await supabase
//       .from("users")
//       .update({ balance: lender.balance + amount })
//       .eq("id", sender_id);

//     if (updateBorrowerError || updateLenderError) {
//       return res.status(500).json({ message: "Failed to update balances" });
//     }

//     // ✅ Mark the transaction as "repaid"
//     const { error: updateTransactionError } = await supabase
//       .from("transactions")
//       .update({ status: "repaid" })
//       .eq("id", transactionId);

//     if (updateTransactionError) {
//       return res.status(500).json({ message: "Failed to update transaction status" });
//     }
//     if(!updateTransactionError){
//       //now call the model and feed the data in it regarding the loan reapyment.

//     }

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

    // ✅ Now call the function to recalculate user financial metrics
    const lenderMetrics = await calculateUserFinancialMetrics(sender_id);
    const borrowerMetrics = await calculateUserFinancialMetrics(receiver_id);

    // ✅ Update metrics in the database for both lender and borrower
    const { error: updateLenderMetricsError } = await supabase
      .from("users")
      .update({
        total_lend_borrow_ratio: lenderMetrics.totalLendBorrowRatio,
        timely_payment_score: lenderMetrics.timelyPaymentScore
      })
      .eq("id", sender_id);

    const { error: updateBorrowerMetricsError } = await supabase
      .from("users")
      .update({
        total_lend_borrow_ratio: borrowerMetrics.totalLendBorrowRatio,
        timely_payment_score: borrowerMetrics.timelyPaymentScore
      })
      .eq("id", receiver_id);

    if (updateLenderMetricsError || updateBorrowerMetricsError) {
      return res.status(500).json({ message: "Failed to update financial metrics" });
    }

    res.status(200).json({
      message: "Loan repaid successfully",
      lenderMetrics,
      borrowerMetrics
    });

  } catch (error) {
    res.status(500).json({ message: "Error repaying loan", error: error.message });
  }
};

const calculateUserFinancialMetrics = async (userId) => {
  try {
      if (!userId) {
          throw new Error("User ID is required");
      }

      // ✅ Fetch all transactions where user is sender (lender) or receiver (borrower)
      const { data: transactions, error: transactionsError } = await supabase
          .from("transactions")
          .select("id, amount, sender_id, receiver_id, status, created_at")
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

      if (transactionsError) {
          throw transactionsError;
      }

      if (!transactions || transactions.length === 0) {
          return { totalLendBorrowRatio: 0, timelyPaymentScore: 0 };
      }

      let totalLent = 0;
      let totalBorrowed = 0;
      let totalRepayments = 0;
      let timelyRepayments = 0;

      const now = new Date();

      transactions.forEach(transaction => {
          if (transaction.sender_id === userId) {
              totalLent += transaction.amount;
          }
          if (transaction.receiver_id === userId) {
              totalBorrowed += transaction.amount;

              // ✅ Check if repayment was on time
              if (transaction.status === "repaid") {
                  totalRepayments++;

                  // Assume repayment was timely if done within 7 days of borrowing
                  const repaymentDeadline = new Date(transaction.created_at);
                  repaymentDeadline.setDate(repaymentDeadline.getDate() + 7);

                  if (now <= repaymentDeadline) {
                      timelyRepayments++;
                  }
              }
          }
      });

      // ✅ Calculate Total Lend/Borrow Ratio (Prevent division by zero)
      const totalLendBorrowRatio = totalBorrowed > 0 ? (totalLent / totalBorrowed) : (totalLent > 0 ? 1 : 0);

      // ✅ Calculate Timely Payment Score (Percentage of timely repayments)
      const timelyPaymentScore = totalRepayments > 0 ? (timelyRepayments / totalRepayments) * 100 : 0;

      //here we must call the model and send the data as input then get the output
      

      return { totalLendBorrowRatio, timelyPaymentScore };

  } catch (error) {
      console.error("Error calculating user financial metrics:", error.message);
      return { totalLendBorrowRatio: 0, timelyPaymentScore: 0 };
  }
};



module.exports = { getUserLoans, repayLoan };

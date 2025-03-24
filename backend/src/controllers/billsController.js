import { supabase } from "../config/db.js";
import axios from 'axios';
// Create a new bill with its contributors and payment requests
const createBill = async (req, res) => {
  try {
    const { creator_id, name, description, total_amount, contributors } = req.body;

    // Validate required fields
    if (!creator_id || !name || !total_amount || !Array.isArray(contributors) || contributors.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Insert the bill record into the bills table
    const { data: billData, error: billError } = await supabase
      .from("bills")
      .insert([{ creator_id, name, description, total_amount }])
      .select();

    if (billError) throw billError;
    if (!billData || billData.length === 0) {
      return res.status(500).json({ message: "Failed to create bill" });
    }

    const bill = billData[0];

    // Loop through contributors and insert each into billcontributors
    for (const contributor of contributors) {
      const { owner_id = creator_id, contributor_id, share_amount, paid_amount } = contributor;
      const final_paid_amount = paid_amount || 0;

      // Insert into billcontributors table
      const { data: contributorData, error: contributorError } = await supabase
        .from("billcontributors")
        .insert([{
          bill_id: bill.id,
          contributor_id,
          owner_id,
          share_amount,
          paid_amount: final_paid_amount
        }])
        .select();
    
    if (contributorError) {
      console.error("Error inserting contributor:", contributorError);
      throw contributorError;
    } else {
      console.log("Inserted contributor:", contributorData);
    }

      if (contributorError) throw contributorError;

      // Create a payment request for the contributor
      const requested_amount = share_amount - final_paid_amount;
      const { error: paymentRequestError } = await supabase
        .from("payment_requests")
        .insert([{
          bill_id: bill.id,
          contributor_id,
          owner_id,
          requested_amount,
          status: "pending"
        }]);

      if (paymentRequestError) throw paymentRequestError;
    }

    res.status(201).json({ message: "Bill created successfully", bill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const CREDIT_SCORING_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-live-server.com/predict"
    : "http://localhost:8000/predict";
const payBill = async (req, res) => {
    try {
      const { paymentRequestId } = req.body;
  
      if (!paymentRequestId) {
        return res.status(400).json({ message: "Transaction ID is required" });
      }
  
      // ✅ Fetch transaction details
      const { data: transaction, error: paymentRequesError } = await supabase
        .from("payment_requests")
        .select("id, requested_amount, contributor_id, owner_id, status")
        .eq("id", paymentRequestId)
        .single();
  
      if (transactionError || !transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
  
      let { requested_amount, contributor_id, owner_id, status } = transaction;
  
      // ✅ Borrower is ALWAYS the sender_id (the original requester)
      let borrower_id = contributor_id;
      let lender_id = owner_id;
  
      console.log(`🔄 Borrower (Who is repaying): ${borrower_id}`);
      console.log(`✅ Lender (Who gets repaid): ${lender_id}`);
  
      // ✅ Fetch borrower and lender balances
      const { data: borrower, error: borrowerError } = await supabase
        .from("users")
        .select("id, balance")
        .eq("id", borrower_id)
        .single();
  
      const { data: lender, error: lenderError } = await supabase
        .from("users")
        .select("id, balance")
        .eq("id", lender_id)
        .single();
  
      if (borrowerError || lenderError || !borrower || !lender) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // ✅ Ensure borrower has enough balance before repayment
      if (borrower.balance < requested_amount) {
        return res.status(400).json({ message: "Insufficient balance to repay loan" });
      }
  
      // ✅ Deduct amount from borrower & add to lender **(CORRECTED)**
      const updatedBorrowerBalance = borrower.balance - requested_amount; // Borrower loses money
      const updatedLenderBalance = lender.balance + requested_amount; // Lender gains money back
  
      const { error: updateBorrowerError } = await supabase
        .from("users")
        .update({ balance: updatedBorrowerBalance })
        .eq("id", borrower_id);
  
      const { error: updateLenderError } = await supabase
        .from("users")
        .update({ balance: updatedLenderBalance })
        .eq("id", lender_id);
  
      if (updateBorrowerError || updateLenderError) {
        return res.status(500).json({ message: "Failed to update balances" });
      }
  
      // ✅ Mark the transaction as "repaid"
      const { error: updateTransactionError } = await supabase
        .from("payment_requests")
        .update({ status: "repaid" })
        .eq("id", paymentRequestId);
  
      if (updateTransactionError) {
        return res.status(500).json({ message: "Failed to update transaction status" });
      }
      // ✅ Calculate & update financial metrics for both lender & borrower
          const lenderMetrics = await calculateUserFinancialMetrics(lender_id);
          const borrowerMetrics = await calculateUserFinancialMetrics(borrower_id);
  
          // ✅ Update metrics in DB
          const { error: updateLenderMetricsError } = await supabase
            .from("users")
            .update({
              total_lend_borrow_ratio: lenderMetrics.totalLendBorrowRatio,
              timely_payment_score: lenderMetrics.timelyPaymentScore,
            })
            .eq("id", lender_id);
  
          const { error: updateBorrowerMetricsError } = await supabase
            .from("users")
            .update({
              total_lend_borrow_ratio: borrowerMetrics.totalLendBorrowRatio,
              timely_payment_score: borrowerMetrics.timelyPaymentScore,
            })
            .eq("id", borrower_id);
  
          if (updateLenderMetricsError || updateBorrowerMetricsError) {
            return res.status(500).json({ message: "Failed to update financial metrics" });
          }
  
          const { data: borrowerobj, error: borrowerErrors } = await supabase
          .from("users")
          .select("*")
          .eq("id", borrower_id)
          .single();
  
      const { data: lenderobj, error: lenderErrors } = await supabase
          .from("users")
          .select("*")
          .eq("id", lender_id)
          .single();
          console.log('borrower obj is '+ borrowerobj)
          const borrowerscore = await updateCreditScore(borrower_id, borrowerobj, borrowerMetrics);
          console.log('ledner obj is '+ lenderobj)
          const lenderscore= await updateCreditScore(lender_id, lenderobj, lenderMetrics);
  
          console.log('the lender score is '+ lenderscore.credit_score)
          console.log('the borrowerscoreis '+ borrowerscore.credit_score)
  
  
      res.status(200).json({
        message: "Loan repaid successfully",
        borrower_balance: updatedBorrowerBalance,
        lender_balance: updatedLenderBalance
      });
  
    } catch (error) {
      res.status(500).json({ message: "Error repaying loan", error: error.message });
    }
  };

  const updateCreditScore = async (userId, userData, financialMetrics) => {
    try {
      // ✅ Prepare Data for Credit Score API
      const requestData = {
        age: userData.age,
        gender: userData.gender, // 1 for male, 0 for female
        marital_status: userData.marital_status, // 1 for married, 0 otherwise
        education_level: userData.education_level, // "Bachelor", "Master", etc.
        employment_status: userData.employment_status, // 1 for employed, 0 otherwise
        total_lend_borrow_ratio: financialMetrics.totalLendBorrowRatio,
        timely_payment_score: financialMetrics.timelyPaymentScore,
      };
  
      console.log(`📨 Sending data to Credit Scoring API for user ${userId}:`, requestData);
  
      // ✅ Call the API
      const response = await axios.post(CREDIT_SCORING_API_URL, requestData);
      const creditScore = response.data.credit_score;
  
      console.log(`✅ Credit Score Received for user ${userId}: ${creditScore}`);
  
      // ✅ Store Credit Score in Database
      const { error: updateError } = await supabase
        .from("users")
        .update({ credit_score: creditScore })
        .eq("id", userId);
  
      if (updateError) {
        console.error(`❌ Failed to update credit score for user ${userId}:`, updateError);
      }
    } catch (error) {
      console.error(`❌ Error fetching credit score for user ${userId}:`, error.message);
    }
  };
  
  const calculateUserFinancialMetrics = async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
  
      // ✅ Fetch all transactions where user is sender (lender) or receiver (borrower)
      const { data: transactions, error: transactionsError } = await supabase
      .from("payment_requests")
      .select("id, requested_amount, contributor_id, owner_id, status, created_at")
        .or(`contributor_id.eq.${userId},owner_id.eq.${userId}`);
  
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
  
      transactions.forEach(payment_requests => {
        if (payment_requests.contributor_id === userId) {
          totalLent += payment_requests.requested_amount;
        }
        if (payment_requests.owner_id === userId) {
          totalBorrowed += payment_requests.requested_amount;
  
          // ✅ Check if repayment was on time
          if (payment_requests.status === "repaid") {
            totalRepayments++;
  
            // Assume repayment was timely if done within 7 days of borrowing
            const repaymentDeadline = new Date(payment_requests.created_at);
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

// Retrieve details of a specific bill along with its contributors
const getBill = async (req, res) => {
  try {
    const { billId } = req.params;
    if (!billId) {
      return res.status(400).json({ message: "Bill ID is required" });
    }

    // Get the bill record
    const { data: bill, error: billError } = await supabase
      .from("bills")
      .select("*")
      .eq("id", billId)
      .single();
    if (billError) throw billError;

    // Get all contributors for this bill
    const { data: contributors, error: contributorsError } = await supabase
      .from("billcontributors")
      .select("*")
      .eq("bill_id", billId);
    if (contributorsError) throw contributorsError;

    // Compute pending amount for each contributor (share_amount - paid_amount)
    const contributorsWithPending = contributors.map(c => ({
      ...c,
      pending_amount: c.share_amount - c.paid_amount
    }));

    res.status(200).json({ bill, contributors: contributorsWithPending });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List all bills (optionally filtered by creator_id)
const listBills = async (req, res) => {
  try {
    const { creator_id } = req.query;
    let query = supabase.from("bills").select("*");

    if (creator_id) {
      query = query.eq("creator_id", creator_id);
    }

    const { data: bills, error } = await query;
    if (error) throw error;

    res.status(200).json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update bill details (name, description, total_amount)
const updateBill = async (req, res) => {
  try {
    const { billId } = req.params;
    const { name, description, total_amount } = req.body;
    if (!billId) {
      return res.status(400).json({ message: "Bill ID is required" });
    }

    const { data, error } = await supabase
      .from("bills")
      .update({ name, description, total_amount, updated_at: new Date() })
      .eq("id", billId)
      .select();
    if (error) throw error;

    res.status(200).json({ message: "Bill updated successfully", bill: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a contributor's paid amount for a bill
const updateContributorPayment = async (req, res) => {
  try {
    const { billId, contributorId } = req.params;
    const { paid_amount } = req.body;
    if (!billId || !contributorId) {
      return res.status(400).json({ message: "Bill ID and Contributor ID are required" });
    }

    const { data, error } = await supabase
      .from("billcontributors")
      .update({ paid_amount, updated_at: new Date() })
      .eq("bill_id", billId)
      .eq("contributor_id", contributorId)
      .select();
    if (error) throw error;

    res.status(200).json({ message: "Contributor payment updated", contributor: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a bill along with its associated contributors and payment requests
const deleteBill = async (req, res) => {
  try {
    const { billId } = req.params;
    if (!billId) {
      return res.status(400).json({ message: "Bill ID is required" });
    }

    // Delete contributors for this bill
    const { error: delContributorsError } = await supabase
      .from("billcontributors")
      .delete()
      .eq("bill_id", billId);
    if (delContributorsError) throw delContributorsError;

    // Delete payment requests for this bill
    const { error: delPaymentError } = await supabase
      .from("payment_requests")
      .delete()
      .eq("bill_id", billId);
    if (delPaymentError) throw delPaymentError;

    // Delete the bill record
    const { error: delBillError } = await supabase
      .from("bills")
      .delete()
      .eq("id", billId);
    if (delBillError) throw delBillError;

    res.status(200).json({ message: "Bill and associated records deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createBill, getBill, listBills, updateBill, updateContributorPayment, deleteBill, payBill };

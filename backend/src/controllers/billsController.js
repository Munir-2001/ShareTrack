import { supabase } from "../config/db.js";

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
      const { contributor_id, share_amount, paid_amount } = contributor;
      const final_paid_amount = paid_amount || 0;

      const { data: contributorData, error: contributorError } = await supabase
      .from("billcontributors")
      .insert([{
        bill_id: bill.id,
        contributor_id,
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

export { createBill, getBill, listBills, updateBill, updateContributorPayment, deleteBill };

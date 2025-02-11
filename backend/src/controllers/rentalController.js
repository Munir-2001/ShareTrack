const { supabase } = require("../config/db");

const getRentalItems = async (req, res) => {
    try {
      // ✅ Fetch rental items from the database
      const { data, error } = await supabase.from("rental_items").select("*");
  
      if (error) {
        console.error("❌ Supabase Error:", error);
        return res.status(500).json({ message: "Database error while fetching rental items." });
      }
  
      return res.status(200).json(data);
    } catch (error) {
      console.error("❌ Error fetching rental items:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

module.exports = { getRentalItems };

// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//     sender_username: {
//         type: String,
//         required: true,
//     },
//     receiver_username: {
//         type: String,
//         required: true,
//     },
//     amount: {
//         type: Number,
//         required: true,
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'approved', 'declined', 'transferred'], // Possible values for status
//         default: 'pending',
//     },
//     timestamp: {
//         type: Date,
//         default: Date.now, // Automatically set to the current date
//     },
// });

// // Create the Transaction model
// const Transaction = mongoose.model('Transaction', transactionSchema);

// module.exports = Transaction; 



const Transaction = {
    id: Number(null),
    sender_id: Number(null),
    receiver_id: Number(null),
    amount: Number(null),
    status: String("pending"), // Default status
    transaction_type: String("payment"),
    created_at: new Date().toISOString(),
  };

  module.exports = { Transaction };
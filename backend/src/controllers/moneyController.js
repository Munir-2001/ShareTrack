// const Transaction = require('../models/Transaction');
// const User = require('../models/User');
// const Relationship = require('../models/Relationship');

// // Request Money API
// const requestMoney = async (req, res) => {
//     const { senderUsername, receiverUsername, amount } = req.body;

//     try {
//         // Fetch receiver by username
//         const receiver = await User.findOne({ username: receiverUsername });

//         if (!receiver) {
//             return res.status(404).json({ message: "Receiver not found" });
//         }

//         // Check if they are friends
//         const existingFriendship = await Relationship.findOne({
//             $or: [
//                 { requester: senderUsername, recipient: receiver._id },
//                 { requester: receiver._id, recipient: senderUsername }
//             ]
//         });

//         if (!existingFriendship) {
//             return res.status(403).json({ message: "Users are not connected as friends" });
//         }

//         // Create money request
//         const transaction = new Transaction({
//             sender_username: senderUsername,
//             receiver_username: receiverUsername,
//             amount,
//             status: 'pending'
//         });

//         await transaction.save();

//         res.status(201).json({ message: "Money request sent successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error processing request", error: error.message });
//     }
// };

// // Respond to Money Request API
// const respondToMoneyRequest = async (req, res) => {
//     const { transactionId, response } = req.body;

//     try {
//         const transaction = await Transaction.findById(transactionId);

//         if (!transaction) {
//             return res.status(404).json({ message: "Transaction not found" });
//         }

//         if (response === "declined") {
//             transaction.status = "declined";
//             await transaction.save();
//             return res.status(200).json({ message: "Money request declined" });
//         }

//         // Check balance of the receiver
//         const receiver = await User.findOne({ username: transaction.receiver_username });

//         if (!receiver || receiver.balance < transaction.amount) {
//             return res.status(400).json({ message: "Insufficient balance" });
//         }

//         // Deduct the amount from the receiver
//         receiver.balance -= transaction.amount;
//         await receiver.save();

//         // Add the amount to the sender
//         const sender = await User.findOne({ username: transaction.sender_username });
//         if (!sender) {
//             return res.status(404).json({ message: "Sender not found" });
//         }

//         sender.balance += transaction.amount;
//         await sender.save();

//         // Update the transaction status
//         transaction.status = "approved";
//         await transaction.save();

//         res.status(200).json({ message: "Money request approved successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error processing request", error: error.message });
//     }
// };

// module.exports = {
//     requestMoney,
//     respondToMoneyRequest
// }; 
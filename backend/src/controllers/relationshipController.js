// const Relationship = require('../models/Relationship');
// const User = require('../models/User');
// const Transaction = require('../models/Transaction');
// //CRUD, also get details for the other user when he is a receiver or requester

// const requestRelationship = async (req, res) => {
//     try {

//         const { requester, recipeintUsername } = req.body;
//         const users = await User.find({ username: recipeintUsername });


//         if (users.length > 0) {
//             const user = users[0];
//             const recipient = user?._id;

//             if (requester == recipient) {
//                 res.status(400).json({ message: "You cannot send a friend request to yourself!" });
//                 return;
//             }

//             // Check if relationship already exists for both as requester and recipient
//             const existingRelationship = await Relationship.findOne({ $or: [{ requester: requester, recipient: recipient }, { requester: recipient, recipient: requester }] });


//             switch (existingRelationship?.status) {
//                 case 0:
//                     if (existingRelationship.requester == requester) {
//                         res.status(400).json({ message: "Friend request already sent!" });
//                         return;
//                     }
//                     else {
//                         res.status(400).json({ message: "Friend request from user already pending!" });
//                         return;
//                     }

//                 case 1:
//                     res.status(400).json({ message: "Friend already exists!" });
//                     return;
//                 case 2:
//                     if (existingRelationship.requester == requester) {
//                         res.status(400).json({ message: "You have blocked this user!" });
//                         return;
//                     }
//                     else {
//                         res.status(400).json({ message: "User has blocked you!" });
//                         return;
//                     }
//                 case 3:
//                     if (existingRelationship.requester == requester) {
//                         res.status(400).json({ message: "User has blocked you!" });
//                         return;
//                     }
//                     else {
//                         res.status(400).json({ message: "You have blocked this user!" });
//                         return;
//                     }



//             }

//             const relationship = new Relationship({ requester: requester, recipient: recipient });
//             await relationship.save();
//             res.status(200).json(relationship);
//         } else {
//             res.status(400).json({ message: "User does not exist!" });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ message: err.message });
//     }
// }

// const approveRelationship = async (req, res) => {
//     try {
//         const { relationshipId } = req.body;
//         const relationship = await Relationship.findById(relationshipId);
//         relationship.status = 1;
//         await relationship.save();
//         res.json(relationship);
//     }
//     catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// const deleteRelationship = async (req, res) => {
//     try {
//         const { relationshipId } = req.body;
//         const relationship = await Relationship
//             .findByIdAndDelete(relationshipId);
//         res.json(relationship);
//     }
//     catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// const blockRelationship = async (req, res) => {

//     try {

//         const { relationshipId, blockerId } = req.body;

//         const relationship = await Relationship.findOne({ _id: relationshipId, $or: [{ requester: blockerId }, { recipient: blockerId }] });

//         if (relationship.requester == blockerId) {
//             relationship.status = 2;

//         } else if (relationship.recipient == blockerId) {
//             relationship.status = 3;

//         }
//         await relationship.save();
//         res.json(relationship);
//     }
//     catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// const getAllFriends = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const relationships = await Relationship.find({ $or: [{ requester: userId }, { recipient: userId }], status: 1 });
//         // username, email, phone, and id of the user stored in the relationships array
//         const friends = await Promise.all(relationships.map(async (relationship) => {
//             const friendId = relationship.requester == userId ? relationship.recipient : relationship.requester;
//             const friend = await User.findById(friendId);
//             return {
//                 id: friend._id,
//                 username: friend.username,
//                 email: friend.email,
//                 phone: friend.phone,
//                 relationship: relationship
//             };
//         }));

//         res.json(friends);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// const getAllFriendRequestsReceived = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const relationships = await Relationship.find({ recipient: userId, status: 0 });

//         const requests = await Promise.all(relationships.map(async (relationship) => {
//             const requester = await User.findById(relationship.requester);
//             return {
//                 id: requester._id,
//                 username: requester.username,
//                 email: requester.email,
//                 phone: requester.phone,
//                 relationship: relationship
//             };
//         }
//         ));

//         res.json(requests);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// const getAllFriendRequestsSent = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const relationships = await Relationship.find({ requester: userId, status: 0 });

//         const requests = await Promise.all(relationships.map(async (relationship) => {
//             const recipient = await
//                 User.findById(relationship.recipient);
//             return {
//                 id: recipient._id,
//                 username: recipient.username,
//                 email: recipient.email,
//                 phone: recipient.phone,
//                 relationship: relationship
//             };
//         }
//         ));

//         res.json(requests);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// const getBlockedRelationships = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const relationships = await Relationship.find({ $or: [{ requester: userId, status: 2 }, { recipient: userId, status: 3 }] });

//         const blockedRelationships = await Promise.all(relationships.map(async (relationship) => {
//             const friendId = relationship.requester == userId ? relationship.recipient : relationship.requester;
//             const friend = await User.findById(friendId);
//             return {
//                 id: friend._id,
//                 username: friend.username,
//                 email: friend.email,
//                 phone: friend.phone,
//                 relationship: relationship
//             };
//         }));

//         res.json(blockedRelationships);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }
// const sendMoney = async (req, res) => {
//     const { senderUsername, receiverUsername, amount } = req.body;
//     console.log('Received:', { senderUsername, receiverUsername, amount }); // Debug log

//     try {
//         const sender = await User.findOne({ username: senderUsername });
//         const receiver = await User.findOne({ username: receiverUsername });

//         if (!sender) {
//             return res.status(404).json({ message: 'Sender not found' });
//         }
//         if (!receiver) {
//             return res.status(404).json({ message: 'Receiver not found' });
//         }

//         if (sender.balance < amount) {
//             return res.status(400).json({ message: 'Insufficient balance' });
//         }

//         // Deduct amount from sender and add to receiver
//         sender.balance -= amount;
//         receiver.balance += amount;

//         await sender.save();
//         await receiver.save();

//         const transaction = new Transaction({
//             sender_username: senderUsername,
//             receiver_username: receiverUsername,
//             amount,
//             status: 'transferred'
//         });

//         await transaction.save(); // Save
        
//         console.log('added in transaction table as well.' + transaction)

//         res.status(200).json({ message: 'Money sent successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // const requestMoney = async (req, res) => {
// //     const { senderUsername, receiverUsername, amount } = req.body;
// //     console.log('in backend and printing received data')
// //     console.log('Received:', { senderUsername, receiverUsername, amount }); // Debug log


// //     try {
// //         // Fetch receiver by username
// //         const receiver = await User.findOne({ username: receiverUsername });

// //         if (!receiver) {
// //             return res.status(404).json({ message: "Receiver not found" });
// //         }

// //         // Check if they are friends
// //         const existingFriendship = await Relationship.findOne({
// //             $or: [
// //                 { requester: senderUsername, recipient: receiver._id },
// //                 { requester: receiver._id, recipient: senderUsername }
// //             ]
// //         });

// //         if (!existingFriendship) {
// //             return res.status(403).json({ message: "Users are not connected as friends" });
// //         }

// //         // Create money request
// //         const transaction = new Transaction({
// //             sender_username: senderUsername,
// //             receiver_username: receiverUsername,
// //             amount,
// //             status: 'pending'
// //         });

// //         await transaction.save();

// //         res.status(201).json({ message: "Money request sent successfully" });
// //     } catch (error) {
// //         res.status(500).json({ message: "Error processing request", error: error.message });
// //     }
// // };

// const requestMoney = async (req, res) => {
//     const { senderUsername, receiverUsername, amount } = req.body;
//     console.log('In backend - received data:', { senderUsername, receiverUsername, amount });

//     try {
//         // Fetch sender and receiver by username
//         const sender = await User.findOne({ username: senderUsername });
//         const receiver = await User.findOne({ username: receiverUsername });

//         if (!sender) {
//             return res.status(404).json({ message: "Sender not found" });
//         }
//         if (!receiver) {
//             return res.status(404).json({ message: "Receiver not found" });
//         }

//         console.log("Sender ID:", sender._id);
//         console.log("Receiver ID:", receiver._id);

//         // Check if they are friends
//         const existingFriendship = await Relationship.findOne({
//             $or: [
//                 { requester: sender._id, recipient: receiver._id },
//                 { requester: receiver._id, recipient: sender._id }
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
// const getMoneyRequests = async (req, res) => {
//     const { username } = req.body;

//     try {
//         const requests = await Transaction.find({ receiver_username: username, status: 'pending' });
//         res.status(200).json(requests);
//         console.log('the getmoneyrequests are'+requests)
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching requests", error: error.message });
//     }
// };
// const getTransactionHistory = async (req, res) => {
//     const { username } = req.body;

//     try {
//         const transactions = await Transaction.find({
//             $or: [{ sender_username: username }, { receiver_username: username }],
//         }).sort({ createdAt: -1 });

//         res.status(200).json(transactions);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching transaction history", error: error.message });
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
// const getSentMoneyRequests = async (req, res) => {
//     const { username } = req.body;

//     try {
//         const requests = await Transaction.find({ sender_username: username, status: 'pending' });
//         res.status(200).json(requests);
//         console.log('requests are'+requests)
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching sent requests", error: error.message });
//     }
// };


// module.exports = {
//     requestRelationship,
//     approveRelationship,
//     deleteRelationship,
//     blockRelationship,
//     getAllFriends,
//     getAllFriendRequestsReceived,
//     getAllFriendRequestsSent,
//     getBlockedRelationships,
//     sendMoney,
//     respondToMoneyRequest,
//     requestMoney,
//     getMoneyRequests,
//     getTransactionHistory,
//     getSentMoneyRequests
// }




const { supabase } = require("../config/db");

// Request a new relationship (friend request)
const requestRelationship = async (req, res) => {
    try {
        const { requesterId, recipientUsername } = req.body;

        // Check if recipient exists
        const { data: recipient, error: recipientError } = await supabase
            .from("users")
            .select("id")
            .eq("username", recipientUsername)
            .single();

        if (!recipient || recipientError) {
            return res.status(400).json({ message: "Recipient user does not exist" });
        }

        if (requesterId === recipient.id) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself!" });
        }

        // Check if relationship already exists
        const { data: existingRelationship } = await supabase
            .from("relationships")
            .select("*")
            .or(`(requester_id.eq.${requesterId},recipient_id.eq.${recipient.id}),(requester_id.eq.${recipient.id},recipient_id.eq.${requesterId})`)
            .single();

        if (existingRelationship) {
            switch (existingRelationship.status) {
                case 0:
                    return res.status(400).json({ message: existingRelationship.requester_id === requesterId ? "Friend request already sent!" : "Friend request pending!" });
                case 1:
                    return res.status(400).json({ message: "Friend already exists!" });
                case 2:
                case 3:
                    return res.status(400).json({ message: existingRelationship.requester_id === requesterId ? "User has blocked you!" : "You have blocked this user!" });
            }
        }

        // Create new relationship request
        const { data, error } = await supabase
            .from("relationships")
            .insert([{ requester_id: requesterId, recipient_id: recipient.id, status: 0 }]);

        if (error) throw error;

        res.status(201).json({ message: "Friend request sent successfully", data });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Approve a relationship request
const approveRelationship = async (req, res) => {
    try {
        const { relationshipId } = req.body;

        const { data: relationship, error } = await supabase
            .from("relationships")
            .update({ status: 1 })
            .eq("id", relationshipId);

        if (error) throw error;

        res.status(200).json({ message: "Friend request approved", relationship });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a relationship
const deleteRelationship = async (req, res) => {
    try {
        const { relationshipId } = req.body;

        const { error } = await supabase
            .from("relationships")
            .delete()
            .eq("id", relationshipId);

        if (error) throw error;

        res.status(200).json({ message: "Friend removed successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Block a relationship
const blockRelationship = async (req, res) => {
    try {
        const { relationshipId, blockerId } = req.body;

        const { data: relationship, error } = await supabase
            .from("relationships")
            .select("*")
            .eq("id", relationshipId)
            .single();

        if (!relationship || error) {
            return res.status(400).json({ message: "Relationship not found" });
        }

        const newStatus = relationship.requester_id === blockerId ? 2 : 3;

        const { error: updateError } = await supabase
            .from("relationships")
            .update({ status: newStatus })
            .eq("id", relationshipId);

        if (updateError) throw updateError;

        res.status(200).json({ message: "User blocked successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Send money
const sendMoney = async (req, res) => {
    try {
        const { senderId, receiverId, amount } = req.body;

        // Check sender's balance
        const { data: senderBalance, error: senderError } = await supabase
            .from("user_balances")
            .select("balance")
            .eq("user_id", senderId)
            .single();

        if (!senderBalance || senderBalance.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Deduct from sender and add to receiver
        await supabase
            .from("user_balances")
            .update({ balance: senderBalance.balance - amount })
            .eq("user_id", senderId);

        await supabase
            .from("user_balances")
            .update({ balance: supabase.raw("balance + ?", [amount]) })
            .eq("user_id", receiverId);

        // Record transaction
        await supabase.from("transactions").insert([
            { sender_id: senderId, receiver_id: receiverId, amount, status: "transferred", transaction_type: "payment" }
        ]);

        res.status(200).json({ message: "Money sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};

// Get transaction history
const getTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data: transactions, error } = await supabase
            .from("transactions")
            .select("*")
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order("created_at", { ascending: false });

        if (error) throw error;

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction history", error: error.message });
    }
};

// Get money requests received
const getMoneyRequests = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data: requests, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("receiver_id", userId)
            .eq("status", "pending");

        if (error) throw error;

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching requests", error: error.message });
    }
};

// Get sent money requests
const getSentMoneyRequests = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data: requests, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("sender_id", userId)
            .eq("status", "pending");

        if (error) throw error;

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sent requests", error: error.message });
    }
};

// Get all friends of a user
const getAllFriends = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data: relationships, error } = await supabase
            .from("relationships")
            .select("*")
            .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
            .eq("status", 1);

        if (error) throw error;

        const friends = await Promise.all(
            relationships.map(async (relationship) => {
                const friendId = relationship.requester_id === Number(userId) ? relationship.recipient_id : relationship.requester_id;
                const { data: friend } = await supabase
                    .from("users")
                    .select("id, username, email, phone")
                    .eq("id", friendId)
                    .single();
                return { ...friend, relationship };
            })
        );

        res.status(200).json(friends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all friend requests received
const getAllFriendRequestsReceived = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data: requests, error } = await supabase
            .from("relationships")
            .select("*")
            .eq("recipient_id", userId)
            .eq("status", 0);

        if (error) throw error;

        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all friend requests sent
const getAllFriendRequestsSent = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data: requests, error } = await supabase
            .from("relationships")
            .select("*")
            .eq("requester_id", userId)
            .eq("status", 0);

        if (error) throw error;

        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all blocked users
const getBlockedRelationships = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data: blockedRelationships, error } = await supabase
            .from("relationships")
            .select("*")
            .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
            .or("status.eq.2,status.eq.3");

        if (error) throw error;

        res.status(200).json(blockedRelationships);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Request money from another user
const requestMoney = async (req, res) => {
    try {
        const { senderId, receiverId, amount } = req.body;

        // Check if users are connected
        const { data: existingFriendship } = await supabase
            .from("relationships")
            .select("*")
            .or(`(requester_id.eq.${senderId},recipient_id.eq.${receiverId}),(requester_id.eq.${receiverId},recipient_id.eq.${senderId})`)
            .single();

        if (!existingFriendship) {
            return res.status(403).json({ message: "Users are not connected as friends" });
        }

        // Record money request
        await supabase.from("transactions").insert([
            { sender_id: senderId, receiver_id: receiverId, amount, status: "pending", transaction_type: "lending" }
        ]);

        res.status(201).json({ message: "Money request sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};

// Respond to a money request
const respondToMoneyRequest = async (req, res) => {
    try {
        const { transactionId, response } = req.body;

        const { data: transaction } = await supabase
            .from("transactions")
            .select("*")
            .eq("id", transactionId)
            .single();

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (response === "declined") {
            await supabase.from("transactions").update({ status: "declined" }).eq("id", transactionId);
            return res.status(200).json({ message: "Money request declined" });
        }

        // Check receiver balance
        const { data: receiverBalance } = await supabase
            .from("user_balances")
            .select("balance")
            .eq("user_id", transaction.receiver_id)
            .single();

        if (!receiverBalance || receiverBalance.balance < transaction.amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Process transaction
        await supabase
            .from("user_balances")
            .update({ balance: receiverBalance.balance - transaction.amount })
            .eq("user_id", transaction.receiver_id);

        await supabase
            .from("user_balances")
            .update({ balance: supabase.raw("balance + ?", [transaction.amount]) })
            .eq("user_id", transaction.sender_id);

        await supabase.from("transactions").update({ status: "approved" }).eq("id", transactionId);

        res.status(200).json({ message: "Money request approved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};

module.exports = {
    requestRelationship,
    approveRelationship,
    deleteRelationship,
    blockRelationship,
    sendMoney,
    getTransactionHistory,
    getMoneyRequests,
    getSentMoneyRequests,
    getAllFriends,
    getAllFriendRequestsReceived,
    getAllFriendRequestsSent,
    getBlockedRelationships,
    requestMoney,
    respondToMoneyRequest
};

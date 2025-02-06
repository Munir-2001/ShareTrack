const { supabase } = require("../config/db");
debugger;


const requestRelationship = async (req, res) => {
    try {
        const { requesterId, recipientUsername } = req.body;

        console.log("📥 Friend request received:", { requesterId, recipientUsername });

        if (!requesterId || !recipientUsername) {
            console.error("❌ Missing requesterId or recipientUsername in request");
            return res.status(400).json({ message: "Requester ID and recipient username are required" });
        }

        // ✅ Check if recipient exists
        const { data: recipient, error: recipientError } = await supabase
            .from("users")
            .select("id")
            .eq("username", recipientUsername)
            .single();

        console.log("🔍 Checking if recipient exists:", recipient);

        if (!recipient || recipientError) {
            console.error("❌ Recipient user does not exist:", recipientUsername);
            return res.status(400).json({ message: "Recipient user does not exist" });
        }

        if (requesterId === recipient.id) {
            console.error("❌ User cannot send a friend request to themselves");
            return res.status(400).json({ message: "You cannot send a friend request to yourself!" });
        }

        // ✅ Check if a relationship already exists between these users
        const { data: existingRelationship, error: relationshipError } = await supabase
            .from("relationships")
            .select("*")
            .or(`(requester_id.eq.${requesterId},recipient_id.eq.${recipient.id}),(requester_id.eq.${recipient.id},requester_id.eq.${requesterId})`)
            .single();

        console.log("🔍 Checking if relationship already exists:", existingRelationship);

        if (existingRelationship) {
            let message;
            switch (existingRelationship.status) {
                case 0:
                    message = existingRelationship.requester_id === requesterId ? 
                        "Friend request already sent!" : 
                        "Friend request pending!";
                    break;
                case 1:
                    message = "Friend already exists!";
                    break;
                case 2:
                case 3:
                    message = existingRelationship.requester_id === requesterId ? 
                        "User has blocked you!" : 
                        "You have blocked this user!";
                    break;
            }
            console.error("❌ Relationship conflict:", message);

            // ✅ If the request already exists but was declined before, update its status back to pending.
            if (existingRelationship.status !== 1 && existingRelationship.status !== 2 && existingRelationship.status !== 3) {
                const { error: updateError } = await supabase
                    .from("relationships")
                    .update({ status: 0 }) // Set status back to pending
                    .eq("id", existingRelationship.id);

                if (updateError) throw updateError;

                console.log("✅ Updated existing friend request to pending.");
                return res.status(200).json({ message: "Friend request re-sent!" });
            }

            return res.status(400).json({ message });
        }

        // ✅ No existing relationship, create a new friend request
        const { data, error } = await supabase
            .from("relationships")
            .insert([{ requester_id: requesterId, recipient_id: recipient.id, status: 0 }]);

        if (error) throw error;

        console.log("✅ Friend request successfully created:", data);
        res.status(201).json({ message: "Friend request sent successfully", data });
    } catch (err) {
        console.error("❌ requestRelationship: Unexpected error:", err.message);
        res.status(500).json({ message: "Internal server error", error: err.message });
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

const sendMoney = async (req, res) => {
    try {
        const { senderUsername, receiverUsername, amount } = req.body;

        if (!senderUsername || !receiverUsername || !amount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        console.log(`📥 Received request: sender=${senderUsername}, receiver=${receiverUsername}, amount=${amount}`);

        // ✅ Convert senderUsername to senderId
        const { data: sender, error: senderError } = await supabase
            .from("users")
            .select("id, balance")
            .eq("username", senderUsername)
            .single();

        if (!sender || senderError) {
            console.error("❌ Sender not found:", senderError);
            return res.status(404).json({ message: "Sender not found" });
        }

        // ✅ Convert receiverUsername to receiverId
        const { data: receiver, error: receiverError } = await supabase
            .from("users")
            .select("id, balance")
            .eq("username", receiverUsername)
            .single();

        if (!receiver || receiverError) {
            console.error("❌ Receiver not found:", receiverError);
            return res.status(404).json({ message: "Receiver not found" });
        }

        console.log(`✅ Converted to IDs: senderId=${sender.id}, receiverId=${receiver.id}`);

        // ✅ Ensure sender has enough balance
        if (sender.balance < amount) {
            console.error(`❌ Insufficient balance: Sender (${senderUsername}) has ${sender.balance}`);
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // ✅ Deduct from sender and add to receiver
        await supabase
            .from("users")
            .update({ balance: sender.balance - amount })
            .eq("id", sender.id);

        await supabase
            .from("users")
            .update({ balance: receiver.balance + amount })
            .eq("id", receiver.id);

        // ✅ Record transaction
        await supabase.from("transactions").insert([
            { sender_id: sender.id, receiver_id: receiver.id, amount, status: "transferred" }
        ]);

        console.log("✅ Money sent successfully!");
        res.status(200).json({ message: "Money sent successfully" });
    } catch (error) {
        console.error("❌ Error processing transaction:", error.message);
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};



const getTransactionHistory = async (req, res) => {
    try {
        const { username } = req.body; // Fix: Accept username instead of userId

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Get userId from username
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("username", username)
            .single();

        if (!user || userError) {
            return res.status(404).json({ message: "User not found" });
        }

        const userId = user.id; // Convert username to userId

        // Fetch transactions
        const { data: transactions, error } = await supabase
            .from("transactions")
            .select("id, sender_id, receiver_id, amount, status, created_at")
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order("created_at", { ascending: false });

        if (error) throw error;

        if (transactions.length === 0) {
            return res.status(200).json([]); // ✅ Return an empty array instead of an error
        }

        // Fetch sender and receiver usernames
        const userIds = [...new Set([...transactions.map(t => t.sender_id), ...transactions.map(t => t.receiver_id)])];
        
        const { data: users, error: usersError } = await supabase
            .from("users")
            .select("id, username")
            .in("id", userIds);

        if (usersError) {
            console.error("❌ Error fetching usernames:", usersError);
            return res.status(500).json({ message: "Error fetching usernames", error: usersError.message });
        }

        // Map transactions to include usernames
        const transactionsWithNames = transactions.map(transaction => {
            const sender = users.find(u => u.id === transaction.sender_id);
            const receiver = users.find(u => u.id === transaction.receiver_id);
            return {
                ...transaction,
                sender_username: sender ? sender.username : "Unknown User",
                receiver_username: receiver ? receiver.username : "Unknown User"
            };
        });

        console.log("✅ Returning transaction history:", transactionsWithNames);
        res.status(200).json(transactionsWithNames);
    } catch (error) {
        console.error("❌ Error fetching transaction history:", error.message);
        res.status(500).json({ message: "Error fetching transaction history", error: error.message });
    }
};


const getMoneyRequests = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            console.log("❌ getMoneyRequests: Username is missing in request");
            return res.status(400).json({ message: "Username is required" });
        }

        // Convert username to userId
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("username", username)
            .single();

        if (!user || userError) {
            console.log("❌ getMoneyRequests: User not found for username:", username);
            return res.status(404).json({ message: "User not found" });
        }

        const userId = user.id;

        // Fetch pending money requests
        const { data: requests, error } = await supabase
            .from("transactions")
            .select("id, sender_id, receiver_id, amount, status, created_at")
            .eq("receiver_id", userId)
            .eq("status", "pending");

        if (error) {
            console.error("❌ getMoneyRequests: Error fetching data from Supabase:", error);
            return res.status(500).json({ message: "Error fetching money requests", error: error.message });
        }

        console.log("✅ getMoneyRequests: Returning transactions:", requests);
        res.status(200).json(requests);
    } catch (error) {
        console.error("❌ getMoneyRequests: Unexpected error:", error.message);
        res.status(500).json({ message: "Unexpected error fetching money requests", error: error.message });
    }
};

const getSentMoneyRequests = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            console.log("❌ getSentMoneyRequests: Username is missing in request");
            return res.status(400).json({ message: "Username is required" });
        }

        // Convert username to userId
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("username", username)
            .single();

        if (!user || userError) {
            console.log("❌ getSentMoneyRequests: User not found for username:", username);
            return res.status(404).json({ message: "User not found" });
        }

        const userId = user.id;

        // Fetch sent money requests
        const { data: requests, error } = await supabase
            .from("transactions")
            .select("id, sender_id, receiver_id, amount, status, created_at")
            .eq("sender_id", userId)
            .eq("status", "pending");

        if (error) {
            console.error("❌ getSentMoneyRequests: Error fetching transactions from Supabase:", error);
            return res.status(500).json({ message: "Error fetching sent requests", error: error.message });
        }

        // Fetch receiver usernames based on receiver_id
        const receiverIds = requests.map(request => request.receiver_id);
        
        const { data: receivers, error: receiverError } = await supabase
            .from("users")
            .select("id, username")
            .in("id", receiverIds);

        if (receiverError) {
            console.error("❌ getSentMoneyRequests: Error fetching receiver usernames:", receiverError);
            return res.status(500).json({ message: "Error fetching receiver usernames", error: receiverError.message });
        }

        // Map receiver usernames to transactions
        const transactionsWithNames = requests.map(request => {
            const receiver = receivers.find(r => r.id === request.receiver_id);
            return {
                ...request,
                receiver_username: receiver ? receiver.username : "Unknown User"
            };
        });

        console.log("✅ getSentMoneyRequests: Returning transactions:", transactionsWithNames);
        res.status(200).json(transactionsWithNames);
    } catch (error) {
        console.error("❌ getSentMoneyRequests: Unexpected error:", error.message);
        res.status(500).json({ message: "Unexpected error fetching sent requests", error: error.message });
    }
};





const getAllFriends = async (req, res) => {
    try {
        const { userId } = req.body;  // ✅ Expect `userId` in request body

        if (!userId) {
            console.error("❌ getAllFriends: Missing userId in request");
            return res.status(400).json({ message: "User ID is required" });
        }

        // Get all relationships where user is either requester or recipient
        const { data: relationships, error } = await supabase
            .from("relationships")
            .select("*")
            .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
            .eq("status", 1);

        if (error) {
            console.error("❌ getAllFriends: Error fetching relationships:", error);
            return res.status(500).json({ message: "Error fetching relationships" });
        }

        if (!relationships.length) {
            console.log("⚠️ getAllFriends: No friends found for user", userId);
            return res.status(200).json([]); // Return empty array if no friends
        }

        // Extract friend IDs
        const friendIds = relationships.map(rel =>
            rel.requester_id === userId ? rel.recipient_id : rel.requester_id
        );

        // Fetch user details for friends
        const { data: friends, error: friendError } = await supabase
            .from("users")
            .select("id, username, email, phone")
            .in("id", friendIds);

        if (friendError) {
            console.error("❌ getAllFriends: Error fetching friend details:", friendError);
            return res.status(500).json({ message: "Error fetching friend details" });
        }

        // Ensure every friend has a valid `relationship` object
        const friendsWithRelationships = friends.map(friend => ({
            ...friend,
            relationship: relationships.find(rel =>
                rel.requester_id === friend.id || rel.recipient_id === friend.id
            ) || { id: null } // ✅ Provide fallback if `relationship` is missing
        }));

        console.log("✅ getAllFriends: Returning friend list:", friendsWithRelationships);
        res.status(200).json(friendsWithRelationships);
    } catch (error) {
        console.error("❌ getAllFriends: Unexpected error:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getAllFriendRequestsReceived = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            console.error("❌ getAllFriendRequestsReceived: Missing userId");
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch pending requests received
        const { data: requests, error } = await supabase
            .from("relationships")
            .select("id, requester_id, recipient_id, status, created_at")
            .eq("recipient_id", userId)
            .eq("status", 0);

        if (error) {
            console.error("❌ getAllFriendRequestsReceived: Error fetching data", error);
            throw error;
        }

        if (requests.length === 0) {
            return res.status(200).json([]);
        }

        // Fetch usernames for all requester IDs
        const requesterIds = requests.map((req) => req.requester_id);

        const { data: requesters, error: requestersError } = await supabase
            .from("users")
            .select("id, username")
            .in("id", requesterIds);

        if (requestersError) {
            console.error("❌ getAllFriendRequestsReceived: Error fetching usernames", requestersError);
            return res.status(500).json({ message: "Error fetching usernames" });
        }

        // Map requester usernames to the requests
        const formattedRequests = requests.map((req) => ({
            ...req,
            requester_username: requesters.find((u) => u.id === req.requester_id)?.username || "Unknown",
        }));

        console.log("✅ Returning received friend requests:", formattedRequests);
        res.status(200).json(formattedRequests);
    } catch (err) {
        console.error("❌ getAllFriendRequestsReceived: Unexpected error", err.message);
        res.status(500).json({ message: err.message });
    }
};


const getAllFriendRequestsSent = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            console.error("❌ getAllFriendRequestsSent: Missing userId");
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch pending requests sent
        const { data: requests, error } = await supabase
            .from("relationships")
            .select("id, requester_id, recipient_id, status, created_at")
            .eq("requester_id", userId)
            .eq("status", 0);

        if (error) {
            console.error("❌ getAllFriendRequestsSent: Error fetching data", error);
            throw error;
        }

        if (requests.length === 0) {
            return res.status(200).json([]);
        }

        // Fetch usernames for all recipient IDs
        const recipientIds = requests.map((req) => req.recipient_id);

        const { data: recipients, error: recipientsError } = await supabase
            .from("users")
            .select("id, username")
            .in("id", recipientIds);

        if (recipientsError) {
            console.error("❌ getAllFriendRequestsSent: Error fetching usernames", recipientsError);
            return res.status(500).json({ message: "Error fetching usernames" });
        }

        // Map recipient usernames to the requests
        const formattedRequests = requests.map((req) => ({
            ...req,
            recipient_username: recipients.find((u) => u.id === req.recipient_id)?.username || "Unknown",
        }));

        console.log("✅ Returning sent friend requests:", formattedRequests);
        res.status(200).json(formattedRequests);
    } catch (err) {
        console.error("❌ getAllFriendRequestsSent: Unexpected error", err.message);
        res.status(500).json({ message: err.message });
    }
};



const getBlockedRelationships = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            console.error("❌ getBlockedRelationships: Missing userId");
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch blocked relationships
        const { data: blockedRelationships, error } = await supabase
            .from("relationships")
            .select("id, requester_id, recipient_id, status")
            .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
            .in("status", [2, 3]); // ✅ Ensure only blocked users are fetched

        if (error) {
            console.error("❌ getBlockedRelationships: Error fetching relationships", error);
            return res.status(500).json({ message: "Error fetching relationships" });
        }

        if (!blockedRelationships.length) {
            console.warn("⚠️ getBlockedRelationships: No blocked users found for user", userId);
            return res.status(200).json([]);
        }

        // Identify blocked user IDs
        const blockedUserIds = blockedRelationships.map(rel =>
            rel.requester_id === userId ? rel.recipient_id : rel.requester_id
        );

        // Fetch user details
        const { data: users, error: userError } = await supabase
            .from("users")
            .select("id, username, email")
            .in("id", blockedUserIds);

        if (userError) {
            console.error("❌ getBlockedRelationships: Error fetching user details", userError);
            return res.status(500).json({ message: "Error fetching user details" });
        }

        // Map usernames to blocked relationships
        const blockedUsersWithNames = blockedRelationships.map(rel => {
            const blockedUser = users.find(u => u.id === (rel.requester_id === userId ? rel.recipient_id : rel.requester_id));
            return {
                ...rel,
                username: blockedUser ? blockedUser.username : "Unknown User",
                email: blockedUser ? blockedUser.email : "N/A"
            };
        });

        console.log("✅ Returning blocked users:", blockedUsersWithNames);
        res.status(200).json(blockedUsersWithNames);
    } catch (err) {
        console.error("❌ getBlockedRelationships: Unexpected error", err.message);
        res.status(500).json({ message: err.message });
    }
};


// const requestMoney = async (req, res) => {
//     try {
//         const { senderUsername, receiverUsername, amount } = req.body; // Fix: Accept usernames

//         if (!senderUsername || !receiverUsername || !amount) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         // Fetch sender & receiver IDs
//         const { data: sender, error: senderError } = await supabase
//             .from("users")
//             .select("id")
//             .eq("username", senderUsername)
//             .single();

//         const { data: receiver, error: receiverError } = await supabase
//             .from("users")
//             .select("id")
//             .eq("username", receiverUsername)
//             .single();

//         if (!sender || senderError) return res.status(404).json({ message: "Sender not found" });
//         if (!receiver || receiverError) return res.status(404).json({ message: "Receiver not found" });

//         // Record money request
//         await supabase.from("transactions").insert([
//             { sender_id: sender.id, receiver_id: receiver.id, amount, status: "pending" }
//         ]);

//         res.status(201).json({ message: "Money request sent successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error processing request", error: error.message });
//     }
// };


// const respondToMoneyRequest = async (req, res) => {
//     try {
//         const { transactionId, response } = req.body;

//         if (!transactionId || !response) {
//             return res.status(400).json({ message: "Transaction ID and response are required" });
//         }

//         console.log(`Processing request: ${transactionId} - ${response}`);

//         const { data: transaction, error: transactionError } = await supabase
//             .from("transactions")
//             .select("*")
//             .eq("id", transactionId)
//             .single();

//         if (!transaction || transactionError) {
//             return res.status(404).json({ message: "Transaction not found" });
//         }

//         if (response === "declined") {
//             const { error: declineError } = await supabase
//                 .from("transactions")
//                 .update({ status: "declined" })
//                 .eq("id", transactionId);

//             if (declineError) throw declineError;

//             return res.status(200).json({ message: "Money request declined" });
//         }

//         // Fetch receiver's balance
//         const { data: receiverBalance, error: receiverError } = await supabase
//             .from("users")
//             .select("balance")
//             .eq("user_id", transaction.receiver_id)
//             .single();

//         if (!receiverBalance || receiverError || receiverBalance.balance < transaction.amount) {
//             return res.status(400).json({ message: "Insufficient balance to approve request" });
//         }

//         console.log(`Processing approval for transaction: ${transactionId}`);

//         // Process transaction
//         await supabase
//             .from("users")
//             .update({ balance: receiverBalance.balance - transaction.amount })
//             .eq("user_id", transaction.receiver_id);

//         await supabase
//             .from("users")
//             .update({ balance: supabase.raw("balance + ?", [transaction.amount]) })
//             .eq("user_id", transaction.sender_id);

//         const { error: approveError } = await supabase
//             .from("transactions")
//             .update({ status: "approved" })
//             .eq("id", transactionId);

//         if (approveError) throw approveError;

//         res.status(200).json({ message: "Money request approved successfully" });
//     } catch (error) {
//         console.error("Error processing money request:", error.message);
//         res.status(500).json({ message: "Error processing request", error: error.message });
//     }
// };
// const respondToMoneyRequest = async (req, res) => {
//     try {
//         const { transactionId, response } = req.body;

//         if (!transactionId || !response) {
//             return res.status(400).json({ message: "Transaction ID and response are required" });
//         }

//         console.log(`Processing request: ${transactionId} - ${response}`);

//         // Fetch transaction details
//         const { data: transaction, error: transactionError } = await supabase
//             .from("transactions")
//             .select("*")
//             .eq("id", transactionId)
//             .single();

//         if (!transaction || transactionError) {
//             return res.status(404).json({ message: "Transaction not found" });
//         }

//         if (response === "declined") {
//             console.log("✅ Declining transaction:", transactionId);
//             await supabase.from("transactions").update({ status: "declined" }).eq("id", transactionId);
//             return res.status(200).json({ message: "Money request declined" });
//         }

//         // ✅ Fetch receiver's balance from `users` table
//         const { data: receiver, error: receiverError } = await supabase
//             .from("users")
//             .select("balance")
//             .eq("id", transaction.receiver_id)
//             .single();

//         if (receiverError) {
//             console.error("❌ Error fetching receiver balance:", receiverError);
//             return res.status(500).json({ message: "Error fetching receiver balance" });
//         }

//         if (!receiver) {
//             console.error("❌ Receiver balance not found for user_id:", transaction.receiver_id);
//             return res.status(404).json({ message: "Receiver balance record not found" });
//         }

//         console.log(`✅ Receiver Balance: ${receiver.balance}, Requested Amount: ${transaction.amount}`);

//         if (receiver.balance < transaction.amount) {
//             console.error("❌ Insufficient balance for approval");
//             return res.status(400).json({ message: "Insufficient balance to approve request" });
//         }

//         console.log(`✅ Processing approval for transaction: ${transactionId}`);

//         // ✅ Deduct amount from receiver's balance in `users` table
//         const { error: deductError } = await supabase
//             .from("users")
//             .update({ balance: receiver.balance - transaction.amount })
//             .eq("id", transaction.receiver_id);

//         if (deductError) {
//             console.error("❌ Error deducting balance:", deductError);
//             return res.status(500).json({ message: "Error processing transaction" });
//         }

//         // ✅ Add amount to sender's balance in `users` table
//         const { error: addError } = await supabase
//             .from("users")
//             .update({ balance: transaction.amount + receiver.balance }) // ✅ Fix: Use computed balance
//             .eq("id", transaction.sender_id);

//         if (addError) {
//             console.error("❌ Error adding balance to sender:", addError);
//             return res.status(500).json({ message: "Error processing transaction" });
//         }

//         // ✅ Update transaction status
//         const { error: approveError } = await supabase
//             .from("transactions")
//             .update({ status: "approved" })
//             .eq("id", transactionId);

//         if (approveError) throw approveError;

//         console.log("✅ Transaction approved successfully!");
//         res.status(200).json({ message: "Money request approved successfully" });
//     } catch (error) {
//         console.error("❌ Error processing money request:", error.message);
//         res.status(500).json({ message: "Error processing request", error: error.message });
//     }
// };

const requestMoney = async (req, res) => {
    try {
        const { senderUsername, receiverUsername, amount, repaymentDate } = req.body; // ✅ Now requires repaymentDate

        // Validate required fields
        if (!senderUsername || !receiverUsername || !amount || !repaymentDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate repayment date (must be in the future)
        const repaymentDateObj = new Date(repaymentDate);
        if (isNaN(repaymentDateObj.getTime()) || repaymentDateObj <= new Date()) {
            return res.status(400).json({ message: "Invalid repayment date. Must be in the future." });
        }

        // Fetch sender & receiver IDs
        const { data: sender, error: senderError } = await supabase
            .from("users")
            .select("id")
            .eq("username", senderUsername)
            .single();

        const { data: receiver, error: receiverError } = await supabase
            .from("users")
            .select("id")
            .eq("username", receiverUsername)
            .single();

        if (!sender || senderError) return res.status(404).json({ message: "Sender not found" });
        if (!receiver || receiverError) return res.status(404).json({ message: "Receiver not found" });

        // Insert transaction into `transactions` table with type `lending`
        const { data: transaction, error: transactionError } = await supabase
            .from("transactions")
            .insert([
                {
                    sender_id: sender.id,
                    receiver_id: receiver.id,
                    amount,
                    status: "pending",
                }
            ])
            .select()
            .single(); // Returns the inserted transaction

        if (transactionError) throw transactionError;

        // Insert repayment details into `lending_details`
        // const { error: lendingError } = await supabase.from("lending_details").insert([
        //     {
        //         transaction_id: transaction.id,
        //         repayment_date: repaymentDate,
        //         mode_of_payment: "Amount Loaned" // Default, can be updated later
        //     }
        // ]);

        if (lendingError) throw lendingError;

        res.status(201).json({ message: "Money request sent successfully with repayment date" });
    } catch (error) {
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};




const respondToMoneyRequest = async (req, res) => {
    try {
        const { transactionId, response } = req.body;

        if (!transactionId || !response) {
            return res.status(400).json({ message: "Transaction ID and response are required" });
        }

        console.log(`Processing request: ${transactionId} - ${response}`);

        // Fetch transaction details
        const { data: transaction, error: transactionError } = await supabase
            .from("transactions")
            .select("*")
            .eq("id", transactionId)
            .single();

        if (!transaction || transactionError) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const senderId = transaction.sender_id; // The one who requested money
        const receiverId = transaction.receiver_id; // The one who was requested to send money

        if (response === "declined") {
            console.log("✅ Declining transaction:", transactionId);
            await supabase
                .from("transactions")
                .update({ status: "declined" })
                .eq("id", transactionId);
            return res.status(200).json({ message: "Money request declined" });
        }

        // ✅ Fetch balances from `users` table
        const { data: sender, error: senderError } = await supabase
            .from("users")
            .select("balance")
            .eq("id", senderId)
            .single();

        const { data: receiver, error: receiverError } = await supabase
            .from("users")
            .select("balance")
            .eq("id", receiverId)
            .single();

        if (!sender || senderError) {
            console.error("❌ Sender not found:", senderError);
            return res.status(500).json({ message: "Sender balance not found" });
        }

        if (!receiver || receiverError) {
            console.error("❌ Receiver not found:", receiverError);
            return res.status(500).json({ message: "Receiver balance not found" });
        }

        console.log(`✅ Sender Balance (Before Update): ${sender.balance}`);
        console.log(`✅ Receiver Balance (Before Update): ${receiver.balance}`);
        console.log(`✅ Requested Amount: ${transaction.amount}`);

        if (receiver.balance < transaction.amount) {
            console.error("❌ Insufficient balance for approval");
            return res.status(400).json({ message: "Insufficient balance to approve request" });
        }

        console.log(`✅ Processing approval for transaction: ${transactionId}`);

        // ✅ Deduct amount from **receiver's balance** (the person who was requested to send money)
        const { error: deductError } = await supabase
            .from("users")
            .update({ balance: receiver.balance - transaction.amount })
            .eq("id", receiverId);

        if (deductError) {
            console.error("❌ Error deducting balance:", deductError);
            return res.status(500).json({ message: "Error processing transaction" });
        }

        // ✅ Add amount to **sender's balance** (the person who requested the money)
        const { error: addError } = await supabase
            .from("users")
            .update({ balance: sender.balance + transaction.amount })
            .eq("id", senderId);

        if (addError) {
            console.error("❌ Error adding balance to sender:", addError);
            return res.status(500).json({ message: "Error processing transaction" });
        }

        console.log(`✅ Sender Balance (After Update): ${sender.balance + transaction.amount}`);
        console.log(`✅ Receiver Balance (After Update): ${receiver.balance - transaction.amount}`);

        // ✅ Update transaction status
        const { error: approveError } = await supabase
            .from("transactions")
            .update({ status: "approved",
                transaction_type: "lending" 
             })
            .eq("id", transactionId)

            const { error: lendingError } = await supabase.from("lending_details").insert([
                {
                    transaction_id: transaction.id,
                    repayment_date: repaymentDate,
                    mode_of_payment: "Amount Loaned" // Default, can be updated later
                }
            ]);
            
        if (approveError) throw approveError;

        console.log("✅ Transaction approved successfully!");
        res.status(200).json({ message: "Money request approved successfully" });
    } catch (error) {
        console.error("❌ Error processing money request:", error.message);
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};


const getUserBalance = async (req, res) => {
    try {
        const { username } = req.body; // Fix: Accept username instead of userId

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Convert username to userId
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id, balance") // Fix: Select balance too
            .eq("username", username)
            .single();

        if (!user || userError) {
            return res.status(404).json({ message: "User not found or balance not available" });
        }

        res.status(200).json({ balance: user.balance });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user balance", error: err.message });
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
    respondToMoneyRequest,
    getUserBalance
};

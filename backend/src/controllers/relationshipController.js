const { supabase } = require("../config/db");
debugger;
// Request a new relationship (friend request)
// const requestRelationship = async (req, res) => {
//     try {
//         const { requesterId, recipientUsername } = req.body;
//         console.log('requested if and recipient username was '+ 
//             requesterId
//             +
//             'and name is ' + recipientUsername
//         )
//         // Check if recipient exists
//         const { data: recipient, error: recipientError } = await supabase
//             .from("users")
//             .select("id")
//             .eq("username", recipientUsername)
//             .single();

//             console.log('supabase response was on checking if recipient exists'+data)

//         if (!recipient || recipientError) {
//             return res.status(400).json({ message: "Recipient user does not exist" });
//         }

//         if (requesterId === recipient.id) {
//             return res.status(400).json({ message: "You cannot send a friend request to yourself!" });
//         }

//         // Check if relationship already exists
//         const { data: existingRelationship } = await supabase
//             .from("relationships")
//             .select("*")
//             .or(`(requester_id.eq.${requesterId},recipient_id.eq.${recipient.id}),(requester_id.eq.${recipient.id},recipient_id.eq.${requesterId})`)
//             .single();

//             console.log('supabase response was on checking if relationship exists'+data)


//         if (existingRelationship) {
//             switch (existingRelationship.status) {
//                 case 0:
//                     return res.status(400).json({ message: existingRelationship.requester_id === requesterId ? "Friend request already sent!" : "Friend request pending!" });
//                 case 1:
//                     return res.status(400).json({ message: "Friend already exists!" });
//                 case 2:
                    
//                 case 3:
//                     return res.status(400).json({ message: existingRelationship.requester_id === requesterId ? "User has blocked you!" : "You have blocked this user!" });
//             }
//         }

//         // Create new relationship request
//         const { data, error } = await supabase
//             .from("relationships")
//             .insert([{ requester_id: requesterId, recipient_id: recipient.id, status: 0 }]);



//         if (error) throw error;

//         res.status(201).json({ message: "Friend request sent successfully", data });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };
const requestRelationship = async (req, res) => {
    try {
        const { requesterId, recipientUsername } = req.body;

        console.log(`✅ requestRelationship: Received request with`, { requesterId, recipientUsername });

        if (!requesterId || !recipientUsername) {
            console.error("❌ Missing requesterId or recipientUsername");
            return res.status(400).json({ message: "Requester ID and recipient username are required" });
        }

        // Check if recipient exists
        const { data: recipient, error: recipientError } = await supabase
            .from("users")
            .select("id")
            .eq("username", recipientUsername)
            .single();

        console.log("✅ Supabase response for recipient check:", recipient);

        if (!recipient || recipientError) {
            console.error("❌ Recipient user does not exist:", recipientUsername);
            return res.status(400).json({ message: "Recipient user does not exist" });
        }

        // Prevent self-requests
        if (requesterId === recipient.id) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself!" });
        }

        // Check if relationship already exists
        const { data: existingRelationship } = await supabase
            .from("relationships")
            .select("*")
            .or(`(requester_id.eq.${requesterId},recipient_id.eq.${recipient.id}),(requester_id.eq.${recipient.id},requester_id.eq.${requesterId})`)
            .single();

        console.log("✅ Supabase response for relationship check:", existingRelationship);

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

        if (error) {
            console.error("❌ Error inserting relationship:", error);
            throw error;
        }

        console.log("✅ Friend request successfully created");
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

// Send money
const sendMoney = async (req, res) => {
    try {
        const { senderUsername, receiverUsername, amount } = req.body; // Fix: Accept usernames

        if (!senderUsername || !receiverUsername || !amount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Fetch sender & receiver IDs
        const { data: sender, error: senderError } = await supabase
            .from("users")
            .select("id, balance")
            .eq("username", senderUsername)
            .single();

        const { data: receiver, error: receiverError } = await supabase
            .from("users")
            .select("id,balance")
            .eq("username", receiverUsername)
            .single();

        if (!sender || senderError) return res.status(404).json({ message: "Sender not found" });
        if (!receiver || receiverError) return res.status(404).json({ message: "Receiver not found" });

        if (sender.balance < amount) {
            console.log('sender baalnce was' + sender.balance)
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Deduct from sender and add to receiver
        await supabase
            .from("users")
            .update({ balance: sender.balance - amount })
            .eq("id", sender.id);

        await supabase
            .from("users")
            .update({ balance: supabase.raw("balance + ?", [amount]) })
            .eq("id", receiver.id);

        // Record transaction
        await supabase.from("transactions").insert([
            { sender_id: sender.id, receiver_id: receiver.id, amount, status: "transferred" }
        ]);

        res.status(200).json({ message: "Money sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};

// Get transaction history
// const getTransactionHistory = async (req, res) => {
//     try {
//         const { username } = req.body; // Fix: Accept username instead of userId

//         if (!username) {
//             return res.status(400).json({ message: "Username is required" });
//         }

//         // Get userId from username
//         const { data: user, error: userError } = await supabase
//             .from("users")
//             .select("id")
//             .eq("username", username)
//             .single();

//         if (!user || userError) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const userId = user.id; // Convert username to userId

//         const { data: transactions, error } = await supabase
//             .from("transactions")
//             .select("*")
//             .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
//             .order("created_at", { ascending: false });

//         if (error) throw error;

//         res.status(200).json(transactions);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching transaction history", error: error.message });
//     }
// };
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

// Get money requests received
// const getMoneyRequests = async (req, res) => {
//     try {
//         const { username } = req.body; // Fix: Accept username

//         if (!username) {
//             return res.status(400).json({ message: "Username is required" });
//         }

//         // Convert username to userId
//         const { data: user, error: userError } = await supabase
//             .from("users")
//             .select("id")
//             .eq("username", username)
//             .single();

//         if (!user || userError) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const userId = user.id;

//         // Get pending money requests for the user
//         const { data: requests, error } = await supabase
//             .from("transactions")
//             .select("*")
//             .eq("receiver_id", userId)
//             .eq("status", "pending");

//         if (error) throw error;
//         console.log('get money request data is '+data)

//         res.status(200).json(requests);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching money requests", error: error.message });
//     }
// };
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


// Get sent money requests
// const getSentMoneyRequests = async (req, res) => {
//     try {
//         const { username } = req.body; //  Fix: Accept username instead of userId

//         if (!username) {
//             return res.status(400).json({ message: "Username is required" });
//         }

//         // Convert username to userId
//         const { data: user, error: userError } = await supabase
//             .from("users")
//             .select("id")
//             .eq("username", username)
//             .single();

//         if (!user || userError) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const userId = user.id;

//         // Fetch sent money requests
//         const { data: requests, error } = await supabase
//             .from("transactions")
//             .select("*")
//             .eq("sender_id", userId) //  Now using userId instead of undefined
//             .eq("status", "pending");

//         if (error) throw error;
//         console.log('getsent money request data is '+data)
//         res.status(200).json(requests);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching sent requests", error: error.message });
//     }
// };
// const getSentMoneyRequests = async (req, res) => {
//     try {
//         const { username } = req.body;

//         if (!username) {
//             console.log(" getSentMoneyRequests: Username is missing in request");
//             return res.status(400).json({ message: "Username is required" });
//         }

//         // Convert username to userId
//         const { data: user, error: userError } = await supabase
//             .from("users")
//             .select("id")
//             .eq("username", username)
//             .single();

//         if (!user || userError) {
//             console.log(" getSentMoneyRequests: User not found for username:", username);
//             return res.status(404).json({ message: "User not found" });
//         }

//         const userId = user.id;

//         // Fetch sent money requests
//         const { data: requests, error } = await supabase
//             .from("transactions")
//             .select("id, sender_id, receiver_id, amount, status, created_at")
//             .eq("sender_id", userId)
//             .eq("status", "pending");

//         if (error) {
//             console.error(" getSentMoneyRequests: Error fetching data from Supabase:", error);
//             return res.status(500).json({ message: "Error fetching sent requests", error: error.message });
//         }

//         console.log(" getSentMoneyRequests: Returning transactions:", requests);
//         res.status(200).json(requests);
//     } catch (error) {
//         console.error(" getSentMoneyRequests: Unexpected error:", error.message);
//         res.status(500).json({ message: "Unexpected error fetching sent requests", error: error.message });
//     }
// };
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




// Get all friends of a user
// const getAllFriends = async (req, res) => {
//     try {
//         const { username } = req.body; // Fix: Accept username

//         if (!username) {
//             return res.status(400).json({ message: "Username is required" });
//         }

//         // Convert username to userId
//         const { data: user, error: userError } = await supabase
//             .from("users")
//             .select("id")
//             .eq("username", username)
//             .single();

//         if (!user || userError) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const userId = user.id;

//         // Get all friends
//         const { data: relationships, error } = await supabase
//             .from("relationships")
//             .select("*")
//             .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
//             .eq("status", 1);

//         if (error) throw error;

//         const friends = await Promise.all(
//             relationships.map(async (relationship) => {
//                 const friendId = relationship.requester_id === userId ? relationship.recipient_id : relationship.requester_id;
//                 const { data: friend } = await supabase
//                     .from("users")
//                     .select("id, username, email, phone")
//                     .eq("id", friendId)
//                     .single();
//                 return { ...friend, relationship };
//             })
//         );

//         res.status(200).json(friends);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Get all friend requests received
// const getAllFriendRequestsReceived = async (req, res) => {
//     try {
//         const { username } = req.body; // Fix: Accept username

//         if (!username) {
//             return res.status(400).json({ message: "Username is required" });
//         }

//         // Convert username to userId
//         const { data: user, error: userError } = await supabase
//             .from("users")
//             .select("id")
//             .eq("username", username)
//             .single();

//         if (!user || userError) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const userId = user.id;

//         // Fetch friend requests received
//         const { data: requests, error } = await supabase
//             .from("relationships")
//             .select("*")
//             .eq("recipient_id", userId)
//             .eq("status", 0);

//         if (error) throw error;

//         res.status(200).json(requests);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Get all friend requests sent
// const getAllFriendRequestsSent = async (req, res) => {
//     try {
//         const { username } = req.body; // Fix: Accept username

//         if (!username) {
//             return res.status(400).json({ message: "Username is required" });
//         }

//         // Convert username to userId
//         const { data: user, error: userError } = await supabase
//             .from("users")
//             .select("id")
//             .eq("username", username)
//             .single();

//         if (!user || userError) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const userId = user.id;

//         // Fetch friend requests sent
//         const { data: requests, error } = await supabase
//             .from("relationships")
//             .select("*")
//             .eq("requester_id", userId)
//             .eq("status", 0);

//         if (error) throw error;

//         res.status(200).json(requests);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Get all blocked users
// const getBlockedRelationships = async (req, res) => {
//     try {
//         const { username } = req.body; // Fix: Accept username

//         if (!username) {
//             return res.status(400).json({ message: "Username is required" });
//         }

//         // Convert username to userId
//         const { data: user, error: userError } = await supabase
//             .from("users")
//             .select("id")
//             .eq("username", username)
//             .single();

//         if (!user || userError) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const userId = user.id;

//         // Fetch blocked relationships
//         const { data: blockedRelationships, error } = await supabase
//             .from("relationships")
//             .select("*")
//             .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
//             .or("status.eq.2,status.eq.3");

//         if (error) throw error;

//         res.status(200).json(blockedRelationships);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
const getAllFriends = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const { data: relationships, error } = await supabase
        .from("relationships")
        .select("*")
        .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
        .eq("status", 1);

    if (error) throw error;

    res.status(200).json(relationships);
};

const getAllFriendRequestsReceived = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const { data: requests, error } = await supabase
        .from("relationships")
        .select("*")
        .eq("recipient_id", userId)
        .eq("status", 0);

    if (error) throw error;

    res.status(200).json(requests);
};

const getAllFriendRequestsSent = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const { data: requests, error } = await supabase
        .from("relationships")
        .select("*")
        .eq("requester_id", userId)
        .eq("status", 0);

    if (error) throw error;

    res.status(200).json(requests);
};

const getBlockedRelationships = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const { data: blockedRelationships, error } = await supabase
        .from("relationships")
        .select("*")
        .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
        .or("status.eq.2,status.eq.3");

    if (error) throw error;

    res.status(200).json(blockedRelationships);
};

// Request money from another user
const requestMoney = async (req, res) => {
    try {
        const { senderUsername, receiverUsername, amount } = req.body; // Fix: Accept usernames

        if (!senderUsername || !receiverUsername || !amount) {
            return res.status(400).json({ message: "Missing required fields" });
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

        // Record money request
        await supabase.from("transactions").insert([
            { sender_id: sender.id, receiver_id: receiver.id, amount, status: "pending" }
        ]);

        res.status(201).json({ message: "Money request sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};


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
            .update({ status: "approved" })
            .eq("id", transactionId);

        if (approveError) throw approveError;

        console.log("✅ Transaction approved successfully!");
        res.status(200).json({ message: "Money request approved successfully" });
    } catch (error) {
        console.error("❌ Error processing money request:", error.message);
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};



// const getUserBalance = async (req, res) => {
//     try {
//         const { userId } = req.body; // Get userId from request body

//         if (!userId) {
//             return res.status(400).json({ message: "User ID is required" });
//         }

//         // Fetch the user's balance from the database
//         const { data: userBalance, error } = await supabase
//             .from("users")
//             .select("balance")
//             .eq("id", userId) // Ensure you are querying by the correct field
//             .single();

//         if (error || !userBalance) {
//             return res.status(404).json({ message: "User not found or balance not available" });
//         }

//         res.status(200).json({ balance: userBalance.balance });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
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

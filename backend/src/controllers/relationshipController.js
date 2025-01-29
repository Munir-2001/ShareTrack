const Relationship = require('../models/Relationship');
const User = require('../models/User');

//CRUD, also get details for the other user when he is a receiver or requester

const requestRelationship = async (req, res) => {
    try {

        const { requester, recipeintUsername } = req.body;
        const users = await User.find({ username: recipeintUsername });


        if (users.length > 0) {
            const user = users[0];
            const recipient = user?._id;

            if (requester == recipient) {
                res.status(400).json({ message: "You cannot send a friend request to yourself!" });
                return;
            }

            // Check if relationship already exists for both as requester and recipient
            const existingRelationship = await Relationship.findOne({ $or: [{ requester: requester, recipient: recipient }, { requester: recipient, recipient: requester }] });


            switch (existingRelationship?.status) {
                case 0:
                    if (existingRelationship.requester == requester) {
                        res.status(400).json({ message: "Friend request already sent!" });
                        return;
                    }
                    else {
                        res.status(400).json({ message: "Friend request from user already pending!" });
                        return;
                    }

                case 1:
                    res.status(400).json({ message: "Friend already exists!" });
                    return;
                case 2:
                    if (existingRelationship.requester == requester) {
                        res.status(400).json({ message: "You have blocked this user!" });
                        return;
                    }
                    else {
                        res.status(400).json({ message: "User has blocked you!" });
                        return;
                    }
                case 3:
                    if (existingRelationship.requester == requester) {
                        res.status(400).json({ message: "User has blocked you!" });
                        return;
                    }
                    else {
                        res.status(400).json({ message: "You have blocked this user!" });
                        return;
                    }



            }

            const relationship = new Relationship({ requester: requester, recipient: recipient });
            await relationship.save();
            res.status(200).json(relationship);
        } else {
            res.status(400).json({ message: "User does not exist!" });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
}

const approveRelationship = async (req, res) => {
    try {
        const { relationshipId } = req.body;
        const relationship = await Relationship.findById(relationshipId);
        relationship.status = 1;
        await relationship.save();
        res.json(relationship);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const deleteRelationship = async (req, res) => {
    try {
        const { relationshipId } = req.body;
        const relationship = await Relationship
            .findByIdAndDelete(relationshipId);
        res.json(relationship);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const blockRelationship = async (req, res) => {

    try {

        const { relationshipId, blockerId } = req.body;

        const relationship = await Relationship.findOne({ _id: relationshipId, $or: [{ requester: blockerId }, { recipient: blockerId }] });

        if (relationship.requester == blockerId) {
            relationship.status = 2;

        } else if (relationship.recipient == blockerId) {
            relationship.status = 3;

        }
        await relationship.save();
        res.json(relationship);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const getAllFriends = async (req, res) => {
    try {
        const { userId } = req.params;
        const relationships = await Relationship.find({ $or: [{ requester: userId }, { recipient: userId }], status: 1 });
        // username, email, phone, and id of the user stored in the relationships array
        const friends = await Promise.all(relationships.map(async (relationship) => {
            const friendId = relationship.requester == userId ? relationship.recipient : relationship.requester;
            const friend = await User.findById(friendId);
            return {
                id: friend._id,
                username: friend.username,
                email: friend.email,
                phone: friend.phone,
                relationship: relationship
            };
        }));

        res.json(friends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getAllFriendRequestsReceived = async (req, res) => {
    try {
        const { userId } = req.params;
        const relationships = await Relationship.find({ recipient: userId, status: 0 });

        const requests = await Promise.all(relationships.map(async (relationship) => {
            const requester = await User.findById(relationship.requester);
            return {
                id: requester._id,
                username: requester.username,
                email: requester.email,
                phone: requester.phone,
                relationship: relationship
            };
        }
        ));

        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getAllFriendRequestsSent = async (req, res) => {
    try {
        const { userId } = req.params;
        const relationships = await Relationship.find({ requester: userId, status: 0 });

        const requests = await Promise.all(relationships.map(async (relationship) => {
            const recipient = await
                User.findById(relationship.recipient);
            return {
                id: recipient._id,
                username: recipient.username,
                email: recipient.email,
                phone: recipient.phone,
                relationship: relationship
            };
        }
        ));

        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getBlockedRelationships = async (req, res) => {
    try {
        const { userId } = req.params;
        const relationships = await Relationship.find({ $or: [{ requester: userId, status: 2 }, { recipient: userId, status: 3 }] });

        const blockedRelationships = await Promise.all(relationships.map(async (relationship) => {
            const friendId = relationship.requester == userId ? relationship.recipient : relationship.requester;
            const friend = await User.findById(friendId);
            return {
                id: friend._id,
                username: friend.username,
                email: friend.email,
                phone: friend.phone,
                relationship: relationship
            };
        }));

        res.json(blockedRelationships);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
const sendMoney = async (req, res) => {
    const { senderId, receiverId, amount } = req.body;

    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Deduct amount from sender and add to receiver
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        res.status(200).json({ message: 'Money sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    requestRelationship,
    approveRelationship,
    deleteRelationship,
    blockRelationship,
    getAllFriends,
    getAllFriendRequestsReceived,
    getAllFriendRequestsSent,
    getBlockedRelationships,
    sendMoney
}

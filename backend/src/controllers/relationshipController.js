const Relationship = require('../models/Relationship');
const User = require('../models/User');

//CRUD, also get details for the other user when he is a receiver or requester

const requestRelationship = async (req, res) => {
    try {
        const { requester, recipeintUsername } = req.body;
        const user = await User.find({ username: recipeintUsername });
        const recipeint = user?._id;
        if (user) {
            const relationship = new Relationship({ requester, recipeint });
            await relationship.save();
            res.status(201).json(relationship);
        } else {
            res.status(400).json({ message: "User does not exist!" });
        }
    } catch (err) {
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
        const relationship = await Relationship.findById(relationshipId);
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



module.exports = {
    requestRelationship,
    approveRelationship,
    deleteRelationship,
    blockRelationship,
    getAllFriends,
    getAllFriendRequestsReceived,
    getAllFriendRequestsSent
}

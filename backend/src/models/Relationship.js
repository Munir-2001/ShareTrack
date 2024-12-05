const mongoose = require('mongoose');

// items to rent
const relationSchema = new mongoose.Schema({

    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, editable: false },  // requester is the user who sends the request
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, editable: false },  // recipient is the user who receives the request
    // 0: pending, 1: friends, 2: blocked by requester, 3: blocked by recipient
    status: { type: Number, required: true, default: 0 },

},
    { timestamps: true, }

);


const Relationship = mongoose.model('Relationship', relationSchema);
module.exports = Relationship;

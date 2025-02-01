// const mongoose = require('mongoose');

// // items to rent
// const itemSchema = new mongoose.Schema({

//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     category: { type: String, required: true },
//     photos: { type: [String], required: false },
//     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

//     city: { type: String, required: true, default: 'Karachi' },
//     state: { type: String, required: true, default: 'Sindh' },
//     country: { type: String, required: true, default: 'Pakistan' },

//     isAvailable: { type: Boolean, default: true },


//     availableDates: { type: [{ start: Date, end: Date }], required: false },

//     bookings: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }], required: false },

//     rating: { type: Number, required: false, default: 0 },






// },
//     { timestamps: true, }

// );


// const Item = mongoose.model('Items', itemSchema);
// module.exports = Item;

const Item = {
    id: Number(null),
    name: String(""),
    description: String(""),
    price: Number(null),
    category: String(""),
    owner_id: Number(null),
    city: String("Karachi"),
    state: String("Sindh"),
    country: String("Pakistan"),
    is_available: Boolean(true),
    created_at: new Date().toISOString(),
  };
  
  module.exports = { Item };
  
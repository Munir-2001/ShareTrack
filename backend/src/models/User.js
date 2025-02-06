// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const userSchema = new mongoose.Schema({
//     // Identifiers / CREDAENTIALS
//     username: { type: String, required: true, unique: true },
//     phone: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true, select: false },

//     // Personal Information
//     photo: { type: String, required: false },
//     role: { type: String, required: false, default: 'user' },
//     credit_score: { type: Number, required: false },
//     age: { type: Number, required: false },
//     balance : {type: Number, required: false, default: 0},
//     // Verification
//     isEmailVerified: { type: Boolean, default: false },
//     isPhoneVerified: { type: Boolean, default: false },
//     isBlocked: { type: Boolean, default: false },
//     blockedUntil: { type: Date, required: false },
//     blockReason: { type: String, required: false },


// },
//     { timestamps: true, }

// );

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// // Method to compare passwords
// userSchema.methods.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };

// const User = mongoose.model('User', userSchema);
// module.exports = User;



const User = {
    id: Number(null),
    username: String(""),
    phone: String(""),
    email: String(""),
    password: String(""),
    photo: String(""),
    role: String("user"),
    credit_score: Number(null),
    age: Number(null),
    balance: Number(0),
    isEmailVerified: Boolean(false),
    isPhoneVerified: Boolean(false),
    isBlocked: Boolean(false),
    blockedUntil: null,
    blockReason: String(""),
    created_at: new Date().toISOString(),
    credit_score:text
  };
  
  User.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
  
  User.comparePassword = async function (candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  };
  module.exports = { User };

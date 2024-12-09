const User = require('../models/User');
const uploadToStorage = require('../config/storage');


// Register a new user, ensuring no repeated email, username, or phone
const createUser = async (req, res) => {
    try {
        const { username, phone, email, password } = req.body;

        // Check if the user already exists
        const userExists = await User
            .findOne({ $or: [{ email }, { phone }, { username }] })
            .exec();
        if (userExists) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user and save to DB
        const user = new User({ username, phone, email, password });
        await user.save();

        // Remove password from the response
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json(userResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Log in user by comparing hashed passwords
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User
            .findOne({ email })
            .select('+password')
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password match
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Remove password from the response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { username, phone, email, password, isVerified } = req.body;
        const user = await User
            .findOne({ email })
            .select('+password')
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password match
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Remove password from the response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const updatePhoto = async (req, res) => {
    try {
        const { username } = req.body;

        // console.log('username', username);

        const user = await User.findOne({ username: username }).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const photo = req.file; // Multer adds this to req

        // console.log('photo', photo);

        if (!photo) {
            return res.status(400).json({ message: "No file uploaded" });
        }


        // set filename as username + timestamp
        const filename = `${username}-${Date.now()}`;
        photo.originalname = `${filename}.${photo.originalname.split('.').pop()}`;

        const photoUrl = await uploadToStorage(photo, 'profilepictures');


        user.photo = photoUrl;
        console.log('user', photoUrl);
        await user.save();
        res.status(200).json({ photoUrl });


    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
}

module.exports = { createUser, loginUser, updateUser, updatePhoto };

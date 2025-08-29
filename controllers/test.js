const User = require('../models/users');
const bcrypt = require('bcrypt');

module.exports.testing = async (req, res) => {
    try {
        res.status(200).json({ message: 'Hello World' });
    } catch (e) {
        console.error(e);
    }
};

module.exports.signUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user in DB
        const newUser = new User({ userName, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            message: 'User saved successfully',
            user: {
                id: newUser.id,
                userName: newUser.userName,
                email: newUser.email
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports.getUsers = async (req, res) => {
    try {
        const data = await User.find().select("-createdAt -updatedAt");

        res.status(201).json({ message: 'Users Found successfully!!!', data: data });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


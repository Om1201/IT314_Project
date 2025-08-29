const User = require('../models/users');

module.exports.testing = async (req, res) => {
    try {
        res.status(200).json({ message: 'Hello World' });
    } catch (e) {
        console.error(e);
    }
};

module.exports.dene = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Save new user in DB
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User saved successfully', user: newUser });
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


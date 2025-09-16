const jwt = require('jsonwebtoken');

// Middleware to protect routes
module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // verify with secret key
        req.user = decoded; // save decoded payload to req
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};

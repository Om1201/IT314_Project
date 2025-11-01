import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized Login Again.' });
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.userId = tokenDecode.id;
            req.email = tokenDecode.email;
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorized Login Again.' });
        }
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ success: false, message: error.message });
    }
};

export default userAuth;

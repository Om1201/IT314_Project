import express from "express" 
import {isAuthenticated, Logout, register, resetPassword, sendResetToken, Signin, verifyAccount, verifyResetToken} from "../controllers/Auth.js";
import userAuth from "../middlewares/userAuth.js"
import {login as googleLogin} from "../controllers/oAuthController.js";
import {verifyToken as googleVerifyToken} from "../controllers/oAuthController.js";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/account-verify', verifyAccount);
authRouter.post('/singin', Signin);
authRouter.post('/logout', Logout);
authRouter.post('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-token', sendResetToken);
authRouter.post('/verify-reset-token', verifyResetToken);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/oauth/google/login', googleLogin);
authRouter.post('/oauth/google/callback', googleVerifyToken);

export default authRouter;
import express from "express" 
import {isAuthenticated, logout, register, resetPassword, sendResetToken, signIn, verifyAccount, verifyResetToken} from "../controllers/Auth.js";
import userAuth from "../middlewares/userAuth.js"
import {login as googleLogin} from "../controllers/oAuthController.js";
import {verifyToken as googleVerifyToken} from "../controllers/oAuthController.js";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/account-verify', verifyAccount);
authRouter.post('/singin', signIn);
authRouter.post('/logout', logout);
authRouter.post('/is-auth', userAuth, isAuthenticated);

authRouter.post('/send-reset-token', sendResetToken);
authRouter.post('/verify-reset-token', verifyResetToken);
authRouter.post('/reset-password', resetPassword);

authRouter.get('/oauth/google/login', googleLogin);
authRouter.get('/oauth/google/callback', googleVerifyToken);

export default authRouter;
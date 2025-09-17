import express from "express" 
import {isAuthenticated, Logout, register, resetPassword, sendResetToken, Signin, verifyAccount, verifyResetToken} from "../controllers/Auth.js";
import {login as loginWithGoogle, verifyToken as googVerifyToken} from "../controllers/oAuthController.js";
import userAuth from "../middlewares/userAuth.js"
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/account-verify', verifyAccount);
authRouter.post('/singin', Signin);
authRouter.post('/logout', Logout);
authRouter.post('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-token', sendResetToken);
authRouter.post('/verify-reset-token', verifyResetToken);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/OAuth/login', loginWithGoogle);
authRouter.post('/OAuth/callback', googVerifyToken);


export default authRouter;
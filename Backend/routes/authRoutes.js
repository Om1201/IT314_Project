import express from "express" 
import {isAuthenticated, logout, register, resetPassword, sendResetToken, signIn, verifyAccount, verifyResetToken} from "../controllers/Auth.js";
import userAuth from "../middlewares/userAuth.js"
import {login as googleLogin} from "../controllers/oAuthController.js";
import {verifyToken as googleVerifyToken} from "../controllers/oAuthController.js";
import { validate } from "../middlewares/validate.js";
import { emailSchema, registerSchema, resetPassSchema, signinSchema, tokenSchema } from "../validators/authValidators.js";

const authRouter = express.Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/verify-account', validate(tokenSchema), verifyAccount);
authRouter.post('/signin', validate(signinSchema), signIn);
authRouter.post('/logout', logout);
authRouter.get('/is-auth', userAuth, isAuthenticated);

authRouter.post('/send-reset-token', validate(emailSchema), sendResetToken);
authRouter.post('/verify-reset-token', validate(tokenSchema), verifyResetToken);
authRouter.post('/reset-password', validate(resetPassSchema), resetPassword);

authRouter.get('/oauth/google/login', googleLogin);
authRouter.post('/oauth/google/callback', googleVerifyToken);

export default authRouter;
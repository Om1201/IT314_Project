import express from "express" 
import { Logout, register, Signin, verifyAccount } from "../controllers/Auth.js";
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/account-verify', verifyAccount);
authRouter.post('/singin', Signin);
authRouter.post('/logout', Logout);

export default authRouter;
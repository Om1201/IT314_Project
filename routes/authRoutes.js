import express from "express" 
import {register, verifyAccount} from "../controllers/Auth.js";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/account-verify', verifyAccount);
export default authRouter;
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';

import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

app.use("/api/auth", authRouter);

app.get('/', (req, res) => {
    res.send('Server is healthy');
});

export default app;

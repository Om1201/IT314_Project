import express from "express"
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";


import connectdb from "./config/connectDB.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

const port = process.env.PORT || 4000


await connectdb();
app.use(express.json());
app.use(cookieParser());


app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use("/api/auth", authRouter);

app.get('/', (req, res) => {
  res.send('Server is healthy');
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
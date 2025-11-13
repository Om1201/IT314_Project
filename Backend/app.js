import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import authRouter from './routes/authRoutes.js';
import roadmapRouter from './routes/roadmapRoutes.js';
import codeRoutes from './routes/codeRoutes.js';

import S3Routes from './routes/S3Routes.js';
import chatRoutes from './routes/chatRotutes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

app.use('/api/auth', authRouter);
app.use('/api/roadmap', roadmapRouter);
app.use('/api/code', codeRoutes);
app.use('/api/chat', chatRoutes);

app.use('/api/s3', S3Routes); 
app.get('/', (req, res) => {
    res.send('Server is healthy');
});

export default app;

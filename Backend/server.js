// server.js
import 'dotenv/config';
import app from './app.js';
import connectDb from './config/connectDB.js';
import { verifyEmailTransporter } from './config/mailer.js';
import axios from 'axios'
const port = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectDb();
        await verifyEmailTransporter();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            setInterval(() => {
                axios.get('https://it314-project.onrender.com/health')
                .then(res => {
                    console.log(`Health check successfull, status: ${res.status}`)
                })
                .catch(error => {
                    console.log(`Health check failed: ${error.message}`)
                })
            }, 5*60*1000);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();

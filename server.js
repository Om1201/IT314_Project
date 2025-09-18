// server.js
import 'dotenv/config';
import app from "./app.js";
import connectDb from "./config/connectDb.js";

const port = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();

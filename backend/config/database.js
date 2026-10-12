import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const dbConnect = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL?.trim();
        if (!mongoUrl) {
            throw new Error("MONGODB_URL environment variable is not defined!");
        }

        await mongoose.connect(mongoUrl);
        console.log("Connected to the database successfully!");
    } catch (err) {
        console.log("Error connecting to the database!");
        console.error(err);
        process.exit(1);
    }
};

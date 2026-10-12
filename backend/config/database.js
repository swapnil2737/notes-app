import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const dbConnect = async () => {
    try{
         await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to the database successfully!");
    }
    catch(err){
        console.log("Error connecting to the database!");
        console.error(err);
        process.exit(1);
    }

}

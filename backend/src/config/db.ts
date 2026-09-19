import mongoose from "mongoose";
import { DB_NAME, MONGO_URI } from "../constants/env";

export async function connectToDb() {
    const conn = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
    console.log(`Successfully connected to DB: ${conn.connection.host}`);
}

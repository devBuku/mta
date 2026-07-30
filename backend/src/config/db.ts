import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env.js";

const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to DB:', conn.connection.host)
  }
  catch(error) {
    console.error("Error in connecting to DB:", error);
    process.exit(1);
  }
}

export default connectToDb;

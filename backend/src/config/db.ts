import mongoose from "mongoose";
import { DB_NAME, MONGO_URI } from "../constants/env";
const connectDb = async function () {
  try {
    const conn = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
    console.log(`Connected to db: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error in connectDb(): ${err}`);
    process.exit(1);
  }
};

export default connectDb;

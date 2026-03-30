import mongoose from "mongoose";
import { MONGO_URI } from "../contants/env";

async function connectToDb() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Successfully connected to DB`);
  } catch (error) {
    console.log(`Could not connect to DB: ${error}`);
    process.exit(1);
  }
}

export default connectToDb;

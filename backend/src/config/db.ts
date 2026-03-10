import mongoose from "mongoose";
import { LOCAL_MONGODB_URI } from "../constants/env";

async function connectToDb() {
  try {
    await mongoose.connect(LOCAL_MONGODB_URI);
    console.log(`Successfully connected to DB`);
  } catch (error) {
    console.log(`Could not connect to the Database, ${error}`);
    process.exit(1);
  }
}

export default connectToDb;

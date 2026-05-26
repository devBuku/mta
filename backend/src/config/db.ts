import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectToDb = async function () {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to database.`);
  } catch (error) {
    console.log(`Could not connect to the database: ${error}`);
    process.exit(1);
  }
};

export default connectToDb;

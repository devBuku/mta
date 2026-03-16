import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

async function connectToDb() {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {}
}

export default connectToDb;

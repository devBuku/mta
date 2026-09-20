import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";

interface SessionDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    createdAt: Date;
    expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true,
    },
    userAgent: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: thirtyDaysFromNow,
    },
});

export const Session = mongoose.model<SessionDocument>("Session", sessionSchema);

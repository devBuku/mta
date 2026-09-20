import mongoose from "mongoose";
import { hashValue, compareValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (value: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: [6, "Password must be 6 characters long"],
        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await hashValue(this.password);
});

userSchema.methods.comparePassword = async function (password: string) {
    return compareValue(password, this.password);
};

export const User = mongoose.model<UserDocument>("User", userSchema);

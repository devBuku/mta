import { z } from "zod";

const loginSchema = z.object({
    email: z.email().min(1).max(255),
    password: z.string().min(6).max(255),
    userAgent: z.string().optional(),
});

const registerSchema = loginSchema
    .extend({
        confirmPassword: z.string().min(6).max(255),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export { registerSchema, loginSchema };

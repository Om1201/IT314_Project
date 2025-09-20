import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(35, "Name must be at most 35 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  email: z
    .string()
    .min(1, "Email is required")
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
    
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});
  
  
export const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .toLowerCase()
    .email("Invalid email address"),
    
  password: z
    .string()
    .min(1, "Password is required")
});
  
  
export const resetPassSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .toLowerCase()
    .email("Invalid email address"),
  
  newPassword: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  
})
  

export const tokenSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .toLowerCase()
    .email("Invalid email format"),
  token: z
    .string()
    .min(1, "Token is required")
    .uuid("Invalid reset token format"),
});

  
export const emailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .toLowerCase()
    .email("Invalid email format"),
});

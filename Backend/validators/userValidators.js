import { z } from 'zod';

export const changePasswordSchema = z.object({
    oldPassword: z
        .string()
        .min(1, 'Old password is required'),

    newPassword: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters long')
        .max(50, 'Password must be at most 50 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[\W_]/, 'Password must contain at least one special character'),
});
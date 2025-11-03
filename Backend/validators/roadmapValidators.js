import { z } from 'zod';

export const generationSchema = z.object({
    userDescription: z
        .string()
        .min(5, 'Description must be at least 5 characters')
        .max(500, 'Description must be at most 500 characters'),
    userLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
        errorMap: () => ({ message: 'Invalid skill level' }),
    }),
});

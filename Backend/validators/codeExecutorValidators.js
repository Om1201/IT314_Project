import { z } from 'zod';

const fileSchema = z.object({
    name: z.string().min(1, 'File name is required'),
    content: z.string().min(1, 'File content is required'),
});

export const codeExecutionSchema = z.object({
    language: z
        .string()
        .min(1, 'Language is required')
        .toLowerCase(),
    version: z
        .string()
        .min(1, 'Version is required'),
    files: z
        .array(fileSchema)
        .min(1, 'At least one file is required'),
    
    args: z
        .array(z.string())
        .optional()
        .default([]),
    stdin: z
        .string()
        .optional()
        .default(''),
});

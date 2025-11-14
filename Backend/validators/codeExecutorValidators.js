import { z } from 'zod';

const fileSchema = z.object({
    name: z.string().min(1, 'File name is required'),
    code: z.string(),
    id: z.string().optional(),
    input:  z.string().optional(),
    language: z.string().optional(),
    output: z.string().optional(),
    saved: z.boolean().optional(),
});

export const codeExecutionSchema = z.object({
    language: z
        .string()
        .min(1, 'Language is required')
        .toLowerCase(),
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

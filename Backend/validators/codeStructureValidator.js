import { z } from 'zod';

export const codeStructureSchema = z.object({
    fileName : z.string().min(1, 'File name is required'),
    content : z.string().min(1, 'File content is required'),    
});

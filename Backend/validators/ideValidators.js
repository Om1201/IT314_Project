import { z } from 'zod';

export const saveSchema = z.object({
  key: z
    .string()
    .min(1, "Key ID is required"),

  name: z
    .string()
    .min(1, "File name cannot be empty")
    .refine(
      (val) => !/[\/\\]/.test(val),
      "File name cannot contain / or \\"
    ),

  filePath: z
    .string()
    .min(1, "Filepath is required"),
});


export const renameSchema = z.object({
    key: z
      .string()
      .min(1, "Key ID is required"),
 name: z
    .string()
    .min(1, "File name cannot be empty")
    .refine(
      (val) => !/[\/\\]/.test(val),
      "File name cannot contain / or \\"
    ),
    oldFilePath: z
      .string()
      .min(1, "Old file path is required"),
    newFilePath: z
      .string()
      .min(1, "New file path is required"),
  });
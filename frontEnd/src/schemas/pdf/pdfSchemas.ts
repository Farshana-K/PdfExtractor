import { z } from 'zod';

export const uploadPdfSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.type === 'application/pdf', 'Only PDF files are allowed')
    .refine((file) => file.size <= 25 * 1024 * 1024, 'PDF must be smaller than 10 MB')
});

export const extractPdfSchema = z.object({
  pages: z.array(z.number().int().positive()).min(1, 'Select at least one page'),
  save: z.boolean()
});

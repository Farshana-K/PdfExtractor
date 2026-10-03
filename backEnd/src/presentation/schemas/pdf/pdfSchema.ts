
import { z } from 'zod';

export const ExtractPdfSchema = z.object({
  pages: z.array(z.number().int().positive()).min(1)
});


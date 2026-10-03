import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  email: z.email()
});

export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordSchema>;

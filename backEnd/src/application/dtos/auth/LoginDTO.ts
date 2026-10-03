import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

export interface LoginOutputDTO {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export type LoginDTO = z.infer<typeof LoginSchema>;

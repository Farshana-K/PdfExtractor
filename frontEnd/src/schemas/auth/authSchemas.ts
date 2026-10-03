import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must contain at least 2 characters').max(80),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must contain at least 8 characters').max(100),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match'
});

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const emailSchema = z.object({
  email: z.email('Enter a valid email address')
});

export const otpSchema = z.object({
  email: z.email('Invalid email address'),
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit OTP'),
  purpose: z.enum(['EMAIL_VERIFICATION', 'PASSWORD_RESET'])
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must contain at least 8 characters').max(100),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match'
});

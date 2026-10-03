import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const ResendOtpSchema = z.object({
  email: z.email(),
  purpose: z.enum(["EMAIL_VERIFICATION", "PASSWORD_RESET"]).optional(),
});

export const ResetPasswordSchema = z.object({
  resetToken: z.string().min(1),
  password: z.string().min(8).max(100),
});

export const VerifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string().regex(/^\d{6}$/),
  purpose: z.enum(["EMAIL_VERIFICATION", "PASSWORD_RESET"]),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  email: z.email(),
});

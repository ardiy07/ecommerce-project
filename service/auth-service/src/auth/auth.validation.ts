import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly VERIFY_EMAIL: ZodType = z.object({
    email: z.string().min(1).max(100).email(),
  });

  static readonly VERIFY_OTP: ZodType = z.object({
    email: z.string().min(1).max(100).email(),
    otp: z.string().min(6).max(6),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().min(1).max(100).email(),
    password: z.string().min(6).max(20),
  });

  static readonly REGISTER: ZodType = z.object({
    otp: z.string().min(6).max(6),
    email: z.string().min(1).max(100).email(),
    password: z.string().min(6).max(20),
  });
}

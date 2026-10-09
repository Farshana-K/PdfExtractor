
import { Resend } from 'resend';

import { IEmailService } from '../../application/interfaces/services/IEmailService.js';
import { AppError } from '../../shared/AppError.js';
import { HttpStatusCode } from '../../shared/HttpStatusCode.js';
import { RESPONSE_MESSAGES } from '../../shared/ResponseMessages.js';

export class ResendEmailService implements IEmailService {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      throw new Error('Resend email service is not configured');
    }

    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async sendOtp(
    email: string,
    otp: string,
    purpose: string
  ): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: [email],
      subject: 'PDF Extractor verification code',
      text: `Your ${purpose} OTP is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2>PDF Extractor</h2>
          <p>Your ${purpose} OTP is:</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</p>
          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this code, you can safely ignore this email.</p>
        </div>
      `
    });

    if (error) {
      throw new AppError(
        RESPONSE_MESSAGES.INTERNAL_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}

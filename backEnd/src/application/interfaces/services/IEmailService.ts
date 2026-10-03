export interface IEmailService {
  sendOtp(email: string, otp: string, purpose: string): Promise<void>;
}

export type OtpPurpose = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';

export class Otp {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly code: string,
    public readonly purpose: OtpPurpose,
    public readonly expiresAt: Date,
    public readonly createdAt: Date
  ) {}

}

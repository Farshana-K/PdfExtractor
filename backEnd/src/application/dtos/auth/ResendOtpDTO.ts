export type OtpPurpose = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';


export interface ResendOtpInputDTO {
  email: string;
  purpose?: OtpPurpose;
}
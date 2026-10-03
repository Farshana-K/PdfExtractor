export type OtpPurpose = "EMAIL_VERIFICATION" | "PASSWORD_RESET";
export interface VerifyOtpDTO {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}
export interface VerifyOtpUserDTO {
  id: string;
  name: string;
  email: string;
}
export interface VerifyEmailOtpOutputDTO {
  purpose: "EMAIL_VERIFICATION";
  user: VerifyOtpUserDTO;
}
export interface VerifyPasswordResetOtpOutputDTO {
  purpose: "PASSWORD_RESET";
  resetToken: string;
}
export type VerifyOtpOutputDTO =
  | VerifyEmailOtpOutputDTO
  | VerifyPasswordResetOtpOutputDTO;

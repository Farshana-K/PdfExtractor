
import { API_ROUTES } from '../constants/apiRoutes';
import { apiService as api } from './apiService';
import type { User } from '../types';

type OtpPurpose = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';

interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface EmailData {
  email: string;
}

interface VerifyOtpData {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

interface VerifyOtpResponse {
  resetToken?: string;
}

interface ResendOtpData {
  email: string;
  purpose: OtpPurpose;
}

interface ResetPasswordData {
  resetToken: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data } = await api.post<ApiResponse<LoginResponse>>(
      API_ROUTES.AUTH.LOGIN,
      credentials
    );

    if (!data.data?.user) {
      throw new Error('Invalid login response from server');
    }

    return data.data.user;
  },

  async register(userData: RegisterData): Promise<void> {
    await api.post<ApiResponse>(
      API_ROUTES.AUTH.REGISTER,
      userData
    );
  },

  async verifyOtp(
    otpData: VerifyOtpData
  ): Promise<VerifyOtpResponse> {
    const { data } = await api.post<ApiResponse<VerifyOtpResponse>>(
      API_ROUTES.AUTH.VERIFY_OTP,
      otpData
    );

    return data.data ?? {};
  },

  async resendOtp(otpData: ResendOtpData): Promise<void> {
    await api.post<ApiResponse>(
      API_ROUTES.AUTH.RESEND_OTP,
      otpData
    );
  },

  async forgotPassword(emailData: EmailData): Promise<void> {
    await api.post<ApiResponse>(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      emailData
    );
  },

  async resetPassword(
    resetData: ResetPasswordData
  ): Promise<void> {
    await api.post<ApiResponse>(
      API_ROUTES.AUTH.RESET_PASSWORD,
      resetData
    );
  }
};

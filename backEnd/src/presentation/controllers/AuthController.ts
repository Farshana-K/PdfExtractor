
import { Request, Response } from 'express';

import {
  RegisterSchema,
  VerifyOtpSchema,
  ResendOtpSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema
} from '../schemas/auth/authSchema.js';

import { IVerifyOtpUseCase } from '../../application/interfaces/auth/IVerifyOtpUseCase.js';
import { ILoginUseCase } from '../../application/interfaces/auth/ILoginUseCase.js';
import { IResendOtpUseCase } from '../../application/interfaces/auth/IResendOtpUseCase.js';
import { IForgotPasswordUseCase } from '../../application/interfaces/auth/IForgotPasswordUseCase.js';
import { IResetPasswordUseCase } from '../../application/interfaces/auth/IResetPasswordUseCase.js';
import { IRefreshSessionUseCase } from '../../application/interfaces/auth/IRefreshSessionUseCase.js';
import { IRegisterUserUseCase } from '../../application/interfaces/auth/IRegisterUseCase.js';

export class AuthController {
  constructor(
    private readonly register: IRegisterUserUseCase,
    private readonly verifyOtp: IVerifyOtpUseCase,
    private readonly login: ILoginUseCase,
    private readonly resendOtp: IResendOtpUseCase,
    private readonly forgotPassword: IForgotPasswordUseCase,
    private readonly resetPassword: IResetPasswordUseCase,
    private readonly refreshSession: IRefreshSessionUseCase
  ) {}

  registerUser = async (req: Request, res: Response) => {
    const data = RegisterSchema.parse(req.body);

    const user = await this.register.execute(data);

    res.status(201).json({
      message: 'Registration successful. Verify your email with the OTP.',
      user
    });
  };

  verifyOtpRequest = async (req: Request, res: Response) => {
    const data = VerifyOtpSchema.parse(req.body);

    const result = await this.verifyOtp.execute(data);

    res.json(result);
  };

  resend = async (req: Request, res: Response) => {
    const data = ResendOtpSchema.parse(req.body);

    await this.resendOtp.execute(data);

    res.json({
      message: 'If the request is valid, a new OTP has been sent.'
    });
  };

  loginUser = async (req: Request, res: Response) => {
    const data = LoginSchema.parse(req.body);

    const result = await this.login.execute(data);

    this.setCookies(res, result.accessToken, result.refreshToken);

    res.json({
      user: result.user
    });
  };

  forgotPasswordRequest = async (req: Request, res: Response) => {
    const data = ForgotPasswordSchema.parse(req.body);

    await this.forgotPassword.execute(data);

    res.json({
      message: 'If an account exists for this email, an OTP has been sent.'
    });
  };

  resetPasswordRequest = async (req: Request, res: Response) => {
    const data = ResetPasswordSchema.parse(req.body);

    await this.resetPassword.execute(data);

    res.json({
      message: 'Password reset successfully'
    });
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    const result = await this.refreshSession.execute({
      refreshToken
    });

    this.setCookies(res, result.accessToken, result.refreshToken);

    res.json({
      user: result.user
    });
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    });

    res.json({
      message: 'Logged out'
    });
  };

  private setCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }
}



import { Request, Response } from 'express';

import { RESPONSE_MESSAGES } from '../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../shared/HttpStatusCode.js';
import { AppError } from '../../shared/AppError.js';
import { successResponse } from '../../shared/ApiResponse.js';

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
    private readonly _registerUseCase: IRegisterUserUseCase,
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly _loginUseCase: ILoginUseCase,
    private readonly _resendOtpUseCase: IResendOtpUseCase,
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    private readonly _resetPasswordUseCase: IResetPasswordUseCase,
    private readonly _refreshSessionUseCase: IRefreshSessionUseCase
  ) {}

  registerUser = async (req: Request, res: Response) => {
    const data = RegisterSchema.parse(req.body);
    const user = await this._registerUseCase.execute(data);

    res.status(HttpStatusCode.CREATED).json(
      successResponse(
        RESPONSE_MESSAGES.REGISTRATION_SUCCESS,
        { user }
      )
    );
  };

  verifyOtpRequest = async (req: Request, res: Response) => {
    const data = VerifyOtpSchema.parse(req.body);
    const result = await this._verifyOtpUseCase.execute(data);

    res.json(
      successResponse(
        RESPONSE_MESSAGES.OTP_VERIFIED,
        result
      )
    );
  };

  resend = async (req: Request, res: Response) => {
    const data = ResendOtpSchema.parse(req.body);
    await this._resendOtpUseCase.execute(data);

    res.json(
      successResponse(RESPONSE_MESSAGES.OTP_SENT)
    );
  };

  loginUser = async (req: Request, res: Response) => {
    const data = LoginSchema.parse(req.body);
    const result = await this._loginUseCase.execute(data);

    this.setCookies(
      res,
      result.accessToken,
      result.refreshToken
    );

    res.json(
      successResponse(
        RESPONSE_MESSAGES.LOGIN_SUCCESS,
        { user: result.user }
      )
    );
  };

  forgotPasswordRequest = async (req: Request, res: Response) => {
    const data = ForgotPasswordSchema.parse(req.body);
    await this._forgotPasswordUseCase.execute(data);

    res.json(
      successResponse(
        RESPONSE_MESSAGES.FORGOT_PASSWORD_OTP_SENT
      )
    );
  };

  resetPasswordRequest = async (req: Request, res: Response) => {
    const data = ResetPasswordSchema.parse(req.body);
    await this._resetPasswordUseCase.execute(data);

    res.json(
      successResponse(
        RESPONSE_MESSAGES.PASSWORD_RESET_SUCCESS
      )
    );
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        RESPONSE_MESSAGES.REFRESH_REQUIRED,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const result = await this._refreshSessionUseCase.execute({
      refreshToken
    });

    this.setCookies(
      res,
      result.accessToken,
      result.refreshToken
    );

    res.json(
      successResponse(
        RESPONSE_MESSAGES.SESSION_REFRESHED,
        { user: result.user }
      )
    );
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

    res.json(
      successResponse(RESPONSE_MESSAGES.LOGGED_OUT)
    );
  };

  private setCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
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

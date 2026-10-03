
import { UserRepository } from '../infrastructure/repositories/UserRepository.js';
import { PdfRepository } from '../infrastructure/repositories/PdfRepository.js';
import { OtpRepository } from '../infrastructure/repositories/OtpRepository.js';

import { ResendEmailService } from '../infrastructure/services/ResendEmailService.js';
import { TokenService } from '../infrastructure/services/TokenService.js';
import { GridFsStorageService } from '../infrastructure/services/GridFsStorageService.js';
import { BcryptPasswordHasher } from '../infrastructure/services/BcryptPasswordHasher.js';

import { RegisterUserUseCase } from '../application/usecases/auth/RegisterUserUseCase.js';
import { VerifyOtpUseCase } from '../application/usecases/auth/VerifyOtpUseCase.js';
import { ForgotPasswordUseCase } from '../application/usecases/auth/ForgotPasswordUseCase.js';
import { ResetPasswordUseCase } from '../application/usecases/auth/ResetPasswordUseCase.js';
import { RefreshSessionUseCase } from '../application/usecases/auth/RefreshSessionUseCase.js';
import { LoginUseCase } from '../application/usecases/auth/LoginUseCase.js';
import { ResendOtpUseCase } from '../application/usecases/auth/ResendOtpUseCase.js';

import { UploadPdfUseCase } from '../application/usecases/pdf/UploadPdfUseCase.js';
import { ListUserPdfsUseCase } from '../application/usecases/pdf/ListUserPdfsUseCase.js';
import { GetPdfUseCase } from '../application/usecases/pdf/GetPdfUseCase.js';
import { DeletePdfUseCase } from '../application/usecases/pdf/DeletePdfUseCase.js';
import { ExtractPdfUseCase } from '../application/usecases/pdf/ExtractPdfUseCase.js';

import { AuthController } from '../presentation/controllers/AuthController.js';
import { PdfController } from '../presentation/controllers/PdfController.js';

const users = new UserRepository();
const pdfs = new PdfRepository();
const otps = new OtpRepository();

const email = new ResendEmailService();
const tokens = new TokenService();
const storage = new GridFsStorageService();
const passwordHasher = new BcryptPasswordHasher();

export const authController = new AuthController(
  new RegisterUserUseCase(
    users,
    otps,
    email,
    passwordHasher
  ),
  new VerifyOtpUseCase(
    users,
    otps,
    tokens
  ),
  new LoginUseCase(
    users,
    tokens,
    passwordHasher
  ),
  new ResendOtpUseCase(
    users,
    otps,
    email
  ),
  new ForgotPasswordUseCase(
    users,
    otps,
    email
  ),
  new ResetPasswordUseCase(
    users,
    otps,
    passwordHasher,
    tokens
  ),
  new RefreshSessionUseCase(
    users,
    tokens
  )
);

export const pdfController = new PdfController(
  new UploadPdfUseCase(
    pdfs,
    storage
  ),
  new ListUserPdfsUseCase(
    pdfs
  ),
  new GetPdfUseCase(
    pdfs,
    storage
  ),
  new DeletePdfUseCase(
    pdfs,
    storage
  ),
  new ExtractPdfUseCase(
    pdfs,
    storage
  ),
  storage
);

export { tokens };


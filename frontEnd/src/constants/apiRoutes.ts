export const API_ROUTES = {
  AUTH: {
    REGISTER: '/auth/register', VERIFY_OTP: '/auth/verify-otp', RESEND_OTP: '/auth/resend-otp',
    LOGIN: '/auth/login', LOGOUT: '/auth/logout', REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password', RESET_PASSWORD: '/auth/reset-password'
  },
  PDFS: '/pdfs',
  pdfById: (id: string) => `/pdfs/${id}`,
  extractPdf: (id: string) => `/pdfs/${id}/extract`,
  generatedById: (id: string) => `/generated/${id}`,
  saveGenerated: (id: string) => `/generated/${id}/save`,
  downloadGenerated: (id: string) => `/generated/${id}/download`
} as const;

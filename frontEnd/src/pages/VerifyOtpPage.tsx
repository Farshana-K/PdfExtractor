
import { FormEvent, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { otpSchema } from '../schemas/auth/authSchemas';
import toast from 'react-hot-toast';

type Purpose = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';

export function VerifyOtpPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get('email') || '';
  const purpose = (params.get('purpose') ||
    'EMAIL_VERIFICATION') as Purpose;

  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function verify(event: FormEvent) {
    event.preventDefault();

    setError('');
    setMessage('');

    const result = otpSchema.safeParse({
      email,
      otp,
      purpose,
    });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message || 'Enter a valid OTP',
      );
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOtp(result.data);

      if (purpose === 'PASSWORD_RESET') {
        const resetToken = response.resetToken;

        if (!resetToken) {
          setError('Reset token was not returned by the server. Please try again.');
          return;
        }

        /*
         * Password reset flow:
         * OTP verified → store reset token → reset password page
         */
        sessionStorage.setItem('pdf-reset-token', resetToken);

        navigate('/reset-password');
      } else {
        /*
         * Registration flow:
         * OTP verified → registration completed → login
         */
        toast.success(
          'Registration complete! Please login to continue.',
        );

        navigate('/login');
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.message ||
          'Invalid OTP',
      );
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setError('');
    setMessage('');
    setResending(true);

    try {
      await authService.resendOtp({
        email,
        purpose,
      });

      setMessage('A new OTP has been sent.');
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.message ||
          'Could not resend OTP',
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-md place-items-center">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-2xl shadow-slate-200/60 sm:p-9">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-indigo-50 text-2xl">
          ✉
        </div>

        <h1 className="text-3xl font-black text-slate-900">
          {purpose === 'PASSWORD_RESET'
            ? 'Verify reset request'
            : 'Verify your email'}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Enter the 6-digit code sent to{' '}
          <span className="font-bold text-slate-700">
            {email}
          </span>
          .
        </p>

        <form onSubmit={verify} className="mt-7 space-y-4">
          <input
            value={otp}
            onChange={(event) =>
              setOtp(
                event.target.value
                  .replace(/\D/g, '')
                  .slice(0, 6),
              )
            }
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-3xl font-black tracking-[0.5em] outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-left text-sm text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3.5 font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Verify OTP'}
          </button>
        </form>

        <button
          type="button"
          disabled={resending || !email}
          onClick={resend}
          className="mt-5 text-sm font-bold text-indigo-600 disabled:opacity-50"
        >
          {resending ? 'Sending…' : 'Resend OTP'}
        </button>

        <div className="mt-5">
          <Link
            to={
              purpose === 'PASSWORD_RESET'
                ? '/forgot-password'
                : '/register'
            }
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Use a different email
          </Link>
        </div>
      </div>
    </div>
  );
}


import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { emailSchema } from '../schemas/auth/authSchemas';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');

    const result = emailSchema.safeParse({ email });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message || 'Enter a valid email'
      );
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(result.data);

      navigate(
        `/verify-otp?email=${encodeURIComponent(result.data.email)}&purpose=PASSWORD_RESET`
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.message ||
          'Could not start password reset'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-md place-items-center">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-200/60 sm:p-9">
        <div className="mb-7">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-xl text-indigo-600">
            ↻
          </div>

          <h1 className="text-3xl font-black text-slate-900">
            Forgot password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter your account email. If an account exists, we’ll send a
            6-digit OTP.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
          />

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3.5 font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Sending OTP…' : 'Send OTP'}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-6 block text-center text-sm font-bold text-indigo-600"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}

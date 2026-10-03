
import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { resetPasswordSchema } from '../schemas/auth/authSchemas';

export function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('pdf-reset-token')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  async function submit(event: FormEvent) {
    event.preventDefault();

    setError('');

    const result = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ||
          'Please check your password'
      );
      return;
    }

    const resetToken = sessionStorage.getItem('pdf-reset-token');

    if (!resetToken) {
      navigate('/forgot-password', { replace: true });
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        resetToken,
        password: result.data.password,
      });

      sessionStorage.removeItem('pdf-reset-token');

      toast.success(
        'Password changed successfully. Please login to continue.'
      );

      navigate('/login');
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          'Could not reset password'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-md place-items-center">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-200/60 sm:p-9">
        <div className="mb-7">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-xl">
            ✓
          </div>

          <h1 className="text-3xl font-black text-slate-900">
            Create a new password
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your OTP was verified. Choose a new password for your
            account.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <PasswordField
            label="New password"
            value={password}
            onChange={setPassword}
            showPassword={showPassword}
            onToggle={() =>
              setShowPassword((previous) => !previous)
            }
          />

          <PasswordField
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            showPassword={showConfirmPassword}
            onToggle={() =>
              setShowConfirmPassword((previous) => !previous)
            }
          />

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3.5 font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Updating password…' : 'Update password'}
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

function PasswordField({
  label,
  value,
  onChange,
  showPassword,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-20 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="At least 8 characters"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-indigo-600 hover:text-indigo-500"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
}



import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { registerSchema } from '../schemas/auth/authSchemas';

export function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');

    const result = registerSchema.safeParse(form);

    if (!result.success) {
      setError(
        result.error.issues[0]?.message || 'Please check your details'
      );
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      });

      navigate(
        `/verify-otp?email=${encodeURIComponent(
          result.data.email
        )}&purpose=EMAIL_VERIFICATION`
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.message ||
          'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60 sm:p-9">
        <div className="mb-7">
          <span className="text-sm font-bold text-indigo-600">
            GET STARTED
          </span>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Create your workspace
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            We’ll send a verification OTP to your email.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(value) => setForm({ ...form, name: value })}
            placeholder="Your name"
          />

          <Input
            label="Email"
            value={form.email}
            onChange={(value) => setForm({ ...form, email: value })}
            placeholder="you@example.com"
            type="email"
          />

          <PasswordInput
            label="Password"
            value={form.password}
            onChange={(value) => setForm({ ...form, password: value })}
            placeholder="At least 8 characters"
            showPassword={showPassword}
            onToggle={() => setShowPassword((previous) => !previous)}
          />

          <PasswordInput
            label="Confirm password"
            value={form.confirmPassword}
            onChange={(value) =>
              setForm({ ...form, confirmPassword: value })
            }
            placeholder="Repeat password"
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
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  showPassword,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
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
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={showPassword ? 'text' : 'password'}
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

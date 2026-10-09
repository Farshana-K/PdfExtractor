
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { loginSchema } from '../schemas/auth/authSchemas';
import { useAppDispatch } from '../redux/hooks';
import { setUser } from '../redux/slices/authSlice';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message || 'Please check your details'
      );
      return;
    }

    setLoading(true);

    try {
      const user = await authService.login(result.data);

      dispatch(setUser(user));
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue working with your PDFs."
    >
      <form onSubmit={submit} className="space-y-5">
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="you@example.com"
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>

          <div className="relative">
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-20 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              type={showPassword ? 'text' : 'password'}
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-indigo-600 hover:text-indigo-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && <ErrorBox>{error}</ErrorBox>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-indigo-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{' '}
        <Link to="/register" className="font-bold text-indigo-600">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-5xl place-items-center lg:grid-cols-2 lg:gap-12">
      <div className="hidden lg:block">
        <div className="mb-5 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
          Secure PDF workspace
        </div>

        <h1 className="text-5xl font-black tracking-tight text-slate-900">
          Your documents,
          <br />
          <span className="text-indigo-600">your workflow.</span>
        </h1>

        <p className="mt-5 max-w-md text-lg leading-8 text-slate-500">
          Store PDFs securely, select exactly the pages you need, rearrange
          them, and generate a new document in seconds.
        </p>
      </div>

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60 sm:p-8">
        <h2 className="text-2xl font-black text-slate-900">{title}</h2>

        <p className="mt-2 mb-7 text-sm leading-6 text-slate-500">
          {subtitle}
        </p>

        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {children}
    </p>
  );
}

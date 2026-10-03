import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUser, setUser } from '../redux/slices/authSlice';

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function logout() {
    try { await api.post('/auth/logout'); } finally {
      dispatch(setUser(null));
      navigate('/login');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-black tracking-tight text-slate-900">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">P</span>
            PDF<span className="text-indigo-600">Flow</span>
          </Link>
          <nav className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden text-sm font-medium text-slate-600 sm:inline">Hi, {user.name}</span>
                <button onClick={logout} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">Logout</button>
              </>
            ) : (
              <Link to="/login" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
    </div>
  );
}

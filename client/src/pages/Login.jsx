import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md bg-zinc-950 rounded-2xl border border-zinc-800 shadow-xl p-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Login to Your Account</h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-zinc-300 mb-1">Email</label>
            <input
              className="w-full px-3 py-2 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-cyan-500 focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoFocus
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1">Password</label>
            <input
              className="w-full px-3 py-2 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-cyan-500 focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full px-6 py-2 mt-2 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-zinc-400 mt-5 text-center">
          New here?{' '}
          <Link className="text-pink-400 underline hover:text-pink-200 transition" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

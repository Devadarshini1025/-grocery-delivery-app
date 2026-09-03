import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-4xl text-leaf-700 mb-8">Welcome back</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-ink-600 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-kraft-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-leaf-500"
          />
        </div>

        <div>
          <label className="block text-sm text-ink-600 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-kraft-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-leaf-500"
          />
        </div>

        {error && <p className="text-tomato-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tomato-600 hover:bg-tomato-500 transition-colors text-white py-2.5 rounded font-medium disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-600">
        New here?{' '}
        <Link to="/register" className="text-leaf-700 underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
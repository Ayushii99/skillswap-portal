import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    collegeName: '',
    location: '',
    bio: '',
    skillsOffered: '',
    skillsWanted: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          collegeName: form.collegeName,
          location: form.location,
          bio: form.bio,
          skillsOffered: form.skillsOffered
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          skillsWanted: form.skillsWanted
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        };
        await register(payload);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-indigo-400 text-center">
          SkillSwap Portal
        </h1>
        <p className="text-slate-400 text-sm text-center mt-1 mb-6">
          {isLogin
            ? 'Sign in to swap skills with campus and local peers'
            : 'Create an account and start with 3 Skill Credits'}
        </p>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-300 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Password *</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {!isLogin && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">College / Institute</label>
                  <input
                    type="text"
                    name="collegeName"
                    value={form.collegeName}
                    onChange={handleChange}
                    placeholder="e.g. University Name"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">City / Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Patna / Dehradun"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Skills You Can Teach (comma separated)
                </label>
                <input
                  type="text"
                  name="skillsOffered"
                  value={form.skillsOffered}
                  onChange={handleChange}
                  placeholder="React, Node.js, Video Editing"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Skills You Want to Learn (comma separated)
                </label>
                <input
                  type="text"
                  name="skillsWanted"
                  value={form.skillsWanted}
                  onChange={handleChange}
                  placeholder="UI/UX Design, Python, Public Speaking"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Short Bio</label>
                <textarea
                  name="bio"
                  rows={2}
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell peers about your background or learning goals..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer"
          >
            {submitting
              ? 'Please wait...'
              : isLogin
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-indigo-400 hover:underline font-medium cursor-pointer"
          >
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
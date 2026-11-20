import { useState, useEffect } from 'react';
import { Coins, Award, Save } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    collegeName: '',
    location: '',
    bio: '',
    skillsOffered: '',
    skillsWanted: '',
  });
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        collegeName: user.collegeName || '',
        location: user.location || '',
        bio: user.bio || '',
        skillsOffered: (user.skillsOffered || []).join(', '),
        skillsWanted: (user.skillsWanted || []).join(', '),
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const payload = {
        name: form.name,
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

      const { data } = await API.put('/users/profile', payload);
      setUser(data);
      setStatusMsg({
        type: 'success',
        text: 'Profile aur skills successfully update ho gaye!',
      });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Update karne mein error aaya',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-500/15 border border-amber-400/30 text-amber-300 px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5">
              <Coins className="w-4 h-4" />
              {user?.skillCredits ?? 0} Credits
            </div>
            <div className="bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              {user?.completedSwaps ?? 0} Swaps
            </div>
          </div>
        </div>

        {statusMsg.text && (
          <div
            className={`text-sm p-3.5 rounded-xl mb-5 border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold mb-2">Edit Profile & Skills</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">City / Location</label>
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
            <label className="block text-xs text-slate-300 mb-1">College / Institute</label>
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
            <label className="block text-xs text-slate-300 mb-1">
              Skills You Can Teach (comma separated)
            </label>
            <input
              type="text"
              name="skillsOffered"
              value={form.skillsOffered}
              onChange={handleChange}
              placeholder="React, Node.js, C++, UI Design"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Skills You Want to Learn (comma separated)
            </label>
            <input
              type="text"
              name="skillsWanted"
              value={form.skillsWanted}
              onChange={handleChange}
              placeholder="Python, Machine Learning, Video Editing"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={form.bio}
              onChange={handleChange}
              placeholder="Apni learning goals ya experience ke baare mein likhein..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Search, MapPin, GraduationCap, Sparkles, Send, X } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ExplorePage({ mode = 'explore' }) {
  const { user } = useAuth();
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Modal state for sending swap request
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [swapForm, setSwapForm] = useState({
    skillToLearn: '',
    skillOfferedInReturn: '',
    creditsUsed: 1,
    message: '',
  });
  const [modalMsg, setModalMsg] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const fetchPeers = async () => {
    setLoading(true);
    try {
      if (mode === 'matches') {
        const { data } = await API.get('/users/matches');
        setPeers(data);
      } else {
        const params = {};
        if (skillFilter.trim()) params.skill = skillFilter.trim();
        if (locationFilter.trim()) params.location = locationFilter.trim();
        const { data } = await API.get('/users', { params });
        setPeers(data);
      }
    } catch (err) {
      console.error('Error fetching peers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeers();
  }, [mode]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPeers();
  };

  const openSwapModal = (peer) => {
    setSelectedPeer(peer);
    setModalMsg({ type: '', text: '' });
    setSwapForm({
      skillToLearn: peer.skillsOffered?.[0] || '',
      skillOfferedInReturn: user?.skillsOffered?.[0] || '',
      creditsUsed: 1,
      message: '',
    });
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setSending(true);
    setModalMsg({ type: '', text: '' });

    try {
      await API.post('/swaps', {
        providerId: selectedPeer._id,
        ...swapForm,
      });
      setModalMsg({
        type: 'success',
        text: 'Swap request sent! Check "My Swaps" to track its status.',
      });
      setTimeout(() => {
        setSelectedPeer(null);
      }, 1200);
    } catch (err) {
      setModalMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to send swap request',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {mode === 'matches' ? (
                <>
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  Smart Skill Matches
                </>
              ) : (
                'Explore Campus & Local Peers'
              )}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {mode === 'matches'
                ? 'Best matched peers based on the skills you offer and want to learn'
                : 'Find peers to learn new skills through mutual exchange or Skill Credits'}
            </p>
          </div>
        </div>

        {/* Search & Filter Bar (only in explore mode) */}
        {mode === 'explore' && (
          <form
            onSubmit={handleSearch}
            className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                placeholder="Filter by skill (e.g. React, Python)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Filter by city (e.g. Patna, Dehradun)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg py-2 px-4 text-sm transition cursor-pointer"
            >
              Search Peers
            </button>
          </form>
        )}

        {/* Peers Grid */}
        {loading ? (
          <p className="text-slate-400 text-center py-12">Loading peers...</p>
        ) : peers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400">
            {mode === 'matches'
              ? 'No skill matches found yet. Add more skills to your profile or browse Explore Peers.'
              : 'No peers found yet. Register another account to test skill swapping and matchmaking.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {peers.map((peer) => (
              <div
                key={peer._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {peer.name}
                      </h2>
                      {peer.collegeName && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                          {peer.collegeName}
                        </p>
                      )}
                      {peer.location && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {peer.location}
                        </p>
                      )}
                    </div>

                    {peer.isMutual && (
                      <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        Mutual Match
                      </span>
                    )}
                  </div>

                  {peer.bio && (
                    <p className="text-slate-300 text-sm mt-3 line-clamp-2">
                      {peer.bio}
                    </p>
                  )}

                  {/* Skills Offered */}
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                      Can Teach
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {peer.skillsOffered?.length > 0 ? (
                        peer.skillsOffered.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">Not listed</span>
                      )}
                    </div>
                  </div>

                  {/* Skills Wanted */}
                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                      Wants to Learn
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {peer.skillsWanted?.length > 0 ? (
                        peer.skillsWanted.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">Not listed</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openSwapModal(peer)}
                  className="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Request Skill Swap
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Swap Request Modal */}
      {selectedPeer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setSelectedPeer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">
              Request Swap with {selectedPeer.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">
              Available Balance: {user?.skillCredits} Skill Credits
            </p>

            {modalMsg.text && (
              <div
                className={`text-sm p-3 rounded-lg mb-4 border ${
                  modalMsg.type === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                }`}
              >
                {modalMsg.text}
              </div>
            )}

            <form onSubmit={handleSendRequest} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Skill You Want to Learn *
                </label>
                <input
                  type="text"
                  required
                  value={swapForm.skillToLearn}
                  onChange={(e) =>
                    setSwapForm({ ...swapForm, skillToLearn: e.target.value })
                  }
                  placeholder="e.g. Video Editing"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Skill You Offer in Return (Optional)
                </label>
                <input
                  type="text"
                  value={swapForm.skillOfferedInReturn}
                  onChange={(e) =>
                    setSwapForm({
                      ...swapForm,
                      skillOfferedInReturn: e.target.value,
                    })
                  }
                  placeholder="e.g. React.js (or leave blank for credit swap)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Skill Credits to Offer
                </label>
                <input
                  type="number"
                  min={1}
                  max={user?.skillCredits || 1}
                  required
                  value={swapForm.creditsUsed}
                  onChange={(e) =>
                    setSwapForm({
                      ...swapForm,
                      creditsUsed: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Message / Schedule Note
                </label>
                <textarea
                  rows={2}
                  value={swapForm.message}
                  onChange={(e) =>
                    setSwapForm({ ...swapForm, message: e.target.value })
                  }
                  placeholder="Hi! Let's schedule a 1-hour session over the weekend."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm transition cursor-pointer"
              >
                {sending ? 'Sending...' : 'Send Swap Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
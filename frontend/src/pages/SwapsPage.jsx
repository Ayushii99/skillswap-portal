import { useState, useEffect } from 'react';
import { Check, X, CheckCircle2, Coins } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function SwapsPage() {
  const { user, refreshUser } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [feedback, setFeedback] = useState('');

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/swaps/my');
      setSwaps(data);
    } catch (err) {
      console.error('Error fetching swaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const handleRespond = async (swapId, status) => {
    setActionId(swapId);
    setFeedback('');
    try {
      await API.patch(`/swaps/${swapId}/respond`, { status });
      setFeedback(`Swap request ${status} successfully.`);
      await fetchSwaps();
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const handleComplete = async (swapId) => {
    setActionId(swapId);
    setFeedback('');
    try {
      const { data } = await API.patch(`/swaps/${swapId}/complete`);
      setFeedback(data.message || 'Swap completed and credits transferred!');
      await Promise.all([fetchSwaps(), refreshUser()]);
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Could not complete swap');
    } finally {
      setActionId(null);
    }
  };

  const badgeStyle = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">My Skill Swaps</h1>
        <p className="text-slate-400 text-sm mb-6">
          Track sent and received swap requests and transfer Skill Credits upon completion
        </p>

        {feedback && (
          <div className="bg-indigo-500/15 border border-indigo-500/40 text-indigo-200 text-sm p-3.5 rounded-xl mb-5">
            {feedback}
          </div>
        )}

        {loading ? (
          <p className="text-slate-400 text-center py-12">Loading swaps...</p>
        ) : swaps.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
            No swap requests yet. Send a request from Explore Peers or Smart Matches to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {swaps.map((swap) => {
              const isProvider = swap.provider?._id === user?._id;
              const otherPerson = isProvider ? swap.requester : swap.provider;

              return (
                <div
                  key={swap._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full border ${badgeStyle(
                          swap.status
                        )}`}
                      >
                        {swap.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {isProvider ? 'Incoming Request from' : 'Sent Request to'}{' '}
                        <strong className="text-white">
                          {otherPerson?.name || 'Peer'}
                        </strong>
                      </span>
                      <span className="text-xs text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        <Coins className="w-3.5 h-3.5" />
                        {swap.creditsUsed} Credit(s)
                      </span>
                    </div>

                    <p className="text-sm text-slate-200">
                      <strong>Skill to Learn:</strong> {swap.skillToLearn}
                      {swap.skillOfferedInReturn && (
                        <span className="text-slate-400">
                          {' '}
                          • <strong>Offered in Return:</strong>{' '}
                          {swap.skillOfferedInReturn}
                        </span>
                      )}
                    </p>

                    {swap.message && (
                      <p className="text-xs text-slate-400 italic">
                        "{swap.message}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {isProvider && swap.status === 'pending' && (
                      <>
                        <button
                          disabled={actionId === swap._id}
                          onClick={() => handleRespond(swap._id, 'accepted')}
                          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          disabled={actionId === swap._id}
                          onClick={() => handleRespond(swap._id, 'rejected')}
                          className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}

                    {swap.status === 'accepted' && (
                      <button
                        disabled={actionId === swap._id}
                        onClick={() => handleComplete(swap._id)}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Complete & Transfer Credits
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
import { Link, useNavigate } from 'react-router-dom';
import { Coins, Sparkles, ArrowLeftRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-slate-900 text-white px-6 py-3.5 shadow-md flex flex-wrap items-center justify-between gap-4">
      <Link to="/" className="text-xl font-bold tracking-tight text-indigo-400">
        SkillSwap Portal
      </Link>

      <div className="flex items-center gap-5 text-sm font-medium">
        <Link to="/" className="hover:text-indigo-300 transition">
          Explore Peers
        </Link>
        <Link to="/matches" className="flex items-center gap-1 hover:text-indigo-300 transition">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Smart Matches
        </Link>
        <Link to="/swaps" className="flex items-center gap-1 hover:text-indigo-300 transition">
          <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
          My Swaps
        </Link>
        <Link to="/profile" className="flex items-center gap-1 hover:text-indigo-300 transition">
          <User className="w-4 h-4 text-sky-400" />
          {user.name}
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-sm font-semibold">
          <Coins className="w-4 h-4" />
          <span>{user.skillCredits} Credits</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-sm transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
}
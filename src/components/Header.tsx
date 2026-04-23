import { Building2, Search, Menu, UserCircle, LogOut, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './AuthContext';
import { useState } from 'react';
import ListingModal from './ListingModal';
import { Link } from 'react-router-dom';

export default function Header() {
  const { user, signInWithGoogle, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-surface-dark">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.location.href = '/'}
        >
          <div className="w-10 h-10 bg-surface-dark flex items-center justify-center rounded-sm border border-accent-teal/50">
            <Building2 className="text-accent-cyan w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-widest text-accent-cyan uppercase">BigBroker</span>
        </motion.div>

        <nav className="hidden lg:flex items-center gap-8 font-semibold text-[11px] uppercase tracking-wider text-text-silver">
          <a href="#" className="hover:text-accent-cyan transition-colors">Listings</a>
          <a href="#" className="hover:text-accent-cyan transition-colors">Portfolio</a>
          <a href="#" className="hover:text-accent-cyan transition-colors">Analytics</a>
          {user && (
            <>
              <Link to="/dashboard" className="hover:text-accent-cyan transition-colors">Dashboard</Link>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 text-accent-cyan hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Post Asset
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <button className="hidden md:flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-accent-teal/30 rounded-sm hover:border-accent-cyan transition-colors text-text-silver">
            <Search className="w-4 h-4" />
            Search
          </button>
          
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="hidden lg:flex flex-col items-end group cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-[10px] font-bold text-white uppercase tracking-tighter group-hover:text-accent-cyan transition-colors">{user.displayName}</span>
                <span className="text-[8px] text-accent-teal uppercase font-bold tracking-[0.2em] opacity-60">Authorized Agent</span>
              </Link>
              <button 
                onClick={logout}
                className="hidden sm:block p-2 text-text-silver hover:text-red-400 transition-colors bg-surface-dark rounded-sm border border-accent-teal/10"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="hidden sm:flex items-center gap-2 bg-accent-teal text-black px-5 py-2.5 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-accent-cyan transition-colors shadow-lg active:scale-95"
            >
              <UserCircle className="w-4 h-4" />
              Auth
            </button>
          )}

          <button className="flex lg:hidden items-center p-2 rounded-full hover:bg-surface-dark transition-colors">
            <Menu className="w-6 h-6 text-text-silver" />
          </button>
        </div>
      </div>
    </header>

    <ListingModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onSuccess={() => window.location.reload()} 
    />
    </>
  );
}
